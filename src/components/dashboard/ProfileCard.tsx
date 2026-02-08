import { ExternalLink } from "lucide-react";
import { profileCardData } from "@/data/patientData";

const ProfileCard = () => {
  return <div className="health-card overflow-hidden">
      {/* Gradient banner */}
      <div className="h-16 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5" />

      {/* Content */}
      <div className="px-5 -mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-2xl border-4 border-card shadow-md">
            👤
          </div>
          <div className="pt-8">
            <h4 className="font-semibold text-foreground">{profileCardData.name}</h4>
            <span className="text-sm text-muted-foreground">{profileCardData.gender}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
          <div className="text-center p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="text-lg font-bold text-foreground">{profileCardData.weight}</div>
            <div className="text-xs text-muted-foreground">Weight</div>
            <div className="text-xs text-muted-foreground">{profileCardData.weightUnit}</div>
          </div>
          <div className="text-center border-x border-border/50 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="text-lg font-bold text-foreground">{profileCardData.age}</div>
            <div className="text-xs text-muted-foreground">Age</div>
          </div>
          <div className="text-center p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="text-lg font-bold text-foreground">{profileCardData.bloodType}</div>
            <div className="text-xs text-muted-foreground">Blood</div>
            <div className="text-xs text-muted-foreground">{profileCardData.bloodRh}</div>
          </div>
        </div>
      </div>
    </div>;
};
export default ProfileCard;