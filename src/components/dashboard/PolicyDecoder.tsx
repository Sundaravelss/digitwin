import { MessageCircle, Send, FileText, Search, Shield, DollarSign, Heart } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sampleQueries = [
  { icon: Shield, text: "Is gym membership covered?" },
  { icon: DollarSign, text: "What's my deductible?" },
  { icon: Heart, text: "Coverage for mental health?" },
];

const PolicyDecoder = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="health-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Policy Decoder</h3>
            <p className="text-xs text-muted-foreground">RAG-powered policy search</p>
          </div>
        </div>
      </div>

      {/* Answer area */}
      <div className="flex-1 bg-secondary/20 rounded-2xl p-5 mb-4 min-h-[400px] border border-border/30 overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="bg-card rounded-2xl rounded-tl-sm p-4 shadow-[var(--shadow-sm)]">
            <p className="text-sm text-foreground">
              Ask me anything about your policy documents. I'll search through all uploaded policies and provide accurate answers with source references.
            </p>
          </div>
        </div>
      </div>

      {/* Sample queries */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sampleQueries.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.text}
              onClick={() => setQuery(q.text)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 hover:text-primary text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5"
            >
              <Icon className="w-4 h-4" />
              {q.text}
            </button>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask about your policy..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 h-12 rounded-xl bg-secondary/50 border-0"
        />
        <Button size="icon" className="w-12 h-12 rounded-xl">
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default PolicyDecoder;
