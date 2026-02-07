import { NextResponse } from "next/server";
import { callOpenAIJson } from "../../_lib/openai";

export const runtime = "nodejs";

type VoiceCoachRequest = {
  transcript: string;
  context?: string;
  biomarkerSnapshot?: unknown;
};

type VoiceCoachResponse = {
  reply: string;
  nextPrompts: string[];
  safety: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VoiceCoachRequest;
    const transcript = (body.transcript ?? "").trim();
    if (!transcript) throw new Error("Missing transcript");

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<VoiceCoachResponse>({
        reply:
          "Demo coach: keep it slow, keep it consistent. If anything feels sharp or worsening, pause and follow your clinician’s plan.",
        nextPrompts: [
          "On a 0–10 scale, what’s your pain right now?",
          "Any swelling or stiffness compared to yesterday?",
          "What’s one small action you can do in the next 10 minutes?",
        ],
        safety: [
          "Stop if you feel sharp pain, dizziness, or chest pain",
          "Seek care for severe symptoms or allergic reactions",
        ],
      });
    }

    const instructions =
      "You are DigiTwin Recover (powered by Gradium): a supportive real-time coach for a hackathon demo. You help with recovery via voice sessions and nutrition guidance. Output strict JSON only with keys: reply, nextPrompts(string[]), safety(string[]). " +
      "No diagnosis, no medical advice. Be brief, actionable, and cautious.";

    const result = await callOpenAIJson<VoiceCoachResponse>({
      instructions,
      user: {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `User said: ${transcript}\nContext: ${body.context ?? "(none)"}\nBiomarkers snapshot (optional): ${JSON.stringify(body.biomarkerSnapshot ?? {})}`,
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
