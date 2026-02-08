import { Users, AlertTriangle, CheckCircle, AlertCircle, ChevronRight, Activity, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { doctorPatientListData } from "@/data/patientData";

const statusConfig = {
  stable: { label: "Stable", color: "bg-success/10 text-success", icon: CheckCircle },
  "at-risk": { label: "At Risk", color: "bg-warning/10 text-warning", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

const stableCount = doctorPatientListData.filter(p => p.status === "stable").length;
const atRiskCount = doctorPatientListData.filter(p => p.status === "at-risk").length;
const criticalCount = doctorPatientListData.filter(p => p.status === "critical").length;

const DoctorPatientList = () => {
  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">My Patients Status</h3>
            <p className="text-xs text-muted-foreground">Anonymized patient overview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", config.color.split(' ')[0].replace('/10', ''))} />
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search patients..." 
          className="pl-10 h-10 rounded-xl bg-secondary/50 border-0"
        />
      </div>

      <div className="flex items-center gap-6 mb-4 p-3 rounded-xl bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-success" />
          <span className="text-sm font-medium text-foreground">{stableCount} Stable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-warning" />
          <span className="text-sm font-medium text-foreground">{atRiskCount} At Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-foreground">{criticalCount} Critical</span>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {doctorPatientListData.map((patient) => {
          const config = statusConfig[patient.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          
          return (
            <div
              key={patient.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]",
                patient.status === "critical"
                  ? "bg-destructive/5 border-l-4 border-destructive/60 hover:bg-destructive/8"
                  : patient.status === "at-risk"
                  ? "bg-warning/5 border-l-4 border-warning/60 hover:bg-warning/8"
                  : "bg-secondary/30 border-l-4 border-success/40 hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{patient.name}</span>
                    <span className="text-xs text-muted-foreground">({patient.id})</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Updated {patient.lastUpdate}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium", config.color)}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {config.label}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorPatientList;
