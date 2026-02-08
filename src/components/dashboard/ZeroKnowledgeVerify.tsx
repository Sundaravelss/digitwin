import { Shield, CheckCircle, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ZeroKnowledgeVerify = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Verify & Reward</h3>
            <p className="text-xs text-muted-foreground">Zero-Knowledge Proof Verification</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-6 h-6 text-violet-600" />
          <div>
            <h4 className="font-semibold text-foreground">Privacy-First Verification</h4>
            <p className="text-sm text-muted-foreground">Prove achievements without exposing raw data</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">Claim to verify:</p>
          <p className="font-medium text-foreground">"User burned more than 500 calories today"</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>No raw data shared</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Cryptographic proof</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Tamper-proof</span>
          </div>
        </div>

        {isVerified ? (
          <div className="flex items-center justify-center gap-3 p-5 rounded-xl bg-success/10 text-success border border-success/20 animate-scale-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-success/5 via-transparent to-success/5 shimmer" />
            <CheckCircle className="w-7 h-7 relative z-10" />
            <div className="relative z-10">
              <span className="font-semibold text-lg">Proof Verified!</span>
              <p className="text-xs text-success/80">Cryptographic integrity confirmed</p>
            </div>
          </div>
        ) : isVerifying ? (
          <div className="flex flex-col items-center gap-4 py-6 animate-fade-in-up">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#zkGradient)" strokeWidth="6"
                        strokeDasharray="190 252" strokeLinecap="round" />
                <defs>
                  <linearGradient id="zkGradient">
                    <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                    <stop offset="100%" stopColor="hsl(239, 84%, 67%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-violet-500 animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">Generating ZK Proof...</p>
            <p className="text-xs text-muted-foreground">Computing cryptographic proof without revealing data</p>
          </div>
        ) : (
          <Button
            onClick={handleVerify}
            className="w-full gap-2"
            size="lg"
          >
            Generate Proof
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ZeroKnowledgeVerify;
