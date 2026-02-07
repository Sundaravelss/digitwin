import { NextResponse } from "next/server";
import { fileToDataUrl } from "../_lib/base64";
import { callOpenAIJson } from "../_lib/openai";
import { difyQuery } from "../_lib/dify";

export const runtime = "nodejs";

type BiologicalProfile = {
  age?: number;
  sex?: "female" | "male" | "other";
  allergies?: string;
  conditions?: string;
  bloodPressure?: string;
  currentMeds?: string;
  smoker?: boolean;
  cigarettesPerDay?: number;
};

type RiskLevel = "danger" | "warning" | "info";

type StudyCitation = {
  year: number;
  finding: string;
  riskPercent?: number;
};

type MedSimResult = {
  riskLevel: RiskLevel;
  headline: string;
  explanation: string;
  saferNextSteps: string[];
  extractedMedicationName?: string;
  recentStudies?: StudyCitation[];
  difySource?: boolean;
};

function fallbackMedSim(args: {
  profile: BiologicalProfile;
  hint: string;
}): MedSimResult {
  const hint = args.hint.toLowerCase();
  const allergies = (args.profile.allergies ?? "").toLowerCase();
  const currentMeds = (args.profile.currentMeds ?? "").toLowerCase();

  const mentionsAmox = hint.includes("amoxicillin") || hint.includes("amox");
  const penAllergy =
    allergies.includes("penicillin") || allergies.includes("beta-lactam");
  
  // Check for blood thinner interactions
  const onBloodThinners = currentMeds.includes("warfarin") || currentMeds.includes("blood thinner");
  const newDrugInteracts = hint.includes("ibuprofen") || hint.includes("aspirin") || hint.includes("nsaid");

  if (mentionsAmox && penAllergy) {
    return {
      riskLevel: "danger",
      headline: "Potential severe allergy conflict",
      extractedMedicationName: "Amoxicillin (detected from text hint)",
      explanation:
        "Your profile mentions a penicillin-class allergy. Amoxicillin is commonly in that family, so this is a high-risk combination in this demo simulation.",
      saferNextSteps: [
        "Do not take it until you confirm with a clinician/pharmacist",
        "Share your allergy history and any prior reactions",
        "Ask about non-penicillin alternatives",
      ],
      recentStudies: [
        { year: 2024, finding: "Cross-reactivity between penicillin and amoxicillin remains significant", riskPercent: 8 }
      ],
    };
  }
  
  if (onBloodThinners && newDrugInteracts) {
    return {
      riskLevel: "danger",
      headline: "WARNING: Bleeding risk detected",
      extractedMedicationName: args.hint,
      explanation:
        "Your profile shows blood thinner use. NSAIDs and aspirin significantly increase bleeding risk when combined with anticoagulants.",
      saferNextSteps: [
        "Consult your doctor before taking this medication",
        "Ask about acetaminophen as an alternative",
        "Monitor for signs of bleeding (bruising, dark stool, etc.)",
      ],
      recentStudies: [
        { year: 2025, finding: "2025 study shows 15% increased bleed risk with NSAID + anticoagulant combinations", riskPercent: 15 }
      ],
    };
  }

  return {
    riskLevel: "info",
    headline: "No obvious red flags found (demo)",
    extractedMedicationName: args.hint || undefined,
    explanation:
      "This demo did not detect a clear contraindication from the provided info. Real-world safety depends on dose, diagnosis, kidney/liver function, and more.",
    saferNextSteps: [
      "Confirm the exact medication name + dose",
      "Double-check allergies and current meds",
      "If you feel unwell, seek medical care",
    ],
  };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const profileRaw = String(form.get("profile") ?? "{}");
    const hint = String(form.get("hint") ?? "");
    const profile = JSON.parse(profileRaw) as BiologicalProfile;

    const image = form.get("image");
    const imageFile = image instanceof File ? image : null;
    const imageDataUrl = imageFile ? await fileToDataUrl(imageFile) : null;

    // Optional: ask Dify to search web for latest drug interaction studies (2024-2025).
    let difyContext: string | null = null;
    let recentStudies: StudyCitation[] = [];
    
    try {
      const difyResult = await difyQuery({
        user: "digitwin-sim-lab",
        query: `Search for the latest drug interaction studies (2024-2025) for: ${hint || "(unknown medication)"}. ` +
          `Patient is taking: ${profile.currentMeds || "no listed medications"}. ` +
          `Patient conditions: ${profile.conditions || "none listed"}. ` +
          `Look for: contraindications, bleeding risks, cardiac risks, respiratory risks, cross-reactivity with ${profile.allergies || "no known allergies"}. ` +
          `Return findings with year, risk percentages if available, and key warnings.`,
        inputs: { 
          medication: hint, 
          profile,
          mode: "web_search_drug_interactions" 
        },
      });
      
      if (difyResult) {
        difyContext = difyResult;
        // Try to extract study citations if Dify returned structured data
        try {
          const parsed = JSON.parse(difyResult);
          if (Array.isArray(parsed.studies)) {
            recentStudies = parsed.studies;
          }
        } catch {
          // Dify returned plain text, that's fine
        }
      }
    } catch {
      difyContext = null;
    }

    // If OPENAI_API_KEY not present, fall back.
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(fallbackMedSim({ profile, hint }));
    }

    const instructions =
      "You are DigiTwin Sim-Lab: a medication safety simulator for the DigiTwin biological twin platform. You MUST output strict JSON only, with keys: " +
      "riskLevel (danger|warning|info), headline, explanation, saferNextSteps (string[]), extractedMedicationName (optional), recentStudies (optional array of {year: number, finding: string, riskPercent?: number}). " +
      "Do NOT provide medical advice; use cautious language; suggest consulting clinician/pharmacist. " +
      "If the user has an allergy conflict or clear contraindication, set riskLevel=danger. " +
      "If recent studies (2024-2025) show interaction risks, cite them with specific percentages if available. " +
      "If risk is plausible but uncertain, set riskLevel=warning. Else info. " +
      "Keep explanation under 90 words.";

    const content: Array<
      { type: "input_text"; text: string } | { type: "input_image"; image_url: string }
    > = [
      {
        type: "input_text",
        text: `User profile (mocked): ${JSON.stringify(profile)}\n\nMedication being checked: ${hint}\n\nRecent Dify web search results for drug interactions: ${difyContext ?? "(no results)"}\n\nAnalyze for interactions with current medications and conditions. If Dify found recent studies, include them in recentStudies array.`,
      },
    ];

    if (imageDataUrl) {
      content.push({ type: "input_image", image_url: imageDataUrl });
      content.push({
        type: "input_text",
        text: "From the image, try to read the medication name (and strength if present). If unclear, say so in extractedMedicationName.",
      });
    }

    const result = await callOpenAIJson<MedSimResult>({
      instructions,
      user: { role: "user", content },
    });

    return NextResponse.json(result);
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
