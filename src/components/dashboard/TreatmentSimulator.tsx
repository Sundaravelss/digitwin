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
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
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

// ── Types ──────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  source?: "dify_enhanced" | "ai_simulation" | "demo";
  elapsedTime?: number;
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
  {
    icon: Pill,
    text: "Simulate metformin 500mg for 90 days",
    category: "medication",
  },
  {
    icon: Shield,
    text: "Check drug interactions for amoxicillin",
    category: "interaction",
  },
  {
    icon: Pill,
    text: "Evaluate atorvastatin 20mg treatment",
    category: "medication",
  },
  {
    icon: Syringe,
    text: "Simulate knee replacement procedure",
    category: "procedure",
  },
  {
    icon: Pill,
    text: "Check lisinopril 10mg safety",
    category: "medication",
  },
  {
    icon: Shield,
    text: "Drug interaction check: warfarin + ibuprofen",
    category: "interaction",
  },
];

// ── Helper: extract biomarkers from patient data ───────────────────────

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

// ── Component ──────────────────────────────────────────────────────────

const TreatmentSimulator = () => {
  // Patient selection
  const [selectedPatientId, setSelectedPatientId] = useState(
    allPatients[0]?.id || "PT-001"
  );

  // Form inputs (matching Dify workflow)
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentType, setTreatmentType] = useState("medication");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [simulationDays, setSimulationDays] = useState("90");

  // Chat
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Submit handler ─────────────────────────────────────────────────

  const handleSubmit = async (text?: string) => {
    const queryText = text || query;
    if (!queryText.trim() || isLoading) return;

    // Build treatment info from form or parse from query text
    const effectiveTreatmentName = treatmentName || queryText;
    const effectiveTreatmentType = treatmentType;
    const effectiveDosage = dosage;
    const effectiveDuration = duration;
    const effectiveSimDays = simulationDays;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: queryText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      // Get patient details for the API
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
              hrvMs: undefined,
              sleepHours: undefined,
            },
          },
          treatment: {
            type: effectiveTreatmentType,
            name: effectiveTreatmentName,
            dosage: effectiveDosage,
            duration: effectiveDuration,
          },
          simulationDays: Number(effectiveSimDays) || 90,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // Format the response into a readable markdown message
      let outputText = "";

      if (data.clinicalNotes) {
        outputText += `## Clinical Summary\n${data.clinicalNotes}\n\n`;
      }

      if (data.efficacyScore !== undefined || data.riskScore !== undefined) {
        outputText += `## Scores\n`;
        outputText += `| Metric | Score |\n|---|---|\n`;
        if (data.efficacyScore !== undefined)
          outputText += `| Efficacy | **${data.efficacyScore}/100** |\n`;
        if (data.riskScore !== undefined)
          outputText += `| Risk | **${data.riskScore}/100** |\n`;
        outputText += "\n";
      }

      if (data.pharmacogenomicAssessment || data.pharmacogenomic_assessment) {
        const pgx = data.pharmacogenomicAssessment || data.pharmacogenomic_assessment;
        if (pgx && Object.keys(pgx).length > 0) {
          outputText += `## Pharmacogenomic Assessment\n`;
          if (pgx.dosing_recommendation || pgx.dosingRecommendation)
            outputText += `- **Dosing**: ${pgx.dosing_recommendation || pgx.dosingRecommendation}\n`;
          if (pgx.primary_metabolism_pathway || pgx.primaryMetabolismPathway)
            outputText += `- **Metabolism Pathway**: ${pgx.primary_metabolism_pathway || pgx.primaryMetabolismPathway}\n`;
          if (pgx.notes)
            outputText += `- **Notes**: ${pgx.notes}\n`;
          outputText += "\n";
        }
      }

      if (data.drugInteractions && data.drugInteractions.length > 0) {
        outputText += `## Drug Interactions\n`;
        outputText += `| Drug | Severity | Description |\n|---|---|---|\n`;
        for (const ix of data.drugInteractions) {
          const severityBadge =
            ix.severity === "high" || ix.severity === "contraindicated"
              ? `**${ix.severity}**`
              : ix.severity;
          outputText += `| ${ix.drug} | ${severityBadge} | ${ix.description} |\n`;
        }
        outputText += "\n";
      }

      if (data.expectedOutcomes) {
        const outcomes = data.expectedOutcomes;
        if (outcomes.positive?.length) {
          outputText += `## Expected Benefits\n`;
          for (const p of outcomes.positive) outputText += `- ${p}\n`;
          outputText += "\n";
        }
        if (outcomes.risks?.length) {
          outputText += `## Risks\n`;
          for (const r of outcomes.risks) outputText += `- ${r}\n`;
          outputText += "\n";
        }
        if (outcomes.sideEffects?.length) {
          outputText += `## Side Effects\n`;
          for (const s of outcomes.sideEffects) outputText += `- ${s}\n`;
          outputText += "\n";
        }
      }

      if (data.alternativeTreatments && data.alternativeTreatments.length > 0) {
        outputText += `## Alternative Treatments\n`;
        outputText += `| Treatment | Efficacy | Reason |\n|---|---|---|\n`;
        for (const alt of data.alternativeTreatments) {
          outputText += `| ${alt.name} | ${alt.efficacy}/100 | ${alt.reason} |\n`;
        }
        outputText += "\n";
      }

      if (data.monitoringRecommendations?.length) {
        outputText += `## Monitoring Recommendations\n`;
        for (const rec of data.monitoringRecommendations) outputText += `- ${rec}\n`;
        outputText += "\n";
      }

      if (data.warnings?.length) {
        outputText += `## Warnings\n`;
        for (const w of data.warnings) outputText += `- ${w}\n`;
        outputText += "\n";
      }

      if (data.projections?.length) {
        outputText += `## Biomarker Projections\n`;
        outputText += `| Day | BP | Glucose | HR | Health Score |\n|---|---|---|---|---|\n`;
        for (const p of data.projections) {
          outputText += `| ${p.day} | ${p.bloodPressure || p.blood_pressure || "-"} | ${p.glucoseMgDl || p.glucose_mg_dl || "-"} | ${p.restingHeartRate || p.resting_heart_rate || "-"} | ${p.overallHealth || p.overall_health || "-"} |\n`;
        }
        outputText += "\n";
      }

      if (!outputText.trim()) {
        outputText = "Simulation completed. No detailed output returned.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: outputText,
        timestamp: new Date(),
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: `Failed to run simulation: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
            <h3 className="font-semibold text-foreground">
              Treatment Simulation
            </h3>
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
            <div
              key={marker.name}
              className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50"
            >
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
        {/* Treatment Name (Medication dropdown) */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
            Treatment / Medicine
          </label>
          <Select value={treatmentName} onValueChange={setTreatmentName}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Select medicine" />
            </SelectTrigger>
            <SelectContent>
              {medicationList.map((med) => (
                <SelectItem key={med} value={med}>
                  {med}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Treatment Type */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
            Type
          </label>
          <Select value={treatmentType} onValueChange={setTreatmentType}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {treatmentTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dosage */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
            Dosage
          </label>
          <Input
            placeholder="e.g. 500mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
            Duration
          </label>
          <Input
            placeholder="e.g. 3 months"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* Simulation Days */}
        <div>
          <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
            Simulation
          </label>
          <Select value={simulationDays} onValueChange={setSimulationDays}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Days" />
            </SelectTrigger>
            <SelectContent>
              {simulationDaysOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-secondary/20 rounded-2xl p-5 mb-4 min-h-[300px] max-h-[500px] border border-border/30 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-violet-500" />
            </div>
            <h4 className="font-medium text-foreground mb-2">
              DigiTwin Treatment Simulation
            </h4>
            <p className="text-sm text-muted-foreground max-w-md mb-1">
              Simulate treatments, check drug interactions, and evaluate
              medication safety. The workflow analyzes pharmacogenomics,
              drug interactions, contraindications, and projects biomarker
              trajectories for the selected patient.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Select a patient, fill in treatment details above, then send a
              message or try a sample below.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.role !== "user" && (
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === "system"
                        ? "bg-destructive/10"
                        : "bg-gradient-to-br from-violet-500 to-purple-600"
                    }`}
                  >
                    {msg.role === "system" ? (
                      <Activity className="w-4 h-4 text-destructive" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 shadow-[var(--shadow-sm)] max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : msg.role === "system"
                      ? "bg-destructive/5 border border-destructive/20 rounded-tl-sm"
                      : "bg-card rounded-tl-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_table]:border-collapse [&_th]:border [&_th]:border-border/50 [&_td]:border [&_td]:border-border/50 [&_th]:bg-secondary/50">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                  {msg.source && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/20">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1.5"
                      >
                        {msg.source === "dify_enhanced"
                          ? "Dify Workflow"
                          : msg.source === "ai_simulation"
                          ? "AI Simulation"
                          : "Demo Data"}
                      </Badge>
                    </div>
                  )}
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
                    <span>Running treatment simulation pipeline...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
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
