import { FlaskConical, Pill, AlertTriangle, Play, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { treatmentSimulatorData } from "@/data/patientData";

const TreatmentSimulator = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const biomarkers = treatmentSimulatorData.biomarkers;
  const drugInteractions = treatmentSimulatorData.drugInteractions;

  return (
    <div className="health-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Treatment Simulation</h3>
            <p className="text-xs text-muted-foreground">AI-powered drug interaction check</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsSimulating(!isSimulating)}
          className="gap-2"
        >
          {isSimulating ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Biomarkers */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 rounded-full bg-primary" />
            <h4 className="text-sm font-semibold text-foreground">Patient Biomarkers</h4>
          </div>
          <div className="space-y-2">
            {biomarkers.map((marker) => (
              <div 
                key={marker.name}
                className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <span className="text-sm text-muted-foreground">{marker.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{marker.value}</span>
                  <span className="text-xs text-muted-foreground">{marker.unit}</span>
                  {marker.status === "normal" ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : marker.status === "elevated" ? (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drug Interactions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 rounded-full bg-violet-500" />
            <h4 className="text-sm font-semibold text-foreground">Drug Interactions</h4>
          </div>
          <div className="space-y-3">
            {drugInteractions.map((interaction, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border-l-4 ${
                  interaction.severity === "low" 
                    ? "bg-success/10 border-success hover:bg-success/15 transition-colors"
                    : interaction.severity === "moderate"
                    ? "bg-warning/10 border-warning hover:bg-warning/15 transition-colors"
                    : "bg-destructive/10 border-destructive hover:bg-destructive/15 transition-colors"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Pill className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {interaction.drug1} + {interaction.drug2}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{interaction.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isSimulating && (
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-primary">Running simulation...</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full shimmer" style={{ width: '60%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentSimulator;
