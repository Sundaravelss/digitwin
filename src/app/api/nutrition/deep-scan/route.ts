import { NextResponse } from "next/server";
import { fileToDataUrl } from "../../_lib/base64";
import { callOpenAIJson } from "../../_lib/openai";
import { difyQuery } from "../../_lib/dify";

export const runtime = "nodejs";

type DeepScanResult = {
  identified: string;
  brand?: string;
  servingSize?: string;
  nutritionFacts: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    sodium: number;
    totalCarbs: number;
    sugar: number;
    protein: number;
  };
  hiddenConcerns: string[];
  glucoseImpact: {
    spikePrediction: "low" | "moderate" | "high" | "very_high";
    peakTimeMinutes: number;
    explanation: string;
  };
  metabolicConsequence: {
    shortTerm: string;
    visualPrompt: string;
  };
  source: "dify" | "ai_vision" | "demo";
};

function demoDeepScan(): DeepScanResult {
  return {
    identified: "Fast food burger meal",
    brand: "Demo Brand",
    servingSize: "1 meal (~450g)",
    nutritionFacts: {
      calories: 890,
      totalFat: 42,
      saturatedFat: 15,
      transFat: 1.5,
      sodium: 1480,
      totalCarbs: 78,
      sugar: 14,
      protein: 38,
    },
    hiddenConcerns: [
      "Trans fats (1.5g) - linked to heart disease",
      "Sodium exceeds 60% of daily recommended intake",
      "Contains high fructose corn syrup",
    ],
    glucoseImpact: {
      spikePrediction: "high",
      peakTimeMinutes: 45,
      explanation: "High glycemic load from refined carbs will cause rapid blood sugar spike.",
    },
    metabolicConsequence: {
      shortTerm: "Energy crash expected 90-120 minutes post-meal. May feel bloated and sluggish.",
      visualPrompt: "Person looking tired and bloated after meal, slightly uncomfortable, realistic",
    },
    source: "demo",
  };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const profileRaw = String(form.get("profile") ?? "{}");
    const image = form.get("image");
    const imageFile = image instanceof File ? image : null;
    
    if (!imageFile) throw new Error("Missing food image");
    const imageDataUrl = await fileToDataUrl(imageFile);

    // Step 1: Try to use Dify to scrape official nutritional data
    let difyNutritionData: string | null = null;
    try {
      difyNutritionData = await difyQuery({
        user: "digitwin-deep-scan",
        query: `Find official nutritional information PDF or data for the food item shown. ` +
          `Search for: brand nutrition facts, sodium content, trans fats, hidden ingredients, glycemic index. ` +
          `Return detailed macros if found, especially: calories, total fat, saturated fat, trans fat, sodium, sugar, carbs, protein. ` +
          `Also note any concerning additives like HFCS, MSG, artificial colors.`,
        inputs: { mode: "web_scrape_nutrition" },
      });
    } catch {
      difyNutritionData = null;
    }

    // If no OpenAI, return demo
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(demoDeepScan());
    }

    const instructions = `You are a Deep-Scan Nutritionist for DigiTwin, a biological digital twin simulator. 
You analyze food images to provide PRECISE metabolic impact data, not just guesses.

Output STRICT JSON only with this schema:
{
  "identified": "Food name",
  "brand": "Brand if identifiable",
  "servingSize": "Estimated serving",
  "nutritionFacts": {
    "calories": number,
    "totalFat": number (grams),
    "saturatedFat": number,
    "transFat": number,
    "sodium": number (mg),
    "totalCarbs": number,
    "sugar": number,
    "protein": number
  },
  "hiddenConcerns": ["array of concerning ingredients/facts found"],
  "glucoseImpact": {
    "spikePrediction": "low|moderate|high|very_high",
    "peakTimeMinutes": number,
    "explanation": "Brief explanation of glucose impact"
  },
  "metabolicConsequence": {
    "shortTerm": "What user will feel in next 2 hours",
    "visualPrompt": "Image generation prompt showing physical consequence"
  },
  "source": "ai_vision"
}

Be specific about hidden sodium, trans fats, and additives. Calculate glucose spike based on glycemic load.`;

    const result = await callOpenAIJson<DeepScanResult>({
      instructions,
      user: {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Analyze this food image with deep nutritional scan. Profile: ${profileRaw}. ${difyNutritionData ? `Additional data from web search: ${difyNutritionData}` : "No additional data available."}`,
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
