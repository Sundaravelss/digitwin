"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { wearablesData } from "@/data/patientData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const WearablesCard = () => {
  const [devices, setDevices] = useState(wearablesData);
  const [manageOpen, setManageOpen] = useState(false);

  const toggleDevice = (deviceName: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.name === deviceName ? { ...d, connected: !d.connected } : d
      )
    );
    const device = devices.find((d) => d.name === deviceName);
    if (device) {
      if (device.connected) {
        toast.info(`Disconnected ${deviceName}`);
      } else {
        toast.success(`Connected ${deviceName}`);
      }
    }
  };

  return (
    <>
      <div className="health-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Wearables</h3>
          <button
            onClick={() => setManageOpen(true)}
            className="text-sm text-primary hover:underline"
          >
            Manage
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {devices.map((device) => (
            <div
              key={device.name}
              className={cn(
                "relative p-3 rounded-xl transition-all cursor-pointer",
                device.connected
                  ? "bg-success/10 border border-success/20 hover:-translate-y-0.5 hover:bg-success/15 hover:shadow-[var(--shadow-glow-success)]"
                  : "bg-secondary/50 hover:bg-secondary hover:shadow-[var(--shadow-sm)]"
              )}
              onClick={() => toggleDevice(device.name)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xl",
                    device.color
                  )}
                >
                  {device.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {device.name}
                  </div>
                  <div
                    className={cn(
                      "text-xs",
                      device.connected
                        ? "text-success"
                        : "text-muted-foreground"
                    )}
                  >
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

      {/* Manage Dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Manage Wearables</DialogTitle>
            <DialogDescription>
              Toggle your connected devices on or off.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {devices.map((device) => (
              <div
                key={device.name}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-xl",
                      device.color
                    )}
                  >
                    {device.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{device.name}</p>
                    <p
                      className={cn(
                        "text-xs",
                        device.connected
                          ? "text-success"
                          : "text-muted-foreground"
                      )}
                    >
                      {device.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={device.connected}
                  onCheckedChange={() => toggleDevice(device.name)}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WearablesCard;
