import { Home, Users, Building2, Activity, Settings, LogOut, BrainCircuit, Gift, Dna, ClipboardList, FlaskConical, BarChart3, FileSearch, ShieldCheck, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const DigiTwinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Orbital rings */}
    <ellipse cx="20" cy="20" rx="19" ry="8" stroke="currentColor" strokeWidth="0.8" opacity="0.35" transform="rotate(-30 20 20)" />
    <ellipse cx="20" cy="20" rx="19" ry="8" stroke="currentColor" strokeWidth="0.8" opacity="0.35" transform="rotate(30 20 20)" />
    <ellipse cx="20" cy="20" rx="19" ry="8" stroke="currentColor" strokeWidth="0.8" opacity="0.35" transform="rotate(90 20 20)" />
    {/* Orbital glow nodes */}
    <circle cx="3.5" cy="14" r="1.4" fill="currentColor" opacity="0.8" />
    <circle cx="36.5" cy="14" r="1.4" fill="currentColor" opacity="0.8" />
    <circle cx="20" cy="1.2" r="1.2" fill="currentColor" opacity="0.7" />
    <circle cx="20" cy="38.8" r="1.2" fill="currentColor" opacity="0.7" />
    {/* Human figure — bold silhouette, arms spread */}
    {/* Head */}
    <circle cx="20" cy="7" r="3" fill="currentColor" opacity="0.9" />
    {/* Neck */}
    <path d="M18.5 10 L21.5 10 L21.5 12 L18.5 12Z" fill="currentColor" opacity="0.8" />
    {/* Torso — tapered */}
    <path d="M15 12.5 L25 12.5 L23 25 L17 25Z" fill="currentColor" opacity="0.7" />
    {/* Arms — spread outward */}
    <path d="M15 13 L9 17.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M25 13 L31 17.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M9 17.5 L5.5 22.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M31 17.5 L34.5 22.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {/* Legs */}
    <path d="M17.5 25 L15 36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M22.5 25 L25 36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    {/* Core glow */}
    <circle cx="20" cy="18" r="3.5" fill="currentColor" opacity="0.12" />
    <circle cx="20" cy="18" r="2" fill="currentColor" opacity="0.35" />
    <circle cx="20" cy="18" r="1" fill="currentColor" opacity="1" />
  </svg>
);
type UserRole = "patient" | "doctor" | "insurer";
type PatientTab = "home" | "companion" | "benefits" | "biodata";
type DoctorTab = "patients" | "simulator" | "intake";
type InsurerTab = "promos" | "decoder" | "verify";
interface SidebarProps {
  activeRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
}
const patientTabs = [{
  id: "home",
  label: "Home",
  icon: Home
}, {
  id: "companion",
  label: "Health Companion",
  icon: BrainCircuit
}, {
  id: "benefits",
  label: "Health Benefits",
  icon: Gift
}, {
  id: "biodata",
  label: "Biological Data",
  icon: Dna
}];
const doctorTabs = [{
  id: "patients",
  label: "Patient List",
  icon: ClipboardList
}, {
  id: "simulator",
  label: "Treatment Simulator",
  icon: FlaskConical
}, {
  id: "intake",
  label: "Intake Analyzer",
  icon: Stethoscope
}];
const insurerTabs = [{
  id: "promos",
  label: "Promos Dashboard",
  icon: BarChart3
}, {
  id: "decoder",
  label: "Policy Decoder",
  icon: FileSearch
}, {
  id: "verify",
  label: "Zero-Knowledge Verify",
  icon: ShieldCheck
}];
const Sidebar = ({
  activeRole,
  activeTab,
  onTabChange,
  onSettingsClick
}: SidebarProps) => {
  const tabs = activeRole === "patient" ? patientTabs : activeRole === "doctor" ? doctorTabs : insurerTabs;
  return <aside className="relative z-50 flex flex-col items-center py-6 px-3 bg-gradient-to-b from-primary to-blue-600 rounded-3xl w-20 sticky top-6 h-[calc(100vh-64px)]">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl" />
      {/* Logo */}
      <div className="w-14 h-14 flex items-center justify-center mb-8 text-white">
        <DigiTwinIcon className="w-9 h-9" />
      </div>

      {/* Tab Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <Tooltip key={tab.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <button onClick={() => onTabChange(tab.id)} className={cn("relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200", isActive ? "bg-white text-primary shadow-lg shadow-white/25 scale-105" : "text-white/70 hover:bg-white/15 hover:text-white hover:scale-105 active:scale-95")}>
                  <Icon className="w-6 h-6" />
                  {isActive && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-full" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-foreground text-background">
                <p>{tab.label}</p>
              </TooltipContent>
            </Tooltip>;
      })}
        
        <div className="w-10 h-px bg-white/15 my-3" />
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <Activity className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-foreground text-background">
            <p>Activity</p>
          </TooltipContent>
        </Tooltip>
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3 mt-auto">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button onClick={onSettingsClick} className="w-12 h-12 flex items-center justify-center rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <Settings className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-foreground text-background">
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all">
              <LogOut className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-foreground text-background">
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>;
};
export default Sidebar;