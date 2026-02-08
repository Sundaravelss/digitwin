import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DigiTwinIcon } from "@/components/dashboard/Sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRole = "patient" | "doctor" | "insurer";

interface HeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleLabels = {
  patient: "Patient Space",
  doctor: "Doctor Space",
  insurer: "Insurer Space",
};

const Header = ({ userRole, onRoleChange }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <DigiTwinIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">DigiTwin</h1>
            <p className="text-sm text-muted-foreground">Your Digital Bio Twin</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-12 h-11 rounded-xl bg-secondary/50 border-0 shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-card transition-all duration-200 placeholder:text-muted-foreground/60"
          />
        </div>
        
        <Select value={userRole} onValueChange={(value) => onRoleChange(value as UserRole)}>
          <SelectTrigger className="w-[200px] h-11 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium hover:bg-primary/15 transition-all duration-200">
            <SelectValue placeholder="Select space" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">
              <span className="flex items-center gap-2">🏠 Patient Space</span>
            </SelectItem>
            <SelectItem value="doctor">
              <span className="flex items-center gap-2">👨‍⚕️ Doctor Space</span>
            </SelectItem>
            <SelectItem value="insurer">
              <span className="flex items-center gap-2">🏢 Insurer Space</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default Header;
