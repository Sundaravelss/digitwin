import { NextResponse } from "next/server";
import { fileToDataUrl } from "../../_lib/base64";
import { callOpenAIJson } from "../../_lib/openai";

export const runtime = "nodejs";

type CoachFeedback = {
  assessment: string;
  cues: string[];
  safety: string[];
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const profileRaw = String(form.get("profile") ?? "{}");
    const context = String(form.get("context") ?? "Rehab movement");

    const image = form.get("image");
    const imageFile = image instanceof File ? image : null;
    if (!imageFile) throw new Error("Missing image");

    const imageDataUrl = await fileToDataUrl(imageFile);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<CoachFeedback>({
        assessment: "Demo feedback (no AI configured)",
        cues: [
          "Move slowly and stay within pain-free range",
          "Keep breathing; avoid holding your breath",
          "Prioritize form over depth",
        ],
        safety: [
          "Stop if sharp pain, dizziness, or swelling increases",
          "Follow your clinician’s rehab protocol",
        ],
      });
    }

    const instructions =
      "You are a rehab form coach for a hackathon demo. Output strict JSON only with keys: assessment, cues(string[]), safety(string[]). " +
      "No medical advice; do not diagnose; be conservative. If the image is unclear, say so in assessment and give generic safe cues.";

    const result = await callOpenAIJson<CoachFeedback>({
      instructions,
      user: {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Context: ${context}\nProfile (mocked): ${profileRaw}\nGive practical cues for safer movement based on the image.`,
          },
          { type: "input_image", image_url: imageDataUrl },
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
