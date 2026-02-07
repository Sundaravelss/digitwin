import { NextResponse } from "next/server";
import { callFalGenerate } from "../../_lib/fal";
import { callOpenAIJson } from "../../_lib/openai";

export const runtime = "nodejs";

type ConsequenceType = "glucose_spike" | "fatigue" | "bloated" | "healthy" | "aged";

type MetabolicConsequenceRequest = {
  type: ConsequenceType;
  intensity: "mild" | "moderate" | "severe";
  profile?: {
    age?: number;
    sex?: "female" | "male" | "other";
  };
  context?: string;
};

type MetabolicConsequenceResponse = {
  imageUrl?: string;
  caption: string;
  physiologicalExplanation: string;
  reversible: boolean;
  timeToRecover?: string;
  notes?: string;
};

const consequencePrompts: Record<ConsequenceType, Record<string, string>> = {
  glucose_spike: {
    mild: "Portrait of person looking slightly tired, subtle fatigue in eyes, natural lighting, realistic, documentary style",
    moderate: "Portrait of person looking tired and sluggish after meal, visible fatigue, slight discomfort, realistic documentary photography",
    severe: "Portrait of person looking very tired and uncomfortable, energy crash visible, drowsy expression, realistic documentary style",
  },
  fatigue: {
    mild: "Portrait showing subtle under-eye circles, slightly tired expression, natural pose, realistic",
    moderate: "Portrait with visible tiredness, under-eye shadows, lower energy posture, realistic documentary",
    severe: "Portrait showing exhaustion, heavy eyelids, drained appearance, realistic documentation",
  },
  bloated: {
    mild: "Portrait of person looking slightly uncomfortable after eating, realistic, natural lighting",
    moderate: "Portrait showing visible discomfort, person holding stomach area subtly, post-meal bloating, realistic",
    severe: "Portrait of person with visible discomfort, uncomfortable posture, post-large-meal state, realistic documentary",
  },
  healthy: {
    mild: "Portrait of person looking refreshed and alert, good skin, bright eyes, natural lighting, realistic",
    moderate: "Portrait showing vibrant healthy appearance, glowing skin, energetic expression, realistic documentary",
    severe: "Portrait of peak health, radiant skin, bright alert eyes, confident healthy posture, realistic",
  },
  aged: {
    mild: "Portrait subtly showing 5 years of aging, slightly more pronounced lines around eyes, realistic documentary",
    moderate: "Portrait showing 10 years of accelerated aging, more wrinkles, duller skin, tired eyes, realistic",
    severe: "Portrait showing 20 years of accelerated aging from poor habits, significant aging signs, realistic documentary style",
  },
};

const captions: Record<ConsequenceType, Record<string, string>> = {
  glucose_spike: {
    mild: "Mild glucose spike predicted - you may feel slightly drowsy in about 45 minutes.",
    moderate: "Moderate glucose spike incoming - expect an energy dip in 30-60 minutes.",
    severe: "High glucose spike alert - significant energy crash expected within 30-45 minutes.",
  },
  fatigue: {
    mild: "Low sleep is starting to show - your recovery capacity is reduced.",
    moderate: "Sleep debt is accumulating - cognitive function and mood will be affected.",
    severe: "Severe sleep deprivation detected - immune function and metabolism compromised.",
  },
  bloated: {
    mild: "This meal may cause mild digestive discomfort.",
    moderate: "High sodium/volume meal - expect noticeable bloating for 2-4 hours.",
    severe: "Very heavy meal detected - significant digestive load for 4-6 hours.",
  },
  healthy: {
    mild: "You're on track - keep making good choices!",
    moderate: "Your healthy habits are paying off - visible improvements in energy.",
    severe: "Optimal health achieved - you're glowing from the inside out!",
  },
  aged: {
    mild: "Current habits may accelerate aging by ~5 years over time.",
    moderate: "These habits could accelerate aging by ~10 years if continued long-term.",
    severe: "Warning: Current lifestyle could add 20+ years to your biological age.",
  },
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MetabolicConsequenceRequest;
    const { type, intensity, profile, context } = body;

    if (!type || !intensity) {
      throw new Error("Missing type or intensity");
    }

    const promptTemplate = consequencePrompts[type]?.[intensity];
    const captionTemplate = captions[type]?.[intensity];

    if (!promptTemplate || !captionTemplate) {
      throw new Error("Invalid type or intensity combination");
    }

    // Generate additional context from AI if available
    let physiologicalExplanation = "";
    if (process.env.OPENAI_API_KEY) {
      const aiExplanation = await callOpenAIJson<{ explanation: string; timeToRecover?: string }>({
        instructions: "Output JSON with keys: explanation (2-3 sentences about the physiological mechanism), timeToRecover (optional string). Be factual and educational.",
        user: {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Explain the physiological mechanism behind: ${type} at ${intensity} level. Context: ${context ?? "general health simulation"}. Profile: ${JSON.stringify(profile ?? {})}`,
            },
          ],
        },
      }).catch(() => ({ explanation: "", timeToRecover: undefined }));
      physiologicalExplanation = aiExplanation.explanation;
    } else {
      physiologicalExplanation = `This simulation shows the ${intensity} ${type.replace("_", " ")} effect on your biological twin.`;
    }

    // Generate image with fal if configured
    let imageUrl: string | undefined;
    if (process.env.FAL_KEY) {
      try {
        const sexHint = profile?.sex === "female" ? "woman" : profile?.sex === "male" ? "man" : "person";
        const ageHint = profile?.age ? `approximately ${profile.age} years old` : "";
        const fullPrompt = `${promptTemplate}, ${sexHint} ${ageHint}, high quality portrait, no text`.trim();
        
        const falResult = await callFalGenerate({ prompt: fullPrompt });
        imageUrl = falResult.imageUrl;
      } catch (e) {
        // fal failed, continue without image
      }
    }

    return NextResponse.json<MetabolicConsequenceResponse>({
      imageUrl,
      caption: captionTemplate,
      physiologicalExplanation,
      reversible: type !== "aged" || intensity === "mild",
      timeToRecover: type === "glucose_spike" ? "2-4 hours" : type === "fatigue" ? "1-3 days of good sleep" : undefined,
      notes: imageUrl ? undefined : "Set FAL_KEY to enable visual consequence generation.",
    });
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
