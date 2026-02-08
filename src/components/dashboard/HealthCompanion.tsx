import {
  BrainCircuit, Send, Sparkles, TrendingUp, Moon, Apple, Activity, Pill,
  Utensils, Paperclip, X, Loader2, AlertTriangle, Heart, Zap, Flame,
  ChevronDown, ChevronUp, Dumbbell,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────

type SimulationData = {
  patient_id?: string;
  patient_name?: string;
  item_identified?: string;
  item_category?: string;
  nutritional_or_pharma_data?: {
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    sodium_mg?: number;
    sugar_g?: number;
    fiber_g?: number;
    glycemic_index?: number;
    active_ingredients?: string[];
    mechanism?: string;
  };
  patient_alerts?: Array<{
    type: string;
    severity: "low" | "moderate" | "high" | "critical";
    message: string;
    evidence?: string;
  }>;
  baseline_biomarkers?: Record<string, unknown>;
  simulation?: {
    timepoints?: string[];
    projections?: Record<string, number[]>;
    sleep_quality_impact?: string;
    peak_glucose_time?: string;
    return_to_baseline?: string;
    health_score_impact?: { metabolic?: number; cardiovascular?: number; overall?: number };
  };
  activity_suggestions?: Array<{
    activity_name: string;
    duration_minutes: number | string;
    calories_burned: number | string;
    intensity: string;
    note?: string;
  }> | null;
  text_summary?: string;
  concern?: string;
  pharmacogenomic_note?: string;
  suggestions?: string[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  simulationData?: SimulationData | null;
  chatSuggestions?: string[];
};

// ── Helpers ────────────────────────────────────────────────────────────

const SIMULATION_KEYWORDS = [
  "pizza", "burger", "food", "rice", "salad", "chicken", "eating", "ate", "eat",
  "meal", "snack", "breakfast", "lunch", "dinner", "drink", "coffee", "beer",
  "medication", "medicine", "drug", "pill", "mg", "amoxicillin", "metformin",
  "ibuprofen", "paracetamol", "doliprane", "aspirin", "tylenol", "taking",
  "impact of", "simulate", "what happens if", "what if i",
];

function isSimulationQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return SIMULATION_KEYWORDS.some((kw) => lower.includes(kw));
}

/** Extract a JSON object from text that may include markdown code fences or preamble. */
function extractJsonFromText(text: string): Record<string, unknown> | null {
  // 1. Try direct parse
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch { /* not plain JSON */ }

  // 2. Strip markdown code fences: ```json ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1]);
      if (parsed && typeof parsed === "object") return parsed;
    } catch { /* bad JSON inside fence */ }
  }

  // 3. Find first top-level { ... } in the text
  let depth = 0, start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") { if (depth === 0) start = i; depth++; }
    else if (text[i] === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        try {
          const parsed = JSON.parse(text.slice(start, i + 1));
          if (parsed && typeof parsed === "object") return parsed;
        } catch { /* keep scanning */ }
      }
    }
  }
  return null;
}

function tryParseSimulationJson(text: string): SimulationData | null {
  const parsed = extractJsonFromText(text);
  if (parsed && (parsed.simulation || parsed.patient_alerts || parsed.text_summary)) {
    return parsed as SimulationData;
  }
  return null;
}

// ── Simulation subcomponents ───────────────────────────────────────────

function AlertBadge({ alert }: { alert: NonNullable<SimulationData["patient_alerts"]>[number] }) {
  const colorMap: Record<string, string> = {
    critical: "bg-red-500/15 text-red-600 border-red-500/30",
    high: "bg-orange-500/15 text-orange-600 border-orange-500/30",
    moderate: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
    low: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  };
  const cls = colorMap[alert.severity] || colorMap.low;

  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${cls}`}>
      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold capitalize">{alert.severity}</span>
        <span className="mx-1">&middot;</span>
        <span>{alert.message}</span>
      </div>
    </div>
  );
}

function NutritionCard({ data }: { data: NonNullable<SimulationData["nutritional_or_pharma_data"]> }) {
  const nutrients = [
    { label: "Calories", value: data.calories, unit: "kcal", icon: Flame, color: "text-orange-500" },
    { label: "Protein", value: data.protein_g, unit: "g", icon: Zap, color: "text-blue-500" },
    { label: "Carbs", value: data.carbs_g, unit: "g", icon: Activity, color: "text-amber-500" },
    { label: "Fat", value: data.fat_g, unit: "g", icon: Heart, color: "text-pink-500" },
  ].filter((n) => n.value != null);

  if (nutrients.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      {nutrients.map((n) => {
        const Icon = n.icon;
        return (
          <div key={n.label} className="bg-secondary/40 rounded-lg p-2 text-center">
            <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${n.color}`} />
            <div className="text-xs font-semibold">{n.value}{n.unit}</div>
            <div className="text-[10px] text-muted-foreground">{n.label}</div>
          </div>
        );
      })}
    </div>
  );
}

const CHART_COLORS: Record<string, { stroke: string; fill: string }> = {
  glucose_mg_dl: { stroke: "#ef4444", fill: "#ef444430" },
  resting_heart_rate: { stroke: "#ec4899", fill: "#ec489930" },
  crp_mg_l: { stroke: "#f97316", fill: "#f9731630" },
  systolic: { stroke: "#8b5cf6", fill: "#8b5cf630" },
  energy_level: { stroke: "#22c55e", fill: "#22c55e30" },
  hba1c_pct: { stroke: "#3b82f6", fill: "#3b82f630" },
  ldl_mg_dl: { stroke: "#f59e0b", fill: "#f59e0b30" },
  cortisol_nmol_l: { stroke: "#d946ef", fill: "#d946ef30" },
};

const CHART_LABELS: Record<string, { label: string; unit: string }> = {
  glucose_mg_dl: { label: "Glucose", unit: "mg/dL" },
  resting_heart_rate: { label: "Heart Rate", unit: "bpm" },
  crp_mg_l: { label: "CRP", unit: "mg/L" },
  systolic: { label: "BP Systolic", unit: "mmHg" },
  energy_level: { label: "Energy", unit: "%" },
  hba1c_pct: { label: "HbA1c", unit: "%" },
  ldl_mg_dl: { label: "LDL", unit: "mg/dL" },
  cortisol_nmol_l: { label: "Cortisol", unit: "nmol/L" },
};

function BiomarkerProjections({ simulation }: { simulation: NonNullable<SimulationData["simulation"]> }) {
  const projections = simulation.projections;
  const timepoints = simulation.timepoints;
  if (!projections || !timepoints) return null;

  const metricKeys = Object.keys(projections).filter(
    (k) => projections[k] && projections[k]!.length > 0
  );
  if (metricKeys.length === 0) return null;

  // Build chart data: [{ time: "0h", glucose_mg_dl: 108, ... }, ...]
  const chartData = timepoints.map((t, i) => {
    const point: Record<string, string | number> = { time: t };
    for (const key of metricKeys) {
      point[key] = projections[key]![i] ?? 0;
    }
    return point;
  });

  // Summary: baseline vs peak/final for each metric
  const summaries = metricKeys.map((key) => {
    const values = projections[key]!;
    const baseline = values[0] ?? 0;
    const final = values[values.length - 1] ?? 0;
    const peak = Math.max(...values);
    const min = Math.min(...values);
    const delta = final - baseline;
    const info = CHART_LABELS[key] || { label: key, unit: "" };
    return { key, baseline, final, peak, min, delta, ...info };
  });

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
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
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
              formatter={(value: string) => (CHART_LABELS[value]?.label || value)}
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
                  fill={`url(#grad-${key})`}
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
          const color = isUp ? "text-red-500" : "text-green-500";
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

      {simulation.peak_glucose_time && (
        <div className="text-[10px] text-muted-foreground">
          Peak at {simulation.peak_glucose_time} · Returns to baseline: {simulation.return_to_baseline || "~2–4h"}
        </div>
      )}
    </div>
  );
}

function ActivitySuggestions({ activities }: { activities: NonNullable<SimulationData["activity_suggestions"]> }) {
  const [expanded, setExpanded] = useState(false);
  if (!activities || activities.length === 0) return null;

  const shown = expanded ? activities : activities.slice(0, 2);

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
        <Dumbbell className="w-3 h-3" /> Burn it off
      </div>
      <div className="space-y-1.5">
        {shown.map((a, i) => (
          <div key={i} className="flex items-center justify-between bg-secondary/30 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="font-medium">{a.activity_name}</span>
            <span className="text-muted-foreground">{a.duration_minutes} min &middot; {a.calories_burned} kcal</span>
          </div>
        ))}
      </div>
      {activities.length > 2 && (
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-primary mt-1 flex items-center gap-0.5">
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> +{activities.length - 2} more</>}
        </button>
      )}
    </div>
  );
}

function HealthScoreImpact({ impact }: { impact: NonNullable<NonNullable<SimulationData["simulation"]>["health_score_impact"]> }) {
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
                  : "bg-red-500/10 text-red-600 border-red-500/30"
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

function SimulationResultCard({ data, onSuggestionClick }: { data: SimulationData; onSuggestionClick?: (text: string) => void }) {
  return (
    <div className="space-y-2">
      {data.text_summary && (
        <p className="text-sm whitespace-pre-wrap">{data.text_summary}</p>
      )}

      {data.patient_alerts && data.patient_alerts.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {data.patient_alerts.map((alert, i) => (
            <AlertBadge key={i} alert={alert} />
          ))}
        </div>
      )}

      {data.pharmacogenomic_note && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg border bg-violet-500/10 text-violet-700 border-violet-500/30 text-xs mt-1">
          <span className="font-semibold">Pharmacogenomic:</span> {data.pharmacogenomic_note}
        </div>
      )}

      {data.nutritional_or_pharma_data && (
        <NutritionCard data={data.nutritional_or_pharma_data} />
      )}

      {data.simulation && (
        <BiomarkerProjections simulation={data.simulation} />
      )}

      {data.simulation?.health_score_impact && (
        <HealthScoreImpact impact={data.simulation.health_score_impact} />
      )}

      {data.activity_suggestions && (
        <ActivitySuggestions activities={data.activity_suggestions} />
      )}

      {data.suggestions && data.suggestions.length > 0 && (
        <SuggestionPills suggestions={data.suggestions} onSuggestionClick={onSuggestionClick} />
      )}

      {data.concern && (
        <div className="text-xs text-muted-foreground mt-2 italic">{data.concern}</div>
      )}
    </div>
  );
}

// ── Suggestions ────────────────────────────────────────────────────────

const suggestions = [
  { icon: Activity, text: "Show my health status" },
  { icon: TrendingUp, text: "How is my glucose trending?" },
  { icon: Utensils, text: "Impact of eating pizza?" },
  { icon: Pill, text: "Taking Amoxicillin 500mg for 5 days" },
  { icon: Apple, text: "Suggest a low-cholesterol dinner" },
  { icon: Moon, text: "Impact of 4h sleep on my body" },
];

// ── Main Component ─────────────────────────────────────────────────────

const HealthCompanion = () => {
  const [message, setMessage] = useState("");
  const [attachedImage, setAttachedImage] = useState<{ file: File; preview: string } | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Analyzing...");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSend = useCallback(async (text?: string) => {
    const msgText = (text ?? message).trim();
    if (!msgText && !attachedImage) return;
    if (isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: msgText,
      imageUrl: attachedImage?.preview,
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    const imageFile = attachedImage?.file;
    if (attachedImage) {
      setAttachedImage(null);
    }

    try {
      // ── ALL queries route to /api/patient-intake (Dify workflow) ──
      // The Dify workflow internally classifies intent as "simulation" or
      // "general_chat" and routes accordingly.
      setLoadingStatus(
        isSimulationQuery(msgText) || imageFile
          ? "Running DigiTwin simulation..."
          : "Thinking..."
      );

      let res: Response;

      if (imageFile) {
        // Send as FormData when image is attached
        const formData = new FormData();
        formData.append("itemText", msgText || "Analyze this food image");
        formData.append("patientId", "PT_001");
        formData.append("simulationWindow", "both");
        formData.append("stream", "false");
        formData.append("image", imageFile);

        res = await fetch("/api/patient-intake", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send as JSON when no image
        res = await fetch("/api/patient-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemText: msgText,
            patientId: "PT_001",
            simulationWindow: "both",
            stream: false,
          }),
        });
      }

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      // Dify workflow returns outputs in various keys depending on the path
      const rawOutputs = data.outputs || {};
      let outputText: string =
        rawOutputs.answer || rawOutputs.text || rawOutputs.result || rawOutputs.output || "";
      // If Dify returned an object instead of a string, stringify it
      if (typeof outputText === "object" && outputText !== null) {
        outputText = JSON.stringify(outputText);
      }
      // Fallback: grab any non-empty string value from outputs
      if (!outputText) {
        for (const val of Object.values(rawOutputs)) {
          if (typeof val === "string" && val.trim()) { outputText = val; break; }
        }
      }

      // Try to parse structured simulation JSON (handles code fences)
      const simData = tryParseSimulationJson(outputText);

      // Try to parse as general chat JSON (has "reply" field)
      let chatReply = "";
      let chatSuggestions: string[] | undefined;

      if (simData?.text_summary) {
        chatReply = simData.text_summary;
      } else if (outputText) {
        const parsed = extractJsonFromText(outputText);
        if (parsed?.reply && typeof parsed.reply === "string") {
          chatReply = parsed.reply;
          if (Array.isArray(parsed.suggestions)) {
            chatSuggestions = parsed.suggestions as string[];
          }
        } else {
          chatReply = outputText;
        }
      } else {
        chatReply = data.reply || "Sorry, I couldn't process that request.";
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: chatReply,
        simulationData: simData,
        chatSuggestions,
      };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Health Companion send error:", err);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStatus("Analyzing...");
    }
  }, [message, attachedImage, chatHistory, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
    handleSend(text);
  };

  const handleAttachImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setAttachedImage({ file, preview });
    }
    if (e.target) e.target.value = "";
  };

  const removeAttachedImage = () => {
    if (attachedImage) {
      URL.revokeObjectURL(attachedImage.preview);
      setAttachedImage(null);
    }
  };

  return (
    <div className="health-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Health Companion</h3>
            <p className="text-xs text-muted-foreground">Health insights & digital twin simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Online
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-secondary/20 rounded-2xl p-5 mb-4 min-h-[400px] border border-border/30 overflow-y-auto shadow-[0_2px_12px_rgba(0,0,0,0.06)] space-y-4">
        {/* Welcome message */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-[var(--shadow-sm)] max-w-[80%]">
            <p className="text-sm text-foreground">
              Hello! I&apos;m your Health Companion. I can show you health trends, simulate food or medication impacts, and provide personalized insights. How can I help you today?
            </p>
          </div>
        </div>

        {/* Chat messages */}
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`rounded-2xl p-4 max-w-[85%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card rounded-tl-sm shadow-[var(--shadow-sm)]"
              }`}
            >
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Attached"
                  className="w-32 h-32 rounded-lg object-cover mb-2"
                />
              )}

              {msg.role === "assistant" && msg.simulationData ? (
                <SimulationResultCard data={msg.simulationData} onSuggestionClick={handleSuggestionClick} />
              ) : msg.role === "assistant" ? (
                <>
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_table]:border-collapse [&_th]:border [&_th]:border-border/50 [&_td]:border [&_td]:border-border/50 [&_th]:bg-secondary/50">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.chatSuggestions && msg.chatSuggestions.length > 0 && (
                    <SuggestionPills suggestions={msg.chatSuggestions} onSuggestionClick={handleSuggestionClick} />
                  )}
                </>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingStatus}
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.text}
              onClick={() => handleSuggestionClick(suggestion.text)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:bg-primary/5 hover:border-primary/20 hover:text-primary hover:shadow-[0_3px_12px_rgba(0,0,0,0.1)] text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Icon className="w-4 h-4" />
              {suggestion.text}
            </button>
          );
        })}
      </div>

      {/* Attached image preview */}
      {attachedImage && (
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-secondary/50 border border-border/50">
          <div className="relative flex-shrink-0">
            <img
              src={attachedImage.preview}
              alt="Attached food"
              className="w-14 h-14 rounded-lg object-cover"
            />
            <button
              onClick={removeAttachedImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground truncate flex-1">
            {attachedImage.file.name}
          </span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-xl">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-xl text-muted-foreground hover:text-primary"
          onClick={handleAttachImage}
          title="Attach food image"
          disabled={isLoading}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <Input
          placeholder="Ask about your health..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-12 rounded-xl bg-secondary/50 border-0"
          disabled={isLoading}
        />
        <Button
          size="icon"
          className="w-12 h-12 rounded-xl"
          onClick={() => handleSend()}
          disabled={isLoading || (!message.trim() && !attachedImage)}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

export default HealthCompanion;
