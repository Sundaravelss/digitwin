import { Camera, Upload, Utensils, Flame, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NutritionCoach = () => {
  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Nutrition Coach</h3>
            <p className="text-xs text-muted-foreground">24/7 AI guidance</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-warning/10 text-warning font-medium">
          24/7 Available
        </span>
      </div>

      {/* Food Scanner */}
      <div className="border-2 border-dashed border-muted rounded-2xl p-8 text-center mb-6 hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-105 transition-all duration-300">
          <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Food Scanner</p>
        <p className="text-xs text-muted-foreground">Upload food image → calorie estimation</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] transition-all duration-200 text-left">
          <Flame className="w-5 h-5 text-destructive" />
          <div>
            <div className="text-sm font-medium text-foreground">Burn Calc</div>
            <div className="text-xs text-muted-foreground">Activity tracker</div>
          </div>
        </button>
        <button className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] transition-all duration-200 text-left">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <div className="text-sm font-medium text-foreground">Deep Scan</div>
            <div className="text-xs text-muted-foreground">Hidden nutrients</div>
          </div>
        </button>
        <button className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] transition-all duration-200 text-left">
          <Clock className="w-5 h-5 text-warning" />
          <div>
            <div className="text-sm font-medium text-foreground">Meal Log</div>
            <div className="text-xs text-muted-foreground">Track intake</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NutritionCoach;
