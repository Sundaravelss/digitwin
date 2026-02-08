import { ExternalLink, ChevronUp, Calendar } from "lucide-react";
import { caloriesAnalysisData } from "@/data/patientData";

const CaloriesAnalysis = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
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
      
      {/* Date */}
      <div className="p-4 pb-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      {/* Nutrients */}
      <div className="px-4 pb-4 space-y-4">
        {caloriesAnalysisData.nutrients.map((nutrient) => (
          <div key={nutrient.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{nutrient.name}</span>
              <span className="font-medium text-foreground">{nutrient.value}%</span>
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
