"use client";

import { useState } from "react";

type OnboardingData = {
  name: string;
  age: number | null;
  sex: "female" | "male" | "other" | null;
  healthGoals: string[];
  wearableDevice: string | null;
  dietaryPreferences: string[];
  allergies: string;
  conditions: string;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active" | null;
};

type OnboardingProps = {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
};

const HEALTH_GOALS = [
  { id: "lose_weight", label: "Lose Weight", icon: "⚖️" },
  { id: "build_muscle", label: "Build Muscle", icon: "💪" },
  { id: "improve_sleep", label: "Better Sleep", icon: "😴" },
  { id: "reduce_stress", label: "Reduce Stress", icon: "🧘" },
  { id: "eat_healthier", label: "Eat Healthier", icon: "🥗" },
  { id: "more_energy", label: "More Energy", icon: "⚡" },
  { id: "manage_condition", label: "Manage Health Condition", icon: "❤️" },
  { id: "preventive", label: "Preventive Care", icon: "🛡️" },
];

const WEARABLE_DEVICES = [
  { id: "apple_watch", label: "Apple Watch", icon: "⌚" },
  { id: "fitbit", label: "Fitbit", icon: "📱" },
  { id: "garmin", label: "Garmin", icon: "🏃" },
  { id: "samsung", label: "Samsung Galaxy Watch", icon: "⌚" },
  { id: "whoop", label: "WHOOP", icon: "💪" },
  { id: "oura", label: "Oura Ring", icon: "💍" },
  { id: "other", label: "Other Device", icon: "📊" },
  { id: "none", label: "No Wearable", icon: "❌" },
];

const DIETARY_PREFERENCES = [
  { id: "omnivore", label: "Omnivore" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "gluten_free", label: "Gluten-Free" },
  { id: "dairy_free", label: "Dairy-Free" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { id: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
  { id: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
  { id: "active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
  { id: "very_active", label: "Extra Active", desc: "Very hard exercise & physical job" },
];

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: null,
    sex: null,
    healthGoals: [],
    wearableDevice: null,
    dietaryPreferences: [],
    allergies: "",
    conditions: "",
    activityLevel: null,
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setData((prev) => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goalId)
        ? prev.healthGoals.filter((g) => g !== goalId)
        : [...prev.healthGoals, goalId],
    }));
  };

  const toggleDiet = (dietId: string) => {
    setData((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(dietId)
        ? prev.dietaryPreferences.filter((d) => d !== dietId)
        : [...prev.dietaryPreferences, dietId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.75c2.5 0 4.5 2 4.5 4.5S14.5 11.75 12 11.75 7.5 9.75 7.5 7.25 9.5 2.75 12 2.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4.75 21.25c.7-4.4 4.9-7 7.25-7s6.55 2.6 7.25 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-bold tracking-tight">DigiTwin</span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Let's personalize your experience
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Help us understand your health goals to provide better insights
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Tell us about yourself</h2>
              
              <label className="block">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  What should we call you?
                </span>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Enter your name"
                  className="mt-2 w-full h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 text-base"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Age</span>
                  <input
                    type="number"
                    value={data.age ?? ""}
                    onChange={(e) => setData({ ...data, age: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Age"
                    className="mt-2 w-full h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 text-base"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sex</span>
                  <select
                    value={data.sex ?? ""}
                    onChange={(e) => setData({ ...data, sex: e.target.value as OnboardingData["sex"] })}
                    className="mt-2 w-full h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 text-base"
                  >
                    <option value="">Select...</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {/* Step 1: Health Goals */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">What are your health goals?</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Select all that apply</p>
              
              <div className="grid grid-cols-2 gap-3">
                {HEALTH_GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-xl border text-left transition ${
                      data.healthGoals.includes(goal.id)
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                    }`}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <p className="mt-1 text-sm font-medium">{goal.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Wearable Device */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Do you use a wearable device?</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Connect your device for real-time health tracking
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {WEARABLE_DEVICES.map((device) => (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => setData({ ...data, wearableDevice: device.id })}
                    className={`p-4 rounded-xl border text-left transition ${
                      data.wearableDevice === device.id
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                    }`}
                  >
                    <span className="text-xl">{device.icon}</span>
                    <p className="mt-1 text-sm font-medium">{device.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Activity & Diet */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Your activity level</h2>
                <div className="mt-4 space-y-2">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setData({ ...data, activityLevel: level.id as OnboardingData["activityLevel"] })}
                      className={`w-full p-3 rounded-xl border text-left transition ${
                        data.activityLevel === level.id
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      <p className="font-medium text-sm">{level.label}</p>
                      <p className={`text-xs mt-0.5 ${data.activityLevel === level.id ? "opacity-80" : "text-zinc-500"}`}>
                        {level.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Dietary preferences (optional)</h3>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_PREFERENCES.map((diet) => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => toggleDiet(diet.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        data.dietaryPreferences.includes(diet.id)
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200"
                      }`}
                    >
                      {diet.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Medical Info */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Medical information</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                This helps us provide safer recommendations. All data stays on your device.
              </p>
              
              <label className="block">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Known allergies
                </span>
                <input
                  type="text"
                  value={data.allergies}
                  onChange={(e) => setData({ ...data, allergies: e.target.value })}
                  placeholder="e.g., Penicillin, Peanuts, None"
                  className="mt-2 w-full h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 text-base"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Existing health conditions
                </span>
                <input
                  type="text"
                  value={data.conditions}
                  onChange={(e) => setData({ ...data, conditions: e.target.value })}
                  placeholder="e.g., Asthma, Diabetes, None"
                  className="mt-2 w-full h-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 text-base"
                />
              </label>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <strong>Privacy note:</strong> Your medical information is stored locally on your device only. 
                  DigiTwin never shares your personal health data with third parties.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Skip setup
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              {step === totalSteps - 1 ? "Get Started" : "Continue"}
            </button>
          </div>
        </div>

        {/* Skip option */}
        {step > 0 && (
          <p className="text-center mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Want to skip?{" "}
            <button type="button" onClick={onSkip} className="underline hover:text-zinc-900 dark:hover:text-white">
              Go to dashboard
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
