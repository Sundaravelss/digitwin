import { NextResponse } from "next/server";
import { fileToDataUrl } from "../_lib/base64";
import { callOpenAIJson } from "../_lib/openai";
import { callFalGenerate } from "../_lib/fal";

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

type HabitInput = {
  sleepHours?: number;
  smoking?: boolean;
  cigarettesPerDay?: number;
  exerciseMinutes?: number;
  alcoholDrinksPerWeek?: number;
  stressLevel?: "low" | "moderate" | "high";
  dietQuality?: "poor" | "fair" | "good" | "excellent";
  customHabit?: string;
};

type FutureSelfResult = {
  imageUrl?: string;
  caption: string;
  agingAcceleration?: {
    yearsAdded: number;
    reversible: boolean;
    topFactors: string[];
  };
  notes?: string;
};

function calculateAgingAcceleration(habits: HabitInput, profile: BiologicalProfile): { yearsAdded: number; reversible: boolean; topFactors: string[] } {
  let yearsAdded = 0;
  const topFactors: string[] = [];

  // Sleep impact
  const sleep = habits.sleepHours ?? 7;
  if (sleep < 5) {
    yearsAdded += 5;
    topFactors.push("Severe sleep deprivation (<5h)");
  } else if (sleep < 6) {
    yearsAdded += 3;
    topFactors.push("Chronic sleep deprivation (5-6h)");
  } else if (sleep < 7) {
    yearsAdded += 1;
  }

  // Smoking impact
  if (habits.smoking || profile.smoker) {
    const cigs = habits.cigarettesPerDay ?? profile.cigarettesPerDay ?? 10;
    if (cigs > 20) {
      yearsAdded += 10;
      topFactors.push(`Heavy smoking (${cigs} cigs/day)`);
    } else if (cigs > 10) {
      yearsAdded += 6;
      topFactors.push(`Moderate smoking (${cigs} cigs/day)`);
    } else if (cigs > 0) {
      yearsAdded += 3;
      topFactors.push("Light smoking");
    }
  }

  // Stress impact
  if (habits.stressLevel === "high") {
    yearsAdded += 4;
    topFactors.push("Chronic high stress");
  } else if (habits.stressLevel === "moderate") {
    yearsAdded += 1;
  }

  // Diet impact
  if (habits.dietQuality === "poor") {
    yearsAdded += 3;
    topFactors.push("Poor diet quality");
  } else if (habits.dietQuality === "fair") {
    yearsAdded += 1;
  }

  // Alcohol impact
  const alcohol = habits.alcoholDrinksPerWeek ?? 0;
  if (alcohol > 14) {
    yearsAdded += 4;
    topFactors.push("Heavy alcohol consumption");
  } else if (alcohol > 7) {
    yearsAdded += 2;
    topFactors.push("Moderate alcohol consumption");
  }

  // Exercise (can be protective)
  const exercise = habits.exerciseMinutes ?? 0;
  if (exercise >= 150) {
    yearsAdded = Math.max(0, yearsAdded - 2);
  } else if (exercise >= 75) {
    yearsAdded = Math.max(0, yearsAdded - 1);
  } else if (exercise < 30) {
    yearsAdded += 2;
    topFactors.push("Sedentary lifestyle");
  }

  return {
    yearsAdded: Math.min(yearsAdded, 25), // Cap at 25 years
    reversible: yearsAdded <= 10 && !habits.smoking,
    topFactors: topFactors.slice(0, 3),
  };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const profileRaw = String(form.get("profile") ?? "{}");
    const habitsRaw = String(form.get("habits") ?? "{}");
    const mode = String(form.get("mode") ?? "current") as "current" | "aged" | "recover";
    const sleepHours = Number(form.get("sleepHours") ?? "7");
    const customHabit = String(form.get("customHabit") ?? "");
    
    const profile = JSON.parse(profileRaw) as BiologicalProfile;
    let habits: HabitInput;
    try {
      habits = JSON.parse(habitsRaw) as HabitInput;
    } catch {
      habits = {};
    }
    
    // Merge form fields into habits
    habits.sleepHours = habits.sleepHours ?? sleepHours;
    habits.smoking = habits.smoking ?? profile.smoker;
    habits.cigarettesPerDay = habits.cigarettesPerDay ?? profile.cigarettesPerDay;
    if (customHabit) habits.customHabit = customHabit;

    const image = form.get("image");
    const imageFile = image instanceof File ? image : null;
    const imageDataUrl = imageFile ? await fileToDataUrl(imageFile) : undefined;

    const agingData = calculateAgingAcceleration(habits, profile);
    
    // Build habit description
    const habitDescriptions: string[] = [];
    if (habits.sleepHours) habitDescriptions.push(`Sleep: ${habits.sleepHours}h/night`);
    if (habits.smoking) habitDescriptions.push(`Smoking: ${habits.cigarettesPerDay ?? 10} cigs/day`);
    if (habits.stressLevel) habitDescriptions.push(`Stress: ${habits.stressLevel}`);
    if (habits.dietQuality) habitDescriptions.push(`Diet: ${habits.dietQuality}`);
    if (habits.exerciseMinutes !== undefined) habitDescriptions.push(`Exercise: ${habits.exerciseMinutes} min/week`);
    if (habits.alcoholDrinksPerWeek) habitDescriptions.push(`Alcohol: ${habits.alcoholDrinksPerWeek} drinks/week`);
    if (habits.customHabit) habitDescriptions.push(`Custom: ${habits.customHabit}`);
    
    const habitText = habitDescriptions.join(". ") || "No specific habits entered.";

    // Generate prompts based on mode
    let basePrompt: string;
    let caption: string;
    
    const sexHint = profile.sex === "female" ? "woman" : profile.sex === "male" ? "man" : "person";
    const currentAge = profile.age ?? 30;
    
    if (mode === "aged") {
      const agedAge = currentAge + agingData.yearsAdded;
      basePrompt = `Realistic portrait of a ${sexHint} who looks ${agedAge} years old, showing signs of ${agingData.topFactors.join(", ") || "aging"}, ` +
        `${agingData.yearsAdded > 10 ? "tired skin, visible wrinkles, dull complexion" : "slight fatigue, early aging signs"}, ` +
        `documentary lighting, honest, not grotesque, photorealistic`;
      caption = `This is your DigiTwin aged by your current habits. Your biological age could be ${agingData.yearsAdded} years older than your chronological age. (${habitText})`;
    } else if (mode === "recover") {
      basePrompt = `Realistic portrait of a ${sexHint} who looks healthy and ${Math.max(currentAge - 5, 20)} years old, ` +
        `vibrant skin, bright eyes, well-rested, energetic expression, documentary lighting, photorealistic`;
      caption = `Recovery simulation: With improved habits, your DigiTwin shows how you could look with optimal health. (${habitText})`;
    } else {
      basePrompt = `Realistic portrait of a ${sexHint} around ${currentAge} years old, neutral expression, ` +
        `natural lighting, documentary style, photorealistic`;
      caption = `Your current DigiTwin baseline. Habits: ${habitText}`;
    }

    // Try fal for image generation
    if (process.env.FAL_KEY) {
      try {
        const prompt = `${basePrompt}. Keep identity consistent if reference provided. No text. High detail.`;
        const fal = await callFalGenerate({ prompt, imageDataUrl });
        return NextResponse.json<FutureSelfResult>({
          imageUrl: fal.imageUrl,
          caption,
          agingAcceleration: mode === "aged" ? agingData : undefined,
          notes: fal.imageUrl ? undefined : "fal returned no image URL.",
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : "fal error";
        return NextResponse.json<FutureSelfResult>({
          caption,
          agingAcceleration: mode === "aged" ? agingData : undefined,
          notes: `fal generation failed; showing caption only. (${message})`,
        });
      }
    }

    // If OpenAI is available, create a more personalized caption
    if (process.env.OPENAI_API_KEY) {
      const instructions =
        "You are DigiTwin Future Self: a health visualization coach. Output strict JSON with keys: caption, notes(optional). " +
        "No medical claims, no diagnoses. Keep it short, impactful, and motivating. Reference specific habit impacts.";

      const result = await callOpenAIJson<{ caption: string; notes?: string }>({
        instructions,
        user: {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Generate a caption for future-self visualization. Mode=${mode}. Habits: ${JSON.stringify(habits)}. ` +
                `Aging acceleration: ${agingData.yearsAdded} years, factors: ${agingData.topFactors.join(", ")}. Profile: ${JSON.stringify(profile)}`,
            },
          ],
        },
      });

      return NextResponse.json<FutureSelfResult>({
        caption: result.caption,
        agingAcceleration: mode === "aged" ? agingData : undefined,
        notes: result.notes,
      });
    }

    return NextResponse.json<FutureSelfResult>({
      caption,
      agingAcceleration: mode === "aged" ? agingData : undefined,
      notes: "Set FAL_KEY to enable image generation.",
    });
  } catch (e) {
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 400 },
    );
  }
}
