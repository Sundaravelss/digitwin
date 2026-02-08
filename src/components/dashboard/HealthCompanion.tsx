import { MessageCircle, Send, Sparkles, TrendingUp, Pill, Apple } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const suggestions = [
  { icon: TrendingUp, text: "Show my health trends" },
  { icon: Apple, text: "Impact of eating pizza?" },
  { icon: Pill, text: "Side effects of my medication" },
];

const HealthCompanion = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="health-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Health Companion</h3>
            <p className="text-xs text-muted-foreground">AI-powered insights</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Online
        </div>
      </div>

      {/* Chat area placeholder */}
      <div className="flex-1 bg-secondary/20 rounded-2xl p-5 mb-4 min-h-[400px] border border-border/30 overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-[var(--shadow-sm)] max-w-[80%]">
            <p className="text-sm text-foreground">
              Hello! I'm your Health Companion. I can show you health trends, simulate food or medication impacts, and provide personalized insights. How can I help you today?
            </p>
          </div>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.text}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 hover:text-primary text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5"
            >
              <Icon className="w-4 h-4" />
              {suggestion.text}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask about your health..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 h-12 rounded-xl bg-secondary/50 border-0"
        />
        <Button size="icon" className="w-12 h-12 rounded-xl">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default HealthCompanion;
