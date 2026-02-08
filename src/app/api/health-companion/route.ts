import { NextResponse } from "next/server";
import { fileToDataUrl } from "../_lib/base64";
import { callOpenAIJson, OpenAIUserMessage } from "../_lib/openai";
import { difyQuery, difyFileUpload, difyWorkflowRun } from "../_lib/dify";

export const runtime = "nodejs";

type SimulationType = "food" | "medication" | "smoking" | "habit" | "combined";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  imageUrl?: string;
  simulationType?: SimulationType;
  nutritionData?: NutritionData;
  biomarkerImpact?: BiomarkerImpact;
};

type NutritionData = {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  sugar: number;
  fiber?: number;
  concern?: string;
};

type BiomarkerImpact = {
  glucoseChange: number;
  inflammationChange: number;
  heartRateChange: number;
  energyChange: number;
  sleepQualityImpact: string;
  overallHealthDelta: number;
  timeToImpact: string;
};

type CompanionResponse = {
  reply: string;
  simulationType: SimulationType | null;
  nutritionData: NutritionData | null;
  biomarkerImpact: BiomarkerImpact | null;
  suggestions: string[];
  avatarPrompt: string | null;
  updatedBiomarkers: {
    calories: number;
    glucoseMgDl: number;
    inflammationIndex: number;
    energyLevel: number;
  } | null;
  shouldGenerateAvatar: boolean;
  source: "ai" | "dify_enhanced" | "demo";
};

function demoResponse(biomarkers?: Record<string, unknown>, isTrendQuery = false): CompanionResponse {
  if (isTrendQuery && biomarkers) {
    const glucose = Number(biomarkers.glucoseMgDl) || 95;
    const ldl = Number(biomarkers.ldlCholesterol) || 120;
    const hdl = Number(biomarkers.hdlCholesterol) || 55;
    const energy = Number(biomarkers.energyLevel) || 70;
    
    const glucoseStatus = glucose < 100 ? "healthy" : glucose < 126 ? "prediabetic range" : "elevated";
    const ldlStatus = ldl < 100 ? "optimal" : ldl < 130 ? "near optimal" : "elevated";
    const hdlStatus = hdl > 60 ? "excellent" : hdl > 40 ? "acceptable" : "low";
    
    return {
      reply: `📊 **Your Health Trends Overview**

Based on your current biomarkers:

**Blood Glucose**: ${glucose} mg/dL (${glucoseStatus})
${glucose < 100 ? "✅ Your glucose levels are well controlled." : "⚠️ Consider monitoring carbohydrate intake."}

**Cholesterol Panel**:
- LDL: ${ldl} mg/dL (${ldlStatus})
- HDL: ${hdl} mg/dL (${hdlStatus})
${ldl < 130 && hdl > 40 ? "✅ Lipid profile looks good!" : "💡 Consider heart-healthy dietary changes."}

**Energy Level**: ${energy}/100
${energy > 60 ? "You're maintaining good energy levels!" : "Consider improving sleep or nutrition habits."}

**Recommendations**:
1. ${glucose > 100 ? "Reduce refined carbohydrates" : "Maintain current diet patterns"}
2. ${ldl > 100 ? "Increase fiber and omega-3 intake" : "Continue heart-healthy habits"}
3. ${energy < 60 ? "Prioritize 7-8 hours of sleep" : "Keep up your healthy routine!"}`,
      simulationType: "combined",
      nutritionData: null,
      biomarkerImpact: null,
      suggestions: [
        "What foods can lower my cholesterol?",
        "How does exercise affect my glucose?",
        "Show my future self in 5 years",
        "Analyze my lunch",
      ],
      avatarPrompt: null,
      updatedBiomarkers: null,
      shouldGenerateAvatar: false,
      source: "demo",
    };
  }
  
  return {
    reply: "I'm your Health Companion! Upload a photo of your food, medication, or tell me about your habits, and I'll simulate how it affects your DigiTwin. What would you like to explore today?",
    simulationType: null,
    nutritionData: null,
    biomarkerImpact: null,
    suggestions: [
      "Show my health trends",
      "Analyze my breakfast",
      "Check medication interaction",
      "Simulate smoking impact",
    ],
    avatarPrompt: null,
    updatedBiomarkers: null,
    shouldGenerateAvatar: false,
    source: "demo",
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const form = await req.formData();
    const messageRaw = String(form.get("message") ?? "");
    const profileRaw = String(form.get("profile") ?? "{}");
    const biomarkersRaw = String(form.get("biomarkers") ?? "{}");
    const historyRaw = String(form.get("history") ?? "[]");
    const image = form.get("image");
    const imageFile = image instanceof File ? image : null;

    let profile: Record<string, unknown> = {};
    let biomarkers: Record<string, unknown> = {};
    let history: ChatMessage[] = [];
    
    try { profile = JSON.parse(profileRaw); } catch { /* empty */ }
    try { biomarkers = JSON.parse(biomarkersRaw); } catch { /* empty */ }
    try { history = JSON.parse(historyRaw); } catch { /* empty */ }

    // Detect simulation type from message
    const lowerMessage = messageRaw.toLowerCase();
    
    // Check if user is asking about health trends/status
    const isTrendQuery = lowerMessage.includes("trend") || 
      lowerMessage.includes("status") || 
      lowerMessage.includes("health") ||
      lowerMessage.includes("overview") ||
      lowerMessage.includes("summary") ||
      lowerMessage.includes("how am i") ||
      lowerMessage.includes("my health");
    
    const detectSimType = (): SimulationType | null => {
      if (imageFile) {
        if (lowerMessage.includes("med") || lowerMessage.includes("pill") || lowerMessage.includes("drug")) {
          return "medication";
        }
        return "food"; // Default for images
      }
      if (lowerMessage.includes("smok") || lowerMessage.includes("cigarette") || lowerMessage.includes("tobacco")) {
        return "smoking";
      }
      if (lowerMessage.includes("med") || lowerMessage.includes("pill") || lowerMessage.includes("drug") || lowerMessage.includes("prescription")) {
        return "medication";
      }
      if (lowerMessage.includes("food") || lowerMessage.includes("eat") || lowerMessage.includes("meal") || lowerMessage.includes("snack")) {
        return "food";
      }
      if (lowerMessage.includes("exercise") || lowerMessage.includes("sleep") || lowerMessage.includes("habit") || lowerMessage.includes("lifestyle")) {
        return "habit";
      }
      // For trend queries, return combined to analyze overall health
      if (isTrendQuery) {
        return "combined";
      }
      return null;
    };
    
    const simType = detectSimType();
    
    let imageDataUrl: string | null = null;
    if (imageFile) {
      imageDataUrl = await fileToDataUrl(imageFile);
    }

    // Try Dify for enhanced nutrition data
    let difyNutritionData: string | null = null;
    if (simType === "food" && imageFile) {
      try {
        difyNutritionData = await difyQuery({
          user: "digitwin-health-companion",
          query: `Analyze this food. Find nutritional information: calories, protein, carbs, fat, sodium, sugar. 
            Also identify any health concerns for someone with these conditions: ${profile.conditions || 'none'} 
            and allergies: ${profile.allergies || 'none'}.`,
          inputs: { mode: "nutrition_analysis" },
        });
      } catch {
        difyNutritionData = null;
      }
    }

    // Try Dify workflow for image analysis (Patient Intake Analyzer)
    if (imageFile) {
      try {
        const uploaded = await difyFileUpload({
          file: imageFile,
          user: "digitwin-health-companion",
        });

        if (uploaded) {
          const workflowResult = await difyWorkflowRun({
            inputs: {
              patient_id: "PT-001",
              item_text: messageRaw || "Analyze this food image",
              item_image_url: "",
              simulation_window: "both",
            },
            files: [
              {
                type: "image",
                transfer_method: "local_file",
                upload_file_id: uploaded.id,
              },
            ],
            user: "digitwin-health-companion",
          });

          if (
            workflowResult?.status === "succeeded" &&
            workflowResult.outputs
          ) {
            const outputText =
              (workflowResult.outputs.text as string) ||
              (workflowResult.outputs.result as string) ||
              (workflowResult.outputs.output as string) ||
              (workflowResult.outputs.answer as string) ||
              null;

            if (outputText?.trim()) {
              return NextResponse.json({
                reply: outputText,
                source: "dify_workflow",
              });
            }
          }
        }
      } catch (err) {
        console.error("Dify workflow image analysis error:", err);
        // Fall through to OpenAI
      }
    }

    // Return demo if no OpenAI key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(demoResponse(biomarkers, isTrendQuery));
    }

    const systemPrompt = `You are the Health Companion for DigiTwin, an AI-powered biological digital twin simulator.
Your role is to have natural conversations with users about their health choices and simulate the metabolic impact.

USER PROFILE:
- Age: ${profile.age || "Unknown"}
- Sex: ${profile.sex || "Unknown"}
- Allergies: ${profile.allergies || "None reported"}
- Conditions: ${profile.conditions || "None reported"}
- Current medications: ${profile.currentMeds || "None"}
- Smoker: ${profile.smoker ? `Yes (${profile.cigarettesPerDay || '?'} per day)` : "No"}

CURRENT BIOMARKERS:
${JSON.stringify(biomarkers, null, 2)}

${difyNutritionData ? `DIFY NUTRITION DATA:\n${difyNutritionData}\n` : ""}

YOUR CAPABILITIES:
1. FOOD ANALYSIS: When user uploads food images or describes meals, analyze nutritional content and predict metabolic impact
2. MEDICATION CHECK: Analyze drug interactions with user's profile and current meds
3. SMOKING SIMULATION: Show long-term impact of smoking habits on biological markers
4. HABIT SIMULATION: Predict how lifestyle changes affect the DigiTwin

RESPONSE FORMAT (JSON):
{
  "reply": "Your conversational response to the user",
  "simulationType": "food" | "medication" | "smoking" | "habit" | "combined" | null,
  "nutritionData": {
    "food": "name of food",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "sodium": number,
    "sugar": number,
    "concern": "any health concern based on user profile"
  } or null,
  "biomarkerImpact": {
    "glucoseChange": number (-20 to +50 mg/dL),
    "inflammationChange": number (-10 to +30 percent),
    "heartRateChange": number (-10 to +20 bpm),
    "energyChange": number (-50 to +30 percent),
    "sleepQualityImpact": "description",
    "overallHealthDelta": number (-20 to +10),
    "timeToImpact": "e.g., '30-60 minutes', '2-4 hours'"
  } or null,
  "suggestions": ["array of 2-4 follow-up questions or actions"],
  "avatarPrompt": "detailed prompt for generating updated DigiTwin avatar showing the impact" or null,
  "updatedBiomarkers": {
    "calories": new daily total,
    "glucoseMgDl": new glucose level,
    "inflammationIndex": new index (0-100),
    "energyLevel": new energy (0-100)
  } or null,
  "shouldGenerateAvatar": true/false (true if significant impact that should be visualized)
}

Be conversational, empathetic, and educational. Always provide actionable insights.
When simulating smoking, be direct about health risks but non-judgmental.
For food, give specific burn suggestions and healthier alternatives when applicable.`;

    // Build user message with history context
    let userMessageText = "";
    
    // Include recent history as context
    if (history.length > 0) {
      userMessageText += "Recent conversation:\n";
      for (const msg of history.slice(-4)) {
        userMessageText += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      }
      userMessageText += "\n";
    }
    
    userMessageText += `Current message: ${messageRaw || "Analyze this image and simulate its impact on my DigiTwin."}`;

    // Build the user message in the correct format
    const userContent: Array<{ type: "input_text"; text: string } | { type: "input_image"; image_url: string }> = [];
    
    userContent.push({ type: "input_text", text: userMessageText });
    
    if (imageDataUrl) {
      userContent.push({ type: "input_image", image_url: imageDataUrl });
    }

    const userMessage: OpenAIUserMessage = {
      role: "user",
      content: userContent,
    };

    const result = await callOpenAIJson<CompanionResponse>({
      instructions: systemPrompt,
      user: userMessage,
    });

    if (!result) {
      return NextResponse.json(demoResponse(biomarkers, isTrendQuery));
    }

    return NextResponse.json({
      ...result,
      source: difyNutritionData ? "dify_enhanced" : "ai",
    });
  } catch (err) {
    console.error("Health Companion error:", err);
    return NextResponse.json(demoResponse());
  }
}
