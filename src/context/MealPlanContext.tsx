"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { mealPlanData, caloriesAnalysisData } from "@/data/patientData";

export type MealItem = { emoji: string; name: string; calories: number };
export type Meal = { name: string; items: MealItem[] };

type MealPlanContextValue = {
  meals: Meal[];
  addItem: (mealName: string, item: MealItem) => void;
  removeItem: (mealName: string, itemIndex: number) => void;
  totalCalories: number;
  nutrientBreakdown: { name: string; value: number; color: string }[];
};

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(mealPlanData);

  const addItem = useCallback((mealName: string, item: MealItem) => {
    setMeals(prev =>
      prev.map(m =>
        m.name === mealName ? { ...m, items: [...m.items, item] } : m
      )
    );
  }, []);

  const removeItem = useCallback((mealName: string, itemIndex: number) => {
    setMeals(prev =>
      prev.map(m =>
        m.name === mealName
          ? { ...m, items: m.items.filter((_, i) => i !== itemIndex) }
          : m
      )
    );
  }, []);

  const totalCalories = useMemo(
    () => meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.calories, 0), 0),
    [meals]
  );

  // Recalculate nutrient percentages proportionally to calorie changes
  const nutrientBreakdown = useMemo(() => {
    const originalTotal = caloriesAnalysisData.consumed;
    const ratio = originalTotal > 0 ? totalCalories / originalTotal : 1;
    const baseNutrients = caloriesAnalysisData.nutrients;
    const scaled = baseNutrients.map(n => n.value * ratio);
    const rawTotal = scaled.reduce((s, v) => s + v, 0);
    return baseNutrients.map((n, i) => ({
      ...n,
      value: rawTotal > 0 ? Math.round((scaled[i] / rawTotal) * 100) : n.value,
    }));
  }, [totalCalories]);

  return (
    <MealPlanContext.Provider
      value={{ meals, addItem, removeItem, totalCalories, nutrientBreakdown }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error("useMealPlan must be used within MealPlanProvider");
  return ctx;
}
