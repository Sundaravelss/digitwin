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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allPatients } from "@/data/patientData";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  treatmentName?: string;
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
  suggestions?: string[];
  healthScoreImpact?: { metabolic?: number; cardiovascular?: number; overall?: number };
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

// ── Chart Configuration (matching HealthCompanion style) ─────────────

const CHART_COLORS: Record<string, { stroke: string; fill: string }> = {
  glucose_mg_dl: { stroke: "#ef4444", fill: "#ef444430" },
  resting_heart_rate: { stroke: "#ec4899", fill: "#ec489930" },
  crp_mg_l: { stroke: "#f97316", fill: "#f9731630" },
  systolic: { stroke: "#8b5cf6", fill: "#8b5cf630" },
  diastolic: { stroke: "#93c5fd", fill: "#93c5fd30" },
  overall_health: { stroke: "#22c55e", fill: "#22c55e30" },
  hrv_ms: { stroke: "#3b82f6", fill: "#3b82f630" },
  hba1c_percent: { stroke: "#d946ef", fill: "#d946ef30" },
  ldl_mg_dl: { stroke: "#f59e0b", fill: "#f59e0b30" },
  overall_health_delta: { stroke: "#14b8a6", fill: "#14b8a630" },
};

const CHART_LABELS: Record<string, { label: string; unit: string }> = {
  glucose_mg_dl: { label: "Glucose", unit: "mg/dL" },
  resting_heart_rate: { label: "Heart Rate", unit: "bpm" },
  crp_mg_l: { label: "CRP", unit: "mg/L" },
  systolic: { label: "BP Systolic", unit: "mmHg" },
  diastolic: { label: "BP Diastolic", unit: "mmHg" },
  overall_health: { label: "Health Score", unit: "/100" },
  hrv_ms: { label: "HRV", unit: "ms" },
  hba1c_percent: { label: "HbA1c", unit: "%" },
  ldl_mg_dl: { label: "LDL", unit: "mg/dL" },
  overall_health_delta: { label: "Health Delta", unit: "" },
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

/** Convert day number to human label like "Day 0", "1d", "7d", "30d" etc */
function dayLabel(day: number): string {
  if (day === 0) return "Day 0";
  if (day < 7) return `${day}d`;
  if (day < 30) return `${day}d`;
  return `${day}d`;
}

// ── Alert Badge (matching HealthCompanion) ───────────────────────────

function AlertBadge({ severity, message }: { severity: string; message: string }) {
  const colorMap: Record<string, string> = {
    critical: "bg-red-500/15 text-red-600 border-red-500/30",
    high: "bg-orange-500/15 text-orange-600 border-orange-500/30",
    moderate: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
    low: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  };
  const cls = colorMap[severity?.toLowerCase()] || colorMap.moderate;

  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${cls}`}>
      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold capitalize">{severity}</span>
        <span className="mx-1">&middot;</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

// ── Biomarker Projections Chart (matching HealthCompanion style) ─────

function BiomarkerProjections({ projections }: { projections: any[] }) {
  const { chartData, metricKeys, summaries, timepoints } = useMemo(() => {
    if (!projections?.length) return { chartData: [], metricKeys: [], summaries: [], timepoints: [] };

    // Convert row-based projections to column-based for the chart
    const timepts = projections.map((p) => dayLabel(p.day ?? 0));
    const columnData: Record<string, number[]> = {};

    for (const p of projections) {
      const bp = parseBP(p.bloodPressure || p.blood_pressure);

      const fields: Record<string, number | null | undefined> = {
        glucose_mg_dl: p.glucoseMgDl ?? p.glucose_mg_dl ?? null,
        resting_heart_rate: p.restingHeartRate ?? p.resting_heart_rate ?? null,
        crp_mg_l: p.crp_mg_l ?? (p.inflammationIndex != null ? p.inflammationIndex / 10 : null),
        systolic: bp?.systolic ?? null,
        diastolic: bp?.diastolic ?? null,
        overall_health: p.overallHealth ?? p.overall_health ?? null,
        hrv_ms: p.hrvMs ?? p.hrv_ms ?? null,
        hba1c_percent: p.hba1c_percent ?? null,
        ldl_mg_dl: p.ldl_mg_dl ?? null,
        overall_health_delta: p.overall_health_delta ?? null,
      };

      for (const [key, val] of Object.entries(fields)) {
        if (val != null) {
          if (!columnData[key]) columnData[key] = [];
          columnData[key].push(val);
        }
      }
    }

    // Filter to only metrics that have data for all timepoints
    const mKeys = Object.keys(columnData).filter(
      (k) => columnData[k] && columnData[k].length === projections.length
    );

    // Build chart data points
    const cData = timepts.map((t, i) => {
      const point: Record<string, string | number> = { time: t };
      for (const key of mKeys) {
        point[key] = columnData[key][i] ?? 0;
      }
      return point;
    });

    // Summary: baseline vs final for each metric
    const sums = mKeys.map((key) => {
      const values = columnData[key];
      const baseline = values[0] ?? 0;
      const final = values[values.length - 1] ?? 0;
      const delta = final - baseline;
      const info = CHART_LABELS[key] || { label: key, unit: "" };
      return { key, baseline, final, delta, ...info };
    });

    return { chartData: cData, metricKeys: mKeys, summaries: sums, timepoints: timepts };
  }, [projections]);

  if (chartData.length < 2 || metricKeys.length === 0) return null;

  return (
    <div className="mt-3 space-y-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Biomarker Projections
      </div>

      {/* Chart */}
      <div className="bg-secondary/30 rounded-xl p-3 border border-border/30">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {metricKeys.map((key) => {
                const c = CHART_COLORS[key] || { stroke: "#94a3b8", fill: "#94a3b830" };
                return (
                  <linearGradient key={key} id={`grad-ts-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c.stroke} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={c.stroke} stopOpacity={0.02} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "11px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              formatter={(value: number, name: string) => {
                const info = CHART_LABELS[name] || { label: name, unit: "" };
                return [`${value} ${info.unit}`, info.label];
              }}
            />
            <Legend
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
              formatter={(value: string) => CHART_LABELS[value]?.label || value}
            />
            {metricKeys.map((key) => {
              const c = CHART_COLORS[key] || { stroke: "#94a3b8", fill: "#94a3b830" };
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={c.stroke}
                  strokeWidth={2}
                  fill={`url(#grad-ts-${key})`}
                  dot={{ r: 3, fill: c.stroke, strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: c.stroke, strokeWidth: 2, fill: "white" }}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metric summary pills */}
      <div className="flex flex-wrap gap-1.5">
        {summaries.map((s) => {
          const isUp = s.delta > 0;
          const sign = isUp ? "+" : "";
          // For health score, up is good; for others (glucose, CRP, etc.) down is good
          const isHealthy = s.key === "overall_health" || s.key === "hrv_ms"
            ? s.delta >= 0
            : s.delta <= 0;
          const color = isHealthy ? "text-green-500" : "text-red-500";
          return (
            <span
              key={s.key}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-[10px] font-medium border border-border/30"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: (CHART_COLORS[s.key] || { stroke: "#94a3b8" }).stroke }}
              />
              {s.label}: {s.baseline.toFixed(s.unit === "%" && s.baseline < 10 ? 1 : 0)} → {s.final.toFixed(s.unit === "%" && s.final < 10 ? 1 : 0)}
              <span className={color}>({sign}{s.delta.toFixed(s.unit === "%" && Math.abs(s.delta) < 10 ? 1 : 0)})</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── Health Score Impact (matching HealthCompanion) ───────────────────

function HealthScoreImpact({ impact }: { impact: { metabolic?: number; cardiovascular?: number; overall?: number } }) {
  const items = [
    { label: "Metabolic", value: impact.metabolic, icon: Activity },
    { label: "Cardiovascular", value: impact.cardiovascular, icon: Heart },
    { label: "Overall", value: impact.overall, icon: Zap },
  ].filter((i) => i.value != null);

  if (items.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Health Score Impact</div>
      <div className="flex gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const val = item.value!;
          const isPositive = val > 0;
          const sign = isPositive ? "+" : "";
          return (
            <div
              key={item.label}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                isPositive
                  ? "bg-green-500/10 text-green-600 border-green-500/30"
                  : val < 0
                  ? "bg-red-500/10 text-red-600 border-red-500/30"
                  : "bg-secondary/50 text-muted-foreground border-border/30"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
              <span className="font-semibold">{sign}{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Suggestion Pills (matching HealthCompanion) ─────────────────────

function SuggestionPills({ suggestions, onSuggestionClick }: { suggestions: string[]; onSuggestionClick?: (text: string) => void }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Suggestions</div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick?.(s)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Drug Interaction Cards ──────────────────────────────────────────

function DrugInteractionCards({ interactions }: { interactions: Array<{ drug: string; severity: string; description: string }> }) {
  if (!interactions?.length) return null;

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Drug Interactions</div>
      <div className="space-y-1.5">
        {interactions.map((ix, i) => (
          <AlertBadge
            key={i}
            severity={ix.severity}
            message={`${ix.drug}: ${ix.description}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Expected Outcomes ───────────────────────────────────────────────

function ExpectedOutcomes({ outcomes }: { outcomes: { positive?: string[]; risks?: string[]; sideEffects?: string[] } }) {
  const hasContent = outcomes.positive?.length || outcomes.risks?.length || outcomes.sideEffects?.length;
  if (!hasContent) return null;

  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
      {outcomes.positive && outcomes.positive.length > 0 && (
        <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 uppercase">Benefits</span>
          </div>
          <ul className="space-y-0.5">
            {outcomes.positive.map((p, i) => (
              <li key={i} className="text-[11px] text-green-800 dark:text-green-300">{p}</li>
            ))}
          </ul>
        </div>
      )}
      {outcomes.risks && outcomes.risks.length > 0 && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingDown className="w-3 h-3 text-red-600" />
            <span className="text-[10px] font-semibold text-red-700 dark:text-red-400 uppercase">Risks</span>
          </div>
          <ul className="space-y-0.5">
            {outcomes.risks.map((r, i) => (
              <li key={i} className="text-[11px] text-red-800 dark:text-red-300">{r}</li>
            ))}
          </ul>
        </div>
      )}
      {outcomes.sideEffects && outcomes.sideEffects.length > 0 && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase">Side Effects</span>
          </div>
          <ul className="space-y-0.5">
            {outcomes.sideEffects.map((s, i) => (
              <li key={i} className="text-[11px] text-amber-800 dark:text-amber-300">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Alternative Treatments ──────────────────────────────────────────

function AlternativeTreatments({ treatments }: { treatments: Array<{ name: string; efficacy: number; reason: string; pharmacogenomic_advantage?: string }> }) {
  const [expanded, setExpanded] = useState(false);
  if (!treatments?.length) return null;

  const shown = expanded ? treatments : treatments.slice(0, 2);

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
        <ClipboardList className="w-3 h-3" /> Alternative Treatments
      </div>
      <div className="space-y-1.5">
        {shown.map((alt, i) => (
          <div key={i} className="flex items-center justify-between bg-secondary/30 rounded-lg px-2.5 py-1.5 text-xs">
            <div className="flex-1 min-w-0">
              <span className="font-medium">{alt.name}</span>
              <span className="text-muted-foreground ml-1.5">{alt.reason}</span>
              {alt.pharmacogenomic_advantage && (
                <span className="text-violet-600 dark:text-violet-400 ml-1">PGx: {alt.pharmacogenomic_advantage}</span>
              )}
            </div>
            <span className="text-primary font-semibold ml-2">{alt.efficacy}/100</span>
          </div>
        ))}
      </div>
      {treatments.length > 2 && (
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-primary mt-1 flex items-center gap-0.5">
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> +{treatments.length - 2} more</>}
        </button>
      )}
    </div>
  );
}

// ── Simulation Result Card (matching HealthCompanion SimulationResultCard) ──

function SimulationResultCard({ result, onSuggestionClick }: { result: SimulationResult; onSuggestionClick?: (text: string) => void }) {
  return (
    <div className="space-y-2">
      {/* Clinical Summary Text */}
      {result.clinicalNotes && (
        <p className="text-sm whitespace-pre-wrap">{result.clinicalNotes}</p>
      )}

      {/* Warnings / Alerts */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {result.warnings.map((w, i) => {
            // Try to detect severity from text
            const lower = w.toLowerCase();
            const severity = lower.includes("critical") || lower.includes("allergy")
              ? "critical"
              : lower.includes("contraindicated") || lower.includes("avoid")
              ? "high"
              : lower.includes("caution") || lower.includes("monitor")
              ? "moderate"
              : "moderate";
            return <AlertBadge key={i} severity={severity} message={w} />;
          })}
        </div>
      )}

      {/* Pharmacogenomic Note */}
      {result.pharmacogenomicAssessment && Object.keys(result.pharmacogenomicAssessment).length > 0 && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg border bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30 text-xs mt-1">
          <Dna className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Pharmacogenomic:</span>{" "}
            {result.pharmacogenomicAssessment.notes ||
              `Dosing: ${result.pharmacogenomicAssessment.dosing_recommendation || result.pharmacogenomicAssessment.dosingRecommendation || "standard"} | Pathway: ${result.pharmacogenomicAssessment.primary_metabolism_pathway || result.pharmacogenomicAssessment.primaryMetabolismPathway || "N/A"}`}
          </div>
        </div>
      )}

      {/* Scores as compact badges */}
      {(result.efficacyScore != null || result.riskScore != null) && (
        <div className="flex gap-2 mt-2">
          {result.efficacyScore != null && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
              result.efficacyScore >= 70
                ? "bg-green-500/10 text-green-600 border-green-500/30"
                : result.efficacyScore >= 40
                ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                : "bg-red-500/10 text-red-600 border-red-500/30"
            }`}>
              <TrendingUp className="w-3 h-3" />
              <span>Efficacy</span>
              <span className="font-semibold">{result.efficacyScore}/100</span>
            </div>
          )}
          {result.riskScore != null && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
              result.riskScore <= 20
                ? "bg-green-500/10 text-green-600 border-green-500/30"
                : result.riskScore <= 50
                ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                : "bg-red-500/10 text-red-600 border-red-500/30"
            }`}>
              <AlertTriangle className="w-3 h-3" />
              <span>Risk</span>
              <span className="font-semibold">{result.riskScore}/100</span>
            </div>
          )}
        </div>
      )}

      {/* Drug Interactions */}
      <DrugInteractionCards interactions={result.drugInteractions || []} />

      {/* Biomarker Projections Chart */}
      {result.projections && result.projections.length > 1 && (
        <BiomarkerProjections projections={result.projections} />
      )}

      {/* Health Score Impact */}
      {result.healthScoreImpact && (
        <HealthScoreImpact impact={result.healthScoreImpact} />
      )}

      {/* Expected Outcomes */}
      {result.expectedOutcomes && (
        <ExpectedOutcomes outcomes={result.expectedOutcomes} />
      )}

      {/* Alternative Treatments */}
      <AlternativeTreatments treatments={result.alternativeTreatments || []} />

      {/* Monitoring Recommendations */}
      {result.monitoringRecommendations && result.monitoringRecommendations.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Monitoring</div>
          <div className="flex flex-wrap gap-1.5">
            {result.monitoringRecommendations.map((rec, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                {rec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion Pills */}
      <SuggestionPills suggestions={result.suggestions || []} onSuggestionClick={onSuggestionClick} />

      {/* Source badge */}
      {result.source && (
        <div className="text-[10px] text-muted-foreground mt-2 italic">
          Source: {result.source === "dify_enhanced" ? "Dify Workflow" : result.source === "ai_simulation" ? "AI Simulation" : "Demo Data"}
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

      // Normalize side_effects → sideEffects
      const rawOutcomes = data.expectedOutcomes || data.expected_outcomes;
      const expectedOutcomes = rawOutcomes ? {
        positive: rawOutcomes.positive || [],
        risks: rawOutcomes.risks || [],
        sideEffects: rawOutcomes.sideEffects || rawOutcomes.side_effects || [],
      } : undefined;

      // Compute health score impact from projections if not provided
      let healthScoreImpact = data.healthScoreImpact || data.health_score_impact;
      if (!healthScoreImpact) {
        const projs = data.projections || [];
        if (projs.length >= 2) {
          const first = projs[0];
          const last = projs[projs.length - 1];
          const firstHealth = first.overallHealth ?? first.overall_health ?? null;
          const lastHealth = last.overallHealth ?? last.overall_health ?? null;
          if (firstHealth != null && lastHealth != null) {
            const delta = lastHealth - firstHealth;
            healthScoreImpact = {
              metabolic: Math.round(delta * 0.4),
              cardiovascular: Math.round(delta * 0.3),
              overall: delta,
            };
          }
        }
      }

      // Generate contextual suggestions if not provided
      const suggestions = data.suggestions || [
        `Check ${effectiveTreatmentName} drug interactions with current medications`,
        `Try alternative treatment for this patient`,
        `Adjust dosage and re-simulate`,
      ];

      const simResult: SimulationResult = {
        id: Date.now().toString(),
        query: queryText,
        timestamp: new Date(),
        source: data.source,
        treatmentName: data.treatmentName || data.treatment_name,
        clinicalNotes: data.clinicalNotes || data.clinical_notes,
        efficacyScore: data.efficacyScore ?? data.efficacy_score,
        riskScore: data.riskScore ?? data.risk_score,
        pharmacogenomicAssessment: data.pharmacogenomicAssessment || data.pharmacogenomic_assessment,
        drugInteractions: data.drugInteractions || data.drug_interactions || [],
        expectedOutcomes,
        projections: data.projections || [],
        alternativeTreatments: data.alternativeTreatments || data.alternative_treatments || [],
        monitoringRecommendations: data.monitoringRecommendations || data.monitoring_recommendations || [],
        warnings: data.warnings || [],
        thinkingSteps: data.thinkingSteps || data.thinking_steps || [],
        suggestions,
        healthScoreImpact,
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

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    handleSubmit(text);
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
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Ready
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

      {/* Chat / Results Area */}
      <div className="flex-1 bg-secondary/20 rounded-2xl p-5 mb-4 min-h-[300px] max-h-[600px] border border-border/30 overflow-y-auto shadow-[0_2px_12px_rgba(0,0,0,0.06)] space-y-4">
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
          <>
            {results.map((result) => (
              <div key={result.id}>
                {/* User query bubble */}
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="rounded-2xl p-4 max-w-[85%] bg-primary text-primary-foreground rounded-tr-sm">
                    <p className="text-sm">{result.query}</p>
                  </div>
                </div>

                {/* Simulation result */}
                <div className="flex items-start gap-3 mt-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-[var(--shadow-sm)] max-w-[85%]">
                    <SimulationResultCard result={result} onSuggestionClick={handleSuggestionClick} />
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-[var(--shadow-sm)]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running treatment simulation pipeline...
                  </div>
                </div>
              </div>
            )}

            <div ref={resultsEndRef} />
          </>
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:bg-primary/5 hover:border-primary/20 hover:text-primary hover:shadow-[0_3px_12px_rgba(0,0,0,0.1)] text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Icon className="w-4 h-4" />
              {q.text}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-xl">
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
