import { useState } from "react";
import { ExternalLink, ChevronUp, ChevronDown, Plus, Calendar } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mealPlanData } from "@/data/patientData";

const MealPlan = () => {
  const [openMeals, setOpenMeals] = useState<string[]>(["Breakfast"]);

  const toggleMeal = (mealName: string) => {
    setOpenMeals(prev => 
      prev.includes(mealName) 
        ? prev.filter(m => m !== mealName)
        : [...prev, mealName]
    );
  };

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
          <h3 className="text-white font-semibold">Meal Plan</h3>
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
      
      {/* Meals */}
      <div className="px-4 pb-4 space-y-2">
        {mealPlanData.map((meal) => (
          <Collapsible 
            key={meal.name} 
            open={openMeals.includes(meal.name)}
            onOpenChange={() => toggleMeal(meal.name)}
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <span className="font-medium text-foreground">{meal.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{meal.items.reduce((sum, i) => sum + i.calories, 0)} kcal</span>
                {openMeals.includes(meal.name) ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-3 pb-3">
              <div className="flex items-center gap-3">
                {meal.items.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-xl hover:scale-110 hover:shadow-sm hover:bg-secondary transition-all duration-200 cursor-pointer">
                      {item.emoji}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{item.calories} Kcal</span>
                  </div>
                ))}
                <button className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <button className="w-full mt-3 py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                Generate AI Suggestion
              </button>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
