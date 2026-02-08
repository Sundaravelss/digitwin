import { NextRequest, NextResponse } from "next/server";
import { optionalEnv } from "../_lib/env";
import { callOpenAIJson } from "../_lib/openai";

export const runtime = "edge";

interface MealSuggestionRequest {
  mealType: string;
  currentItems: Array<{ name: string; calories: number }>;
  healthProfile: {
    glucose: number;
    cholesterol: number;
    bloodPressure: string;
    heartRate: number;
    age: number;
    weight: number;
    geneticInsights: string[];
    dietaryNeeds: string[];
  };
}

interface MealSuggestionResponse {
  suggestions: Array<{ emoji: string; name: string; calories: number }>;
  reasoning: string;
  healthNotes: string[];
  disclaimer: string;
}

// --------------- Demo fallback responses ---------------

const demoResponses: Record<string, MealSuggestionResponse> = {
  Breakfast: {
    suggestions: [
      { emoji: "\u{1F951}", name: "Avocado Toast", calories: 220 },
      { emoji: "\u{1FAD0}", name: "Berry Smoothie Bowl", calories: 180 },
      { emoji: "\u{1F95A}", name: "Egg White Omelette", calories: 140 },
    ],
    reasoning:
      "Heart-healthy fats and low glycemic options to support your cholesterol and blood glucose management.",
    healthNotes: [
      "Avocado provides heart-healthy monounsaturated fats",
      "Berries are low-glycemic and rich in antioxidants",
      "Egg whites provide lean protein without cholesterol",
    ],
    disclaimer:
      "Demo suggestion. This is nutrition guidance, not medical advice.",
  },
  Lunch: {
    suggestions: [
      { emoji: "\u{1F957}", name: "Mediterranean Quinoa Bowl", calories: 380 },
      { emoji: "\u{1F41F}", name: "Grilled Salmon Salad", calories: 320 },
      { emoji: "\u{1F372}", name: "Lentil Vegetable Soup", calories: 250 },
    ],
    reasoning:
      "High fiber and omega-3 rich options to help manage cholesterol and maintain stable blood sugar.",
    healthNotes: [
      "Lentils are high in fiber, helping lower cholesterol",
      "Salmon provides omega-3 fatty acids for heart health",
      "Quinoa is a complete protein with low glycemic index",
    ],
    disclaimer:
      "Demo suggestion. This is nutrition guidance, not medical advice.",
  },
  Dinner: {
    suggestions: [
      { emoji: "\u{1F357}", name: "Herb Grilled Chicken", calories: 350 },
      { emoji: "\u{1F966}", name: "Steamed Broccoli & Rice", calories: 280 },
      { emoji: "\u{1F96A}", name: "Vegetable Stir-Fry", calories: 300 },
    ],
    reasoning:
      "Lean proteins and fiber-rich vegetables for a balanced dinner that supports cardiovascular health.",
    healthNotes: [
      "Lean chicken is low in saturated fat",
      "Broccoli is rich in fiber and vitamins",
      "Stir-frying preserves nutrients with minimal added fat",
    ],
    disclaimer:
      "Demo suggestion. This is nutrition guidance, not medical advice.",
  },
  Snacks: {
    suggestions: [
      { emoji: "\u{1F95C}", name: "Mixed Nuts (30g)", calories: 170 },
      { emoji: "\u{1F34E}", name: "Apple with Almond Butter", calories: 150 },
      { emoji: "\u{1F955}", name: "Carrot Sticks & Hummus", calories: 120 },
    ],
    reasoning:
      "Nutrient-dense snacks with healthy fats and fiber to keep blood sugar stable between meals.",
    healthNotes: [
      "Nuts provide heart-healthy fats and magnesium",
      "Apples are high in soluble fiber (pectin)",
      "Hummus offers plant protein and slow-release energy",
    ],
    disclaimer:
      "Demo suggestion. This is nutrition guidance, not medical advice.",
  },
};

// --------------- Route handler ---------------

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MealSuggestionRequest;
    const { mealType, currentItems, healthProfile } = body;

    // Check for OpenAI key
    const apiKey = optionalEnv("OPENAI_API_KEY");
    if (!apiKey) {
      // Return demo response
      const demo = demoResponses[mealType] || demoResponses.Breakfast;
      return NextResponse.json(demo);
    }

    const systemPrompt = `You are a nutrition AI for DigiTwin, a health digital twin platform. Generate personalized meal suggestions based on the user's biomarkers and health data.

IMPORTANT RULES:
- This is nutrition guidance only, NOT medical advice
- Tailor suggestions to the user's specific health markers
- For elevated cholesterol: suggest heart-healthy foods (omega-3, fiber, low saturated fat)
- For elevated blood pressure: suggest low-sodium options, potassium-rich foods
- For elevated diabetes risk / glucose concerns: prefer low-glycemic foods, balanced macros
- For lactose intolerance: avoid dairy or suggest alternatives
- For slow caffeine metabolism: limit caffeine-containing items
- Do NOT repeat items already in the user's current meal

Return strict JSON with these exact keys:
{
  "suggestions": [{"emoji": "single emoji", "name": "food name", "calories": estimated_calories_number}],
  "reasoning": "1-2 sentence explanation of why these foods help",
  "healthNotes": ["note 1", "note 2", "note 3"],
  "disclaimer": "This is AI-generated nutrition guidance, not medical advice. Consult your healthcare provider."
}

Provide exactly 3 food items. Each must have a single emoji, a descriptive food name, and estimated calories as a number.`;

    const userMessage = `Generate ${mealType} suggestions for this patient:

Health Profile:
- Age: ${healthProfile.age}, Weight: ${healthProfile.weight}kg
- Fasting Glucose: ${healthProfile.glucose} mg/dL
- Total Cholesterol: ${healthProfile.cholesterol} mg/dL
- Blood Pressure: ${healthProfile.bloodPressure} mmHg
- Resting Heart Rate: ${healthProfile.heartRate} bpm
- Genetic Insights: ${healthProfile.geneticInsights.join("; ") || "None"}
- Dietary Needs: ${healthProfile.dietaryNeeds.join("; ") || "None"}

Current ${mealType} items (do NOT repeat these): ${
      currentItems.length > 0
        ? currentItems.map((i) => i.name).join(", ")
        : "None yet"
    }`;

    const result = await callOpenAIJson<MealSuggestionResponse>({
      instructions: systemPrompt,
      user: {
        role: "user",
        content: [{ type: "input_text", text: userMessage }],
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Meal suggestion error:", error);
    // Fall back to demo on any error
    const demo = demoResponses.Breakfast;
    return NextResponse.json(demo);
  }
}
