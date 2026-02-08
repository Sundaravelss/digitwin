import { Dna, FlaskConical, Activity, TrendingUp, Heart, Thermometer, Droplets, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { biologicalTabData } from "@/data/patientData";

const biomarkerIcons: Record<string, any> = {
  "Blood Glucose": Droplets,
  "Total Cholesterol": Heart,
  "Blood Pressure": Activity,
  "Heart Rate": Heart,
  "Body Temperature": Thermometer,
  "Oxygen Saturation": Droplets,
};

const BiologicalData = () => {
  return (
    <div className="space-y-6 animate-content-reveal">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
          <Dna className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Biological Data</h2>
          <p className="text-muted-foreground">Your complete health profile</p>
        </div>
      </div>

      {/* Biomarkers Section */}
      <Card className="border-0 shadow-[var(--shadow-md)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FlaskConical className="w-5 h-5 text-primary" />
            Biomarkers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Blood chemistry, metabolic markers, and physiological measurements that reveal current health status.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {biologicalTabData.biomarkers.map((marker, index) => {
              const Icon = biomarkerIcons[marker.name] || Activity;
              return (
                <div
                  key={marker.name}
                  className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] transition-all duration-300 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{marker.name}</span>
                  </div>
                  <p className={`text-xl font-bold ${
                    marker.status === "normal" || marker.status === "optimal"
                      ? "text-foreground"
                      : "text-orange-600 dark:text-orange-400"
                  }`}>
                    {marker.value} <span className="text-sm font-normal text-muted-foreground">{marker.unit}</span>
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    marker.status === "normal" || marker.status === "optimal"
                      ? "bg-success/20 text-success"
                      : marker.status === "elevated" || marker.status === "borderline"
                      ? "bg-warning/20 text-warning"
                      : "bg-destructive/20 text-destructive"
                  }`}>
                    {marker.status}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genetics Section */}
        <Card className="border-0 shadow-[var(--shadow-md)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dna className="w-5 h-5 text-purple-500" />
              Genetics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              DNA-level insights that define predispositions, drug responses, and long-term risk profiles.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {biologicalTabData.geneticInsights.map((insight) => (
                <div 
                  key={insight.trait} 
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{insight.trait}</p>
                    <p className="text-sm text-muted-foreground">{insight.result}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.risk === "low" 
                      ? "bg-success/20 text-success" 
                      : "bg-warning/20 text-warning"
                  }`}>
                    {insight.risk} risk
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle Section */}
        <Card className="border-0 shadow-[var(--shadow-md)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
              Lifestyle
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sleep patterns, activity levels, nutrition, and daily behaviors captured through wearables.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biologicalTabData.lifestyleMetrics.map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{item.metric}</span>
                    <span className="text-muted-foreground">{item.value} / {item.target}</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Longitudinal History Section */}
      <Card className="border-0 shadow-[var(--shadow-md)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Longitudinal History
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Years of health data that reveal trends, patterns, and trajectories unique to each person.
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative pl-8 border-l-2 border-primary/20 space-y-5">
            {biologicalTabData.longitudinalEvents.map((event, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[calc(1rem+1px)] w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10" />
                <div className="p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                  <p className="text-xs text-primary font-semibold">{event.date}</p>
                  <p className="text-sm text-foreground mt-1">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiologicalData;
