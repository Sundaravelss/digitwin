import { NextResponse } from "next/server";
import { fileToDataUrl } from "../../_lib/base64";
import { callOpenAIJson } from "../../_lib/openai";

export const runtime = "nodejs";

type NutritionResult = {
  estimatedCalories: number;
  confidence: "low" | "medium" | "high";
  whatISee: string;
  burnSuggestion: { activity: string; minutes: number; note: string };
  smokingImpact?: string;
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const profileRaw = String(form.get("profile") ?? "{}");
    const image = form.get("image");
    const imageFile = image instanceof File ? image : null;
    if (!imageFile) throw new Error("Missing food image");

    const imageDataUrl = await fileToDataUrl(imageFile);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<NutritionResult>({
        estimatedCalories: 650,
        confidence: "low",
        whatISee:
          "Demo estimate (no AI configured). Set OPENAI_API_KEY for photo-based estimation.",
        burnSuggestion: {
          activity: "brisk walking",
          minutes: 80,
          note: "Rough estimate; actual burn depends on body weight and intensity.",
        },
      });
    }

    const instructions =
      "You are a nutrition estimator for a hackathon demo. Output strict JSON only with keys: estimatedCalories(number), confidence(low|medium|high), whatISee(string), burnSuggestion({activity,minutes,note}), smokingImpact(optional string). " +
      "Be explicit that this is an estimate. Avoid medical advice.";

    const result = await callOpenAIJson<NutritionResult>({
      instructions,
      user: {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Estimate calories from this food photo. Profile (mocked): ${profileRaw}. Provide 1 simple burn suggestion.`,
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
