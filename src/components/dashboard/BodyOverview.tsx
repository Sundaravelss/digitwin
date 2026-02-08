import { useState } from "react";
import { Thermometer, Heart, Activity, Droplets, Wind, CheckCircle, AlertTriangle } from "lucide-react";
import bodyAnatomy from "@/assets/body-anatomy.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { bodyOverviewData, bodyOverviewLabels } from "@/data/patientData";

const iconMap: Record<string, typeof Heart> = {
  "Blood Glucose": Droplets,
  "Total Cholesterol": Heart,
  "Blood Pressure": Activity,
  "Heart Rate": Heart,
  "Body Temperature": Thermometer,
  "Oxygen Saturation": Wind,
};

const healthMetrics = bodyOverviewData.map((metric) => ({
  ...metric,
  icon: iconMap[metric.label] || Heart,
}));

const BodyOverview = () => {
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Body Overview</h3>
          <span className="flex items-center gap-1 text-xs text-success">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr] gap-8">
        {/* Body Anatomy Image */}
        <div className="relative">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
            <Image
              src={bodyAnatomy}
              alt="Body anatomy"
              className="w-full h-full object-contain scale-110"
              fill
              sizes="220px"
            />

            {/* Scan line effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="w-full h-px bg-primary/30 absolute animate-scan-line" />
            </div>

            {/* Floating labels with real biomarker data */}
            {bodyOverviewLabels.map((label) => (
              <div
                key={label.label}
                className={cn(
                  "absolute px-2 py-1 rounded-full text-white text-[10px] font-medium flex items-center gap-1 shadow-lg animate-pulse-slow cursor-pointer hover:scale-105 transition-transform whitespace-nowrap",
                  label.status === "normal"
                    ? "bg-emerald-500/90"
                    : "bg-amber-500/90"
                )}
                style={{ top: label.position.top, left: label.position.left }}
              >
                {label.label}
                {label.status === "normal" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Health Metrics Grid — 6 cards */}
        <div className="grid grid-cols-3 gap-3">
          {healthMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={cn(
                  "p-4 rounded-xl bg-secondary/50 transition-all duration-300 cursor-pointer group",
                  hoveredMetric === index
                    ? "bg-secondary shadow-[var(--shadow-sm)] -translate-y-0.5 ring-1 ring-primary/20"
                    : "hover:bg-secondary hover:-translate-y-0.5"
                )}
                onMouseEnter={() => setHoveredMetric(index)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-foreground">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">{metric.unit}</span>
                </div>
                <div className="mt-2">
                  <span className={cn(
                    "inline-block px-2 py-0.5 text-[10px] font-medium rounded-full capitalize",
                    metric.status === "normal"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  )}>
                    {metric.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BodyOverview;
