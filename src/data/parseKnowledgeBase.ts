/**
 * Parses the consolidated knowledge-base.md file to extract structured patient
 * JSON data and global metadata. The markdown file is the single source of truth
 * for both the Dify knowledge base (clinical narrative) and the app (JSON blocks).
 *
 * JSON blocks are delimited by:
 *   <!-- APP_DATA:PT-XXX --> ... ```json { ... } ``` ... <!-- /APP_DATA:PT-XXX -->
 *   <!-- APP_DATA:GLOBAL --> ... ```json { ... } ``` ... <!-- /APP_DATA:GLOBAL -->
 */

interface ParsedKnowledgeBase {
  metadata: {
    version: string;
    generatedAt: string;
    dataSource: string;
    weekRange: { start: string; end: string };
  };
  patients: any[];
  realWorldData: any;
}

export function parseKnowledgeBase(markdownContent: string): ParsedKnowledgeBase {
  const patients: any[] = [];
  let metadata: any = {};
  let realWorldData: any = {};

  // Extract all APP_DATA blocks using regex
  const blockRegex = /<!-- APP_DATA:([\w-]+) -->\s*```json\s*([\s\S]*?)```\s*<!-- \/APP_DATA:\1 -->/g;
  let match;

  while ((match = blockRegex.exec(markdownContent)) !== null) {
    const blockId = match[1];
    const jsonStr = match[2].trim();

    try {
      const parsed = JSON.parse(jsonStr);

      if (blockId === "GLOBAL") {
        metadata = parsed.metadata || {};
        realWorldData = parsed.realWorldData || {};
      } else if (blockId.startsWith("PT-")) {
        patients.push(parsed);
      }
    } catch (e) {
      console.error(`Failed to parse JSON block for ${blockId}:`, e);
    }
  }

  // Sort patients by ID to ensure consistent ordering
  patients.sort((a, b) => a.id.localeCompare(b.id));

  return {
    metadata: metadata as ParsedKnowledgeBase["metadata"],
    patients,
    realWorldData,
  };
}

/**
 * Extract patient metadata from HTML comments for filtering.
 * Returns an array of metadata objects parsed from:
 *   <!-- PATIENT:PT-XXX | name:... | age:... | ... -->
 */
export function extractPatientMetadata(markdownContent: string) {
  const metaRegex = /<!-- PATIENT:(PT-\d+) \| ([^>]+) -->/g;
  const results: Array<{
    patientId: string;
    name: string;
    age: number;
    gender: string;
    riskLevel: string;
    healthScore: number;
    conditions: string[];
  }> = [];

  let match;
  while ((match = metaRegex.exec(markdownContent)) !== null) {
    const patientId = match[1];
    const attrs = match[2];
    const attrMap: Record<string, string> = {};

    attrs.split(" | ").forEach((pair) => {
      const [key, value] = pair.split(":");
      if (key && value) {
        attrMap[key.trim()] = value.trim();
      }
    });

    results.push({
      patientId,
      name: attrMap.name || "",
      age: parseInt(attrMap.age) || 0,
      gender: attrMap.gender || "",
      riskLevel: attrMap.risk_level || "",
      healthScore: parseInt(attrMap.health_score) || 0,
      conditions: (attrMap.conditions || "").split(",").filter(Boolean),
    });
  }

  return results;
}
