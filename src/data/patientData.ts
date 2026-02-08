/* eslint-disable @typescript-eslint/no-explicit-any */
import patientsJson from "./patients.json";

// ==========================================
// Core Data Access
// ==========================================
const data = patientsJson as any;
export const allPatients = data.patients as any[];
export const currentPatient = allPatients[0]; // PT-001: Sundar Selvaraj

const dashboard = currentPatient.dashboard;
const weekDays = currentPatient.longitudinalData.days as any[];
const todayData = weekDays[0];
const yesterdayData = weekDays[1];

// ==========================================
// Profile Card Data
// ==========================================
export const profileCardData = dashboard.profileCard as {
  name: string;
  gender: string;
  weight: number;
  weightUnit: string;
  age: number;
  bloodType: string;
  bloodRh: string;
};

// ==========================================
// DigiTwin Avatar Data
// ==========================================
const stepsDelta = Math.round(
  ((todayData.steps - yesterdayData.steps) / yesterdayData.steps) * 100
);

export const digiTwinData = {
  integrityScore: currentPatient.healthScores.overall as number,
  biomarkers: [
    {
      label: "Steps",
      value: todayData.steps.toLocaleString(),
      change: `${stepsDelta >= 0 ? "+" : ""}${stepsDelta}%`,
      positive: stepsDelta >= 0,
    },
    {
      label: "Sleep",
      value: `${todayData.sleepHours}h`,
      change:
        todayData.sleepQuality >= 80
          ? "Good quality"
          : `${todayData.sleepQuality}% quality`,
      positive: todayData.sleepHours >= 7,
    },
    {
      label: "Heart Rate",
      value: `${todayData.restingHeartRate} bpm`,
      change: todayData.restingHeartRate <= 75 ? "Optimal" : "Elevated",
      positive: todayData.restingHeartRate <= 75,
    },
    {
      label: "HRV",
      value: `${todayData.hrvMs}ms`,
      change: `${todayData.hrvMs >= yesterdayData.hrvMs ? "+" : ""}${todayData.hrvMs - yesterdayData.hrvMs}ms`,
      positive: todayData.hrvMs >= yesterdayData.hrvMs,
    },
  ],
};

// ==========================================
// Statistics Chart Data
// ==========================================
export const statisticsChartData = {
  weekly: [...weekDays]
    .reverse()
    .map((day: any, index: number, arr: any[]) => ({
      day: (day.dayOfWeek as string).substring(0, 3),
      value: day.activeMinutes as number,
      highlighted: index === arr.length - 1,
    })),
  monthly: Object.entries(currentPatient.longitudinalData.monthlyTrends).map(
    ([month, trends]: [string, any]) => ({
      day: new Date(month + "-15").toLocaleDateString("en-US", {
        month: "short",
      }),
      value: trends.avgSteps as number,
      highlighted: month === "2026-02",
    })
  ),
};

// ==========================================
// Activity Summary Data
// ==========================================
const workoutTotals: Record<string, number> = {};
weekDays.forEach((day: any) => {
  (day.workouts || []).forEach((w: any) => {
    const type = w.type.charAt(0).toUpperCase() + w.type.slice(1);
    workoutTotals[type] = (workoutTotals[type] || 0) + w.durationMinutes;
  });
});
const totalWorkoutMin = Object.values(workoutTotals).reduce(
  (a, b) => a + b,
  0
);

export const activitySummaryData = {
  totalPercentage: Math.min(
    100,
    Math.round((totalWorkoutMin / 315) * 100)
  ),
  activities: [
    {
      name: "Walking",
      value: Math.min(
        100,
        Math.round(((workoutTotals["Walking"] || 0) / 150) * 100)
      ),
      color: "hsl(var(--primary))",
    },
    {
      name: "Yoga",
      value: Math.min(
        100,
        Math.round(((workoutTotals["Yoga"] || 0) / 90) * 100)
      ),
      color: "hsl(var(--warning))",
    },
    {
      name: "Swimming",
      value: Math.min(
        100,
        Math.round(((workoutTotals["Swimming"] || 0) / 60) * 100)
      ),
      color: "hsl(var(--primary) / 0.4)",
    },
  ],
};

// ==========================================
// Body Overview Data (6 metrics from biomarkers)
// ==========================================
const biomarkers = dashboard.biomarkerData as Array<{
  name: string;
  value: number | string;
  unit: string;
  status: string;
}>;

const realTime = currentPatient.realTimeMetrics as {
  heartRate: number;
  spo2: number;
  respiratoryRate: number;
  skinTemperature: number;
  stressIndex: number;
};

const bodyTempF = biomarkers.find((b) => b.name === "Body Temperature")?.value || 98.6;
const bodyTempC = (((Number(bodyTempF) - 32) * 5) / 9).toFixed(1);

export const bodyOverviewData = biomarkers.map((marker) => {
  // Convert temperature to Celsius for display
  if (marker.name === "Body Temperature") {
    return {
      label: marker.name,
      value: bodyTempC,
      unit: "°C",
      status: marker.status,
    };
  }
  return {
    label: marker.name,
    value: String(marker.value),
    unit: marker.unit,
    status: marker.status,
  };
});

// Floating labels for the anatomy image overlay
export const bodyOverviewLabels = [
  {
    label: `HR: ${realTime.heartRate} bpm`,
    status: realTime.heartRate <= 80 ? "normal" : "elevated",
    position: { top: "25%", left: "52%" },
  },
  {
    label: `SpO2: ${realTime.spo2}%`,
    status: realTime.spo2 >= 95 ? "normal" : "low",
    position: { top: "38%", left: "10%" },
  },
  {
    label: `BP: ${biomarkers[2]?.value}`,
    status: biomarkers[2]?.status || "normal",
    position: { top: "32%", left: "55%" },
  },
  {
    label: `Glucose: ${biomarkers[0]?.value} ${biomarkers[0]?.unit}`,
    status: biomarkers[0]?.status || "normal",
    position: { top: "55%", left: "48%" },
  },
  {
    label: `Temp: ${bodyTempC}°C`,
    status: biomarkers[4]?.status || "normal",
    position: { top: "12%", left: "40%" },
  },
];

// ==========================================
// Health Insights & Tips Data
// ==========================================
const lifestyleMetrics = dashboard.lifestyleMetrics as Array<{
  metric: string;
  value: string;
  target: string;
  progress: number;
}>;

const geneticInsights = dashboard.geneticInsights as Array<{
  trait: string;
  result: string;
  risk: string;
}>;

const longitudinalEvents = dashboard.longitudinalEvents as Array<{
  date: string;
  event: string;
}>;

interface HealthInsight {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  metric?: string;
  status: "warning" | "success" | "info";
  priority: number;
}

const insights: HealthInsight[] = [];

// Insights from elevated biomarkers
biomarkers.forEach((b) => {
  if (b.status !== "normal") {
    if (b.name === "Total Cholesterol") {
      insights.push({
        id: "bio-cholesterol",
        category: "Nutrition",
        icon: "Heart",
        title: "Cholesterol is elevated",
        description: `At ${b.value} ${b.unit}, your cholesterol is above normal. Consider adding more fiber-rich foods and omega-3 fatty acids to your diet.`,
        metric: `${b.value} ${b.unit}`,
        status: "warning",
        priority: 10,
      });
    } else if (b.name === "Blood Pressure") {
      insights.push({
        id: "bio-bp",
        category: "Cardiovascular",
        icon: "Activity",
        title: "Blood pressure is elevated",
        description: `Your BP reading of ${b.value} ${b.unit} is above optimal. Reduce sodium intake and aim for 30 min of daily cardio.`,
        metric: `${b.value} ${b.unit}`,
        status: "warning",
        priority: 10,
      });
    }
  }
});

// Insights from lifestyle metrics
lifestyleMetrics.forEach((lm) => {
  if (lm.progress < 70) {
    const catMap: Record<string, { category: string; icon: string; tip: string }> = {
      "Average Sleep": {
        category: "Sleep",
        icon: "Moon",
        tip: "Try maintaining a consistent bedtime. Avoid screens 1 hour before sleep for better rest quality.",
      },
      "Daily Steps": {
        category: "Exercise",
        icon: "Footprints",
        tip: "Take short walks after meals. Even 10-minute walks can significantly boost your daily count.",
      },
      "Water Intake": {
        category: "Nutrition",
        icon: "Droplets",
        tip: "Keep a water bottle nearby and set hourly reminders. Adequate hydration improves energy and focus.",
      },
      "Exercise Minutes": {
        category: "Exercise",
        icon: "Dumbbell",
        tip: "Try adding a 20-minute walk or yoga session. Even light activity counts toward your goal.",
      },
    };
    const info = catMap[lm.metric];
    if (info) {
      insights.push({
        id: `lifestyle-${lm.metric}`,
        category: info.category,
        icon: info.icon,
        title: `Improve your ${lm.metric.toLowerCase()}`,
        description: `Currently at ${lm.value} vs your ${lm.target} target. ${info.tip}`,
        metric: `${lm.value} / ${lm.target}`,
        status: "warning",
        priority: 100 - lm.progress,
      });
    }
  } else if (lm.progress >= 85) {
    const iconMap: Record<string, string> = {
      "Average Sleep": "Moon",
      "Daily Steps": "Footprints",
      "Water Intake": "Droplets",
      "Exercise Minutes": "Dumbbell",
    };
    insights.push({
      id: `lifestyle-${lm.metric}`,
      category: lm.metric.includes("Sleep") ? "Sleep" : lm.metric.includes("Water") ? "Nutrition" : "Exercise",
      icon: iconMap[lm.metric] || "TrendingUp",
      title: `Great ${lm.metric.toLowerCase()} progress!`,
      description: `You're at ${lm.value} toward your ${lm.target} goal — keep up the momentum.`,
      metric: `${lm.value} / ${lm.target}`,
      status: "success",
      priority: 80,
    });
  }
});

// Insights from genetic risks
geneticInsights
  .filter((g) => g.risk === "high")
  .forEach((g) => {
    insights.push({
      id: `genetic-${g.trait}`,
      category: "Genetics",
      icon: "Dna",
      title: `Monitor: ${g.trait}`,
      description: `${g.result}. Continue lifestyle modifications and regular screening to manage this risk.`,
      status: "info",
      priority: 30,
    });
  });

// Positive reinforcement from longitudinal events
const hba1cEvent = longitudinalEvents.find((e) =>
  (e.event as string).includes("HbA1c")
);
if (hba1cEvent) {
  insights.push({
    id: "longitudinal-hba1c",
    category: "Metabolic",
    icon: "TrendingUp",
    title: "HbA1c is improving",
    description: `${hba1cEvent.event}. Your lifestyle changes are making a measurable difference.`,
    status: "success",
    priority: 50,
  });
}

export const healthInsightsData = insights
  .sort((a, b) => a.priority - b.priority)
  .slice(0, 6);

// ==========================================
// Meal Plan Data
// ==========================================
const mealDate = Object.keys(dashboard.mealPlan)[0];
const todayMeals = (dashboard.mealPlan as any)[mealDate];

export const mealPlanData = [
  { name: "Breakfast", items: todayMeals.breakfast },
  { name: "Lunch", items: todayMeals.lunch },
  { name: "Dinner", items: todayMeals.dinner },
  { name: "Snacks", items: todayMeals.snacks },
] as Array<{
  name: string;
  items: Array<{ emoji: string; name: string; calories: number }>;
}>;

// ==========================================
// Calories Analysis Data
// ==========================================
export const caloriesAnalysisData = {
  consumed: dashboard.caloriesAnalysis.consumed as number,
  burned: dashboard.caloriesAnalysis.burned as number,
  target: dashboard.caloriesAnalysis.target as number,
  nutrients: [
    {
      name: "Protein",
      value: dashboard.caloriesAnalysis.protein as number,
      color: "bg-orange-400",
    },
    {
      name: "Fat",
      value: dashboard.caloriesAnalysis.fat as number,
      color: "bg-primary",
    },
    {
      name: "Carbs",
      value: dashboard.caloriesAnalysis.carbs as number,
      color: "bg-amber-500",
    },
  ],
};

// ==========================================
// Wearables Data
// ==========================================
export const wearablesData = dashboard.wearables as Array<{
  name: string;
  connected: boolean;
  icon: string;
  color: string;
}>;

// ==========================================
// Biological Data (Sub-tab)
// ==========================================
export const biologicalTabData = {
  biomarkers: dashboard.biomarkerData as Array<{
    name: string;
    value: number | string;
    unit: string;
    status: string;
  }>,
  geneticInsights: dashboard.geneticInsights as Array<{
    trait: string;
    result: string;
    risk: string;
  }>,
  lifestyleMetrics: dashboard.lifestyleMetrics as Array<{
    metric: string;
    value: string;
    target: string;
    progress: number;
  }>,
  longitudinalEvents: dashboard.longitudinalEvents as Array<{
    date: string;
    event: string;
  }>,
};

// ==========================================
// Health Benefits Data
// ==========================================
const avgDailySteps = Math.round(
  weekDays.reduce((sum: number, d: any) => sum + d.steps, 0) / weekDays.length
);

export const healthBenefitsData = [
  {
    id: 1,
    title: "10K Steps Challenge",
    reward: "$25 Credit",
    progress: Math.min(100, Math.round((avgDailySteps / 10000) * 100)),
    daysLeft: 5,
    icon: "🚶",
  },
  {
    id: 2,
    title: "Sleep 8 Hours",
    reward: "15% Discount",
    progress: Math.min(
      100,
      Math.round((todayData.sleepHours / 8) * 100)
    ),
    daysLeft: 10,
    icon: "😴",
  },
  {
    id: 3,
    title: "Weekly Exercise Goal",
    reward: "$50 Credit",
    progress: Math.min(100, Math.round((totalWorkoutMin / 315) * 100)),
    daysLeft: 15,
    icon: "🏋️",
  },
];

// ==========================================
// Doctor: Patient List Data
// ==========================================
const updateTimes = [
  "2 hours ago",
  "30 min ago",
  "1 hour ago",
  "5 min ago",
  "1.5 hours ago",
];

export const doctorPatientListData = allPatients.map(
  (patient: any, index: number) => {
    const score = patient.healthScores.overall as number;
    let status: "stable" | "at-risk" | "critical";
    if (score >= 75) status = "stable";
    else if (score >= 50) status = "at-risk";
    else status = "critical";

    return {
      id: patient.id as string,
      name: `${patient.demographics.firstName} ${(patient.demographics.lastName as string).charAt(0)}.`,
      status,
      lastUpdate: updateTimes[index] || "1 hour ago",
      riskScore: 100 - score,
    };
  }
);

// ==========================================
// Doctor: Treatment Simulator Data
// ==========================================
const simPatient = allPatients[3]; // PT-004: Sarah Thompson
const simBiomarkers = simPatient.dashboard.biomarkerData as any[];
const simMeds = (simPatient.medicalHistory?.medications || []) as any[];

export const treatmentSimulatorData = {
  biomarkers: [
    {
      name: "Blood Pressure",
      value: String(simBiomarkers[2].value),
      unit: "mmHg",
      status: "elevated",
    },
    {
      name: "Heart Rate",
      value: String(simBiomarkers[3].value),
      unit: "bpm",
      status: "normal",
    },
    {
      name: "Glucose",
      value: String(simBiomarkers[0].value),
      unit: "mg/dL",
      status: "elevated",
    },
    {
      name: "Cholesterol",
      value: String(simBiomarkers[1].value),
      unit: "mg/dL",
      status: "high",
    },
  ],
  drugInteractions: [
    {
      drug1: simMeds[0]?.name || "Metformin",
      drug2: simMeds[3]?.name || "Lisinopril",
      severity: "low" as const,
      note: "Monitor blood glucose - both affect metabolic pathways",
    },
    {
      drug1: simMeds[2]?.name || "Amlodipine",
      drug2: simMeds[3]?.name || "Lisinopril",
      severity: "moderate" as const,
      note: "Additive hypotensive effect - monitor BP closely",
    },
  ],
};

// ==========================================
// Health Profile for AI Meal Suggestions
// ==========================================
export const healthProfileForAI = {
  glucose: Number(biomarkers[0]?.value) || 98,
  cholesterol: Number(biomarkers[1]?.value) || 215,
  bloodPressure: String(biomarkers[2]?.value || "128/84"),
  heartRate: Number(biomarkers[3]?.value) || 72,
  age: profileCardData.age,
  weight: profileCardData.weight,
  geneticInsights: geneticInsights
    .filter((g) => g.risk !== "low")
    .map((g) => `${g.trait}: ${g.result}`),
  dietaryNeeds: [
    geneticInsights.find((g) => g.trait === "Lactose Tolerance")
      ? "Dairy-free alternatives preferred"
      : "",
    biomarkers.find(
      (b) => b.name === "Total Cholesterol" && b.status !== "normal"
    )
      ? "Heart-healthy, low saturated fat"
      : "",
    biomarkers.find(
      (b) => b.name === "Blood Pressure" && b.status !== "normal"
    )
      ? "Low sodium"
      : "",
    geneticInsights.find(
      (g) => g.trait === "Type 2 Diabetes Risk" && g.risk === "high"
    )
      ? "Low glycemic index"
      : "",
  ].filter(Boolean),
};

// ==========================================
// Insurer Dashboard Data (Aggregate)
// ==========================================
const avgHealthScore = Math.round(
  allPatients.reduce(
    (sum: number, p: any) => sum + (p.healthScores.overall as number),
    0
  ) / allPatients.length
);

export const insurerDashboardData = {
  kpis: [
    {
      title: "Total Enrollments",
      value: "12,847",
      change: "+15%",
      positive: true,
    },
    {
      title: "Active Programs",
      value: "24",
      change: "+3",
      positive: true,
    },
    {
      title: "Rewards Distributed",
      value: "$45.2K",
      change: "+22%",
      positive: true,
    },
    {
      title: "Avg. Health Score",
      value: `${avgHealthScore}%`,
      change: "+5%",
      positive: true,
    },
  ],
  enrollmentData: [
    { month: "Sep", value: 1200 },
    { month: "Oct", value: 1800 },
    { month: "Nov", value: 2400 },
    { month: "Dec", value: 2100 },
    { month: "Jan", value: 2800 },
    { month: "Feb", value: 3500 },
  ],
  categoryData: [
    { name: "Fitness", value: 35, color: "hsl(var(--primary))" },
    { name: "Nutrition", value: 28, color: "hsl(var(--success))" },
    { name: "Sleep", value: 22, color: "hsl(var(--warning))" },
    { name: "Mental", value: 15, color: "hsl(var(--chart-purple))" },
  ],
};
