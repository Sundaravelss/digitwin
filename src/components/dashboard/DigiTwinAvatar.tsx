import { Activity, Heart, Footprints, Moon, TrendingUp, Zap } from "lucide-react";
import Avatar3D from "./Avatar3D";
import { digiTwinData } from "@/data/patientData";
import { useUserAvatar } from "@/context/UserAvatarContext";

const iconMap: Record<string, typeof Heart> = {
  "Steps": Footprints,
  "Sleep": Moon,
  "Heart Rate": Heart,
  "HRV": Zap,
};

const DigiTwinAvatar = () => {
  const integrityScore = digiTwinData.integrityScore;
  const { generatedAvatarUrl, isGenerating } = useUserAvatar();

  const biomarkers = digiTwinData.biomarkers.map((b) => ({
    ...b,
    icon: iconMap[b.label] || Heart,
  }));

  return (
    <div className="health-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-header">My DigiTwin</h3>
          <p className="text-sm text-muted-foreground">Biological Integrity Agent</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Live Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-10">
        {/* Avatar with Integrity Score Ring */}
        <div className="relative flex flex-col items-center">
          {/* Score Ring */}
          <div className="relative w-52 h-52">
            {/* Glow backdrop */}
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-glow-pulse-primary" />
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#integrityGradient)"
                strokeWidth="8"
                strokeDasharray={`${integrityScore * 2.83} ${100 * 2.83}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="integrityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--success))" />
                </linearGradient>
              </defs>
            </svg>

            {/* 3D Avatar inside ring */}
            <div className="absolute inset-4 rounded-full overflow-hidden bg-gradient-to-b from-[#070b1e] to-[#0d1330]">
              <Avatar3D generatedAvatarUrl={generatedAvatarUrl} isGenerating={isGenerating} />
            </div>
          </div>

          {/* Integrity Score */}
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-foreground">{integrityScore}%</div>
            <div className="text-sm text-muted-foreground">Integrity Score</div>
          </div>
        </div>

        {/* Biomarker Grid */}
        <div className="grid grid-cols-2 gap-4">
          {biomarkers.map((marker, index) => {
            const Icon = marker.icon;
            return (
              <div
                key={marker.label}
                className="p-5 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 hover:from-secondary/80 hover:to-secondary/50 hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{marker.label}</span>
                </div>
                <div className={`text-xl font-bold ${marker.positive ? 'text-foreground' : 'text-red-500 dark:text-red-400'}`}>{marker.value}</div>
                <div className={`text-sm flex items-center gap-1 ${marker.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  <TrendingUp className={`w-3 h-3 ${!marker.positive && 'rotate-180'}`} />
                  {marker.change}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DigiTwinAvatar;
