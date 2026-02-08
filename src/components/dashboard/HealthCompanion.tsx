import {
  BrainCircuit, Send, Sparkles, TrendingUp, Moon, Apple, Activity, Pill,
  Utensils, Paperclip, X, Loader2, AlertTriangle, Heart, Zap, Flame,
  ChevronDown, ChevronUp, Dumbbell,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profileCardData, healthProfileForAI } from "@/data/patientData";

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

function tryParseSimulationJson(text: string): SimulationData | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed && (parsed.simulation || parsed.patient_alerts || parsed.text_summary)) {
      return parsed;
    }
  } catch {
    // Not JSON
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

function BiomarkerProjections({ simulation }: { simulation: NonNullable<SimulationData["simulation"]> }) {
  const projections = simulation.projections;
  const timepoints = simulation.timepoints;
  if (!projections || !timepoints) return null;

  const metrics = [
    { key: "glucose_mg_dl", label: "Glucose", unit: "mg/dL", color: "bg-red-500" },
    { key: "resting_heart_rate", label: "Heart Rate", unit: "bpm", color: "bg-pink-500" },
    { key: "crp_mg_l", label: "CRP", unit: "mg/L", color: "bg-orange-500" },
    { key: "systolic", label: "BP Systolic", unit: "mmHg", color: "bg-purple-500" },
  ].filter((m) => projections[m.key]?.length);

  if (metrics.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Biomarker Projections</div>
      {metrics.map((m) => {
        const values = projections[m.key] || [];
        const baseline = values[0] ?? 0;
        const peak = Math.max(...values);
        const delta = peak - baseline;
        const direction = delta > 0 ? "+" : "";
        return (
          <div key={m.key} className="flex items-center gap-3">
            <div className="w-24 text-xs text-muted-foreground truncate">{m.label}</div>
            <div className="flex-1 h-2 bg-secondary/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${m.color} transition-all`}
                style={{ width: `${Math.min(100, baseline > 0 ? (peak / (baseline * 1.5)) * 100 : 50)}%` }}
              />
            </div>
            <div className="text-xs font-mono w-24 text-right">
              {baseline.toFixed(0)} &rarr; {peak.toFixed(0)}
              <span className={delta > 0 ? " text-red-500" : " text-green-500"}> ({direction}{delta.toFixed(0)})</span>
            </div>
          </div>
        );
      })}
      {simulation.peak_glucose_time && (
        <div className="text-[10px] text-muted-foreground">
          Peak at {simulation.peak_glucose_time} &middot; Returns to baseline: {simulation.return_to_baseline || "~2-4h"}
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

function SimulationResultCard({ data }: { data: SimulationData }) {
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

      {data.activity_suggestions && (
        <ActivitySuggestions activities={data.activity_suggestions} />
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
      const useSimulation = isSimulationQuery(msgText) || !!imageFile;

      if (useSimulation) {
        // ── Route to /api/patient-intake (Dify workflow) ──
        setLoadingStatus("Running DigiTwin simulation...");

        const res = await fetch("/api/patient-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemText: msgText,
            patientId: "PT_001",
            imageUrl: null,
            simulationWindow: "both",
            stream: false,
          }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        // Dify workflow returns outputs.answer; demo fallback uses outputs.text
        const outputText: string = data.outputs?.answer || data.outputs?.text || data.outputs?.result || "";

        // Try to parse structured JSON from the Dify workflow
        const simData = tryParseSimulationJson(outputText);

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: simData?.text_summary || outputText || "Simulation complete.",
          simulationData: simData,
        };
        setChatHistory((prev) => [...prev, assistantMessage]);
      } else {
        // ── Route to /api/health-companion (general chat) ──
        setLoadingStatus("Thinking...");

        const formData = new FormData();
        formData.append("message", msgText);
        formData.append("profile", JSON.stringify({
          age: profileCardData.age,
          sex: profileCardData.gender,
          weight: profileCardData.weight,
          conditions: healthProfileForAI.dietaryNeeds.join(", "),
          allergies: "Penicillin",
        }));
        formData.append("biomarkers", JSON.stringify({
          glucoseMgDl: healthProfileForAI.glucose,
          totalCholesterol: healthProfileForAI.cholesterol,
          bloodPressure: healthProfileForAI.bloodPressure,
          heartRate: healthProfileForAI.heartRate,
          energyLevel: 70,
          inflammationIndex: 25,
        }));
        formData.append("history", JSON.stringify(chatHistory.slice(-6)));
        if (imageFile) {
          formData.append("image", imageFile);
        }

        const res = await fetch("/api/health-companion", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.reply || "Sorry, I couldn't process that request.",
        };
        setChatHistory((prev) => [...prev, assistantMessage]);
      }
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
                <SimulationResultCard data={msg.simulationData} />
              ) : msg.role === "assistant" ? (
                <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_table]:border-collapse [&_th]:border [&_th]:border-border/50 [&_td]:border [&_td]:border-border/50 [&_th]:bg-secondary/50">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
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
