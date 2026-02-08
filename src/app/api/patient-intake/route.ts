import { NextResponse } from "next/server";
import { difyWorkflowRun, difyWorkflowStream, difyFileUpload } from "../_lib/dify";

export const runtime = "nodejs";

/**
 * Matches the Dify workflow "DigiTwin Patient Intake Analyzer v2" input schema:
 *   patient_id        — e.g. "PT_001"
 *   item_text          — food / drug / supplement name, e.g. "pepperoni pizza", "metformin 500mg"
 *   item_image_url     — optional image URL (null when not provided)
 *   simulation_window  — "acute" | "chronic" | "both"
 *
 * Accepts both JSON and FormData (when image file is included).
 */
type IntakeRequest = {
  /** The item to analyze (food, drug, supplement, or health question) */
  itemText: string;
  /** Patient identifier */
  patientId?: string;
  /** Optional image URL of the food/medication */
  imageUrl?: string | null;
  /** Simulation window: "acute" (short-term), "chronic" (long-term), or "both" */
  simulationWindow?: "acute" | "chronic" | "both";
  /** Use SSE streaming */
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
    lower.includes("chicken")
  ) {
    const simData = {
      patient_id: "PT_001",
      item_identified: query,
      item_category: "food",
      text_summary: `Nutritional analysis of "${query}": moderate glycemic load with 285 kcal. Blood glucose will spike ~25 mg/dL within 30–60 min, returning to baseline in ~2h. High sodium (640 mg) — monitor if managing blood pressure. Consider adding fiber-rich sides to reduce glycemic impact.`,
      nutritional_or_pharma_data: {
        calories: 285,
        protein_g: 12,
        carbs_g: 36,
        fat_g: 10,
        sodium_mg: 640,
        sugar_g: 4,
        fiber_g: 2.5,
        glycemic_index: 62,
      },
      patient_alerts: [
        { type: "glycemic", severity: "moderate", message: "Moderate glycemic load — may cause a glucose spike above your target range (>140 mg/dL).", evidence: "Estimated GI: 62, GL: 22" },
        { type: "sodium", severity: "moderate", message: "High sodium content (640 mg) — 28% of daily limit. Monitor if managing blood pressure.", evidence: "AHA recommends <2300 mg/day" },
      ],
      simulation: {
        timepoints: ["0h", "0.5h", "1h", "1.5h", "2h", "3h", "4h"],
        projections: {
          glucose_mg_dl: [108, 128, 145, 138, 120, 110, 106],
          resting_heart_rate: [72, 74, 76, 75, 74, 73, 72],
          crp_mg_l: [1.2, 1.2, 1.3, 1.3, 1.2, 1.2, 1.2],
          energy_level: [70, 80, 85, 75, 62, 65, 70],
        },
        peak_glucose_time: "~60 min post-meal",
        return_to_baseline: "~2–3 hours",
        health_score_impact: { metabolic: -3, cardiovascular: -1, overall: -2 },
      },
      activity_suggestions: [
        { activity_name: "Brisk Walk", duration_minutes: 30, calories_burned: 150, intensity: "moderate", note: "Ideal 20–30 min after eating to blunt glucose spike" },
        { activity_name: "Cycling", duration_minutes: 20, calories_burned: 180, intensity: "moderate" },
        { activity_name: "Yoga", duration_minutes: 25, calories_burned: 80, intensity: "light", note: "Aids digestion and reduces cortisol" },
        { activity_name: "Stair Climbing", duration_minutes: 15, calories_burned: 120, intensity: "vigorous" },
      ],
      suggestions: [
        "Add a side salad to increase fiber",
        "Opt for whole-grain crust if available",
        "Limit to 2 slices if managing prediabetes",
        "Take a 20-min walk after eating",
      ],
    };
    return {
      status: "succeeded",
      outputs: { text: JSON.stringify(simData) },
      source: "demo",
    };
  }

  if (
    lower.includes("metformin") ||
    lower.includes("doliprane") ||
    lower.includes("paracetamol") ||
    lower.includes("acetaminophen") ||
    lower.includes("medication") ||
    lower.includes("drug") ||
    lower.includes("pill") ||
    lower.includes("amoxicillin") ||
    lower.includes("mg")
  ) {
    const isMedName = lower.includes("amoxicillin") || lower.includes("metformin") || lower.includes("doliprane") || lower.includes("paracetamol");
    const simData = {
      patient_id: "PT_001",
      item_identified: query,
      item_category: "medication",
      text_summary: `Medication analysis for "${query}": projected biomarker improvements over 12 weeks with regular use. Fasting glucose reduction of 15–30 mg/dL, HbA1c improvement of 1.0–1.5%. GI side effects are common initially but typically resolve within 2 weeks. Take with meals to minimize discomfort.`,
      nutritional_or_pharma_data: {
        active_ingredients: isMedName ? [query.split(" ")[0]] : ["Active compound"],
        mechanism: "Decreases hepatic glucose production, increases peripheral insulin sensitivity",
      },
      patient_alerts: [
        { type: "drug_safety", severity: "low", message: "Common GI side effects (nausea, diarrhea) in first 2 weeks — typically self-resolving.", evidence: "FDA prescribing information" },
        { type: "contraindication", severity: "high", message: "Contraindicated if eGFR < 30 mL/min. Monitor renal function periodically.", evidence: "FDA Black Box Warning: Lactic acidosis risk" },
        { type: "allergy_check", severity: "low", message: "No known cross-reactivity with your reported allergies (Penicillin)." },
      ],
      simulation: {
        timepoints: ["Baseline", "Week 1", "Week 2", "Week 4", "Week 8", "Week 12"],
        projections: {
          glucose_mg_dl: [108, 104, 98, 92, 85, 80],
          hba1c_pct: [5.8, 5.75, 5.65, 5.5, 5.1, 4.8],
          ldl_mg_dl: [142, 140, 138, 135, 132, 130],
          crp_mg_l: [1.2, 1.1, 1.0, 0.9, 0.85, 0.8],
        },
        health_score_impact: { metabolic: 12, cardiovascular: 5, overall: 8 },
      },
      activity_suggestions: [
        { activity_name: "Walking (daily)", duration_minutes: 30, calories_burned: 150, intensity: "moderate", note: "Enhances medication efficacy for glucose control" },
        { activity_name: "Resistance Training", duration_minutes: 20, calories_burned: 130, intensity: "moderate", note: "Improves insulin sensitivity synergistically" },
      ],
      suggestions: [
        "Take with meals to reduce GI side effects",
        "Start at low dose and titrate gradually",
        "Monitor renal function every 6–12 months",
        "Avoid excessive alcohol consumption",
      ],
    };
    return {
      status: "succeeded",
      outputs: { text: JSON.stringify(simData) },
      source: "demo",
    };
  }

  // Sleep-related queries
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("rest")) {
    const simData = {
      patient_id: "PT_001",
      item_identified: query,
      item_category: "lifestyle",
      text_summary: `Sleep impact analysis: reducing sleep to 4 hours significantly impairs metabolic and cardiovascular biomarkers. Expect fasting glucose to rise ~15 mg/dL, cortisol to spike 40%, and cognitive performance to drop. Chronic sleep deprivation (<6h) is associated with 48% increased cardiovascular risk.`,
      patient_alerts: [
        { type: "sleep", severity: "high", message: "Severe sleep deficit (<5h) — significantly increases insulin resistance and cortisol levels.", evidence: "Walker et al., Nature Reviews (2017)" },
        { type: "cardiovascular", severity: "moderate", message: "Short sleep duration linked to 48% increased risk of coronary heart disease.", evidence: "European Heart Journal meta-analysis" },
      ],
      simulation: {
        timepoints: ["Day 1", "Day 2", "Day 3", "Day 5", "Day 7", "Day 14"],
        projections: {
          glucose_mg_dl: [108, 115, 122, 128, 132, 140],
          resting_heart_rate: [72, 76, 80, 82, 84, 86],
          cortisol_nmol_l: [350, 420, 480, 510, 530, 550],
          energy_level: [70, 50, 38, 30, 25, 20],
        },
        sleep_quality_impact: "Severe negative impact on all biomarkers",
        health_score_impact: { metabolic: -15, cardiovascular: -10, overall: -12 },
      },
      activity_suggestions: [
        { activity_name: "Sleep Hygiene Routine", duration_minutes: 30, calories_burned: 0, intensity: "light", note: "Dim lights, no screens 1h before bed" },
        { activity_name: "Evening Yoga", duration_minutes: 20, calories_burned: 60, intensity: "light", note: "Promotes parasympathetic activation" },
        { activity_name: "Morning Sunlight Walk", duration_minutes: 15, calories_burned: 60, intensity: "light", note: "Resets circadian rhythm" },
      ],
      suggestions: [
        "Aim for 7–8 hours of sleep consistently",
        "Avoid caffeine after 2 PM",
        "Keep bedroom cool (65–68°F / 18–20°C)",
        "Consider melatonin 0.5 mg if needed short-term",
      ],
    };
    return {
      status: "succeeded",
      outputs: { text: JSON.stringify(simData) },
      source: "demo",
    };
  }

  // General health / fallback
  const simData = {
    patient_id: "PT_001",
    item_identified: query,
    item_category: "general_health",
    text_summary: `Health overview based on your profile: Overall health score 76/100. Key areas of focus: prediabetes management (fasting glucose 108 mg/dL), lipid optimization (LDL 142 mg/dL), and consistent sleep. Positive trends include regular physical activity and improving dietary habits.`,
    patient_alerts: [
      { type: "glucose", severity: "moderate", message: "Fasting glucose 108 mg/dL — above normal range (<100). Prediabetes range.", evidence: "ADA Prediabetes criteria: 100–125 mg/dL" },
      { type: "lipid", severity: "moderate", message: "LDL cholesterol 142 mg/dL — above optimal target (<130 mg/dL for your risk profile).", evidence: "ACC/AHA Guidelines" },
    ],
    simulation: {
      timepoints: ["Current", "1 Month", "3 Months", "6 Months"],
      projections: {
        glucose_mg_dl: [108, 104, 100, 96],
        ldl_mg_dl: [142, 138, 132, 125],
        systolic: [128, 126, 122, 120],
        energy_level: [70, 74, 78, 82],
      },
      health_score_impact: { metabolic: 5, cardiovascular: 4, overall: 5 },
    },
    activity_suggestions: [
      { activity_name: "Brisk Walking", duration_minutes: 30, calories_burned: 150, intensity: "moderate", note: "5 days/week for cardiovascular health" },
      { activity_name: "Resistance Training", duration_minutes: 25, calories_burned: 130, intensity: "moderate", note: "2–3 days/week for insulin sensitivity" },
      { activity_name: "Swimming", duration_minutes: 30, calories_burned: 200, intensity: "moderate", note: "Low-impact cardio, excellent for joint health" },
    ],
    suggestions: [
      "Increase fiber intake to 25–30g/day",
      "Reduce refined carbs and added sugars",
      "Check fasting glucose weekly",
      "Schedule lipid panel follow-up in 3 months",
    ],
  };
  return {
    status: "succeeded",
    outputs: { text: JSON.stringify(simData) },
    source: "demo",
  };
}

export async function POST(req: Request): Promise<Response> {
  let parsedItemText = "";

  try {
    // Parse body — support both JSON and FormData (for image uploads)
    let itemText = "";
    let patientId = "PT_001";
    let imageUrl: string | null = null;
    let simulationWindow: "acute" | "chronic" | "both" = "both";
    let stream = false;
    let imageFile: File | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      itemText = String(form.get("itemText") ?? "");
      patientId = String(form.get("patientId") ?? "PT_001");
      imageUrl = form.get("imageUrl") ? String(form.get("imageUrl")) : null;
      simulationWindow = (String(form.get("simulationWindow") ?? "both")) as "acute" | "chronic" | "both";
      stream = form.get("stream") === "true";
      const img = form.get("image");
      if (img instanceof File) imageFile = img;
    } else {
      const body: IntakeRequest = await req.json();
      itemText = body.itemText || "";
      patientId = body.patientId || "PT_001";
      imageUrl = body.imageUrl ?? null;
      simulationWindow = body.simulationWindow || "both";
      stream = body.stream || false;
    }

    // Default text when image is provided without text
    if ((!itemText || !itemText.trim()) && imageFile) {
      itemText = "Analyze this image";
    }

    parsedItemText = itemText;

    if (!itemText || !itemText.trim()) {
      return NextResponse.json(
        { error: "itemText is required" },
        { status: 400 }
      );
    }

    // If an image file was uploaded, upload it to Dify first
    let difyFiles: Array<{ type: string; transfer_method: string; upload_file_id: string }> | undefined;

    if (imageFile) {
      console.log("[patient-intake] Uploading image to Dify:", imageFile.name, imageFile.size, "bytes");
      try {
        const uploaded = await difyFileUpload({
          file: imageFile,
          user: "digitwin-intake-analyzer",
        });

        if (uploaded) {
          console.log("[patient-intake] Dify file upload success, id:", uploaded.id);
          difyFiles = [
            {
              type: "image",
              transfer_method: "local_file",
              upload_file_id: uploaded.id,
            },
          ];
        } else {
          console.warn("[patient-intake] Dify file upload returned null (missing DIFY_API_URL or DIFY_INTAKE_API_KEY?)");
        }
      } catch (uploadErr) {
        console.error("[patient-intake] Dify file upload error:", uploadErr);
        // Continue without image — workflow can still process text
      }
    }

    // Build workflow inputs matching Dify schema exactly
    const inputs: Record<string, unknown> = {
      patient_id: patientId,
      item_text: itemText.trim(),
      item_image_url: imageUrl || "",
      simulation_window: simulationWindow,
    };

    console.log("[patient-intake] Calling Dify workflow with inputs:", JSON.stringify(inputs), "files:", difyFiles ? difyFiles.length : 0);

    // Streaming mode
    if (stream) {
      const result = await difyWorkflowStream({
        inputs,
        user: "digitwin-intake-analyzer",
      });

      if (!result) {
        console.warn("[patient-intake] Dify workflow stream returned null — falling back to demo");
        return NextResponse.json(demoResponse(itemText));
      }

      return new Response(result.stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Blocking mode
    const result = await difyWorkflowRun({
      inputs,
      user: "digitwin-intake-analyzer",
      files: difyFiles,
    });

    if (!result) {
      console.warn("[patient-intake] Dify workflow returned null — falling back to demo. Check DIFY_API_URL and DIFY_INTAKE_API_KEY env vars.");
      return NextResponse.json(demoResponse(itemText));
    }

    console.log("[patient-intake] Dify workflow result — status:", result.status, "elapsed:", result.elapsedTime, "tokens:", result.totalTokens);

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
    const message = err instanceof Error ? err.message : "Unknown error";

    // Dify unavailable or errored — fall back to demo data
    return NextResponse.json({
      ...demoResponse(parsedItemText || "general health"),
      _warning: `Dify workflow error — showing demo data (${message})`,
    });
  }
}
