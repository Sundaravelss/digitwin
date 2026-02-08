import { Gift, ChevronRight, Trophy, Target, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { healthBenefitsData } from "@/data/patientData";

const HealthBenefits = () => {
  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Health Benefits</h3>
            <p className="text-xs text-muted-foreground">Earn rewards for healthy habits</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-sm text-primary hover:underline">
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {healthBenefitsData.map((benefit) => (
          <div 
            key={benefit.id}
            className="p-5 rounded-xl bg-secondary/30 hover:bg-secondary/50 border-l-4 border-primary/60 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{benefit.icon}</span>
                <div>
                  <h4 className="font-medium text-foreground">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground">{benefit.daysLeft} days left</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-success/15 to-emerald-400/15 text-success text-xs font-semibold border border-success/20">
                {benefit.reward}
              </span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{benefit.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
                  style={{ width: `${benefit.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBenefits;
