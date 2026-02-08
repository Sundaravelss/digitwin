"use client";

import { useState } from "react";
import {
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Plus,
  Calendar,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMealPlan } from "@/context/MealPlanContext";
import { healthProfileForAI } from "@/data/patientData";
import { toast } from "sonner";

interface AISuggestionResponse {
  suggestions: Array<{ emoji: string; name: string; calories: number }>;
  reasoning: string;
  healthNotes: string[];
  disclaimer: string;
}

const MealPlan = () => {
  const { meals, addItem, removeItem } = useMealPlan();
  const [openMeals, setOpenMeals] = useState<string[]>(["Breakfast"]);

  // AI suggestion state per meal
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<
    Record<string, AISuggestionResponse>
  >({});

  // Add item form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemEmoji, setNewItemEmoji] = useState("");
  const [newItemCalories, setNewItemCalories] = useState("");

  const toggleMeal = (mealName: string) => {
    setOpenMeals((prev) =>
      prev.includes(mealName)
        ? prev.filter((m) => m !== mealName)
        : [...prev, mealName]
    );
  };

  const today = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleGenerateAI = async (mealName: string) => {
    setGeneratingFor(mealName);
    setAiSuggestions((prev) => {
      const next = { ...prev };
      delete next[mealName];
      return next;
    });

    const meal = meals.find((m) => m.name === mealName);
    try {
      const res = await fetch("/api/meal-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType: mealName,
          currentItems:
            meal?.items.map((i) => ({ name: i.name, calories: i.calories })) ??
            [],
          healthProfile: healthProfileForAI,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate suggestions");
      const data: AISuggestionResponse = await res.json();
      setAiSuggestions((prev) => ({ ...prev, [mealName]: data }));
    } catch {
      toast.error("Could not generate suggestions. Please try again.");
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleAddSuggestion = (
    mealName: string,
    item: { emoji: string; name: string; calories: number }
  ) => {
    addItem(mealName, item);
    toast.success(`Added ${item.name} to ${mealName}`);
  };

  const handleAddCustomItem = (mealName: string) => {
    if (!newItemName.trim()) return;
    addItem(mealName, {
      emoji: newItemEmoji || "\u{1F37D}\u{FE0F}",
      name: newItemName.trim(),
      calories: Number(newItemCalories) || 0,
    });
    toast.success(`Added ${newItemName} to ${mealName}`);
    setNewItemName("");
    setNewItemEmoji("");
    setNewItemCalories("");
  };

  const handleRemoveItem = (mealName: string, index: number, name: string) => {
    removeItem(mealName, index);
    toast.info(`Removed ${name}`);
  };

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
        <div className="flex items-center gap-2 text-foreground/70">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
        <button className="text-foreground/70 hover:text-foreground transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Meals */}
      <div className="px-4 pb-4 space-y-2">
        {meals.map((meal) => (
          <Collapsible
            key={meal.name}
            open={openMeals.includes(meal.name)}
            onOpenChange={() => toggleMeal(meal.name)}
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <span className="font-medium text-foreground">{meal.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-foreground/70">
                  {meal.items.reduce((sum, i) => sum + i.calories, 0)} kcal
                </span>
                {openMeals.includes(meal.name) ? (
                  <ChevronUp className="w-4 h-4 text-foreground/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-foreground/60" />
                )}
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-3 pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                {meal.items.map((item, index) => (
                  <HoverCard key={index} openDelay={200} closeDelay={150}>
                    <HoverCardTrigger asChild>
                      <div className="flex flex-col items-center cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-xl hover:scale-110 hover:shadow-sm hover:bg-secondary transition-all duration-200">
                          {item.emoji}
                        </div>
                        <span className="text-xs text-foreground/70 mt-1">
                          {item.calories} Kcal
                        </span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-48 p-3">
                      <p className="font-semibold text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-foreground/70 mb-2">
                        {item.calories} calories
                      </p>
                      <button
                        onClick={() =>
                          handleRemoveItem(meal.name, index, item.name)
                        }
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/5 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove item
                      </button>
                    </HoverCardContent>
                  </HoverCard>
                ))}

                {/* Add item button */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Add food item</p>
                    <input
                      placeholder="Food name"
                      className="w-full px-3 py-1.5 text-sm border rounded-lg bg-background text-foreground placeholder:text-foreground/40"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCustomItem(meal.name);
                      }}
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="Emoji"
                        className="w-16 px-2 py-1.5 text-sm border rounded-lg text-center bg-background text-foreground placeholder:text-foreground/40"
                        value={newItemEmoji}
                        onChange={(e) => setNewItemEmoji(e.target.value)}
                        maxLength={2}
                      />
                      <input
                        placeholder="Calories"
                        type="number"
                        className="flex-1 px-3 py-1.5 text-sm border rounded-lg bg-background text-foreground placeholder:text-foreground/40"
                        value={newItemCalories}
                        onChange={(e) => setNewItemCalories(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => handleAddCustomItem(meal.name)}
                      disabled={!newItemName.trim()}
                      className="w-full py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add
                    </button>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Generate AI Suggestion button */}
              <button
                onClick={() => handleGenerateAI(meal.name)}
                disabled={generatingFor === meal.name}
                className="w-full mt-3 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {generatingFor === meal.name ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate AI Suggestion
                  </>
                )}
              </button>

              {/* Loading skeleton */}
              {generatingFor === meal.name && (
                <div className="mt-3 flex items-center gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-secondary/50 animate-pulse" />
                      <div className="w-10 h-2 rounded bg-secondary/50 animate-pulse mt-1.5" />
                    </div>
                  ))}
                </div>
              )}

              {/* AI Suggestions display */}
              {aiSuggestions[meal.name] && generatingFor !== meal.name && (
                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Suggestions
                    </span>
                    <button
                      onClick={() =>
                        setAiSuggestions((prev) => {
                          const next = { ...prev };
                          delete next[meal.name];
                          return next;
                        })
                      }
                      className="text-xs font-medium text-foreground/60 hover:text-foreground"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-xs text-foreground/80">
                    {aiSuggestions[meal.name].reasoning}
                  </p>
                  <div className="flex items-center gap-3">
                    {aiSuggestions[meal.name].suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleAddSuggestion(meal.name, item)
                        }
                        className="flex flex-col items-center group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                          {item.emoji}
                        </div>
                        <span className="text-[11px] text-foreground/70 mt-1">
                          {item.calories} kcal
                        </span>
                        <span className="text-[11px] text-primary font-semibold">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  {aiSuggestions[meal.name].healthNotes.length > 0 && (
                    <ul className="text-xs text-foreground/70 space-y-0.5">
                      {aiSuggestions[meal.name].healthNotes.map((note, i) => (
                        <li key={i}>• {note}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-[11px] text-foreground/50 italic">
                    {aiSuggestions[meal.name].disclaimer}
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
