import { NextResponse } from "next/server";
import { difyWorkflowRun, difyWorkflowStream } from "../_lib/dify";

export const runtime = "nodejs";

type IntakeRequest = {
  itemText: string;
  patientId?: string;
  imageUrl?: string | null;
  simulationWindow?: "acute" | "chronic" | "both";
  stream?: boolean;
};

function demoResponse(query: string) {
  const lower = query.toLowerCase();

  if (
    lower.includes("pizza") ||
    lower.includes("burger") ||
    lower.includes("food") ||
    lower.includes("rice") ||
    lower.includes("salad") ||
    lower.includes("chicken") ||
    lower.includes("eating")
  ) {
    return {
      status: "succeeded",
      outputs: {
        text: JSON.stringify({
          patient_id: "PT_001",
          patient_name: "Sundar",
          item_identified: query,
          item_category: "food",
          nutritional_or_pharma_data: {
            calories: 285,
            protein_g: 12,
            carbs_g: 36,
            fat_g: 10,
            sodium_mg: 640,
            sugar_g: 3.6,
            fiber_g: 2.5,
            glycemic_index: 80,
          },
          patient_alerts: [
            {
              type: "sodium",
              severity: "moderate",
              message: "High sodium content (640mg) — monitor if managing blood pressure",
              evidence: "WHO recommends <2000mg/day",
            },
            {
              type: "glycemic",
              severity: "moderate",
              message: "High glycemic index may cause blood glucose spike in prediabetic range",
              evidence: "GI: 80, GL: 22 (high)",
            },
          ],
          simulation: {
            timepoints: ["0min", "30min", "60min", "90min", "120min", "180min", "240min"],
            projections: {
              glucose_mg_dl: [108, 135, 152, 143, 128, 115, 108],
              resting_heart_rate: [72, 76, 80, 78, 75, 73, 72],
              crp_mg_l: [1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.2],
              systolic: [120, 124, 128, 126, 123, 121, 120],
              energy_level: [70, 80, 75, 65, 60, 65, 70],
            },
            peak_glucose_time: "~60 minutes",
            return_to_baseline: "~3-4 hours",
            health_score_impact: { metabolic: -8, cardiovascular: -3, overall: -5 },
          },
          activity_suggestions: [
            { activity_name: "Brisk Walk", duration_minutes: 30, calories_burned: 150, intensity: "moderate", note: "Best within 30 min after eating" },
            { activity_name: "Light Cycling", duration_minutes: 25, calories_burned: 180, intensity: "moderate" },
            { activity_name: "Yoga Flow", duration_minutes: 40, calories_burned: 120, intensity: "light", note: "Helps digestion & glucose uptake" },
          ],
          text_summary: "Eating pizza will cause a moderate glucose spike (+44 mg/dL) peaking around 60 minutes, with elevated sodium intake. Consider a 30-minute walk after eating to mitigate the blood sugar rise.",
          suggestions: [
            "Analyze a healthier pizza alternative",
            "Check your glucose trend over the week",
            "Simulate adding a salad with pizza",
            "Show activity suggestions to offset calories",
          ],
        }),
      },
      source: "demo",
    };
  }

  if (
    lower.includes("amoxicillin") ||
    lower.includes("metformin") ||
    lower.includes("doliprane") ||
    lower.includes("paracetamol") ||
    lower.includes("medication") ||
    lower.includes("drug") ||
    lower.includes("pill") ||
    lower.includes("mg") ||
    lower.includes("taking")
  ) {
    const medName = query.replace(/^(taking|impact of)\s*/i, "").trim();
    return {
      status: "succeeded",
      outputs: {
        text: JSON.stringify({
          patient_id: "PT_001",
          patient_name: "Sundar",
          item_identified: medName || "Medication",
          item_category: "medication",
          nutritional_or_pharma_data: {
            active_ingredients: ["Amoxicillin"],
            mechanism: "Beta-lactam antibiotic — inhibits bacterial cell wall synthesis",
          },
          patient_alerts: [
            {
              type: "allergy",
              severity: "high",
              message: "Patient has Penicillin allergy — Amoxicillin is a penicillin-type antibiotic. Cross-reactivity risk!",
              evidence: "Patient profile: Allergies = Penicillin",
            },
            {
              type: "interaction",
              severity: "low",
              message: "No significant interaction with current Vitamin D supplement",
              evidence: "OpenFDA cross-reference",
            },
          ],
          simulation: {
            timepoints: ["Day 0", "Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
            projections: {
              crp_mg_l: [1.2, 1.0, 0.8, 0.6, 0.5, 0.4],
              wbc_count: [11.0, 10.2, 9.5, 8.8, 8.2, 7.5],
              gut_health: [80, 70, 62, 58, 55, 52],
              energy_level: [70, 65, 60, 63, 67, 72],
            },
            health_score_impact: { metabolic: -2, cardiovascular: 0, overall: +3 },
          },
          activity_suggestions: null,
          text_summary: "ALERT: Amoxicillin is a penicillin-type antibiotic and you have a Penicillin allergy. Please consult your healthcare provider before taking this medication. If cleared, the 5-day course should reduce inflammation markers while temporarily affecting gut health.",
          pharmacogenomic_note: "Penicillin allergy cross-reactivity with amoxicillin occurs in ~1-2% of cases. An allergy test is recommended.",
          concern: "Allergy cross-reactivity risk requires medical consultation",
          suggestions: [
            "Check safe antibiotic alternatives",
            "Show my allergy profile details",
            "Simulate a non-penicillin antibiotic",
            "What probiotics help during antibiotics?",
          ],
        }),
      },
      source: "demo",
    };
  }

  return {
    status: "succeeded",
    outputs: {
      text: JSON.stringify({
        patient_id: "PT_001",
        patient_name: "Sundar",
        item_identified: query,
        item_category: "general",
        simulation: {
          timepoints: ["Now", "+1h", "+2h", "+4h", "+8h", "+12h"],
          projections: {
            energy_level: [70, 68, 65, 60, 55, 50],
            glucose_mg_dl: [108, 105, 102, 100, 98, 95],
            resting_heart_rate: [72, 72, 71, 70, 70, 69],
          },
          health_score_impact: { metabolic: 0, cardiovascular: 0, overall: 0 },
        },
        text_summary: `Based on your current health profile, here's your analysis for: "${query}". Your biomarkers are within acceptable ranges, with glucose slightly elevated at 108 mg/dL (prediabetic range). Continue monitoring and maintaining a balanced diet with regular exercise.`,
        suggestions: [
          "Show my detailed biomarker trends",
          "Suggest a healthy meal plan",
          "How can I lower my glucose naturally?",
          "Simulate impact of 30 min exercise",
        ],
      }),
    },
    source: "demo",
  };
}

export async function POST(req: Request): Promise<Response> {
  let parsedItemText = "";

  try {
    const body: IntakeRequest = await req.json();
    const {
      itemText,
      patientId = "PT_001",
      imageUrl = null,
      simulationWindow = "both",
      stream,
    } = body;
    parsedItemText = itemText || "";

    if (!itemText || !itemText.trim()) {
      return NextResponse.json({ error: "itemText is required" }, { status: 400 });
    }

    const inputs: Record<string, unknown> = {
      patient_id: patientId,
      item_text: itemText.trim(),
      item_image_url: imageUrl,
      simulation_window: simulationWindow,
    };

    if (stream) {
      const result = await difyWorkflowStream({ inputs, user: "digitwin-intake-analyzer" });
      if (!result) return NextResponse.json(demoResponse(itemText));
      return new Response(result.stream, {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
      });
    }

    const result = await difyWorkflowRun({ inputs, user: "digitwin-intake-analyzer" });
    if (!result) return NextResponse.json(demoResponse(itemText));

    return NextResponse.json({
      status: result.status,
      outputs: result.outputs,
      elapsedTime: result.elapsedTime,
      totalTokens: result.totalTokens,
      totalSteps: result.totalSteps,
      source: "dify",
    });
  } catch (err) {
    console.error("Patient Intake Analyzer error:", err);
    return NextResponse.json({
      ...demoResponse(parsedItemText || "general health"),
      _warning: "Dify workflow error — showing demo data",
    });
  }
}
