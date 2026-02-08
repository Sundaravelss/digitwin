import { useState } from "react";
import { activitySummaryData } from "@/data/patientData";

const activities = activitySummaryData.activities;

const ActivitySummary = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const totalValue = activitySummaryData.totalPercentage;

  // SVG parameters for the rings
  const size = 180;
  const center = size / 2;
  const strokeWidth = 12;
  const gap = 14;

  const rings = activities.map((activity, index) => {
    const radius = center - strokeWidth / 2 - index * gap;
    const circumference = 2 * Math.PI * radius;
    const progress = (activity.value / 100) * circumference;
    
    return {
      ...activity,
      radius,
      circumference,
      progress,
      index,
    };
  });

  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Activity Summary</h3>
        <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="4" cy="10" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="16" cy="10" r="2" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Multi-ring progress */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {rings.map((ring) => (
              <g key={ring.name}>
                {/* Background ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={strokeWidth}
                />
                {/* Progress ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${ring.progress} ${ring.circumference}`}
                  strokeLinecap="round"
                  className="transition-all duration-500 cursor-pointer"
                  style={{
                    filter: hoveredIndex === ring.index ? 'drop-shadow(0 0 6px currentColor)' : 'none',
                    transform: hoveredIndex === ring.index ? 'scale(1.04)' : 'scale(1)',
                    transformOrigin: 'center',
                  }}
                  onMouseEnter={() => setHoveredIndex(ring.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}
          </svg>
          
          {/* Center percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground tabular-nums">{totalValue}%</span>
            <span className="text-xs text-muted-foreground mt-1">Overall</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {activities.map((activity, index) => (
            <div 
              key={activity.name}
              className="flex items-center gap-2 cursor-pointer transition-opacity"
              style={{ opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activity.color }}
              />
              <span className="text-sm text-muted-foreground">{activity.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
