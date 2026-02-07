import { NextResponse } from "next/server";

export const runtime = "edge";

const GLADIUM_KEY = process.env.gladium_key;

type VoiceCoachRequest = {
  message: string;
  mode: "text" | "voice";
  profile?: {
    age?: number;
    sex?: string;
    allergies?: string;
    conditions?: string;
    goals?: string[];
    dietaryRestrictions?: string[];
  };
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
};

type VoiceCoachResponse = {
  reply: string;
  audioUrl?: string;
  suggestions: string[];
  mealIdeas?: string[];
  disclaimer: string;
};

const SYSTEM_PROMPT = `You are DigiTwin's 24/7 Nutrition Coach — a friendly, knowledgeable nutritionist available around the clock via voice or text.

IMPORTANT BOUNDARIES:
- You are ONLY a nutrition coach, NOT a medical advisor or health practitioner
- NEVER provide medical advice, diagnose conditions, or recommend medications
- If asked about medical conditions, symptoms, or treatments, politely redirect to "Please consult a healthcare professional for medical advice"
- Focus ONLY on: food choices, meal planning, nutritional content, portion sizes, hydration, macros/micros, dietary restrictions

YOUR EXPERTISE:
- Personalized meal suggestions based on user's goals and restrictions
- Explaining nutritional content of foods
- Helping with meal timing and portion control
- Suggesting healthier alternatives to favorite foods
- Understanding food labels and ingredients
- Balancing macronutrients (protein, carbs, fats)
- Hydration guidance
- Snack recommendations
- Restaurant ordering tips

PERSONALITY:
- Warm, encouraging, and non-judgmental
- Use simple language, avoid jargon
- Be practical and realistic
- Celebrate small wins
- Never shame food choices
- Keep responses concise for voice interactions (2-3 sentences when in voice mode)

Always respond in JSON format:
{
  "reply": "Your conversational response",
  "suggestions": ["2-3 follow-up questions the user might ask"],
  "mealIdeas": ["Optional: 1-3 meal ideas if relevant"],
  "disclaimer": "Brief reminder this is nutrition guidance, not medical advice"
}`;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VoiceCoachRequest;
    const { message, mode, profile, conversationHistory = [] } = body;

    if (!message?.trim()) {
      return new NextResponse("Message is required", { status: 400 });
    }

    // Build user context
    let userContext = "";
    if (profile) {
      const parts: string[] = [];
      if (profile.age) parts.push(`Age: ${profile.age}`);
      if (profile.sex) parts.push(`Sex: ${profile.sex}`);
      if (profile.allergies) parts.push(`Allergies: ${profile.allergies}`);
      if (profile.goals?.length) parts.push(`Goals: ${profile.goals.join(", ")}`);
      if (profile.dietaryRestrictions?.length) {
        parts.push(`Dietary restrictions: ${profile.dietaryRestrictions.join(", ")}`);
      }
      if (parts.length) {
        userContext = `\n\nUser profile:\n${parts.join("\n")}`;
      }
    }

    // Demo response if no API key
    if (!GLADIUM_KEY) {
      const demoResponses: Record<string, VoiceCoachResponse> = {
        default: {
          reply: "Great question! I'd love to help you with your nutrition. What specific aspect would you like guidance on — meal planning, understanding food labels, or finding healthier alternatives to your favorite foods?",
          suggestions: [
            "What should I eat for breakfast?",
            "How can I reduce sugar intake?",
            "What are good protein sources?",
          ],
          mealIdeas: [
            "Greek yogurt with berries and nuts",
            "Grilled chicken salad with olive oil dressing",
            "Overnight oats with banana and almond butter",
          ],
          disclaimer: "This is nutrition guidance only, not medical advice. Consult a healthcare professional for medical concerns.",
        },
        breakfast: {
          reply: "For a balanced breakfast, aim for protein plus complex carbs plus healthy fats! This combo keeps you full and energized until lunch. Try to include fiber-rich foods for sustained energy.",
          suggestions: [
            "What if I'm not hungry in the morning?",
            "Are smoothies a good breakfast option?",
            "How much protein should breakfast have?",
          ],
          mealIdeas: [
            "Scrambled eggs with whole grain toast and avocado",
            "Overnight oats with chia seeds and berries",
            "Greek yogurt parfait with granola and honey",
          ],
          disclaimer: "This is nutrition guidance only, not medical advice.",
        },
        snack: {
          reply: "Smart snacking can actually help maintain energy and prevent overeating at meals! The key is choosing snacks with protein or fiber to keep you satisfied. Aim for 150-200 calories per snack.",
          suggestions: [
            "What are some portable snacks?",
            "How often should I snack?",
            "Are protein bars healthy?",
          ],
          mealIdeas: [
            "Apple slices with almond butter",
            "Handful of mixed nuts and dried fruit",
            "Hummus with veggie sticks",
          ],
          disclaimer: "This is nutrition guidance only, not medical advice.",
        },
      };

      const lower = message.toLowerCase();
      let response = demoResponses.default;
      if (lower.includes("breakfast") || lower.includes("morning")) {
        response = demoResponses.breakfast;
      } else if (lower.includes("snack")) {
        response = demoResponses.snack;
      }

      return NextResponse.json(response);
    }

    // Build messages for Gladium API (Groq-compatible format)
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT + userContext + (mode === "voice" ? "\n\nNote: User is speaking via voice. Keep responses concise (2-3 sentences max for the main reply)." : "") },
    ];

    // Add conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call Gladium API (Groq-compatible endpoint)
    const gladiumRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GLADIUM_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: mode === "voice" ? 300 : 500,
      }),
    });

    if (!gladiumRes.ok) {
      const errText = await gladiumRes.text();
      console.error("Gladium API error:", errText);
      return new NextResponse("AI service error", { status: 502 });
    }

    const gladiumData = await gladiumRes.json();
    const content = gladiumData.choices?.[0]?.message?.content ?? "";

    // Parse JSON response
    try {
      const parsed = JSON.parse(content) as VoiceCoachResponse;
      return NextResponse.json(parsed);
    } catch {
      // If not valid JSON, wrap it
      return NextResponse.json<VoiceCoachResponse>({
        reply: content,
        suggestions: ["Tell me more", "What else should I know?", "Any meal ideas?"],
        disclaimer: "This is nutrition guidance only, not medical advice.",
      });
    }
  } catch (e) {
    console.error("Voice coach error:", e);
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 500 },
    );
  }
}
