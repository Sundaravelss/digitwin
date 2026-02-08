import {
  Moon, Footprints, Droplets, Dumbbell, Heart, Activity,
  TrendingUp, Dna, Lightbulb, AlertTriangle, CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { healthInsightsData } from "@/data/patientData";

const iconMap: Record<string, typeof Heart> = {
  Moon,
  Footprints,
  Droplets,
  Dumbbell,
  Heart,
  Activity,
  TrendingUp,
  Dna,
  Lightbulb,
};

const categoryColors: Record<string, string> = {
  Sleep: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  Exercise: "bg-green-500/15 text-green-600 dark:text-green-400",
  Nutrition: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  Cardiovascular: "bg-red-500/15 text-red-600 dark:text-red-400",
  Genetics: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  Metabolic: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
};

const statusConfig = {
  warning: {
    border: "border-l-amber-500",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  success: {
    border: "border-l-emerald-500",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
  },
  info: {
    border: "border-l-blue-500",
    icon: Lightbulb,
    iconColor: "text-blue-500",
  },
};

const DailyActivities = () => {
  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Health Insights & Tips
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Based on your health data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {healthInsightsData.map((insight, index) => {
          const Icon = iconMap[insight.icon] || Lightbulb;
          const config = statusConfig[insight.status];
          const StatusIcon = config.icon;
          const catColor =
            categoryColors[insight.category] ||
            "bg-gray-500/15 text-gray-600";

          return (
            <div
              key={insight.id}
              className={cn(
                "p-4 rounded-xl bg-secondary/50 border-l-4 transition-all duration-300 cursor-pointer hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]",
                config.border
              )}
            >
              {/* Header: Icon + Category badge + Status icon */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      catColor
                    )}
                  >
                    {insight.category}
                  </span>
                </div>
                <StatusIcon className={cn("w-4 h-4", config.iconColor)} />
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-foreground mb-1">
                {insight.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {insight.description}
              </p>

              {/* Optional metric */}
              {insight.metric && (
                <div className="text-xs font-medium text-foreground/70 bg-background/50 px-2 py-1 rounded-md inline-block">
                  {insight.metric}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyActivities;
