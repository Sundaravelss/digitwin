"use client";

import {
  Send,
  Sparkles,
  Activity,
  Pill,
  Loader2,
  FlaskConical,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Syringe,
  Shield,
  Heart,
  TrendingUp,
  TrendingDown,
  Dna,
  ClipboardList,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allPatients } from "@/data/patientData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

type SimulationResult = {
  id: string;
  query: string;
  timestamp: Date;
  source?: string;
  clinicalNotes?: string;
  efficacyScore?: number;
  riskScore?: number;
  pharmacogenomicAssessment?: any;
  drugInteractions?: Array<{ drug: string; severity: string; description: string }>;
  expectedOutcomes?: { positive?: string[]; risks?: string[]; sideEffects?: string[] };
  projections?: Array<any>;
  alternativeTreatments?: Array<{ name: string; efficacy: number; reason: string; pharmacogenomic_advantage?: string }>;
  monitoringRecommendations?: string[];
  warnings?: string[];
  thinkingSteps?: string[];
};

type Biomarker = {
  name: string;
  value: string | number;
  unit: string;
  status: string;
};

// ── Constants ──────────────────────────────────────────────────────────

const medicationList = [
  "Amoxicillin",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Omeprazole",
  "Amlodipine",
  "Levothyroxine",
  "Glipizide",
  "Fluticasone",
  "Losartan",
  "Ibuprofen",
  "Warfarin",
  "Codeine",
  "Simvastatin",
];

const treatmentTypes = [
  { value: "medication", label: "Medication" },
  { value: "procedure", label: "Procedure" },
];

const simulationDaysOptions = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "180", label: "180 days" },
];

const sampleQuestions = [
  { icon: Pill, text: "Simulate metformin 500mg for 90 days", category: "medication" },
  { icon: Shield, text: "Check drug interactions for amoxicillin", category: "interaction" },
  { icon: Pill, text: "Evaluate atorvastatin 20mg treatment", category: "medication" },
  { icon: Syringe, text: "Simulate knee replacement procedure", category: "procedure" },
  { icon: Pill, text: "Check lisinopril 10mg safety", category: "medication" },
  { icon: Shield, text: "Drug interaction check: warfarin + ibuprofen", category: "interaction" },
];

const CHART_COLORS = {
  glucose: "#ef4444",
  heartRate: "#8b5cf6",
  bpSystolic: "#3b82f6",
  bpDiastolic: "#93c5fd",
  healthScore: "#22c55e",
  crp: "#f97316",
};

// ── Helpers ────────────────────────────────────────────────────────────

function getPatientBiomarkers(patient: any): Biomarker[] {
  const biomarkerData = patient?.dashboard?.biomarkerData;
  if (!Array.isArray(biomarkerData)) return [];
  return biomarkerData.map((b: any) => ({
    name: b.name,
    value: String(b.value),
    unit: b.unit,
    status: b.status,
  }));
}

function getPatientLabel(patient: any): string {
  const d = patient?.demographics;
  if (!d) return patient?.id || "Unknown";
  const name = d.name || `${d.firstName || ""} ${d.lastName || ""}`.trim();
  return `${name} (${d.age || "?"}${d.sex === "Male" ? "M" : "F"}) - ${patient.id}`;
}

function getPatientConditions(patient: any): string {
  return (
    patient?.medicalProfile?.conditions
      ?.map((c: { name: string }) => c.name)
      .join(", ") || "No conditions"
  );
}

function parseBP(bp: string | undefined): { systolic: number; diastolic: number } | null {
  if (!bp) return null;
  const parts = bp.split("/").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { systolic: parts[0], diastolic: parts[1] };
  }
  return null;
}

function severityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case "high":
    case "contraindicated":
      return "bg-red-100 border-red-400 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300";
    case "moderate":
      return "bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300";
    case "low":
      return "bg-green-100 border-green-400 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300";
    default:
      return "bg-secondary border-border text-foreground";
  }
}

function scoreColor(score: number, isRisk = false) {
  const effective = isRisk ? score : 100 - score;
  if (effective <= 20) return "text-green-600 dark:text-green-400";
  if (effective <= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

// ── Simulation Result Visualization ────────────────────────────────────

function SimulationResultView({ result }: { result: SimulationResult }) {
  // Build chart data from projections
  const chartData = useMemo(() => {
    if (!result.projections?.length) return [];
    return result.projections.map((p: any) => {
      const bp = parseBP(p.bloodPressure || p.blood_pressure);
      return {
        day: `Day ${p.day}`,
        dayNum: p.day,
        Glucose: p.glucoseMgDl || p.glucose_mg_dl || null,
        "Heart Rate": p.restingHeartRate || p.resting_heart_rate || null,
        "BP Systolic": bp?.systolic || null,
        "BP Diastolic": bp?.diastolic || null,
        "Health Score": p.overallHealth || p.overall_health || null,
        CRP: p.crp_mg_l || p.inflammationIndex || null,
      };
    });
  }, [result.projections]);

  // Compute deltas (first vs last projection)
  const deltas = useMemo(() => {
    if (chartData.length < 2) return [];
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    const items: Array<{ label: string; start: number; end: number; delta: number; unit: string; color: string }> = [];
    if (first.Glucose != null && last.Glucose != null)
      items.push({ label: "Glucose", start: first.Glucose, end: last.Glucose, delta: last.Glucose - first.Glucose, unit: "mg/dL", color: CHART_COLORS.glucose });
    if (first["Heart Rate"] != null && last["Heart Rate"] != null)
      items.push({ label: "Heart Rate", start: first["Heart Rate"], end: last["Heart Rate"], delta: last["Heart Rate"] - first["Heart Rate"], unit: "bpm", color: CHART_COLORS.heartRate });
    if (first["BP Systolic"] != null && last["BP Systolic"] != null)
      items.push({ label: "BP Systolic", start: first["BP Systolic"], end: last["BP Systolic"], delta: last["BP Systolic"] - first["BP Systolic"], unit: "mmHg", color: CHART_COLORS.bpSystolic });
    if (first["Health Score"] != null && last["Health Score"] != null)
      items.push({ label: "Health Score", start: first["Health Score"], end: last["Health Score"], delta: last["Health Score"] - first["Health Score"], unit: "/100", color: CHART_COLORS.healthScore });
    return items;
  }, [chartData]);

  return (
    <div className="space-y-5">
      {/* Clinical Summary */}
      {result.clinicalNotes && (
        <div className="text-sm text-foreground leading-relaxed">
          {result.clinicalNotes}
        </div>
      )}

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-amber-800 dark:text-amber-300">{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pharmacogenomic Assessment */}
      {result.pharmacogenomicAssessment && Object.keys(result.pharmacogenomicAssessment).length > 0 && (
        <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/40">
          <div className="flex items-center gap-2 mb-1">
            <Dna className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Pharmacogenomic</span>
          </div>
          <p className="text-xs text-violet-600 dark:text-violet-400">
            {result.pharmacogenomicAssessment.notes ||
              `Dosing: ${result.pharmacogenomicAssessment.dosing_recommendation || result.pharmacogenomicAssessment.dosingRecommendation || "standard"} | Pathway: ${result.pharmacogenomicAssessment.primary_metabolism_pathway || result.pharmacogenomicAssessment.primaryMetabolismPathway || "N/A"}`}
          </p>
        </div>
      )}

      {/* Scores */}
      {(result.efficacyScore != null || result.riskScore != null) && (
        <div className="grid grid-cols-2 gap-3">
          {result.efficacyScore != null && (
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <div className="text-xs text-muted-foreground mb-1">Efficacy Score</div>
              <div className={`text-2xl font-bold ${scoreColor(result.efficacyScore)}`}>
                {result.efficacyScore}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                  style={{ width: `${result.efficacyScore}%` }}
                />
              </div>
            </div>
          )}
          {result.riskScore != null && (
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
              <div className={`text-2xl font-bold ${scoreColor(result.riskScore, true)}`}>
                {result.riskScore}
                <span className="text-sm font-normal text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-1000"
                  style={{ width: `${result.riskScore}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drug Interactions */}
      {result.drugInteractions && result.drugInteractions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Drug Interactions</span>
          </div>
          <div className="space-y-2">
            {result.drugInteractions.map((ix, i) => (
              <div key={i} className={`p-3 rounded-lg border-l-4 ${severityColor(ix.severity)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{ix.drug}</span>
                  <Badge variant="outline" className="text-[10px] h-5">{ix.severity}</Badge>
                </div>
                <p className="text-xs opacity-80">{ix.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biomarker Projections Chart */}
      {chartData.length > 1 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Biomarker Projections</span>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 border border-border/30">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradGlucose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.glucose} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.glucose} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.healthScore} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.healthScore} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradBP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.bpSystolic} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={CHART_COLORS.bpSystolic} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "11px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                {chartData[0]?.Glucose != null && (
                  <Area type="monotone" dataKey="Glucose" stroke={CHART_COLORS.glucose} fill="url(#gradGlucose)" strokeWidth={2} dot={{ r: 3 }} />
                )}
                {chartData[0]?.["Heart Rate"] != null && (
                  <Line type="monotone" dataKey="Heart Rate" stroke={CHART_COLORS.heartRate} strokeWidth={2} dot={{ r: 3 }} />
                )}
                {chartData[0]?.["BP Systolic"] != null && (
                  <Area type="monotone" dataKey="BP Systolic" stroke={CHART_COLORS.bpSystolic} fill="url(#gradBP)" strokeWidth={2} dot={{ r: 3 }} />
                )}
                {chartData[0]?.["Health Score"] != null && (
                  <Area type="monotone" dataKey="Health Score" stroke={CHART_COLORS.healthScore} fill="url(#gradHealth)" strokeWidth={2} dot={{ r: 3 }} />
                )}
              </AreaChart>
            </ResponsiveContainer>

            {/* Delta Summary */}
            {deltas.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border/30">
                {deltas.map((d) => (
                  <div key={d.label} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.label}:</span>
                    <span className="font-medium">{d.start} &rarr; {d.end}</span>
                    <span className={`font-semibold ${d.delta < 0 ? "text-green-600" : d.delta > 0 ? "text-red-500" : "text-muted-foreground"}`}>
                      ({d.delta > 0 ? "+" : ""}{d.delta})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expected Outcomes */}
      {result.expectedOutcomes && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {result.expectedOutcomes.positive && result.expectedOutcomes.positive.length > 0 && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">Benefits</span>
              </div>
              <ul className="space-y-1">
                {result.expectedOutcomes.positive.map((p, i) => (
                  <li key={i} className="text-xs text-green-800 dark:text-green-300">{p}</li>
                ))}
              </ul>
            </div>
          )}
          {result.expectedOutcomes.risks && result.expectedOutcomes.risks.length > 0 && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">Risks</span>
              </div>
              <ul className="space-y-1">
                {result.expectedOutcomes.risks.map((r, i) => (
                  <li key={i} className="text-xs text-red-800 dark:text-red-300">{r}</li>
                ))}
              </ul>
            </div>
          )}
          {result.expectedOutcomes.sideEffects && result.expectedOutcomes.sideEffects.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Side Effects</span>
              </div>
              <ul className="space-y-1">
                {result.expectedOutcomes.sideEffects.map((s, i) => (
                  <li key={i} className="text-xs text-amber-800 dark:text-amber-300">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Alternative Treatments */}
      {result.alternativeTreatments && result.alternativeTreatments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Alternative Treatments</span>
          </div>
          <div className="space-y-2">
            {result.alternativeTreatments.map((alt, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="text-center min-w-[50px]">
                  <div className="text-lg font-bold text-primary">{alt.efficacy}</div>
                  <div className="text-[9px] text-muted-foreground">/100</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground">{alt.name}</div>
                  <div className="text-[11px] text-muted-foreground">{alt.reason}</div>
                  {alt.pharmacogenomic_advantage && (
                    <div className="text-[10px] text-violet-600 dark:text-violet-400 mt-0.5">
                      PGx: {alt.pharmacogenomic_advantage}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitoring Recommendations */}
      {result.monitoringRecommendations && result.monitoringRecommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Monitoring</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.monitoringRecommendations.map((rec, i) => (
              <div key={i} className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-xs text-blue-700 dark:text-blue-300">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source badge */}
      {result.source && (
        <div className="flex items-center gap-2 pt-2 border-t border-border/20">
          <Badge variant="outline" className="text-[10px] h-5 px-1.5">
            {result.source === "dify_enhanced" ? "Dify Workflow" : result.source === "ai_simulation" ? "AI Simulation" : "Demo Data"}
          </Badge>
        </div>
      )}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────

const TreatmentSimulator = () => {
  // Patient selection
  const [selectedPatientId, setSelectedPatientId] = useState(
    allPatients[0]?.id || "PT-001"
  );

  // Form inputs
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentType, setTreatmentType] = useState("medication");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [simulationDays, setSimulationDays] = useState("90");

  // Chat / results
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const selectedPatient = useMemo(
    () => allPatients.find((p: any) => p.id === selectedPatientId) || allPatients[0],
    [selectedPatientId]
  );

  const biomarkers = useMemo(
    () => getPatientBiomarkers(selectedPatient),
    [selectedPatient]
  );

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  // ── Submit handler ─────────────────────────────────────────────────

  const handleSubmit = async (text?: string) => {
    const queryText = text || query;
    if (!queryText.trim() || isLoading) return;

    const effectiveTreatmentName = treatmentName || queryText;

    setQuery("");
    setIsLoading(true);

    try {
      const patientConditions = getPatientConditions(selectedPatient);
      const currentMeds = selectedPatient?.medicalHistory?.medications
        ?.map((m: any) => m.name)
        .join(", ") || selectedPatient?.medicalProfile?.medications
        ?.map((m: any) => m.name)
        .join(", ") || "";
      const allergies = selectedPatient?.medicalProfile?.allergies
        ?.map((a: any) => typeof a === "string" ? a : a.allergen || a.name)
        .join(", ") || "";
      const demographics = selectedPatient?.demographics;

      const res = await fetch("/api/doctor/treatment-sim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientId,
          patientProfile: {
            age: demographics?.age,
            sex: demographics?.sex,
            conditions: patientConditions,
            allergies,
            currentMeds,
            biomarkers: {
              bloodPressure: biomarkers.find((b) => b.name === "Blood Pressure")?.value,
              glucoseMgDl: Number(biomarkers.find((b) => b.name === "Fasting Glucose")?.value) || undefined,
              restingHeartRate: Number(biomarkers.find((b) => b.name === "Heart Rate")?.value) || undefined,
            },
          },
          treatment: {
            type: treatmentType,
            name: effectiveTreatmentName,
            dosage,
            duration,
          },
          simulationDays: Number(simulationDays) || 90,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const simResult: SimulationResult = {
        id: Date.now().toString(),
        query: queryText,
        timestamp: new Date(),
        source: data.source,
        clinicalNotes: data.clinicalNotes || data.clinical_notes,
        efficacyScore: data.efficacyScore ?? data.efficacy_score,
        riskScore: data.riskScore ?? data.risk_score,
        pharmacogenomicAssessment: data.pharmacogenomicAssessment || data.pharmacogenomic_assessment,
        drugInteractions: data.drugInteractions || data.drug_interactions || [],
        expectedOutcomes: data.expectedOutcomes || data.expected_outcomes,
        projections: data.projections || [],
        alternativeTreatments: data.alternativeTreatments || data.alternative_treatments || [],
        monitoringRecommendations: data.monitoringRecommendations || data.monitoring_recommendations || [],
        warnings: data.warnings || [],
        thinkingSteps: data.thinkingSteps || data.thinking_steps || [],
      };

      setResults((prev) => [...prev, simResult]);
    } catch (err) {
      setResults((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          query: queryText,
          timestamp: new Date(),
          clinicalNotes: `Failed to run simulation: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`,
          warnings: ["Simulation failed - showing error"],
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="health-card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Treatment Simulation</h3>
            <p className="text-xs text-muted-foreground">
              AI-powered drug interaction check &amp; treatment simulation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs gap-1">
            <Zap className="w-3 h-3" />
            v2
          </Badge>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Ready
          </div>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/30">
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
          <Activity className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="h-8 text-xs border-violet-200 dark:border-violet-700 bg-white/50 dark:bg-violet-950/30">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {allPatients.map((patient: any) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {getPatientLabel(patient)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-violet-600/70 dark:text-violet-400/70 truncate mt-1">
            {getPatientConditions(selectedPatient)}
          </p>
        </div>
      </div>

      {/* Patient Biomarkers */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 rounded-full bg-primary" />
          <h4 className="text-xs font-semibold text-foreground">Patient Biomarkers</h4>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {biomarkers.slice(0, 4).map((marker) => (
            <div key={marker.name} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
              <span className="text-xs text-muted-foreground truncate mr-2">{marker.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">{marker.value}</span>
                <span className="text-[10px] text-muted-foreground">{marker.unit}</span>
                {marker.status === "normal" ? (
                  <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />
                ) : marker.status === "elevated" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Input Form */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Treatment / Medicine</label>
          <Select value={treatmentName} onValueChange={setTreatmentName}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Select medicine" />
            </SelectTrigger>
            <SelectContent>
              {medicationList.map((med) => (
                <SelectItem key={med} value={med}>{med}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Type</label>
          <Select value={treatmentType} onValueChange={setTreatmentType}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {treatmentTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Dosage</label>
          <Input placeholder="e.g. 500mg" value={dosage} onChange={(e) => setDosage(e.target.value)} className="h-9 text-xs" />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Duration</label>
          <Input placeholder="e.g. 3 months" value={duration} onChange={(e) => setDuration(e.target.value)} className="h-9 text-xs" />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Simulation</label>
          <Select value={simulationDays} onValueChange={setSimulationDays}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Days" />
            </SelectTrigger>
            <SelectContent>
              {simulationDaysOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 bg-secondary/20 rounded-2xl p-5 mb-4 min-h-[300px] max-h-[600px] border border-border/30 overflow-y-auto">
        {results.length === 0 && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-violet-500" />
            </div>
            <h4 className="font-medium text-foreground mb-2">DigiTwin Treatment Simulation</h4>
            <p className="text-sm text-muted-foreground max-w-md mb-1">
              Simulate treatments, check drug interactions, and evaluate medication safety.
              The workflow analyzes pharmacogenomics, drug interactions, contraindications,
              and projects biomarker trajectories for the selected patient.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Select a patient, fill in treatment details above, then send a message or try a sample below.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result) => (
              <div key={result.id}>
                {/* User query */}
                <div className="flex justify-end mb-3">
                  <div className="rounded-2xl rounded-tr-sm p-3 px-4 bg-primary text-primary-foreground shadow-[var(--shadow-sm)] max-w-[70%]">
                    <p className="text-sm">{result.query}</p>
                  </div>
                </div>
                {/* Simulation result */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 rounded-2xl rounded-tl-sm p-5 bg-card shadow-[var(--shadow-sm)] border border-border/20">
                    <SimulationResultView result={result} />
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-sm p-5 shadow-[var(--shadow-sm)] border border-border/20">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running treatment simulation pipeline...</span>
                  </div>
                  <div className="space-y-2">
                    {["Loading patient profile...", "Analyzing pharmacogenomics...", "Checking drug interactions..."].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground/60">
                        <div className="w-4 h-4 border-2 border-violet-300 border-t-transparent rounded-full animate-spin" style={{ animationDelay: `${i * 0.3}s` }} />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={resultsEndRef} />
          </div>
        )}
      </div>

      {/* Sample Questions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sampleQuestions.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.text}
              onClick={() => handleSubmit(q.text)}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-700 dark:hover:text-violet-300 text-xs text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate max-w-[240px]">{q.text}</span>
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          placeholder="Describe a treatment to simulate, or ask about drug interactions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1 h-12 rounded-xl bg-secondary/50 border-0"
        />
        <Button
          size="icon"
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          onClick={() => handleSubmit()}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TreatmentSimulator;
