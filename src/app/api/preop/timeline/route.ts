import { NextResponse } from "next/server";
import { callOpenAIJson } from "../../_lib/openai";

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

type RecoveryTimeline = {
  surgery: string;
  surgeryDateISO: string;
  days: Array<{ day: number; title: string; actions: string[] }>;
  disclaimer: string;
};

function fallbackTimeline(args: {
  surgery: string;
  surgeryDateISO: string;
}): RecoveryTimeline {
  return {
    surgery: args.surgery,
    surgeryDateISO: args.surgeryDateISO,
    disclaimer:
      "Educational demo only. Follow your surgeon/physio’s plan; seek urgent care for red-flag symptoms.",
    days: [
      {
        day: -3,
        title: "Pre-op prep",
        actions: [
          "Confirm arrival time, fasting instructions, and medications to hold",
          "Prepare ice packs, pillows, and a safe walking path at home",
          "Write down 3 questions for your surgeon/physio",
        ],
      },
      {
        day: 1,
        title: "Inflammation peak (typical)",
        actions: [
          "Rest and follow pain-control plan",
          "Ice 15–20 min as instructed",
          "Watch for worsening pain, fever, or unusual swelling",
        ],
      },
      {
        day: 10,
        title: "Gentle mobility focus",
        actions: [
          "Do physio-approved range-of-motion exercises",
          "Keep swelling down (elevation/ice as instructed)",
          "Track progress and report concerns",
        ],
      },
      {
        day: 42,
        title: "Strength + consistency",
        actions: [
          "Progress strength work only as cleared",
          "Prioritize sleep and protein intake",
          "Avoid sudden spikes in activity",
        ],
      },
    ],
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      surgery?: string;
      surgeryDateISO?: string;
      profile?: BiologicalProfile;
    };

    const surgery = body.surgery?.trim();
    const surgeryDateISO = body.surgeryDateISO?.trim();
    const profile = body.profile ?? {};

    if (!surgery) throw new Error("Missing surgery");
    if (!surgeryDateISO) throw new Error("Missing surgeryDateISO");

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(fallbackTimeline({ surgery, surgeryDateISO }));
    }

    const instructions =
      "You are a pre-op and recovery coach for a hackathon demo. Output strict JSON only with keys: " +
      "surgery, surgeryDateISO, days (array of {day:number,title:string,actions:string[]}), disclaimer. " +
      "No medical advice; be cautious; suggest following the clinician plan. " +
      "Create a concise timeline with 6-10 entries spanning pre-op (-7..-1), early post-op (1..14), and rehab milestones (30..90).";

    const result = await callOpenAIJson<RecoveryTimeline>({
      instructions,
      user: {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Procedure: ${surgery}\nSurgery date (ISO): ${surgeryDateISO}\nProfile (mocked): ${JSON.stringify(profile)}`,
          },
        ],
      },
    });

    return NextResponse.json(result);
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
