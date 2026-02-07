import { NextResponse } from "next/server";
import { optionalEnv } from "../../_lib/env";

export const runtime = "edge";

type TreatmentSimRequest = {
  patientProfile: {
    age?: number;
    sex?: string;
    conditions?: string;
    allergies?: string;
    currentMeds?: string;
    biomarkers?: {
      bloodPressure?: string;
      glucoseMgDl?: number;
      restingHeartRate?: number;
      hrvMs?: number;
      sleepHours?: number;
    };
  };
  treatment: {
    type: "medication" | "procedure" | "lifestyle" | "combination";
    name: string;
    dosage?: string;
    duration?: string;
    description?: string;
  };
  simulationDays?: number; // 7, 30, 90, 180
};

type BiomarkerProjection = {
  day: number;
  bloodPressure: string;
  glucoseMgDl: number;
  restingHeartRate: number;
  hrvMs: number;
  inflammationIndex: number;
  overallHealth: number; // 0-100
};

type TreatmentSimResponse = {
  treatmentName: string;
  efficacyScore: number; // 0-100
  riskScore: number; // 0-100
  projections: BiomarkerProjection[];
  expectedOutcomes: {
    positive: string[];
    risks: string[];
    sideEffects: string[];
  };
  alternativeTreatments: Array<{
    name: string;
    efficacy: number;
    reason: string;
  }>;
  monitoringRecommendations: string[];
  clinicalNotes: string;
  source: "ai_simulation" | "dify_enhanced" | "demo";
};

function generateDemoProjections(
  baseline: TreatmentSimRequest["patientProfile"]["biomarkers"],
  days: number,
  isPositive: boolean
): BiomarkerProjection[] {
  const baselineBP = baseline?.bloodPressure?.split("/").map(Number) || [130, 85];
  const baselineGlucose = baseline?.glucoseMgDl || 100;
  const baselineRHR = baseline?.restingHeartRate || 72;
  const baselineHRV = baseline?.hrvMs || 45;

  const projections: BiomarkerProjection[] = [];
  const intervals = [1, 7, 14, 30, 60, 90, 180].filter((d) => d <= days);

  for (const day of intervals) {
    const progress = day / days;
    const improvement = isPositive ? progress * 0.15 : progress * -0.1;

    projections.push({
      day,
      bloodPressure: `${Math.round(baselineBP[0] * (1 - improvement))}/${Math.round(baselineBP[1] * (1 - improvement))}`,
      glucoseMgDl: Math.round(baselineGlucose * (1 - improvement * 0.8)),
      restingHeartRate: Math.round(baselineRHR * (1 - improvement * 0.5)),
      hrvMs: Math.round(baselineHRV * (1 + improvement * 0.6)),
      inflammationIndex: Math.round(50 * (1 - improvement)),
      overallHealth: Math.round(Math.min(100, 65 + progress * (isPositive ? 25 : -15))),
    });
  }

  return projections;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TreatmentSimRequest;
    const { patientProfile, treatment, simulationDays = 90 } = body;

    if (!treatment?.name) {
      return new NextResponse("Treatment name is required", { status: 400 });
    }

    // Demo responses for common treatments
    const demoTreatments: Record<string, Partial<TreatmentSimResponse>> = {
      metformin: {
        treatmentName: "Metformin 500mg",
        efficacyScore: 82,
        riskScore: 15,
        expectedOutcomes: {
          positive: [
            "Blood glucose reduction of 15-20% expected within 4 weeks",
            "HbA1c improvement of 1-1.5% over 3 months",
            "Potential weight stabilization or modest loss",
            "Improved insulin sensitivity",
          ],
          risks: [
            "Lactic acidosis (rare, monitor kidney function)",
            "B12 deficiency with long-term use",
          ],
          sideEffects: [
            "GI discomfort (usually resolves in 2-4 weeks)",
            "Metallic taste",
            "Reduced appetite",
          ],
        },
        alternativeTreatments: [
          { name: "Lifestyle modification only", efficacy: 45, reason: "Lower efficacy but no medication risks" },
          { name: "GLP-1 agonist", efficacy: 88, reason: "Higher efficacy, injectable, weight loss benefit" },
          { name: "SGLT2 inhibitor", efficacy: 78, reason: "Cardiovascular benefits, weight loss" },
        ],
        monitoringRecommendations: [
          "Check HbA1c at baseline and every 3 months",
          "Monitor kidney function (eGFR) every 6 months",
          "Check B12 levels annually",
          "Track fasting glucose weekly initially",
        ],
        clinicalNotes: "First-line treatment for type 2 diabetes. Start low (500mg) and titrate based on tolerance. Good safety profile in patients without renal impairment.",
      },
      lisinopril: {
        treatmentName: "Lisinopril 10mg",
        efficacyScore: 78,
        riskScore: 20,
        expectedOutcomes: {
          positive: [
            "Blood pressure reduction of 10-15 mmHg systolic expected",
            "Cardiovascular protection benefits",
            "Renal protection in diabetic patients",
            "Reduced left ventricular hypertrophy over time",
          ],
          risks: [
            "Hypotension (especially first dose)",
            "Angioedema (rare but serious)",
            "Hyperkalemia",
          ],
          sideEffects: [
            "Dry cough (10-15% of patients)",
            "Dizziness, especially when standing",
            "Fatigue initially",
          ],
        },
        alternativeTreatments: [
          { name: "ARB (Losartan)", efficacy: 75, reason: "Similar efficacy, no cough side effect" },
          { name: "Calcium channel blocker", efficacy: 72, reason: "Different mechanism, good for isolated systolic HTN" },
          { name: "Thiazide diuretic", efficacy: 70, reason: "Cost-effective, good add-on therapy" },
        ],
        monitoringRecommendations: [
          "Check blood pressure 2-4 weeks after starting",
          "Monitor potassium and creatinine at 1-2 weeks",
          "Assess for cough at each visit",
          "Annual metabolic panel",
        ],
        clinicalNotes: "Excellent first-line agent for hypertension with diabetes or heart failure. Avoid in pregnancy. Monitor for cough which may require switch to ARB.",
      },
      default: {
        efficacyScore: 70,
        riskScore: 25,
        expectedOutcomes: {
          positive: [
            "Expected improvement in targeted biomarkers",
            "Symptom relief anticipated within treatment window",
            "Potential quality of life improvement",
          ],
          risks: [
            "Individual response may vary",
            "Drug interactions should be monitored",
            "Contraindications should be reviewed",
          ],
          sideEffects: [
            "Common side effects vary by treatment",
            "Monitor for unexpected reactions",
          ],
        },
        alternativeTreatments: [
          { name: "Lifestyle modification", efficacy: 50, reason: "Foundation of any treatment plan" },
          { name: "Alternative medication class", efficacy: 65, reason: "May be considered if intolerant" },
        ],
        monitoringRecommendations: [
          "Regular follow-up appointments",
          "Monitor for treatment response",
          "Track side effects",
          "Adjust as needed based on response",
        ],
        clinicalNotes: "Treatment simulation based on general clinical principles. Individualized assessment recommended.",
      },
    };

    // Get demo response
    const treatmentKey = treatment.name.toLowerCase().replace(/\s+\d+mg/g, "").trim();
    const demoData = demoTreatments[treatmentKey] || demoTreatments.default;

    const isPositive = (demoData.efficacyScore || 70) > 60;
    const projections = generateDemoProjections(
      patientProfile.biomarkers,
      simulationDays,
      isPositive
    );

    // Try Dify for enhanced simulation if available
    let source: TreatmentSimResponse["source"] = "demo";
    let clinicalNotes = demoData.clinicalNotes || "";

    const DIFY_API_KEY = optionalEnv("DIFY_API_KEY");
    const DIFY_API_URL = optionalEnv("DIFY_API_URL");
    const OPENAI_API_KEY = optionalEnv("OPENAI_API_KEY");

    if (DIFY_API_KEY && DIFY_API_URL) {
      try {
        const difyRes = await fetch(`${DIFY_API_URL}/chat-messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DIFY_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: {},
            query: `Treatment simulation for ${treatment.name} (${treatment.type}) in patient with: ${patientProfile.conditions || "no known conditions"}. Current meds: ${patientProfile.currentMeds || "none"}. Allergies: ${patientProfile.allergies || "none"}. Provide clinical notes.`,
            response_mode: "blocking",
            user: "digitwin-doctor",
          }),
        });

        if (difyRes.ok) {
          const difyData = await difyRes.json();
          if (difyData.answer) {
            clinicalNotes = difyData.answer;
            source = "dify_enhanced";
          }
        }
      } catch (difyErr) {
        console.error("Dify enhancement failed:", difyErr);
      }
    }

    // Use OpenAI for enhanced simulation if available and Dify didn't work
    if (source === "demo" && OPENAI_API_KEY) {
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a clinical decision support system for doctors. Provide a brief clinical note (2-3 sentences) about the expected outcomes of the treatment. Be professional and evidence-based. Do not provide specific medical advice - this is for simulation purposes only.`,
              },
              {
                role: "user",
                content: `Treatment: ${treatment.name} (${treatment.type}${treatment.dosage ? `, ${treatment.dosage}` : ""})
Patient: ${patientProfile.age || "unknown"} y/o ${patientProfile.sex || "unknown"}, conditions: ${patientProfile.conditions || "none"}, allergies: ${patientProfile.allergies || "NKDA"}, current meds: ${patientProfile.currentMeds || "none"}
Provide clinical simulation notes.`,
              },
            ],
            temperature: 0.3,
            max_tokens: 200,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const aiNotes = data.choices?.[0]?.message?.content;
          if (aiNotes) {
            clinicalNotes = aiNotes;
            source = "ai_simulation";
          }
        }
      } catch (err) {
        console.error("OpenAI enhancement failed:", err);
      }
    }

    const response: TreatmentSimResponse = {
      treatmentName: treatment.name + (treatment.dosage ? ` ${treatment.dosage}` : ""),
      efficacyScore: demoData.efficacyScore || 70,
      riskScore: demoData.riskScore || 25,
      projections,
      expectedOutcomes: demoData.expectedOutcomes || {
        positive: [],
        risks: [],
        sideEffects: [],
      },
      alternativeTreatments: demoData.alternativeTreatments || [],
      monitoringRecommendations: demoData.monitoringRecommendations || [],
      clinicalNotes,
      source,
    };

    return NextResponse.json(response);
  } catch (e) {
    console.error("Treatment simulation error:", e);
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 500 },
    );
  }
}
