import { Watch, Smartphone, Activity, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { wearablesData } from "@/data/patientData";

const WearablesCard = () => {
  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Wearables</h3>
        <button className="text-sm text-primary hover:underline">Manage</button>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {wearablesData.map((device) => (
          <div 
            key={device.name}
            className={cn(
              "relative p-3 rounded-xl transition-all cursor-pointer",
              device.connected ? "bg-success/10 border border-success/20 hover:-translate-y-0.5 hover:bg-success/15 hover:shadow-[var(--shadow-glow-success)]" : "bg-secondary/50 hover:bg-secondary hover:shadow-[var(--shadow-sm)]"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-xl",
                device.color
              )}>
                {device.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{device.name}</div>
                <div className={cn(
                  "text-xs",
                  device.connected ? "text-success" : "text-muted-foreground"
                )}>
                  {device.connected ? "Connected" : "Not connected"}
                </div>
              </div>
            </div>
            
            {device.connected && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center relative">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="absolute inset-0 rounded-full bg-success/40 animate-ping" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WearablesCard;
