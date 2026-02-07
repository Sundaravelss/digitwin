import { NextResponse } from "next/server";

export const runtime = "edge";

type PromoRequest = {
  action: "list" | "enroll" | "check-progress" | "claim-reward";
  userId?: string;
  promoId?: string;
};

type HealthPromo = {
  id: string;
  name: string;
  description: string;
  category: "fitness" | "nutrition" | "prevention" | "wellness";
  requirements: {
    metric: string;
    target: number;
    unit: string;
    duration: string;
  };
  reward: {
    type: "discount" | "cashback" | "credits" | "gift";
    value: number;
    description: string;
  };
  startDate: string;
  endDate: string;
  enrolled: boolean;
  progress?: number; // 0-100
  status: "available" | "enrolled" | "completed" | "expired";
};

type PromoResponse = {
  success: boolean;
  promos?: HealthPromo[];
  promo?: HealthPromo;
  message?: string;
  totalSavings?: number;
};

// Demo promos database
const demoPromos: HealthPromo[] = [
  {
    id: "steps-challenge-2026",
    name: "10K Steps Challenge",
    description: "Walk 10,000 steps daily for 30 consecutive days and earn a premium discount!",
    category: "fitness",
    requirements: {
      metric: "daily_steps",
      target: 10000,
      unit: "steps",
      duration: "30 days",
    },
    reward: {
      type: "discount",
      value: 15,
      description: "15% off your next quarterly premium",
    },
    startDate: "2026-02-01",
    endDate: "2026-03-31",
    enrolled: false,
    status: "available",
  },
  {
    id: "sleep-wellness-2026",
    name: "Sleep Well Program",
    description: "Maintain 7+ hours of sleep for 21 nights. Better sleep = healthier you!",
    category: "wellness",
    requirements: {
      metric: "sleep_hours",
      target: 7,
      unit: "hours/night",
      duration: "21 days",
    },
    reward: {
      type: "credits",
      value: 50,
      description: "$50 wellness credits for gym, spa, or health products",
    },
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    enrolled: false,
    status: "available",
  },
  {
    id: "heart-health-2026",
    name: "Heart Health Tracker",
    description: "Keep your resting heart rate under 75 BPM average for 60 days through exercise.",
    category: "fitness",
    requirements: {
      metric: "resting_heart_rate",
      target: 75,
      unit: "bpm (avg)",
      duration: "60 days",
    },
    reward: {
      type: "cashback",
      value: 100,
      description: "$100 cashback on your annual premium",
    },
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    enrolled: false,
    status: "available",
  },
  {
    id: "preventive-care-2026",
    name: "Annual Checkup Bonus",
    description: "Complete your annual preventive health screening and earn rewards.",
    category: "prevention",
    requirements: {
      metric: "checkup_completed",
      target: 1,
      unit: "checkup",
      duration: "by Dec 31, 2026",
    },
    reward: {
      type: "discount",
      value: 10,
      description: "10% discount on next year's premium",
    },
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    enrolled: false,
    status: "available",
  },
  {
    id: "nutrition-tracker-2026",
    name: "Mindful Eating Challenge",
    description: "Log your meals in DigiTwin for 14 days and maintain balanced nutrition.",
    category: "nutrition",
    requirements: {
      metric: "meals_logged",
      target: 42,
      unit: "meals",
      duration: "14 days",
    },
    reward: {
      type: "gift",
      value: 25,
      description: "$25 gift card to healthy meal delivery service",
    },
    startDate: "2026-02-01",
    endDate: "2026-05-31",
    enrolled: false,
    status: "available",
  },
  {
    id: "active-calories-2026",
    name: "Burn 500 Daily",
    description: "Burn at least 500 active calories every day for 2 weeks.",
    category: "fitness",
    requirements: {
      metric: "active_calories",
      target: 500,
      unit: "kcal/day",
      duration: "14 days",
    },
    reward: {
      type: "credits",
      value: 30,
      description: "$30 fitness equipment store credit",
    },
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    enrolled: false,
    status: "available",
  },
];

// Simulated user enrollment state (in real app, this would be in a database)
const userEnrollments: Map<string, Set<string>> = new Map();
const userProgress: Map<string, Map<string, number>> = new Map();

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PromoRequest;
    const { action, userId = "demo-user", promoId } = body;

    // Initialize user state if not exists
    if (!userEnrollments.has(userId)) {
      userEnrollments.set(userId, new Set());
      userProgress.set(userId, new Map());
    }

    const enrolledPromos = userEnrollments.get(userId)!;
    const progressMap = userProgress.get(userId)!;

    switch (action) {
      case "list": {
        const promos = demoPromos.map((p) => ({
          ...p,
          enrolled: enrolledPromos.has(p.id),
          progress: progressMap.get(p.id) ?? 0,
          status: enrolledPromos.has(p.id)
            ? (progressMap.get(p.id) ?? 0) >= 100
              ? "completed" as const
              : "enrolled" as const
            : p.status,
        }));

        const totalSavings = promos
          .filter((p) => p.status === "completed")
          .reduce((sum, p) => sum + p.reward.value, 0);

        return NextResponse.json<PromoResponse>({
          success: true,
          promos,
          totalSavings,
        });
      }

      case "enroll": {
        if (!promoId) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Promo ID is required",
          });
        }

        const promo = demoPromos.find((p) => p.id === promoId);
        if (!promo) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Promo not found",
          });
        }

        enrolledPromos.add(promoId);
        progressMap.set(promoId, 0);

        return NextResponse.json<PromoResponse>({
          success: true,
          promo: {
            ...promo,
            enrolled: true,
            progress: 0,
            status: "enrolled",
          },
          message: `Successfully enrolled in ${promo.name}! Start tracking your progress.`,
        });
      }

      case "check-progress": {
        if (!promoId) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Promo ID is required",
          });
        }

        const promo = demoPromos.find((p) => p.id === promoId);
        if (!promo) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Promo not found",
          });
        }

        if (!enrolledPromos.has(promoId)) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Not enrolled in this promo",
          });
        }

        // Simulate progress increase for demo
        const currentProgress = progressMap.get(promoId) ?? 0;
        const newProgress = Math.min(100, currentProgress + Math.floor(Math.random() * 15) + 5);
        progressMap.set(promoId, newProgress);

        return NextResponse.json<PromoResponse>({
          success: true,
          promo: {
            ...promo,
            enrolled: true,
            progress: newProgress,
            status: newProgress >= 100 ? "completed" : "enrolled",
          },
          message: newProgress >= 100
            ? "Congratulations! You've completed this challenge! Claim your reward."
            : `Progress updated: ${newProgress}% complete`,
        });
      }

      case "claim-reward": {
        if (!promoId) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Promo ID is required",
          });
        }

        const promo = demoPromos.find((p) => p.id === promoId);
        if (!promo) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Promo not found",
          });
        }

        const progress = progressMap.get(promoId) ?? 0;
        if (progress < 100) {
          return NextResponse.json<PromoResponse>({
            success: false,
            message: "Challenge not yet completed",
          });
        }

        return NextResponse.json<PromoResponse>({
          success: true,
          promo: {
            ...promo,
            enrolled: true,
            progress: 100,
            status: "completed",
          },
          message: `Reward claimed! ${promo.reward.description}. Check your account for details.`,
        });
      }

      default:
        return NextResponse.json<PromoResponse>({
          success: false,
          message: "Invalid action",
        });
    }
  } catch (e) {
    console.error("Promo error:", e);
    return new NextResponse(
      e instanceof Error ? e.message : "Unknown error",
      { status: 500 },
    );
  }
}
