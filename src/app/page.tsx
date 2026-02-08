"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import DigiTwinAvatar from "@/components/dashboard/DigiTwinAvatar";
import HealthCompanion from "@/components/dashboard/HealthCompanion";
import WearablesCard from "@/components/dashboard/WearablesCard";
import HealthBenefits from "@/components/dashboard/HealthBenefits";
import DoctorPatientList from "@/components/dashboard/DoctorPatientList";
import TreatmentSimulator from "@/components/dashboard/TreatmentSimulator";
import InsurerPromosDashboard from "@/components/dashboard/InsurerPromosDashboard";
import ZeroKnowledgeVerify from "@/components/dashboard/ZeroKnowledgeVerify";
import PolicyDecoder from "@/components/dashboard/PolicyDecoder";
import BiologicalData from "@/components/dashboard/BiologicalData";
import PatientIntakeAnalyzer from "@/components/dashboard/PatientIntakeAnalyzer";
import SettingsDialog from "@/components/dashboard/SettingsDialog";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import ActivitySummary from "@/components/dashboard/ActivitySummary";
import BodyOverview from "@/components/dashboard/BodyOverview";
import ProfileCard from "@/components/dashboard/ProfileCard";
import MealPlan from "@/components/dashboard/MealPlan";
import CaloriesAnalysis from "@/components/dashboard/CaloriesAnalysis";
import DailyActivities from "@/components/dashboard/DailyActivities";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { UserAvatarProvider } from "@/context/UserAvatarContext";

type UserRole = "patient" | "doctor" | "insurer";

export default function Home() {
  const [activeRole, setActiveRole] = useState<UserRole>("patient");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Reset to first tab when role changes
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === "patient") setActiveTab("home");
    else if (role === "doctor") setActiveTab("patients");
    else setActiveTab("promos");
  };

  return (
    <UserAvatarProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-[1800px] mx-auto flex gap-8">
          {/* Sidebar */}
          <Sidebar
            activeRole={activeRole}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSettingsClick={() => setSettingsOpen(true)}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Header userRole={activeRole} onRoleChange={handleRoleChange} />

            {/* Patient Space */}
            {activeRole === "patient" && (
              <>
                {activeTab === "home" && (
                  <div className="space-y-8 animate-content-reveal">
                    {/* Top Row: DigiTwin + Right Sidebar */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
                      <div className="space-y-8">
                        <DigiTwinAvatar />

                        {/* Statistics Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <StatisticsChart />
                          <ActivitySummary />
                        </div>

                        {/* Body Overview */}
                        <BodyOverview />

                        {/* Daily Activities */}
                        <DailyActivities />
                      </div>

                      {/* Right Sidebar */}
                      <div className="space-y-5">
                        <ProfileCard />
                        <MealPlanProvider>
                          <MealPlan />
                          <CaloriesAnalysis />
                        </MealPlanProvider>
                        <WearablesCard />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "companion" && (
                  <div className="animate-content-reveal">
                    <HealthCompanion />
                  </div>
                )}
{activeTab === "benefits" && (
                  <div className="animate-content-reveal">
                    <HealthBenefits />
                  </div>
                )}
                {activeTab === "biodata" && (
                  <BiologicalData />
                )}
              </>
            )}

            {/* Doctor Space */}
            {activeRole === "doctor" && (
              <>
                {activeTab === "patients" && (
                  <div className="space-y-8 animate-content-reveal">
                    <DoctorPatientList />
                  </div>
                )}
                {activeTab === "simulator" && (
                  <div className="animate-content-reveal">
                    <TreatmentSimulator />
                  </div>
                )}
                {activeTab === "intake" && (
                  <div className="animate-content-reveal">
                    <PatientIntakeAnalyzer />
                  </div>
                )}
              </>
            )}

            {/* Insurer Space */}
            {activeRole === "insurer" && (
              <>
                {activeTab === "promos" && (
                  <div className="animate-content-reveal">
                    <InsurerPromosDashboard />
                  </div>
                )}
                {activeTab === "decoder" && (
                  <div className="animate-content-reveal">
                    <PolicyDecoder />
                  </div>
                )}
                {activeTab === "verify" && (
                  <div className="animate-content-reveal">
                    <ZeroKnowledgeVerify />
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Settings Dialog */}
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </UserAvatarProvider>
  );
}
