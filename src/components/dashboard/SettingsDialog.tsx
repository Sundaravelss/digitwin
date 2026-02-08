import { Camera, Upload, Loader2, Trash2, Zap } from "lucide-react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { profileCardData, biologicalTabData } from "@/data/patientData";
import { useUserAvatar } from "@/context/UserAvatarContext";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userPhotoUrl, generatedAvatarUrl, isGenerating, error, setUserPhoto, generateAvatar, clearAvatar } = useUserAvatar();

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all local data? This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUserPhoto(dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header with Avatar */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 bg-primary text-primary-foreground">
              {userPhotoUrl ? (
                <AvatarImage src={userPhotoUrl} alt={profileCardData.name} />
              ) : null}
              <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">{profileCardData.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{profileCardData.name}</h2>
              <p className="text-sm text-muted-foreground">DigiTwin User Profile</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none px-6 mt-4">
            <TabsTrigger
              value="biological"
              className="settings-tab data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Biological Profile
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="settings-tab data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="settings-tab data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="p-6 max-h-[480px] overflow-y-auto">
            <TabsContent value="biological" className="mt-0 space-y-4">
              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors">
                <h3 className="font-semibold mb-2">Biomarkers</h3>
                <p className="text-sm text-muted-foreground">Blood chemistry, metabolic markers, and physiological measurements that reveal current health status.</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-secondary rounded-lg">
                    <span className="text-muted-foreground">{biologicalTabData.biomarkers[0].name}</span>
                    <p className="font-medium">{`${biologicalTabData.biomarkers[0].value} ${biologicalTabData.biomarkers[0].unit}`}</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-lg">
                    <span className="text-muted-foreground">{biologicalTabData.biomarkers[1].name}</span>
                    <p className="font-medium">{`${biologicalTabData.biomarkers[1].value} ${biologicalTabData.biomarkers[1].unit}`}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors">
                <h3 className="font-semibold mb-2">Genetics</h3>
                <p className="text-sm text-muted-foreground">DNA-level insights that define predispositions, drug responses, and long-term risk profiles.</p>
              </div>

              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors">
                <h3 className="font-semibold mb-2">Lifestyle</h3>
                <p className="text-sm text-muted-foreground">Sleep patterns, activity levels, nutrition, and daily behaviors captured through wearables and self-reports.</p>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="mt-0 space-y-4">
              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors">
                <h3 className="font-semibold mb-2">Current Plan</h3>
                <p className="text-sm text-muted-foreground">You are on the <span className="font-medium text-primary">Free Plan</span></p>
                <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Upgrade to Pro
                </button>
              </div>

              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors">
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Basic health tracking</li>
                  <li>✓ AI Health Companion (limited)</li>
                  <li className="text-muted-foreground/50">✗ Advanced biomarker analysis</li>
                  <li className="text-muted-foreground/50">✗ Genetic insights</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 space-y-4">
              {/* Avatar Generation */}
              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors space-y-4">
                <h3 className="font-semibold">Avatar</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your photo to generate a 3D game-character avatar for your DigiTwin.
                </p>

                <div className="flex items-center gap-4">
                  {/* Photo Preview */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-secondary flex items-center justify-center">
                      {userPhotoUrl ? (
                        <img src={userPhotoUrl} alt="Your photo" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    {userPhotoUrl && (
                      <span className="absolute -bottom-1 -right-1 text-xs bg-success text-success-foreground px-1.5 py-0.5 rounded-full font-medium">
                        Photo
                      </span>
                    )}
                  </div>

                  {/* Arrow */}
                  {generatedAvatarUrl && (
                    <span className="text-muted-foreground text-lg">→</span>
                  )}

                  {/* Generated Avatar Preview */}
                  {generatedAvatarUrl && (
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary bg-secondary">
                        <img src={generatedAvatarUrl} alt="Generated avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">
                        Avatar
                      </span>
                    </div>
                  )}

                  {/* Loading state */}
                  {isGenerating && !generatedAvatarUrl && (
                    <>
                      <span className="text-muted-foreground text-lg">→</span>
                      <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-secondary flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {userPhotoUrl ? "Change Photo" : "Upload Photo"}
                  </button>

                  {userPhotoUrl && (
                    <button
                      onClick={generateAvatar}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      {isGenerating ? "Generating..." : "Generate Avatar"}
                    </button>
                  )}

                  {(userPhotoUrl || generatedAvatarUrl) && (
                    <button
                      onClick={clearAvatar}
                      className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              {/* Preferences */}
              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors space-y-4">
                <h3 className="font-semibold">Preferences</h3>

                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-sm">Dark mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={(checked) => {
                      setDarkMode(checked);
                      document.documentElement.classList.toggle('dark', checked);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-feedback" className="text-sm">Voice feedback</Label>
                  <Switch
                    id="voice-feedback"
                    checked={voiceFeedback}
                    onCheckedChange={setVoiceFeedback}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>

              {/* Privacy */}
              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors">
                <h3 className="font-semibold mb-2">Privacy</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All data is stored locally in your browser. No personal health information is sent to servers.
                </p>
                <button
                  onClick={handleClearData}
                  className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
                >
                  Clear all local data
                </button>
              </div>

              {/* About */}
              <div className="p-5 border border-border/50 rounded-xl hover:border-border transition-colors">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground">
                  DigiTwin v0.1.0 — Tech Hackathon Demo
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
