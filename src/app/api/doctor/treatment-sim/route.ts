import { NextResponse } from "next/server";
import { optionalEnv } from "../../_lib/env";
import { difyWorkflowRun, type DifyThinkingStep } from "../../_lib/dify";

export const runtime = "nodejs";

type TreatmentSimRequest = {
  patientId?: string;
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

type DrugInteraction = {
  drug: string;
  severity: "low" | "moderate" | "high" | "contraindicated";
  description: string;
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
  drugInteractions: DrugInteraction[];
  thinkingSteps: DifyThinkingStep[];
  alternativeTreatments: Array<{
    name: string;
    efficacy: number;
    reason: string;
  }>;
  monitoringRecommendations: string[];
  clinicalNotes: string;
  source: "ai_simulation" | "dify_enhanced" | "demo";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDifyProjections(raw: any[]): BiomarkerProjection[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => ({
    day: p.day ?? 0,
    bloodPressure: p.blood_pressure || "130/85",
    glucoseMgDl: p.glucose_mg_dl ?? 100,
    restingHeartRate: p.resting_heart_rate ?? 72,
    hrvMs: p.hrv_ms ?? 45,
    inflammationIndex: Math.round((p.crp_mg_l ?? 3) * 10), // CRP to 0-100 index
    overallHealth: p.overall_health ?? 50,
  }));
}

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

function buildDemoResponse(
  treatment: TreatmentSimRequest["treatment"],
  patientProfile: TreatmentSimRequest["patientProfile"],
  simulationDays: number
): TreatmentSimResponse {
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

  const treatmentKey = treatment.name.toLowerCase().replace(/\s+\d+mg/g, "").trim();
  const demoData = demoTreatments[treatmentKey] || demoTreatments.default;
  const isPositive = (demoData.efficacyScore || 70) > 60;

  return {
    treatmentName: treatment.name + (treatment.dosage ? ` ${treatment.dosage}` : ""),
    efficacyScore: demoData.efficacyScore || 70,
    riskScore: demoData.riskScore || 25,
    projections: generateDemoProjections(patientProfile.biomarkers, simulationDays, isPositive),
    expectedOutcomes: demoData.expectedOutcomes || { positive: [], risks: [], sideEffects: [] },
    drugInteractions: [],
    thinkingSteps: [],
    alternativeTreatments: demoData.alternativeTreatments || [],
    monitoringRecommendations: demoData.monitoringRecommendations || [],
    clinicalNotes: demoData.clinicalNotes || "",
    source: "demo",
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TreatmentSimRequest;
    const { patientId, patientProfile, treatment, simulationDays = 90 } = body;

    if (!treatment?.name) {
      return new NextResponse("Treatment name is required", { status: 400 });
    }

    const effectivePatientId = patientId || "PT-001";

    // ── Try Dify Treatment Workflow first ──
    const DIFY_TREATMENT_KEY = optionalEnv("DIFY_TREATMENT_API_KEY") || optionalEnv("DIFY_API_KEY");
    const DIFY_API_URL = optionalEnv("DIFY_API_URL");

    if (DIFY_TREATMENT_KEY && DIFY_API_URL) {
      try {
        const result = await difyWorkflowRun({
          inputs: {
            patient_id: effectivePatientId,
            treatment_name: `${treatment.name}${treatment.dosage ? ` ${treatment.dosage}` : ""}`,
            treatment_type: treatment.type,
            dosage: treatment.dosage || "",
            duration: treatment.duration || "",
            simulation_days: String(simulationDays),
          },
          user: "digitwin-doctor",
          apiKeyEnv: "DIFY_TREATMENT_API_KEY",
        });

        if (result?.status === "succeeded" && result.outputs) {
          const outputText = (result.outputs.answer as string) ||
            (result.outputs.text as string) ||
            (result.outputs.result as string) || "";

          if (outputText.trim()) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const wf: any = JSON.parse(outputText);

              // Map Dify workflow JSON to TreatmentSimResponse
              const thinkingSteps: DifyThinkingStep[] = Array.isArray(wf.thinking_steps)
                ? wf.thinking_steps.map((s: string, i: number) => ({
                    step: i + 1,
                    title: s.replace(/^Step \d+:\s*/, ""),
                    content: s,
                    timestamp: new Date().toISOString(),
                  }))
                : [];

              const drugInteractions: DrugInteraction[] = Array.isArray(wf.drug_interactions)
                ? wf.drug_interactions.map((d: { drug?: string; severity?: string; description?: string }) => ({
                    drug: d.drug || treatment.name,
                    severity: (d.severity || "low") as DrugInteraction["severity"],
                    description: d.description || "",
                  }))
                : [];

              const alternativeTreatments = Array.isArray(wf.alternative_treatments)
                ? wf.alternative_treatments.map((a: { name?: string; efficacy?: number; reason?: string }) => ({
                    name: a.name || "",
                    efficacy: a.efficacy || 50,
                    reason: a.reason || "",
                  }))
                : [];

              const response: TreatmentSimResponse = {
                treatmentName: wf.treatment_name || treatment.name,
                efficacyScore: wf.efficacy_score ?? 75,
                riskScore: wf.risk_score ?? 20,
                projections: mapDifyProjections(wf.projections),
                expectedOutcomes: {
                  positive: wf.expected_outcomes?.positive || [],
                  risks: wf.expected_outcomes?.risks || [],
                  sideEffects: wf.expected_outcomes?.side_effects || [],
                },
                drugInteractions,
                thinkingSteps,
                alternativeTreatments,
                monitoringRecommendations: wf.monitoring_recommendations || [],
                clinicalNotes: wf.clinical_notes || "",
                source: "dify_enhanced",
              };

              return NextResponse.json(response);
            } catch {
              // JSON parse failed, fall through to demo
              console.error("Failed to parse Dify treatment workflow JSON");
            }
          }
        }
      } catch (err) {
        console.error("Dify treatment workflow error:", err);
      }
    }

    // ── Fallback: Use OpenAI for clinical notes if available ──
    const demo = buildDemoResponse(treatment, patientProfile, simulationDays);
    const OPENAI_API_KEY = optionalEnv("OPENAI_API_KEY");

    if (OPENAI_API_KEY) {
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
                content: "You are a clinical decision support system for doctors. Provide a brief clinical note (2-3 sentences) about the expected outcomes of the treatment. Be professional and evidence-based. Do not provide specific medical advice - this is for simulation purposes only.",
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
            demo.clinicalNotes = aiNotes;
            demo.source = "ai_simulation";
          }
        }
      } catch (err) {
        console.error("OpenAI enhancement failed:", err);
      }
    }

    return NextResponse.json(demo);
  } catch (e) {
    console.error("Treatment simulation error:", e);
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 500 },
    );
  }
}
