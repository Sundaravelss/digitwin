"use client";

import { ExternalLink, ChevronUp, Calendar } from "lucide-react";
import { useMealPlan } from "@/context/MealPlanContext";

const CaloriesAnalysis = () => {
  const { totalCalories, nutrientBreakdown } = useMealPlan();

  const today = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="health-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-500 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold">Calories Analysis</h3>
          <ChevronUp className="w-4 h-4 text-white/80" />
        </div>
      </div>

      {/* Date + Total */}
      <div className="p-4 pb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-foreground/70">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-foreground">
            {totalCalories} kcal
          </span>
          <button className="text-foreground/70 hover:text-foreground transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nutrients */}
      <div className="px-4 pb-4 space-y-4">
        {nutrientBreakdown.map((nutrient) => (
          <div key={nutrient.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">{nutrient.name}</span>
              <span className="font-medium text-foreground">
                {nutrient.value}%
              </span>
            </div>
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${nutrient.color} rounded-full transition-all duration-500`}
                style={{ width: `${nutrient.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaloriesAnalysis;
