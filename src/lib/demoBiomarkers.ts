export type BiomarkerDay = {
  dateISO: string;
  steps: number;
  activeCalories: number;
  sleepHours: number;
  restingHeartRate: number;
  hrvMs: number;
  systolic: number;
  diastolic: number;
  glucoseMgDl?: number;
};

export type DemoPerson = {
  id: string;
  displayName: string;
  anonymizedLabel: string;
  status: "Stable" | "At Risk" | "Critical";
  days: BiomarkerDay[];
};

function d(daysAgo: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString().slice(0, 10);
}

export const demoPeople: DemoPerson[] = [
  {
    id: "aura-user",
    displayName: "You (Demo)",
    anonymizedLabel: "You",
    status: "Stable",
    days: [
      {
        dateISO: d(0),
        steps: 9800,
        activeCalories: 560,
        sleepHours: 6.6,
        restingHeartRate: 63,
        hrvMs: 58,
        systolic: 128,
        diastolic: 82,
        glucoseMgDl: 96,
      },
      {
        dateISO: d(1),
        steps: 9100,
        activeCalories: 520,
        sleepHours: 6.2,
        restingHeartRate: 65,
        hrvMs: 55,
        systolic: 130,
        diastolic: 84,
        glucoseMgDl: 98,
      },
      {
        dateISO: d(2),
        steps: 10400,
        activeCalories: 600,
        sleepHours: 6.9,
        restingHeartRate: 62,
        hrvMs: 60,
        systolic: 127,
        diastolic: 81,
        glucoseMgDl: 95,
      },
      {
        dateISO: d(3),
        steps: 8800,
        activeCalories: 470,
        sleepHours: 6.1,
        restingHeartRate: 66,
        hrvMs: 53,
        systolic: 132,
        diastolic: 85,
        glucoseMgDl: 99,
      },
      {
        dateISO: d(4),
        steps: 9600,
        activeCalories: 540,
        sleepHours: 6.4,
        restingHeartRate: 64,
        hrvMs: 57,
        systolic: 129,
        diastolic: 83,
        glucoseMgDl: 97,
      },
    ],
  },
  {
    id: "alex",
    displayName: "Alex M.",
    anonymizedLabel: "Alex M.",
    status: "At Risk",
    days: [
      {
        dateISO: d(0),
        steps: 8600,
        activeCalories: 540,
        sleepHours: 5.1,
        restingHeartRate: 74,
        hrvMs: 42,
        systolic: 141,
        diastolic: 92,
        glucoseMgDl: 104,
      },
      {
        dateISO: d(1),
        steps: 6400,
        activeCalories: 410,
        sleepHours: 4.6,
        restingHeartRate: 76,
        hrvMs: 39,
        systolic: 144,
        diastolic: 94,
        glucoseMgDl: 109,
      },
      {
        dateISO: d(2),
        steps: 9200,
        activeCalories: 610,
        sleepHours: 5.5,
        restingHeartRate: 72,
        hrvMs: 45,
        systolic: 138,
        diastolic: 90,
        glucoseMgDl: 102,
      },
      {
        dateISO: d(3),
        steps: 5100,
        activeCalories: 320,
        sleepHours: 4.2,
        restingHeartRate: 78,
        hrvMs: 36,
        systolic: 146,
        diastolic: 96,
        glucoseMgDl: 112,
      },
      {
        dateISO: d(4),
        steps: 7800,
        activeCalories: 500,
        sleepHours: 5.0,
        restingHeartRate: 75,
        hrvMs: 40,
        systolic: 142,
        diastolic: 93,
        glucoseMgDl: 107,
      },
    ],
  },
  {
    id: "sam",
    displayName: "Sam R.",
    anonymizedLabel: "Sam R.",
    status: "Stable",
    days: [
      {
        dateISO: d(0),
        steps: 11300,
        activeCalories: 690,
        sleepHours: 7.4,
        restingHeartRate: 58,
        hrvMs: 71,
        systolic: 122,
        diastolic: 78,
        glucoseMgDl: 92,
      },
      {
        dateISO: d(1),
        steps: 10100,
        activeCalories: 620,
        sleepHours: 7.1,
        restingHeartRate: 59,
        hrvMs: 68,
        systolic: 121,
        diastolic: 77,
        glucoseMgDl: 94,
      },
      {
        dateISO: d(2),
        steps: 9800,
        activeCalories: 580,
        sleepHours: 6.8,
        restingHeartRate: 60,
        hrvMs: 66,
        systolic: 123,
        diastolic: 79,
        glucoseMgDl: 93,
      },
      {
        dateISO: d(3),
        steps: 12000,
        activeCalories: 740,
        sleepHours: 7.6,
        restingHeartRate: 57,
        hrvMs: 73,
        systolic: 120,
        diastolic: 76,
        glucoseMgDl: 90,
      },
      {
        dateISO: d(4),
        steps: 8900,
        activeCalories: 520,
        sleepHours: 7.0,
        restingHeartRate: 61,
        hrvMs: 64,
        systolic: 124,
        diastolic: 80,
        glucoseMgDl: 95,
      },
    ],
  },
  {
    id: "taylor",
    displayName: "Taylor K.",
    anonymizedLabel: "Taylor K.",
    status: "Critical",
    days: [
      {
        dateISO: d(0),
        steps: 2400,
        activeCalories: 160,
        sleepHours: 3.9,
        restingHeartRate: 92,
        hrvMs: 22,
        systolic: 162,
        diastolic: 102,
        glucoseMgDl: 156,
      },
      {
        dateISO: d(1),
        steps: 3100,
        activeCalories: 190,
        sleepHours: 4.1,
        restingHeartRate: 89,
        hrvMs: 24,
        systolic: 158,
        diastolic: 100,
        glucoseMgDl: 149,
      },
      {
        dateISO: d(2),
        steps: 2700,
        activeCalories: 170,
        sleepHours: 4.0,
        restingHeartRate: 95,
        hrvMs: 20,
        systolic: 165,
        diastolic: 104,
        glucoseMgDl: 161,
      },
      {
        dateISO: d(3),
        steps: 2200,
        activeCalories: 150,
        sleepHours: 3.6,
        restingHeartRate: 97,
        hrvMs: 19,
        systolic: 168,
        diastolic: 106,
        glucoseMgDl: 164,
      },
      {
        dateISO: d(4),
        steps: 2600,
        activeCalories: 165,
        sleepHours: 3.8,
        restingHeartRate: 94,
        hrvMs: 21,
        systolic: 163,
        diastolic: 103,
        glucoseMgDl: 158,
      },
    ],
  },
];

export function latestDay(person: DemoPerson): BiomarkerDay {
  return person.days[0];
}

export function computeIntegrityScore(day: BiomarkerDay): number {
  // Simple, demo-friendly scoring. Clamp 0..100.
  const sleepScore = Math.max(0, Math.min(30, (day.sleepHours / 8) * 30));
  const activityScore = Math.max(0, Math.min(25, (day.activeCalories / 600) * 25));
  const stepsScore = Math.max(0, Math.min(15, (day.steps / 10000) * 15));
  const rhrScore = Math.max(0, Math.min(15, ((90 - day.restingHeartRate) / 40) * 15));
  const hrvScore = Math.max(0, Math.min(15, (day.hrvMs / 70) * 15));

  const score = sleepScore + activityScore + stepsScore + rhrScore + hrvScore;
  return Math.round(Math.max(0, Math.min(100, score)));
}

export function inflammationDeltaPercent(args: {
  calories: number;
  sleepHours: number;
  smoker: boolean;
}): number {
  // Purely illustrative metric to power the "Prediction: +12%" demo moment.
  const calorieFactor = Math.min(18, Math.max(0, (args.calories - 400) / 80));
  const sleepPenalty = Math.min(12, Math.max(0, (7 - args.sleepHours) * 3));
  const smokingPenalty = args.smoker ? 8 : 0;
  return Math.round(Math.max(0, Math.min(35, calorieFactor + sleepPenalty + smokingPenalty)));
}
