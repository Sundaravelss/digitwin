"use client";

import {
  Send,
  Sparkles,
  Activity,
  Pill,
  Apple,
  Loader2,
  Stethoscope,
  Zap,
  FlaskConical,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currentPatient } from "@/data/patientData";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  source?: "dify" | "demo";
  elapsedTime?: number;
  totalSteps?: number;
};

const sampleQuestions = [
  {
    icon: Apple,
    text: "pepperoni pizza",
    category: "food",
  },
  {
    icon: Pill,
    text: "metformin 500mg",
    category: "medication",
  },
  {
    icon: Apple,
    text: "grilled chicken salad",
    category: "food",
  },
  {
    icon: Pill,
    text: "doliprane 1000mg",
    category: "medication",
  },
  {
    icon: FlaskConical,
    text: "omega-3 fish oil supplement",
    category: "supplement",
  },
  {
    icon: Apple,
    text: "brown rice with steamed vegetables",
    category: "food",
  },
];

const PatientIntakeAnalyzer = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Patient context from knowledge base (for display only)
  const patientName = currentPatient.demographics?.name || "Sundar Selvaraj";
  const patientAge = currentPatient.demographics?.age || 32;
  const patientSex = currentPatient.demographics?.sex || "Male";
  const patientConditions = currentPatient.medicalProfile?.conditions
    ?.map((c: { name: string }) => c.name)
    .join(", ") || "Prediabetes, Dyslipidemia, Seasonal Allergies";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSubmit = async (text?: string) => {
    const queryText = text || query;
    if (!queryText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: queryText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/patient-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemText: queryText,
          patientId: "PT-001",
          simulationWindow: "both",
          stream: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // Extract the text output from the workflow response
      let outputText = "";
      if (data.outputs) {
        // The workflow may return text in various output keys
        outputText =
          data.outputs.text ||
          data.outputs.result ||
          data.outputs.output ||
          data.outputs.answer ||
          (typeof data.outputs === "string" ? data.outputs : JSON.stringify(data.outputs, null, 2));
      } else if (data.text) {
        outputText = data.text;
      } else if (data.error) {
        outputText = `**Error**: ${data.error}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: outputText || "No output received from the workflow.",
        timestamp: new Date(),
        source: data.source || "dify",
        elapsedTime: data.elapsedTime,
        totalSteps: data.totalSteps,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: `Failed to analyze: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingText("");
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
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Patient Intake Analyzer
            </h3>
            <p className="text-xs text-muted-foreground">
              Dify Workflow &mdash; USDA + OpenFDA + Biomarker Projections
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

      {/* Patient Context Banner */}
      <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/30">
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
          <Activity className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-violet-700 dark:text-violet-300">
            Analyzing for: {patientName} ({patientAge}
            {patientSex === "Male" ? "M" : "F"}) — PT-001
          </p>
          <p className="text-xs text-violet-600/70 dark:text-violet-400/70 truncate">
            {patientConditions}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-secondary/20 rounded-2xl p-5 mb-4 min-h-[400px] max-h-[600px] border border-border/30 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-violet-500" />
            </div>
            <h4 className="font-medium text-foreground mb-2">
              DigiTwin Patient Intake Analyzer
            </h4>
            <p className="text-sm text-muted-foreground max-w-md mb-1">
              Ask about foods, medications, supplements, or health habits.
              The workflow queries USDA & OpenFDA databases and projects
              biomarker impacts specific to this patient's profile.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Try one of the sample questions below to get started.
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
                        {msg.source === "dify"
                          ? "Dify Workflow"
                          : "Demo Data"}
                      </Badge>
                      {msg.elapsedTime && (
                        <span className="text-[10px] text-muted-foreground">
                          {msg.elapsedTime.toFixed(1)}s
                        </span>
                      )}
                      {msg.totalSteps && (
                        <span className="text-[10px] text-muted-foreground">
                          {msg.totalSteps} steps
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-[var(--shadow-sm)]">
                  {streamingText ? (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{streamingText}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Running workflow pipeline...</span>
                    </div>
                  )}
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
          placeholder="Ask about food, medication, supplements, or health habits..."
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

export default PatientIntakeAnalyzer;
