import { NextResponse } from "next/server";
import { callOpenAIJson } from "../../_lib/openai";

export const runtime = "nodejs";

type SmokingResult = {
  outlook: string;
  shortTerm: string[];
  longTerm: string[];
  recoveryIfQuit: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      cigarettesPerDay?: number;
      profile?: unknown;
    };

    const cigarettesPerDay = Number(body.cigarettesPerDay ?? 0);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<SmokingResult>({
        outlook:
          "Demo simulation (no AI configured). Smoking carries real health risks; consider professional support to quit.",
        shortTerm: [
          "Higher resting heart rate and reduced exercise tolerance",
          "Worse sleep quality and more morning cough",
        ],
        longTerm: [
          "Higher risk of cardiovascular disease and lung disease",
          "Increased cancer risk",
        ],
        recoveryIfQuit: [
          "Within days–weeks: improved breathing and circulation",
          "Over months: better fitness and fewer respiratory symptoms",
        ],
      });
    }

    const instructions =
      "You are a behavior-change coach for a hackathon demo. Output strict JSON only with keys: outlook, shortTerm(string[]), longTerm(string[]), recoveryIfQuit(string[]). " +
      "No medical advice, no scare tactics. Be factual, supportive, and concise.";

    const result = await callOpenAIJson<SmokingResult>({
      instructions,
      user: {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Simulate likely outcomes for smoking at ${cigarettesPerDay} cigarettes/day. Include what improves if quitting. Profile (mocked): ${JSON.stringify(body.profile ?? {})}`,
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
