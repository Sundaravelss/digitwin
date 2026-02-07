import { NextResponse } from "next/server";
import { difyQuery } from "../_lib/dify";

export const runtime = "nodejs";

type EvidenceItem = {
  title: string;
  url: string;
  note: string;
};

type EvidenceResponse = {
  query: string;
  items: EvidenceItem[];
  source: "dify" | "demo";
};

function demoEvidence(query: string): EvidenceResponse {
  const items: EvidenceItem[] = [
    {
      title: "Drug allergy and cross-reactivity (overview)",
      url: "https://www.ncbi.nlm.nih.gov/pmc/",
      note: "Demo link placeholder — configure Dify for curated citations.",
    },
    {
      title: "Hypertension and medication interactions (overview)",
      url: "https://pubmed.ncbi.nlm.nih.gov/",
      note: "Demo link placeholder.",
    },
    {
      title: "Sleep duration and cardiometabolic risk (overview)",
      url: "https://www.cdc.gov/sleep/",
      note: "Demo link placeholder.",
    },
  ];
  return { query, items, source: "demo" };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { query?: string };
    const query = (body.query ?? "").trim();
    if (!query) throw new Error("Missing query");

    const answer = await difyQuery({
      user: "aura-clinical-console",
      query:
        `Return 3-5 evidence links (title + URL + 1-line note) for: ${query}. ` +
        `Output as JSON array only: [{"title":"...","url":"...","note":"..."}]. Prefer PubMed/NCBI/CDC/WHO where relevant.`,
    }).catch(() => null);

    if (!answer) return NextResponse.json(demoEvidence(query));

    let items: EvidenceItem[] | null = null;
    try {
      items = JSON.parse(answer) as EvidenceItem[];
    } catch {
      items = null;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(demoEvidence(query));
    }

    return NextResponse.json<EvidenceResponse>({ query, items, source: "dify" });
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
