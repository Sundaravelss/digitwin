import { NextResponse } from "next/server";
import { difyWorkflowRun, difyWorkflowStream } from "../_lib/dify";

export const runtime = "nodejs";

/**
 * Matches the Dify workflow "DigiTwin Patient Intake Analyzer v2" input schema:
 *   patient_id        — e.g. "PT_001"
 *   item_text          — food / drug / supplement name, e.g. "pepperoni pizza", "metformin 500mg"
 *   item_image_url     — optional image URL (null when not provided)
 *   simulation_window  — "acute" | "chronic" | "both"
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
    return {
      status: "succeeded",
      outputs: {
        text: `## Nutritional Analysis

**Item:** ${query}

### Macronutrient Breakdown
| Nutrient | Amount | % Daily Value |
|----------|--------|---------------|
| Calories | 285 kcal | 14% |
| Protein | 12g | 24% |
| Carbohydrates | 36g | 12% |
| Fat | 10g | 15% |
| Fiber | 2.5g | 10% |
| Sodium | 640mg | 28% |

### Biomarker Projections
- **Blood Glucose**: +25 mg/dL spike expected within 30-60 min, returning to baseline in ~2h
- **Inflammation (CRP)**: Minimal acute impact; repeated high-sodium intake may elevate over weeks
- **Energy Level**: Short-term boost from carbohydrates, potential dip at ~2h post-meal

### Health Considerations
- High sodium content — monitor if managing blood pressure
- Moderate glycemic load — suitable for occasional consumption
- Consider pairing with a side salad for added fiber

### Recommendations
1. Add vegetables or a salad to increase fiber and reduce glycemic impact
2. Opt for whole-grain crust if available
3. Limit to 2 slices if managing prediabetes`,
      },
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
    lower.includes("mg")
  ) {
    return {
      status: "succeeded",
      outputs: {
        text: `## Medication Analysis

**Item:** ${query}

### Drug Profile
- **Class**: Biguanide antihyperglycemic
- **Primary Use**: Type 2 Diabetes / Prediabetes management
- **Mechanism**: Decreases hepatic glucose production, increases insulin sensitivity

### Biomarker Projections (with regular use)
- **Fasting Glucose**: -15 to -30 mg/dL reduction over 4-8 weeks
- **HbA1c**: -1.0 to -1.5% reduction over 3 months
- **LDL Cholesterol**: Modest reduction (-5 to -10%)
- **Body Weight**: Neutral to slight reduction (-1 to -3 kg)

### Safety Check (OpenFDA)
- **Common Side Effects**: GI discomfort (nausea, diarrhea) — typically resolves in 2 weeks
- **Serious Warnings**: Lactic acidosis (rare, monitor renal function)
- **Contraindications**: eGFR < 30 mL/min, acute heart failure

### Recommendations
1. Take with meals to reduce GI side effects
2. Start at low dose (500mg) and titrate gradually
3. Monitor renal function every 6-12 months
4. Avoid excessive alcohol consumption`,
      },
      source: "demo",
    };
  }

  return {
    status: "succeeded",
    outputs: {
      text: `## Health Analysis

**Item:** ${query}

### Overview
Based on your health profile, here's a personalized analysis:

### Key Health Metrics
- **Overall Health Score**: 76/100 (Moderate)
- **Primary Concerns**: Prediabetes management, lipid optimization
- **Positive Trends**: Regular physical activity, improving sleep patterns

### Biomarker Summary
| Marker | Current | Target | Status |
|--------|---------|--------|--------|
| Fasting Glucose | 108 mg/dL | < 100 mg/dL | ⚠️ Elevated |
| HbA1c | 5.8% | < 5.7% | ⚠️ Borderline |
| LDL Cholesterol | 142 mg/dL | < 130 mg/dL | ⚠️ Above optimal |
| HDL Cholesterol | 48 mg/dL | > 40 mg/dL | ✅ Acceptable |
| Triglycerides | 168 mg/dL | < 150 mg/dL | ⚠️ Elevated |

### Personalized Recommendations
1. **Dietary**: Increase fiber intake to 25-30g/day, reduce refined carbs
2. **Exercise**: Maintain 150+ min/week moderate activity; add resistance training
3. **Monitoring**: Check fasting glucose weekly, HbA1c every 3 months
4. **Lifestyle**: Aim for 7-8 hours of sleep consistently

### Next Steps
- Consider consulting with an endocrinologist about prediabetes management
- Track meals to identify glucose spike triggers
- Schedule lipid panel follow-up in 3 months`,
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
      return NextResponse.json(
        { error: "itemText is required" },
        { status: 400 }
      );
    }

    // Build workflow inputs matching Dify schema exactly
    const inputs: Record<string, unknown> = {
      patient_id: patientId,
      item_text: itemText.trim(),
      item_image_url: imageUrl,
      simulation_window: simulationWindow,
    };

    // Streaming mode
    if (stream) {
      const result = await difyWorkflowStream({
        inputs,
        user: "digitwin-intake-analyzer",
      });

      if (!result) {
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
    });

    if (!result) {
      return NextResponse.json(demoResponse(itemText));
    }

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
