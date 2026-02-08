"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeIntegrityScore,
  demoPeople,
  inflammationDeltaPercent,
  latestDay,
  type DemoPerson,
  type BiomarkerDay,
} from "@/lib/demoBiomarkers";
import Onboarding from "@/components/Onboarding";

type RiskLevel = "danger" | "warning" | "info";

type BiologicalProfile = {
  age?: number;
  sex?: "female" | "male" | "other";
  allergies?: string;
  conditions?: string;
  bloodPressure?: string;
  currentMeds?: string;
  smoker?: boolean;
  cigarettesPerDay?: number;
};

type MedSimResult = {
  riskLevel: RiskLevel;
  headline: string;
  explanation: string;
  saferNextSteps: string[];
  extractedMedicationName?: string;
  recentStudies?: Array<{ year: number; finding: string; riskPercent?: number }>;
  difySource?: boolean;
};

type NutritionResult = {
  estimatedCalories: number;
  confidence: "low" | "medium" | "high";
  whatISee: string;
  burnSuggestion: { activity: string; minutes: number; note: string };
  smokingImpact?: string;
};

type DeepScanResult = {
  identified: string;
  brand?: string;
  servingSize?: string;
  nutritionFacts: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    sodium: number;
    totalCarbs: number;
    sugar: number;
    protein: number;
  };
  hiddenConcerns: string[];
  glucoseImpact: {
    spikePrediction: "low" | "moderate" | "high" | "very_high";
    peakTimeMinutes: number;
    explanation: string;
  };
  metabolicConsequence: {
    shortTerm: string;
    visualPrompt: string;
  };
  source: "dify" | "ai_vision" | "demo";
};

type FutureSelfResult = {
  imageUrl?: string;
  caption: string;
  agingAcceleration?: {
    yearsAdded: number;
    reversible: boolean;
    topFactors: string[];
  };
  notes?: string;
};

type PolicyDecoderResponse = {
  query: string;
  answer: string;
  relevantClauses: Array<{
    section: string;
    title: string;
    content: string;
    coverage: "covered" | "not_covered" | "partial" | "requires_preauthorization";
    maxBenefit?: string;
    claimLink?: string;
  }>;
  actionItems: string[];
  source: "dify_rag" | "demo";
};

type EvidenceResponse = {
  query: string;
  items: Array<{ title: string; url: string; note: string }>;
  source: "dify" | "demo";
};

type VoiceCoachResponse = {
  reply: string;
  nextPrompts: string[];
  safety: string[];
};

type VerifyResponse = {
  ok: true;
  challengeId: string;
  result: boolean;
  proof: { scheme: string; commitment: string; note: string };
};

type NutritionCoachResponse = {
  reply: string;
  suggestions: string[];
  mealIdeas?: string[];
  disclaimer: string;
};

// Health Companion Types
type SimulationType = "food" | "medication" | "smoking" | "habit" | "combined";

type NutritionData = {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  sugar: number;
  fiber?: number;
  concern?: string;
};

type BiomarkerImpact = {
  glucoseChange: number;
  inflammationChange: number;
  heartRateChange: number;
  energyChange: number;
  sleepQualityImpact: string;
  overallHealthDelta: number;
  timeToImpact: string;
};

type CompanionMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  simulationType?: SimulationType | null;
  nutritionData?: NutritionData | null;
  biomarkerImpact?: BiomarkerImpact | null;
  timestamp: Date;
};

type CompanionResponse = {
  reply: string;
  simulationType: SimulationType | null;
  nutritionData: NutritionData | null;
  biomarkerImpact: BiomarkerImpact | null;
  suggestions: string[];
  avatarPrompt: string | null;
  updatedBiomarkers: {
    calories: number;
    glucoseMgDl: number;
    inflammationIndex: number;
    energyLevel: number;
  } | null;
  shouldGenerateAvatar: boolean;
  source: "ai" | "dify_enhanced" | "demo";
};

type ThinkingStep = {
  step: number;
  title: string;
  content: string;
  timestamp: string;
};

type DrugInteraction = {
  drug: string;
  severity: "low" | "moderate" | "high" | "contraindicated";
  description: string;
};

type TreatmentSimResponse = {
  treatmentName: string;
  efficacyScore: number;
  riskScore: number;
  projections: Array<{
    day: number;
    bloodPressure: string;
    glucoseMgDl: number;
    restingHeartRate: number;
    hrvMs: number;
    inflammationIndex: number;
    overallHealth: number;
  }>;
  expectedOutcomes: {
    positive: string[];
    risks: string[];
    sideEffects: string[];
  };
  drugInteractions: DrugInteraction[];
  thinkingSteps: ThinkingStep[];
  alternativeTreatments: Array<{ name: string; efficacy: number; reason: string }>;
  monitoringRecommendations: string[];
  clinicalNotes: string;
  source: "ai_simulation" | "dify_enhanced" | "demo";
};

type HealthPromo = {
  id: string;
  name: string;
  description: string;
  category: "fitness" | "nutrition" | "prevention" | "wellness";
  requirements: { metric: string; target: number; unit: string; duration: string };
  reward: { type: string; value: number; description: string };
  startDate: string;
  endDate: string;
  enrolled: boolean;
  progress?: number;
  status: "available" | "enrolled" | "completed" | "expired";
};

type OnboardingData = {
  name: string;
  age: number | null;
  sex: "female" | "male" | "other" | null;
  healthGoals: string[];
  wearableDevice: string | null;
  dietaryPreferences: string[];
  allergies: string;
  conditions: string;
  activityLevel: string | null;
};

const STORAGE_KEY_PROFILE = "digitwin.profile.v1";
const STORAGE_KEY_AVATAR = "digitwin.avatarUrl.v1";
const STORAGE_KEY_SELECTED_PERSON = "digitwin.demoPersonId.v1";
const STORAGE_KEY_ONBOARDING = "digitwin.onboarding.v1";
const STORAGE_KEY_ONBOARDING_DATA = "digitwin.onboardingData.v1";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function useLocalProfile() {
  const [profile, setProfile] = useState<BiologicalProfile>(() => {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(STORAGE_KEY_PROFILE);
    const parsed = raw ? safeJsonParse<BiologicalProfile>(raw) : null;
    return (
      parsed ?? {
        age: 32,
        sex: "other",
        allergies: "Penicillin",
        conditions: "Asthma",
        bloodPressure: "120/80",
        currentMeds: "Vitamin D",
        smoker: false,
        cigarettesPerDay: 0,
      }
    );
  });

  const persist = (next: BiologicalProfile) => {
    setProfile(next);
    window.localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(next));
  };

  return { profile, persist };
}

function useStoredString(key: string, initial: string) {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return initial;
    return window.localStorage.getItem(key) ?? initial;
  });

  const persist = (next: string) => {
    setValue(next);
    window.localStorage.setItem(key, next);
  };

  return { value, persist };
}

async function postFormData<T>(url: string, form: FormData): Promise<T> {
  const res = await fetch(url, { method: "POST", body: form });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
  const data = safeJsonParse<T>(text);
  if (!data) throw new Error("Server returned non-JSON response");
  return data;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
  const data = safeJsonParse<T>(text);
  if (!data) throw new Error("Server returned non-JSON response");
  return data;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "red" | "zinc";
  children: React.ReactNode;
}) {
  const styles =
    tone === "green"
      ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-600/20"
      : tone === "amber"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
        : tone === "red"
          ? "bg-red-600/10 text-red-700 dark:text-red-300 border-red-600/20"
          : "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20";

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        styles,
      )}
    >
      {children}
    </span>
  );
}

function Pill({ level }: { level: RiskLevel }) {
  const label =
    level === "danger" ? "Danger" : level === "warning" ? "Warning" : "Info";
  const tone = level === "danger" ? "red" : level === "warning" ? "amber" : "green";
  return <Badge tone={tone}>{label}</Badge>;
}

function LogoMark() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2.75c2.5 0 4.5 2 4.5 4.5S14.5 11.75 12 11.75 7.5 9.75 7.5 7.25 9.5 2.75 12 2.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4.75 21.25c.7-4.4 4.9-7 7.25-7s6.55 2.6 7.25 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight">DigiTwin</span>
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ key: string; label: string }>;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={cx(
            "rounded-full px-3 py-1.5 text-sm font-medium transition",
            value === o.key
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
              : "bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const completed = window.localStorage.getItem(STORAGE_KEY_ONBOARDING);
    const savedData = window.localStorage.getItem(STORAGE_KEY_ONBOARDING_DATA);
    if (completed === "true") {
      setShowOnboarding(false);
      if (savedData) {
        setOnboardingData(safeJsonParse<OnboardingData>(savedData));
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    window.localStorage.setItem(STORAGE_KEY_ONBOARDING, "true");
    window.localStorage.setItem(STORAGE_KEY_ONBOARDING_DATA, JSON.stringify(data));
    setOnboardingData(data);
    setShowOnboarding(false);
    // Also update profile with onboarding data
    persist({
      ...profile,
      age: data.age ?? profile.age,
      sex: data.sex ?? profile.sex,
      allergies: data.allergies || profile.allergies,
      conditions: data.conditions || profile.conditions,
    });
  };

  const handleOnboardingSkip = () => {
    window.localStorage.setItem(STORAGE_KEY_ONBOARDING, "true");
    setShowOnboarding(false);
  };

  const { profile, persist } = useLocalProfile();
  const { value: avatarUrl, persist: setAvatarUrl } = useStoredString(
    STORAGE_KEY_AVATAR,
    "",
  );
  const { value: selectedPersonId, persist: setSelectedPersonId } = useStoredString(
    STORAGE_KEY_SELECTED_PERSON,
    "aura-user",
  );

  const selectedPerson: DemoPerson =
    demoPeople.find((p) => p.id === selectedPersonId) ?? demoPeople[0];
  const day = latestDay(selectedPerson);
  const integrityScore = computeIntegrityScore(day);

  const [role, setRole] = useState<"user" | "doctor" | "insurer">("user");
  const [userTab, setUserTab] = useState<"my" | "companion" | "coach" | "benefits">("my");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  
  // User Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState<"bio" | "subscription" | "settings">("bio");
  
  // Nutrition Coach: Voice mode
  const [coachMode, setCoachMode] = useState<"text" | "voice">("text");
  const [coachListening, setCoachListening] = useState(false);
  const [doctorTab, setDoctorTab] = useState<"deck" | "treatment">("deck");
  const [insurerTab, setInsurerTab] = useState<"policy" | "heat" | "verify" | "risk" | "promos">("policy");

  // User: avatar
  const [selfie, setSelfie] = useState<File | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Future Cast: meds + food
  const [medImage, setMedImage] = useState<File | null>(null);
  const [medText, setMedText] = useState<string>("");
  const [medResult, setMedResult] = useState<MedSimResult | null>(null);
  const [medBusy, setMedBusy] = useState(false);
  const [medError, setMedError] = useState<string | null>(null);

  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [nutrition, setNutrition] = useState<NutritionResult | null>(null);
  const [foodBusy, setFoodBusy] = useState(false);
  const [foodError, setFoodError] = useState<string | null>(null);

  // Deep Scan (Dify-powered nutrition analysis)
  const [deepScanImage, setDeepScanImage] = useState<File | null>(null);
  const [deepScan, setDeepScan] = useState<DeepScanResult | null>(null);
  const [deepScanBusy, setDeepScanBusy] = useState(false);
  const [deepScanError, setDeepScanError] = useState<string | null>(null);

  // Future Self: habits input
  const [futureSelfMode, setFutureSelfMode] = useState<"current" | "aged" | "recover">("aged");
  const [futureSelfImage, setFutureSelfImage] = useState<File | null>(null);
  const [futureSelf, setFutureSelf] = useState<FutureSelfResult | null>(null);
  const [futureSelfBusy, setFutureSelfBusy] = useState(false);
  const [futureSelfError, setFutureSelfError] = useState<string | null>(null);
  const [habitsInput, setHabitsInput] = useState<{
    sleepHours: number;
    exerciseMinutes: number;
    stressLevel: "low" | "moderate" | "high";
    dietQuality: "poor" | "fair" | "good" | "excellent";
    alcoholDrinksPerWeek: number;
    customHabit: string;
  }>({
    sleepHours: 6,
    exerciseMinutes: 60,
    stressLevel: "moderate",
    dietQuality: "fair",
    alcoholDrinksPerWeek: 3,
    customHabit: "",
  });

  // Recover: voice session
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceReply, setVoiceReply] = useState<VoiceCoachResponse | null>(null);

  // Health Companion (new chat-based simulator)
  const [companionMessages, setCompanionMessages] = useState<CompanionMessage[]>([]);
  const [companionInput, setCompanionInput] = useState<string>("");
  const [companionImage, setCompanionImage] = useState<File | null>(null);
  const [companionImagePreview, setCompanionImagePreview] = useState<string | null>(null);
  const [companionBusy, setCompanionBusy] = useState(false);
  const [companionError, setCompanionError] = useState<string | null>(null);
  const [companionSuggestions, setCompanionSuggestions] = useState<string[]>([
    "What should I eat for breakfast?",
    "Check my medication",
    "Simulate smoking impact",
    "Show my health trends",
  ]);
  const [simulatedBiomarkers, setSimulatedBiomarkers] = useState<{
    calories: number;
    glucoseMgDl: number;
    inflammationIndex: number;
    energyLevel: number;
  } | null>(null);
  const companionChatRef = useRef<HTMLDivElement>(null);

  // Doctor: selected patient
  const [patientId, setPatientId] = useState<string>("alex");
  const patient = demoPeople.find((p) => p.id === patientId) ?? demoPeople[1];
  const patientDay = latestDay(patient);

  // Doctor: Sim-Lab drag-drop
  const drugCatalog = [
    "Amoxicillin",
    "Ibuprofen",
    "Warfarin",
    "Metformin",
    "Lisinopril",
    "Azithromycin",
  ];
  const [slotA, setSlotA] = useState<string>("");
  const [slotB, setSlotB] = useState<string>("");
  const [labResult, setLabResult] = useState<MedSimResult | null>(null);
  const [labBusy, setLabBusy] = useState(false);
  const [labError, setLabError] = useState<string | null>(null);

  // Doctor: Evidence
  const [evidenceQuery, setEvidenceQuery] = useState<string>(
    "Penicillin allergy cross-reactivity",
  );
  const [evidence, setEvidence] = useState<EvidenceResponse | null>(null);
  const [evidenceBusy, setEvidenceBusy] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  // Insurer: Verify & Reward
  const [challenge, setChallenge] = useState<"active500" | "bmi25">("active500");
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);

  // Insurer: Policy Decoder (Dify RAG)
  const [policyQuery, setPolicyQuery] = useState<string>("Is gym membership covered?");
  const [policyResult, setPolicyResult] = useState<PolicyDecoderResponse | null>(null);
  const [policyBusy, setPolicyBusy] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);

  // Nutrition Coach (24/7)
  const [coachMessage, setCoachMessage] = useState<string>("");
  const [coachHistory, setCoachHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [coachReply, setCoachReply] = useState<NutritionCoachResponse | null>(null);
  const [coachBusy, setCoachBusy] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);

  // Doctor: Treatment Simulation (BioTwin-inspired)
  const [treatmentName, setTreatmentName] = useState<string>("Metformin");
  const [treatmentDosage, setTreatmentDosage] = useState<string>("500mg");
  const [treatmentType, setTreatmentType] = useState<"medication" | "procedure" | "lifestyle">("medication");
  const [treatmentDays, setTreatmentDays] = useState<number>(90);
  const [treatmentResult, setTreatmentResult] = useState<TreatmentSimResponse | null>(null);
  const [treatmentBusy, setTreatmentBusy] = useState(false);
  const [treatmentError, setTreatmentError] = useState<string | null>(null);

  // Insurer: Health Promos
  const [promos, setPromos] = useState<HealthPromo[]>([]);
  const [promosBusy, setPromosBusy] = useState(false);
  const [promosError, setPromosError] = useState<string | null>(null);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  const profileJson = useMemo(() => JSON.stringify(profile), [profile]);

  const auraRing = integrityScore >= 80 ? "ring-emerald-400/50" : integrityScore >= 60 ? "ring-amber-400/40" : "ring-zinc-300/40";
  const auraGlow = integrityScore >= 80 ? "shadow-[0_0_35px_rgba(16,185,129,0.25)]" : integrityScore >= 60 ? "shadow-[0_0_25px_rgba(245,158,11,0.18)]" : "opacity-80";

  const statusTone = (s: DemoPerson["status"]) =>
    s === "Stable" ? "green" : s === "At Risk" ? "amber" : "red";

  const onGenerateAvatar = async () => {
    setAvatarError(null);
    setAvatarBusy(true);
    try {
      if (!selfie) throw new Error("Upload a selfie first");
      const form = new FormData();
      form.set("profile", profileJson);
      form.set("mode", "recover");
      form.set("sleepHours", String(day.sleepHours));
      form.set("image", selfie);
      const data = await postFormData<FutureSelfResult>("/api/future-self", form);
      if (!data.imageUrl) {
        throw new Error(data.notes ?? "No avatar image returned (configure FAL_KEY)");
      }
      setAvatarUrl(data.imageUrl);
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setAvatarBusy(false);
    }
  };

  const onRunMedCast = async () => {
    setMedError(null);
    setMedResult(null);
    setMedBusy(true);
    try {
      const form = new FormData();
      form.set("profile", profileJson);
      form.set("hint", medText);
      if (medImage) form.set("image", medImage);
      const data = await postFormData<MedSimResult>("/api/med-sim", form);
      setMedResult(data);
    } catch (e) {
      setMedError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setMedBusy(false);
    }
  };

  const onAnalyzeFood = async () => {
    setFoodError(null);
    setNutrition(null);
    setFoodBusy(true);
    try {
      if (!foodImage) throw new Error("Upload a food photo first");
      const form = new FormData();
      form.set("profile", profileJson);
      form.set("image", foodImage);
      const data = await postFormData<NutritionResult>("/api/nutrition/analyze", form);
      setNutrition(data);
    } catch (e) {
      setFoodError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setFoodBusy(false);
    }
  };

  const onDeepScan = async () => {
    setDeepScanError(null);
    setDeepScan(null);
    setDeepScanBusy(true);
    try {
      if (!deepScanImage) throw new Error("Upload a food photo first");
      const form = new FormData();
      form.set("profile", profileJson);
      form.set("image", deepScanImage);
      const data = await postFormData<DeepScanResult>("/api/nutrition/deep-scan", form);
      setDeepScan(data);
    } catch (e) {
      setDeepScanError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setDeepScanBusy(false);
    }
  };

  const onFutureSelf = async () => {
    setFutureSelfError(null);
    setFutureSelf(null);
    setFutureSelfBusy(true);
    try {
      const form = new FormData();
      form.set("profile", profileJson);
      form.set("mode", futureSelfMode);
      form.set("habits", JSON.stringify({
        sleepHours: habitsInput.sleepHours,
        smoking: profile.smoker,
        cigarettesPerDay: profile.cigarettesPerDay,
        exerciseMinutes: habitsInput.exerciseMinutes,
        stressLevel: habitsInput.stressLevel,
        dietQuality: habitsInput.dietQuality,
        alcoholDrinksPerWeek: habitsInput.alcoholDrinksPerWeek,
        customHabit: habitsInput.customHabit,
      }));
      if (futureSelfImage) form.set("image", futureSelfImage);
      const data = await postFormData<FutureSelfResult>("/api/future-self", form);
      setFutureSelf(data);
    } catch (e) {
      setFutureSelfError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setFutureSelfBusy(false);
    }
  };

  const onPolicyDecode = async () => {
    setPolicyError(null);
    setPolicyResult(null);
    setPolicyBusy(true);
    try {
      if (!policyQuery.trim()) throw new Error("Enter a question about your policy");
      const data = await postJson<PolicyDecoderResponse>("/api/policy/decoder", {
        query: policyQuery,
      });
      setPolicyResult(data);
    } catch (e) {
      setPolicyError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setPolicyBusy(false);
    }
  };

  const onStartVoice = async () => {
    setVoiceError(null);
    const AnyWindow = window as unknown as {
      SpeechRecognition?: any;
      webkitSpeechRecognition?: any;
    };
    const Recognition =
      AnyWindow.SpeechRecognition ?? AnyWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError("Voice input not supported in this browser.");
      return;
    }
    if (listening) return;

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.onresult = (event: any) => {
      const next = String(event?.results?.[0]?.[0]?.transcript ?? "").trim();
      if (next) setTranscript(next);
    };
    recognition.onerror = () => {
      setVoiceError("Voice capture failed. Try again or type instead.");
    };
    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const onCoach = async () => {
    setVoiceError(null);
    setVoiceReply(null);
    setVoiceBusy(true);
    try {
      const data = await postJson<VoiceCoachResponse>("/api/recover/voice", {
        transcript,
        context: "DigiTwin Recover (Gradium voice session)",
        biomarkerSnapshot: {
          dateISO: day.dateISO,
          sleepHours: day.sleepHours,
          activeCalories: day.activeCalories,
          restingHeartRate: day.restingHeartRate,
          hrvMs: day.hrvMs,
          bloodPressure: `${day.systolic}/${day.diastolic}`,
        },
      });
      setVoiceReply(data);
    } catch (e) {
      setVoiceError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setVoiceBusy(false);
    }
  };

  const onDropDrug = (slot: "A" | "B", name: string) => {
    if (slot === "A") setSlotA(name);
    else setSlotB(name);
  };

  const onRunInteractionCheck = async () => {
    setLabError(null);
    setLabResult(null);
    setLabBusy(true);
    try {
      const hint = [slotA, slotB].filter(Boolean).join(" + ");
      if (!hint) throw new Error("Drop at least one medication into a slot");

      const form = new FormData();
      form.set(
        "profile",
        JSON.stringify({
          allergies: profile.allergies,
          conditions: profile.conditions,
          bloodPressure: profile.bloodPressure,
          currentMeds: profile.currentMeds,
        }),
      );
      form.set("hint", hint);
      const data = await postFormData<MedSimResult>("/api/med-sim", form);
      setLabResult(data);
    } catch (e) {
      setLabError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLabBusy(false);
    }
  };

  const onFetchEvidence = async () => {
    setEvidenceError(null);
    setEvidence(null);
    setEvidenceBusy(true);
    try {
      const data = await postJson<EvidenceResponse>("/api/evidence", {
        query: evidenceQuery,
      });
      setEvidence(data);
    } catch (e) {
      setEvidenceError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setEvidenceBusy(false);
    }
  };

  // Nutrition Coach handler
  const onSendToCoach = async () => {
    if (!coachMessage.trim()) return;
    setCoachError(null);
    setCoachBusy(true);
    try {
      const userMessage = coachMessage;
      setCoachMessage("");
      setCoachHistory((prev) => [...prev, { role: "user", content: userMessage }]);
      
      const data = await postJson<NutritionCoachResponse>("/api/nutrition/coach", {
        message: userMessage,
        profile: {
          age: profile.age,
          sex: profile.sex,
          allergies: profile.allergies,
          conditions: profile.conditions,
          goals: onboardingData?.healthGoals,
          dietaryRestrictions: onboardingData?.dietaryPreferences,
        },
        conversationHistory: coachHistory,
      });
      
      setCoachReply(data);
      setCoachHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setCoachError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setCoachBusy(false);
    }
  };

  // Health Companion handler
  const onSendToCompanion = async (messageOverride?: string) => {
    const messageToSend = messageOverride || companionInput;
    if (!messageToSend.trim() && !companionImage) return;
    
    setCompanionError(null);
    setCompanionBusy(true);
    
    const userMessageId = `user-${Date.now()}`;
    const userMessage: CompanionMessage = {
      id: userMessageId,
      role: "user",
      content: messageToSend,
      imageUrl: companionImagePreview || undefined,
      timestamp: new Date(),
    };
    
    setCompanionMessages((prev) => [...prev, userMessage]);
    setCompanionInput("");
    setCompanionImage(null);
    setCompanionImagePreview(null);
    
    try {
      const form = new FormData();
      form.set("message", messageToSend);
      form.set("profile", profileJson);
      form.set("biomarkers", JSON.stringify({
        dateISO: day.dateISO,
        steps: day.steps,
        activeCalories: day.activeCalories,
        sleepHours: day.sleepHours,
        restingHeartRate: day.restingHeartRate,
        hrvMs: day.hrvMs,
        bloodPressure: `${day.systolic}/${day.diastolic}`,
        glucoseMgDl: day.glucoseMgDl,
      }));
      form.set("history", JSON.stringify(companionMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }))));
      
      if (companionImage) {
        form.set("image", companionImage);
      }
      
      const data = await postFormData<CompanionResponse>("/api/health-companion", form);
      
      const assistantMessage: CompanionMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        simulationType: data.simulationType,
        nutritionData: data.nutritionData,
        biomarkerImpact: data.biomarkerImpact,
        timestamp: new Date(),
      };
      
      setCompanionMessages((prev) => [...prev, assistantMessage]);
      
      if (data.suggestions && data.suggestions.length > 0) {
        setCompanionSuggestions(data.suggestions);
      }
      
      if (data.updatedBiomarkers) {
        setSimulatedBiomarkers(data.updatedBiomarkers);
      }
      
      // Scroll to bottom
      setTimeout(() => {
        companionChatRef.current?.scrollTo({
          top: companionChatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
      
    } catch (e) {
      setCompanionError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setCompanionBusy(false);
    }
  };

  const onCompanionImageSelect = (file: File | null) => {
    setCompanionImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanionImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCompanionImagePreview(null);
    }
  };

  // Treatment Simulation handler (BioTwin-inspired)
  const onRunTreatmentSim = async () => {
    setTreatmentError(null);
    setTreatmentResult(null);
    setTreatmentBusy(true);
    try {
      const data = await postJson<TreatmentSimResponse>("/api/doctor/treatment-sim", {
        patientProfile: {
          age: patient.id === "aura-user" ? profile.age : 45,
          sex: patient.id === "aura-user" ? profile.sex : "male",
          conditions: patient.id === "aura-user" ? profile.conditions : "Type 2 Diabetes, Hypertension",
          allergies: patient.id === "aura-user" ? profile.allergies : "None",
          currentMeds: patient.id === "aura-user" ? profile.currentMeds : "Lisinopril 10mg",
          biomarkers: {
            bloodPressure: `${patientDay.systolic}/${patientDay.diastolic}`,
            glucoseMgDl: patientDay.glucoseMgDl,
            restingHeartRate: patientDay.restingHeartRate,
            hrvMs: patientDay.hrvMs,
            sleepHours: patientDay.sleepHours,
          },
        },
        treatment: {
          type: treatmentType,
          name: treatmentName,
          dosage: treatmentDosage,
        },
        simulationDays: treatmentDays,
      });
      setTreatmentResult(data);
    } catch (e) {
      setTreatmentError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setTreatmentBusy(false);
    }
  };

  // Promos handlers
  const onLoadPromos = async () => {
    setPromosError(null);
    setPromosBusy(true);
    try {
      const data = await postJson<{ success: boolean; promos: HealthPromo[]; totalSavings: number }>("/api/insurer/promos", {
        action: "list",
      });
      if (data.success) {
        setPromos(data.promos);
        setTotalSavings(data.totalSavings);
      }
    } catch (e) {
      setPromosError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setPromosBusy(false);
    }
  };

  const onEnrollPromo = async (promoId: string) => {
    try {
      const data = await postJson<{ success: boolean; message: string }>("/api/insurer/promos", {
        action: "enroll",
        promoId,
      });
      if (data.success) {
        onLoadPromos(); // Refresh list
      }
    } catch (e) {
      setPromosError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const onCheckProgress = async (promoId: string) => {
    try {
      const data = await postJson<{ success: boolean; promo: HealthPromo; message: string }>("/api/insurer/promos", {
        action: "check-progress",
        promoId,
      });
      if (data.success) {
        onLoadPromos(); // Refresh list
      }
    } catch (e) {
      setPromosError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  // Load promos on tab change (for both insurer and user benefits)
  useEffect(() => {
    if ((role === "insurer" && insurerTab === "promos") || (role === "user" && userTab === "benefits")) {
      if (promos.length === 0) {
        onLoadPromos();
      }
    }
  }, [role, insurerTab, userTab]);

  const poolCounts = useMemo(() => {
    const pool = demoPeople.filter((p) => p.id !== "aura-user");
    const stable = pool.filter((p) => p.status === "Stable").length;
    const risk = pool.filter((p) => p.status === "At Risk").length;
    const critical = pool.filter((p) => p.status === "Critical").length;
    return { total: pool.length, stable, risk, critical };
  }, []);

  const verifyPool = useMemo(() => {
    const pool = demoPeople.filter((p) => p.id !== "aura-user");
    if (challenge === "active500") {
      const verified = pool.filter((p) => latestDay(p).activeCalories > 500).length;
      return { verified, statement: "Did user burn >500 active calories today?" };
    }
    return { verified: 0, statement: "Maintenance of BMI < 25." };
  }, [challenge]);

  const onIssueCredits = async () => {
    setVerifyError(null);
    setVerifyResult(null);
    setVerifyBusy(true);
    try {
      const challengeId = `challenge_${challenge}_${new Date().toISOString()}`;
      const statement = verifyPool.statement;

      // Local computation (demo): only produce TRUE/FALSE.
      const localResult =
        challenge === "active500" ? day.activeCalories > 500 : false;

      // Demo "proof": commitment generated server-side. In real ZK, only proof + statement is shared.
      const proof = await postJson<VerifyResponse>("/api/verify/proof", {
        challengeId,
        statement,
        result: localResult,
        commitmentInput: JSON.stringify({
          // Commitment input is NOT raw data in a real system.
          // Here it is just a demo seed for hashing.
          device: "local-digitwin-demo",
          computedAt: day.dateISO,
        }),
      });

      setVerifyResult(proof);
    } catch (e) {
      setVerifyError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setVerifyBusy(false);
    }
  };

  const foodDelta = nutrition
    ? inflammationDeltaPercent({
        calories: nutrition.estimatedCalories,
        sleepHours: day.sleepHours,
        smoker: Boolean(profile.smoker),
      })
    : null;

  const headerSubtitle =
    role === "user"
      ? "Patient Space"
      : role === "doctor"
        ? "Doctor Space"
        : "Insurer Space";

  // Show loading state while checking onboarding
  if (showOnboarding === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full mx-auto" />
          <p className="mt-4 text-sm text-zinc-600">Loading DigiTwin...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Professional Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <LogoMark />
              <div className="hidden sm:block h-6 w-px bg-zinc-200 dark:bg-white/10" />
              <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                AI-powered biological digital twin
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Space Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-white/5 transition text-sm font-medium"
                >
                  <span className={
                    role === "user" ? "text-emerald-600 dark:text-emerald-400" :
                    role === "doctor" ? "text-blue-600 dark:text-blue-400" :
                    "text-amber-600 dark:text-amber-400"
                  }>
                    {role === "user" ? "👤 Patient Space" : role === "doctor" ? "🩺 Doctor Space" : "🏢 Insurer Space"}
                  </span>
                  <svg className={cx("w-4 h-4 transition-transform", roleDropdownOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {roleDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setRoleDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl z-20 overflow-hidden">
                      {[
                        { key: "user", label: "Patient Space", icon: "👤", desc: "Your health dashboard", color: "emerald" },
                        { key: "doctor", label: "Doctor Space", icon: "🩺", desc: "Clinical tools & simulations", color: "blue" },
                        { key: "insurer", label: "Insurer Space", icon: "🏢", desc: "Policy & population insights", color: "amber" },
                      ].map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => {
                            setRole(option.key as typeof role);
                            setRoleDropdownOpen(false);
                          }}
                          className={cx(
                            "w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-white/5 transition flex items-center gap-3",
                            role === option.key && "bg-zinc-50 dark:bg-white/5"
                          )}
                        >
                          <span className="text-xl">{option.icon}</span>
                          <div>
                            <p className={cx(
                              "font-medium text-sm",
                              role === option.key && `text-${option.color}-600 dark:text-${option.color}-400`
                            )}>{option.label}</p>
                            <p className="text-xs text-zinc-500">{option.desc}</p>
                          </div>
                          {role === option.key && (
                            <svg className="w-4 h-4 ml-auto text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {onboardingData?.name && (
                <span className="hidden md:block text-sm text-zinc-600 dark:text-zinc-400">
                  Hi, {onboardingData.name}
                </span>
              )}
              
              {/* User Profile Button */}
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-white/20 hover:border-emerald-400 dark:hover:border-emerald-400 transition-colors shadow-sm"
                title="User Profile"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                    {onboardingData?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Sub Navigation */}
        <div className="mx-auto w-full max-w-7xl px-4 pb-2">
          {role === "user" ? (
            <div className="flex gap-1 overflow-x-auto">
              {[
                { key: "my", label: "Home", icon: "🏠" },
                { key: "companion", label: "Health Companion", icon: "💬" },
                { key: "coach", label: "Nutrition Coach", icon: "🥗" },
                { key: "benefits", label: "Health Benefits", icon: "🎁" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setUserTab(tab.key as typeof userTab)}
                  className={cx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2",
                    userTab === tab.key
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                  )}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}

          {role === "doctor" ? (
            <div className="flex gap-1 overflow-x-auto">
              {[
                { key: "deck", label: "My Patients Status", icon: "👥" },
                { key: "treatment", label: "Treatment Simulation", icon: "💊" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDoctorTab(tab.key as typeof doctorTab)}
                  className={cx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2",
                    doctorTab === tab.key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                  )}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}

          {role === "insurer" ? (
            <div className="flex gap-1 overflow-x-auto">
              {[
                { key: "promos", label: "Health Promos", icon: "🎁" },
                { key: "policy", label: "Policy Decoder", icon: "📋" },
                { key: "heat", label: "Population", icon: "🗺️" },
                { key: "verify", label: "Verify & Reward", icon: "✅" },
                { key: "risk", label: "Risk Projector", icon: "📈" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setInsurerTab(tab.key as typeof insurerTab)}
                  className={cx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex items-center gap-2",
                    insurerTab === tab.key
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                  )}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main className={cx(
        "mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6",
        role === "user" ? "lg:grid-cols-3" : ""
      )}>
        {/* Main Content Area */}
        <div className={cx(
          role === "user" ? "lg:col-span-2" : ""
        )}>
          {role === "user" && userTab === "my" ? (
            <Card
              title="DigiTwin Home"
              subtitle="Your biological digital twin with real-time health insights"
            >
              <div className="grid gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">DigiTwin Avatar</p>
                      <Badge tone={integrityScore >= 80 ? "green" : integrityScore >= 60 ? "amber" : "red"}>
                        {integrityScore >= 80 ? "Glowing" : integrityScore >= 60 ? "Fading" : "Dim"}
                      </Badge>
                    </div>
                    <div
                      className={cx(
                        "mt-3 overflow-hidden rounded-2xl ring-1",
                        auraRing,
                        auraGlow,
                      )}
                    >
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt="Aura avatar"
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-56 items-center justify-center bg-zinc-50 text-sm text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                          No avatar yet
                        </div>
                      )}
                    </div>
                    <div className="mt-4 grid gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
                        className="text-sm"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={onGenerateAvatar}
                          disabled={avatarBusy}
                          className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                        >
                          {avatarBusy ? "Generating…" : "Generate DigiTwin Avatar"}
                        </button>
                        {avatarError ? (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {avatarError}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Uses fal if configured (`FAL_KEY`). Otherwise it will fail with a clear message.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                    <p className="text-sm font-medium">Integrity Score</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {integrityScore}/100
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Aggregated from today’s biomarker snapshot (demo).
                    </p>
                    <div className="mt-4 grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Active calories</span>
                        <span className="font-medium">{day.activeCalories}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Sleep</span>
                        <span className="font-medium">{day.sleepHours}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">RHR</span>
                        <span className="font-medium">{day.restingHeartRate} bpm</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">HRV</span>
                        <span className="font-medium">{day.hrvMs} ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">BP</span>
                        <span className="font-medium">{day.systolic}/{day.diastolic}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-200">
                  <p className="font-medium">Privacy Shield (pitch)</p>
                  <p className="mt-2 leading-6">
                    Insurers don’t need your raw biometrics. They only need to know if you met the risk criteria.
                    DigiTwin computes the challenge locally and returns only TRUE/FALSE plus a proof artifact (demo).
                  </p>
                </div>
              </div>
            </Card>
          ) : null}

          {role === "user" && userTab === "companion" ? (
            <Card
              title="Health Companion"
              subtitle="Chat with AI to simulate food, medication, and lifestyle impacts on your DigiTwin"
            >
              <div className="flex flex-col h-[600px]">
                {/* Chat Messages Area */}
                <div
                  ref={companionChatRef}
                  className="flex-1 overflow-y-auto rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 p-4 space-y-4"
                >
                  {companionMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mb-4">
                        <span className="text-3xl">💬</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Welcome to Health Companion</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">
                        I can simulate how food, medications, and habits affect your DigiTwin. 
                        Upload a photo or describe what you want to analyze.
                      </p>
                      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                        {companionSuggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onSendToCompanion(suggestion)}
                            className="p-3 rounded-xl border border-zinc-200 dark:border-white/10 text-left text-xs hover:bg-white dark:hover:bg-white/5 transition"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    companionMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cx(
                          "flex gap-3",
                          msg.role === "user" ? "flex-row-reverse" : ""
                        )}
                      >
                        <div
                          className={cx(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0",
                            msg.role === "user"
                              ? "bg-gradient-to-br from-emerald-400 to-cyan-500 text-white"
                              : "bg-zinc-200 dark:bg-white/10"
                          )}
                        >
                          {msg.role === "user" ? (onboardingData?.name?.charAt(0).toUpperCase() || "U") : "🤖"}
                        </div>
                        <div
                          className={cx(
                            "flex-1 rounded-2xl p-4 max-w-[80%]",
                            msg.role === "user"
                              ? "bg-emerald-600 text-white ml-auto"
                              : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10"
                          )}
                        >
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="Uploaded"
                              className="w-full max-w-xs rounded-xl mb-3"
                            />
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          
                          {/* Nutrition Data Display */}
                          {msg.nutritionData && (
                            <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100">
                              <p className="font-semibold text-sm mb-2">{msg.nutritionData.food}</p>
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div className="text-center">
                                  <p className="font-bold">{msg.nutritionData.calories}</p>
                                  <p className="text-emerald-600 dark:text-emerald-400">kcal</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-bold">{msg.nutritionData.protein}g</p>
                                  <p className="text-emerald-600 dark:text-emerald-400">protein</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-bold">{msg.nutritionData.carbs}g</p>
                                  <p className="text-emerald-600 dark:text-emerald-400">carbs</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-bold">{msg.nutritionData.fat}g</p>
                                  <p className="text-emerald-600 dark:text-emerald-400">fat</p>
                                </div>
                              </div>
                              {msg.nutritionData.concern && (
                                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                                  ⚠️ {msg.nutritionData.concern}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Biomarker Impact Display */}
                          {msg.biomarkerImpact && (
                            <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100">
                              <p className="font-semibold text-sm mb-2">Predicted DigiTwin Impact</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                  <span>Glucose</span>
                                  <span className={msg.biomarkerImpact.glucoseChange > 0 ? "text-red-500" : "text-green-500"}>
                                    {msg.biomarkerImpact.glucoseChange > 0 ? "+" : ""}{msg.biomarkerImpact.glucoseChange} mg/dL
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Inflammation</span>
                                  <span className={msg.biomarkerImpact.inflammationChange > 0 ? "text-red-500" : "text-green-500"}>
                                    {msg.biomarkerImpact.inflammationChange > 0 ? "+" : ""}{msg.biomarkerImpact.inflammationChange}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Energy</span>
                                  <span className={msg.biomarkerImpact.energyChange > 0 ? "text-green-500" : "text-red-500"}>
                                    {msg.biomarkerImpact.energyChange > 0 ? "+" : ""}{msg.biomarkerImpact.energyChange}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Time to effect</span>
                                  <span>{msg.biomarkerImpact.timeToImpact}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-xs opacity-60 mt-2">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {companionBusy && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-sm">
                        🤖
                      </div>
                      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-400 animation-delay-200"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-400 animation-delay-400"></div>
                          </div>
                          <span className="text-sm text-zinc-500">Analyzing and simulating...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Simulated Biomarkers Summary */}
                {simulatedBiomarkers && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                      Updated DigiTwin Biomarkers (Simulated)
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-emerald-700 dark:text-emerald-300">{simulatedBiomarkers.calories}</p>
                        <p className="text-zinc-500">Daily Cal</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-emerald-700 dark:text-emerald-300">{simulatedBiomarkers.glucoseMgDl}</p>
                        <p className="text-zinc-500">Glucose</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-emerald-700 dark:text-emerald-300">{simulatedBiomarkers.inflammationIndex}</p>
                        <p className="text-zinc-500">Inflam.</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-emerald-700 dark:text-emerald-300">{simulatedBiomarkers.energyLevel}</p>
                        <p className="text-zinc-500">Energy</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {companionImagePreview && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={companionImagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-xl border border-zinc-200 dark:border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => onCompanionImageSelect(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Quick Suggestions */}
                {companionMessages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {companionSuggestions.slice(0, 3).map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onSendToCompanion(suggestion)}
                        disabled={companionBusy}
                        className="px-3 py-1.5 rounded-full text-xs bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="mt-3 flex items-end gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => onCompanionImageSelect(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-white/10 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-white/5 transition">
                      📷
                    </div>
                  </label>
                  <div className="flex-1 relative">
                    <textarea
                      value={companionInput}
                      onChange={(e) => setCompanionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !companionBusy) {
                          e.preventDefault();
                          onSendToCompanion();
                        }
                      }}
                      placeholder="Describe food, medication, or habits to simulate..."
                      rows={1}
                      className="w-full min-h-[40px] max-h-24 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 px-4 py-2.5 text-sm resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onSendToCompanion()}
                    disabled={companionBusy || (!companionInput.trim() && !companionImage)}
                    className="h-10 px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium disabled:opacity-50 hover:bg-emerald-700 transition flex items-center gap-2"
                  >
                    {companionBusy ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </>
                    ) : (
                      "Send"
                    )}
                  </button>
                </div>
                
                {companionError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{companionError}</p>
                )}
              </div>
            </Card>
          ) : null}

          {role === "user" && userTab === "coach" ? (
            <Card
              title="24/7 Nutrition Coach"
              subtitle="Your personal nutrition guide — chat or voice, anytime. (Powered by Gladium AI)"
            >
              <div className="grid gap-4">
                {/* Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCoachMode("text")}
                      className={cx(
                        "px-4 py-2 rounded-xl text-sm font-medium transition",
                        coachMode === "text"
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
                      )}
                    >
                      💬 Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoachMode("voice")}
                      className={cx(
                        "px-4 py-2 rounded-xl text-sm font-medium transition",
                        coachMode === "voice"
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
                      )}
                    >
                      🎤 Voice
                    </button>
                  </div>
                  <Badge tone="green">Gladium AI</Badge>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    {coachMode === "voice" 
                      ? "Tap the microphone to speak with your nutrition coach. I'll listen and respond to your questions about food and nutrition."
                      : "I'm your nutrition coach! Ask me about meal planning, food choices, portion sizes, or nutrition tips. I focus only on nutrition guidance — for medical advice, please consult a healthcare professional."
                    }
                  </p>
                </div>

                {/* Chat history */}
                {coachHistory.length > 0 && (
                  <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-200 p-3 dark:border-white/10">
                    <div className="grid gap-3">
                      {coachHistory.map((msg, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-3 text-sm ${
                            msg.role === "user"
                              ? "bg-zinc-100 dark:bg-white/5 ml-8"
                              : "bg-emerald-50 dark:bg-emerald-900/20 mr-8"
                          }`}
                        >
                          <p className="text-xs font-medium mb-1 text-zinc-500">
                            {msg.role === "user" ? "You" : "Coach"}
                          </p>
                          <p>{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Latest reply with suggestions */}
                {coachReply && (
                  <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                    {coachReply.mealIdeas && coachReply.mealIdeas.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Meal Ideas</p>
                        <div className="flex flex-wrap gap-2">
                          {coachReply.mealIdeas.map((idea, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-xs">
                              {idea}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Try asking</p>
                      <div className="flex flex-wrap gap-2">
                        {coachReply.suggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCoachMessage(s)}
                            className="px-3 py-1.5 bg-zinc-100 dark:bg-white/5 rounded-full text-xs hover:bg-zinc-200 dark:hover:bg-white/10 transition"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <p className="mt-3 text-xs text-zinc-500 italic">{coachReply.disclaimer}</p>
                  </div>
                )}

                {/* Voice Mode Input */}
                {coachMode === "voice" && (
                  <div className="flex flex-col items-center gap-4 py-6">
                    <button
                      type="button"
                      onClick={async () => {
                        if (coachListening) return;
                        setCoachError(null);
                        const AnyWindow = window as unknown as {
                          SpeechRecognition?: any;
                          webkitSpeechRecognition?: any;
                        };
                        const Recognition =
                          AnyWindow.SpeechRecognition ?? AnyWindow.webkitSpeechRecognition;
                        if (!Recognition) {
                          setCoachError("Voice input not supported in this browser. Try Chrome or Edge.");
                          return;
                        }
                        const recognition = new Recognition();
                        recognition.lang = "en-US";
                        recognition.interimResults = false;
                        recognition.maxAlternatives = 1;

                        setCoachListening(true);
                        recognition.onresult = async (event: any) => {
                          const transcript = String(event?.results?.[0]?.[0]?.transcript ?? "").trim();
                          if (transcript) {
                            setCoachMessage(transcript);
                            // Auto-send when voice detected
                            setCoachBusy(true);
                            try {
                              setCoachHistory((prev) => [...prev, { role: "user", content: transcript }]);
                              const data = await postJson<NutritionCoachResponse>("/api/nutrition/voice-coach", {
                                message: transcript,
                                mode: "voice",
                                profile: {
                                  age: profile.age,
                                  sex: profile.sex,
                                  allergies: profile.allergies,
                                  conditions: profile.conditions,
                                  goals: onboardingData?.healthGoals,
                                  dietaryRestrictions: onboardingData?.dietaryPreferences,
                                },
                                conversationHistory: coachHistory,
                              });
                              setCoachReply(data);
                              setCoachHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
                              // Text-to-speech response
                              if ('speechSynthesis' in window) {
                                const utterance = new SpeechSynthesisUtterance(data.reply);
                                utterance.rate = 1;
                                window.speechSynthesis.speak(utterance);
                              }
                            } catch (e) {
                              setCoachError(e instanceof Error ? e.message : "Unknown error");
                            } finally {
                              setCoachBusy(false);
                              setCoachMessage("");
                            }
                          }
                        };
                        recognition.onerror = () => {
                          setCoachError("Voice capture failed. Try again.");
                        };
                        recognition.onend = () => {
                          setCoachListening(false);
                        };
                        recognition.start();
                      }}
                      disabled={coachListening || coachBusy}
                      className={cx(
                        "h-20 w-20 rounded-full flex items-center justify-center text-3xl transition-all",
                        coachListening
                          ? "bg-red-500 text-white animate-pulse"
                          : coachBusy
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105"
                      )}
                    >
                      {coachListening ? "🎙️" : coachBusy ? "💭" : "🎤"}
                    </button>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {coachListening ? "Listening..." : coachBusy ? "Thinking..." : "Tap to speak"}
                    </p>
                    {coachMessage && coachMode === "voice" && (
                      <p className="text-sm text-zinc-500 italic">"{coachMessage}"</p>
                    )}
                  </div>
                )}

                {/* Text Mode Input */}
                {coachMode === "text" && (
                  <div className="flex gap-2">
                    <input
                      value={coachMessage}
                      onChange={(e) => setCoachMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !coachBusy && onSendToCoach()}
                      placeholder="Ask about nutrition, meal ideas, or food choices..."
                      className="flex-1 h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm dark:border-white/10 dark:bg-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={onSendToCoach}
                      disabled={coachBusy || !coachMessage.trim()}
                      className="h-10 px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium disabled:opacity-60"
                    >
                      {coachBusy ? "..." : "Send"}
                    </button>
                  </div>
                )}
                
                {coachError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{coachError}</p>
                )}

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { q: "What should I eat for breakfast?", icon: "🌅" },
                    { q: "Healthy snack ideas", icon: "🍎" },
                    { q: "How to reduce sugar intake?", icon: "🍬" },
                    { q: "Best protein sources", icon: "🥩" },
                  ].map((item) => (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => {
                        setCoachMessage(item.q);
                        if (coachMode === "text") {
                          // Auto-trigger send for quick actions
                        }
                      }}
                      className="p-3 rounded-xl border border-zinc-200 dark:border-white/10 text-left text-sm hover:bg-zinc-50 dark:hover:bg-white/5 transition"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.q}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}

          {/* Patient Benefits Tab - Health Promos from Insurance */}
          {role === "user" && userTab === "benefits" ? (
            <Card
              title="Health Benefits & Rewards"
              subtitle="Earn rewards by achieving health goals set by your insurance provider"
            >
              <div className="grid gap-4">
                {/* Benefits Overview Banner */}
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 dark:border-emerald-800 dark:from-emerald-900/30 dark:to-cyan-900/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                        🎯 Better Health = Better Rewards
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                        Complete health challenges to earn premium discounts and rewards
                      </p>
                    </div>
                    {totalSavings > 0 && (
                      <div className="text-right bg-white/50 dark:bg-white/10 rounded-xl p-3">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Your Savings</p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${totalSavings}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {promos.filter(p => p.enrolled).length}
                    </p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Enrolled</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {promos.filter(p => p.status === "completed").length}
                    </p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Completed</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {promos.filter(p => p.status === "available").length}
                    </p>
                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Available</p>
                  </div>
                </div>

                {promosBusy ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full mx-auto" />
                    <p className="mt-3 text-sm text-zinc-500">Loading your health benefits...</p>
                  </div>
                ) : promosError ? (
                  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">{promosError}</p>
                    <button
                      onClick={onLoadPromos}
                      className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {/* Filter tabs */}
                    <div className="flex gap-2 text-xs">
                      <span className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full">All</span>
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/20">Fitness</span>
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/20">Nutrition</span>
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 rounded-full cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/20">Wellness</span>
                    </div>

                    {/* Promo cards */}
                    {promos.map((promo) => (
                      <div
                        key={promo.id}
                        className={cx(
                          "rounded-xl border p-4 transition hover:shadow-md",
                          promo.status === "completed"
                            ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-900/20"
                            : promo.status === "enrolled"
                              ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20"
                              : "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">
                                {promo.category === "fitness" ? "🏃" :
                                 promo.category === "nutrition" ? "🥗" :
                                 promo.category === "prevention" ? "💉" : "🧘"}
                              </span>
                              <p className="font-semibold">{promo.name}</p>
                              <Badge
                                tone={
                                  promo.status === "completed" ? "green" :
                                  promo.status === "enrolled" ? "amber" : "zinc"
                                }
                              >
                                {promo.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {promo.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Target: {promo.requirements.target} {promo.requirements.unit}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {promo.requirements.duration}
                              </span>
                            </div>
                            
                            {/* Progress bar for enrolled promos */}
                            {promo.enrolled && promo.progress !== undefined && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                                  <span className="font-semibold">{promo.progress}%</span>
                                </div>
                                <div className="h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={cx(
                                      "h-full rounded-full transition-all duration-500",
                                      promo.progress >= 100 ? "bg-emerald-500" : "bg-blue-500"
                                    )}
                                    style={{ width: `${Math.min(100, promo.progress)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-xs text-zinc-500 mb-1">Reward</p>
                            <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg px-3 py-2">
                              <p className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">
                                {promo.reward.type === "discount" ? `${promo.reward.value}%` :
                                 `$${promo.reward.value}`}
                              </p>
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                {promo.reward.type === "discount" ? "OFF" : promo.reward.type}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-white/5">
                          {!promo.enrolled ? (
                            <button
                              type="button"
                              onClick={() => onEnrollPromo(promo.id)}
                              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
                            >
                              Enroll Now
                            </button>
                          ) : promo.status === "enrolled" ? (
                            <button
                              type="button"
                              onClick={() => onCheckProgress(promo.id)}
                              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                            >
                              Check Progress
                            </button>
                          ) : promo.status === "completed" ? (
                            <div className="flex-1 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium text-center">
                              ✓ Reward Earned!
                            </div>
                          ) : null}
                          <button
                            type="button"
                            className="px-4 py-2 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-white/5 transition"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}

                    {promos.length === 0 && (
                      <div className="text-center py-12 bg-zinc-50 dark:bg-white/5 rounded-xl">
                        <span className="text-4xl">🎁</span>
                        <p className="mt-3 font-medium text-zinc-600 dark:text-zinc-400">No health benefits available</p>
                        <p className="text-sm text-zinc-500 mt-1">Check back soon for new programs!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ) : null}

          {role === "doctor" && doctorTab === "deck" ? (
            <Card
              title="Patient Deck"
              subtitle="Anonymized patients with status badges (mock data)."
            >
              <div className="grid gap-4">
                <div className="grid gap-2">
                  {demoPeople
                    .filter((p) => p.id !== "aura-user")
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPatientId(p.id)}
                        className={cx(
                          "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition",
                          patientId === p.id
                            ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-white/5"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5",
                        )}
                      >
                        <span className="font-medium">{p.anonymizedLabel}</span>
                        <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                      </button>
                    ))}
                </div>

                <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{patient.anonymizedLabel}</p>
                    <Badge tone={statusTone(patient.status)}>{patient.status}</Badge>
                  </div>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">Latest biomarker snapshot</p>
                  <div className="mt-3 grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Integrity score</span>
                      <span className="font-medium">{computeIntegrityScore(patientDay)}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Active calories</span>
                      <span className="font-medium">{patientDay.activeCalories}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">Sleep</span>
                      <span className="font-medium">{patientDay.sleepHours}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">BP</span>
                      <span className="font-medium">{patientDay.systolic}/{patientDay.diastolic}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">RHR / HRV</span>
                      <span className="font-medium">{patientDay.restingHeartRate} bpm / {patientDay.hrvMs} ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {role === "doctor" && doctorTab === "treatment" ? (
            <Card
              title="Treatment Simulation"
              subtitle="Select a patient and simulate treatment outcomes with drug interaction checks"
            >
              <div className="grid gap-4">
                {/* Step 1: Patient Selection */}
                <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                    Select Patient
                  </p>
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {demoPeople
                      .filter((p) => p.id !== "aura-user")
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPatientId(p.id)}
                          className={cx(
                            "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition",
                            patientId === p.id
                              ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                              : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5",
                          )}
                        >
                          <span className="font-medium">{p.anonymizedLabel}</span>
                          <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Patient Biomarkers Preview */}
                {patient && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-800 dark:bg-blue-900/10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                        {patient.anonymizedLabel} - Current Biomarkers
                      </p>
                      <Badge tone={statusTone(patient.status)}>{patient.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-zinc-500">Integrity Score</p>
                        <p className="font-bold text-lg">{computeIntegrityScore(patientDay)}/100</p>
                      </div>
                      <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-zinc-500">Blood Pressure</p>
                        <p className="font-bold">{patientDay.systolic}/{patientDay.diastolic} mmHg</p>
                      </div>
                      <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-zinc-500">Glucose</p>
                        <p className="font-bold">{patientDay.glucoseMgDl} mg/dL</p>
                      </div>
                      <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-zinc-500">Resting HR</p>
                        <p className="font-bold">{patientDay.restingHeartRate} bpm</p>
                      </div>
                      <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-zinc-500">HRV</p>
                        <p className="font-bold">{patientDay.hrvMs} ms</p>
                      </div>
                      <div className="bg-white/70 dark:bg-white/5 rounded-lg p-2">
                        <p className="text-zinc-500">Sleep</p>
                        <p className="font-bold">{patientDay.sleepHours}h</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Treatment Configuration */}
                <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                    Configure Treatment
                  </p>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Treatment/Drug Name</span>
                        <input
                          value={treatmentName}
                          onChange={(e) => setTreatmentName(e.target.value)}
                          placeholder="e.g., Metformin, Lisinopril"
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Dosage</span>
                        <input
                          value={treatmentDosage}
                          onChange={(e) => setTreatmentDosage(e.target.value)}
                          placeholder="e.g., 500mg"
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                        />
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Treatment Type</span>
                        <select
                          value={treatmentType}
                          onChange={(e) => setTreatmentType(e.target.value as "medication" | "procedure" | "lifestyle")}
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                        >
                          <option value="medication">Medication</option>
                          <option value="procedure">Procedure</option>
                          <option value="lifestyle">Lifestyle Change</option>
                        </select>
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Simulation Period</span>
                        <select
                          value={treatmentDays}
                          onChange={(e) => setTreatmentDays(Number(e.target.value))}
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                        >
                          <option value={30}>30 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>180 days</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    💡 The simulation will automatically check for drug interactions using medical APIs and provide clinical insights powered by AI.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onRunTreatmentSim}
                    disabled={treatmentBusy || !treatmentName.trim()}
                    className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-60 flex items-center gap-2"
                  >
                    {treatmentBusy ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Simulating & Checking Interactions...
                      </>
                    ) : (
                      "Run Treatment Simulation"
                    )}
                  </button>
                  {treatmentError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{treatmentError}</p>
                  )}
                </div>

                {/* Agent Thinking Visualization - Shows during simulation */}
                {treatmentBusy && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-800 dark:bg-blue-900/10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="animate-pulse w-2 h-2 bg-blue-500 rounded-full" />
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Agent Thinking...</p>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 animate-pulse">
                        <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-[10px]">1</span>
                        <span>Analyzing patient profile and conditions...</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-500/70 dark:text-blue-500/70">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px]">2</span>
                        <span>Checking drug interactions via medical APIs...</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-400/50 dark:text-blue-600/50">
                        <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[10px]">3</span>
                        <span>Generating treatment simulation projections...</span>
                      </div>
                    </div>
                  </div>
                )}

                {treatmentResult && (
                  <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-semibold">{treatmentResult.treatmentName}</p>
                      <Badge tone={treatmentResult.source === "dify_enhanced" ? "green" : "zinc"}>
                        {treatmentResult.source.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    {/* AI Thinking Steps (collapsed by default) */}
                    {treatmentResult.thinkingSteps && treatmentResult.thinkingSteps.length > 0 && (
                      <details className="mb-4">
                        <summary className="cursor-pointer text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          View AI Analysis Steps ({treatmentResult.thinkingSteps.length} steps)
                        </summary>
                        <div className="mt-2 p-3 bg-zinc-50 dark:bg-white/5 rounded-lg space-y-2">
                          {treatmentResult.thinkingSteps.map((step, i) => (
                            <div key={i} className="flex gap-2 text-xs">
                              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 text-blue-700 dark:text-blue-300 text-[10px] font-medium">
                                {step.step}
                              </span>
                              <div>
                                <p className="font-medium text-zinc-700 dark:text-zinc-300">{step.title}</p>
                                {step.content && (
                                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">{step.content}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Efficacy Score</p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                          {treatmentResult.efficacyScore}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                        <p className="text-xs text-amber-600 dark:text-amber-400">Risk Score</p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                          {treatmentResult.riskScore}%
                        </p>
                      </div>
                    </div>

                    {/* Drug Interactions Section */}
                    {treatmentResult.drugInteractions && treatmentResult.drugInteractions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1">
                          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Drug Interactions Detected ({treatmentResult.drugInteractions.length})
                        </p>
                        <div className="space-y-2">
                          {treatmentResult.drugInteractions.map((interaction, i) => (
                            <div
                              key={i}
                              className={cx(
                                "p-2 rounded-lg text-xs",
                                interaction.severity === "contraindicated" && "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700",
                                interaction.severity === "high" && "bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700",
                                interaction.severity === "moderate" && "bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700",
                                interaction.severity === "low" && "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800",
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{interaction.drug}</span>
                                <Badge tone={
                                  interaction.severity === "contraindicated" ? "red" :
                                  interaction.severity === "high" ? "red" :
                                  interaction.severity === "moderate" ? "amber" : "zinc"
                                }>
                                  {interaction.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-zinc-600 dark:text-zinc-400">{interaction.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projections Chart (simplified) */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Biomarker Projections
                      </p>
                      <div className="grid gap-1 text-xs">
                        {treatmentResult.projections.slice(-3).map((p) => (
                          <div key={p.day} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-white/5 rounded">
                            <span>Day {p.day}</span>
                            <span>BP: {p.bloodPressure}</span>
                            <span>Glucose: {p.glucoseMgDl}</span>
                            <span>Health: {p.overallHealth}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expected Outcomes */}
                    <div className="grid gap-3 mb-4">
                      <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">Expected Benefits</p>
                        <ul className="text-xs text-emerald-600 dark:text-emerald-400 list-disc pl-4">
                          {treatmentResult.expectedOutcomes.positive.slice(0, 3).map((o, i) => (
                            <li key={i}>{o}</li>
                          ))}
                        </ul>
                      </div>
                      {treatmentResult.expectedOutcomes.risks.length > 0 && (
                        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                          <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Risks to Monitor</p>
                          <ul className="text-xs text-red-600 dark:text-red-400 list-disc pl-4">
                            {treatmentResult.expectedOutcomes.risks.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Alternatives */}
                    {treatmentResult.alternativeTreatments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Alternative Treatments</p>
                        <div className="grid gap-2">
                          {treatmentResult.alternativeTreatments.map((alt, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-white/5 rounded text-xs">
                              <span className="font-medium">{alt.name}</span>
                              <span className="text-zinc-500">{alt.efficacy}% efficacy</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clinical Notes */}
                    <div className="rounded-lg bg-zinc-100 p-3 dark:bg-white/5">
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Clinical Notes</p>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">{treatmentResult.clinicalNotes}</p>
                    </div>

                    {/* Monitoring */}
                    {treatmentResult.monitoringRecommendations.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Monitoring Recommendations</p>
                        <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc pl-4">
                          {treatmentResult.monitoringRecommendations.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ) : null}

          {role === "insurer" && insurerTab === "promos" ? (
            <div className="space-y-6">
              {/* Dashboard Header */}
              <Card
                title="Health Promos Dashboard"
                subtitle="Monitor enrollment and achievement metrics across all health incentive programs"
              >
                <div className="grid gap-6">
                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-xs">Total Programs</p>
                          <p className="text-3xl font-bold mt-1">{promos.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">📋</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-100 text-xs">Total Enrolled</p>
                          <p className="text-3xl font-bold mt-1">{promos.filter(p => p.enrolled).length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">👥</span>
                        </div>
                      </div>
                      <p className="text-xs text-amber-100 mt-2">
                        {promos.length > 0 ? Math.round((promos.filter(p => p.enrolled).length / promos.length) * 100) : 0}% enrollment rate
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-100 text-xs">Achieved Goals</p>
                          <p className="text-3xl font-bold mt-1">{promos.filter(p => p.status === "completed").length}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">🏆</span>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-100 mt-2">
                        {promos.filter(p => p.enrolled).length > 0 
                          ? Math.round((promos.filter(p => p.status === "completed").length / promos.filter(p => p.enrolled).length) * 100) 
                          : 0}% success rate
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-xs">Total Rewards</p>
                          <p className="text-3xl font-bold mt-1">${totalSavings}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                      <p className="text-xs text-purple-100 mt-2">
                        Distributed to members
                      </p>
                    </div>
                  </div>

                  {/* Visual Charts Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Enrollment Funnel */}
                    <div className="rounded-xl border border-zinc-200 dark:border-white/10 p-4">
                      <h3 className="font-semibold text-sm mb-4">📊 Enrollment Funnel</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-600 dark:text-zinc-400">Available Programs</span>
                            <span className="font-medium">{promos.length}</span>
                          </div>
                          <div className="h-8 bg-zinc-100 dark:bg-white/5 rounded-lg overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-lg" style={{ width: '100%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-600 dark:text-zinc-400">Enrolled Members</span>
                            <span className="font-medium">{promos.filter(p => p.enrolled).length}</span>
                          </div>
                          <div className="h-8 bg-zinc-100 dark:bg-white/5 rounded-lg overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-lg transition-all"
                              style={{ width: `${promos.length > 0 ? (promos.filter(p => p.enrolled).length / promos.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-600 dark:text-zinc-400">Goals Achieved</span>
                            <span className="font-medium">{promos.filter(p => p.status === "completed").length}</span>
                          </div>
                          <div className="h-8 bg-zinc-100 dark:bg-white/5 rounded-lg overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-lg transition-all"
                              style={{ width: `${promos.length > 0 ? (promos.filter(p => p.status === "completed").length / promos.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="rounded-xl border border-zinc-200 dark:border-white/10 p-4">
                      <h3 className="font-semibold text-sm mb-4">📈 Programs by Category</h3>
                      <div className="space-y-3">
                        {[
                          { category: "fitness", label: "Fitness", icon: "🏃", color: "bg-blue-500" },
                          { category: "nutrition", label: "Nutrition", icon: "🥗", color: "bg-green-500" },
                          { category: "prevention", label: "Prevention", icon: "💉", color: "bg-purple-500" },
                          { category: "wellness", label: "Wellness", icon: "🧘", color: "bg-amber-500" },
                        ].map(cat => {
                          const count = promos.filter(p => p.category === cat.category).length;
                          const enrolled = promos.filter(p => p.category === cat.category && p.enrolled).length;
                          const completed = promos.filter(p => p.category === cat.category && p.status === "completed").length;
                          return (
                            <div key={cat.category} className="flex items-center gap-3">
                              <span className="text-lg">{cat.icon}</span>
                              <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium">{cat.label}</span>
                                  <span className="text-zinc-500">{count} programs</span>
                                </div>
                                <div className="flex gap-1 h-4">
                                  <div 
                                    className={`${cat.color} rounded transition-all`}
                                    style={{ width: `${count > 0 ? (enrolled / count) * 100 : 0}%` }}
                                    title={`${enrolled} enrolled`}
                                  />
                                  <div 
                                    className="bg-emerald-500 rounded transition-all"
                                    style={{ width: `${count > 0 ? (completed / count) * 100 : 0}%` }}
                                    title={`${completed} completed`}
                                  />
                                  <div className="flex-1 bg-zinc-100 dark:bg-white/10 rounded" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div className="flex gap-4 text-xs text-zinc-500 mt-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> Enrolled</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded" /> Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Programs Performance Table */}
                  <div className="rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">📋 All Programs Performance</h3>
                      <button
                        onClick={onLoadPromos}
                        className="px-3 py-1.5 text-xs bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 rounded-lg transition"
                        disabled={promosBusy}
                      >
                        {promosBusy ? "Loading..." : "Refresh"}
                      </button>
                    </div>
                    
                    {promosBusy ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-3 border-amber-200 border-t-amber-600 rounded-full mx-auto" />
                        <p className="mt-3 text-sm text-zinc-500">Loading dashboard data...</p>
                      </div>
                    ) : promosError ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-red-600 dark:text-red-400">{promosError}</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-zinc-50 dark:bg-white/5 text-xs text-zinc-500">
                            <tr>
                              <th className="text-left px-4 py-3 font-medium">Program</th>
                              <th className="text-left px-4 py-3 font-medium">Category</th>
                              <th className="text-center px-4 py-3 font-medium">Enrolled</th>
                              <th className="text-center px-4 py-3 font-medium">Progress</th>
                              <th className="text-center px-4 py-3 font-medium">Status</th>
                              <th className="text-right px-4 py-3 font-medium">Reward</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                            {promos.map((promo) => (
                              <tr key={promo.id} className="hover:bg-zinc-50 dark:hover:bg-white/5">
                                <td className="px-4 py-3">
                                  <p className="font-medium">{promo.name}</p>
                                  <p className="text-xs text-zinc-500 truncate max-w-xs">{promo.description}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cx(
                                    "px-2 py-1 rounded-full text-xs font-medium",
                                    promo.category === "fitness" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                                    promo.category === "nutrition" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                                    promo.category === "prevention" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                                    promo.category === "wellness" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                                  )}>
                                    {promo.category}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={promo.enrolled ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}>
                                    {promo.enrolled ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {promo.progress !== undefined ? (
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                          className={cx(
                                            "h-full rounded-full",
                                            promo.progress >= 100 ? "bg-emerald-500" : "bg-blue-500"
                                          )}
                                          style={{ width: `${Math.min(100, promo.progress)}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium w-10 text-right">{promo.progress}%</span>
                                    </div>
                                  ) : (
                                    <span className="text-zinc-400 text-xs">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Badge tone={
                                    promo.status === "completed" ? "green" :
                                    promo.status === "enrolled" ? "amber" : "zinc"
                                  }>
                                    {promo.status}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                    {promo.reward.type === "discount" ? `${promo.reward.value}%` : `$${promo.reward.value}`}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {promos.length === 0 && (
                          <div className="text-center py-12">
                            <span className="text-4xl">📋</span>
                            <p className="mt-3 font-medium text-zinc-600 dark:text-zinc-400">No programs yet</p>
                            <p className="text-sm text-zinc-500 mt-1">Create health incentive programs for your members</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ) : null}

          {role === "insurer" && insurerTab === "policy" ? (
            <Card
              title="Policy Decoder"
              subtitle="Ask questions about your insurance policy using Dify RAG."
            >
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Powered by Dify Knowledge Base RAG
                  </p>
                  <Badge tone="amber">Dify RAG</Badge>
                </div>
                
                <label className="grid gap-1 text-sm">
                  <span className="font-medium">Ask about your policy</span>
                  <input
                    value={policyQuery}
                    onChange={(e) => setPolicyQuery(e.target.value)}
                    placeholder='e.g., "Is gym membership covered?", "What preventive care is included?"'
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                  />
                </label>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onPolicyDecode}
                    disabled={policyBusy}
                    className="h-10 rounded-xl bg-amber-600 px-4 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {policyBusy ? "Searching…" : "Search Policy"}
                  </button>
                  {policyError ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{policyError}</p>
                  ) : null}
                </div>

                {policyResult ? (
                  <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold">Answer</p>
                      <Badge tone={policyResult.source === "dify_rag" ? "green" : "zinc"}>
                        {policyResult.source === "dify_rag" ? "Dify RAG" : "Demo"}
                      </Badge>
                    </div>
                    <p className="text-sm leading-6">{policyResult.answer}</p>
                    
                    {policyResult.relevantClauses.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Relevant Policy Clauses</p>
                        <div className="grid gap-2">
                          {policyResult.relevantClauses.map((clause, i) => (
                            <div key={i} className="rounded-lg bg-zinc-50 p-3 text-xs dark:bg-white/5">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{clause.section}: {clause.title}</span>
                                <Badge tone={
                                  clause.coverage === "covered" ? "green" :
                                  clause.coverage === "not_covered" ? "red" :
                                  clause.coverage === "partial" ? "amber" : "zinc"
                                }>
                                  {clause.coverage.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{clause.content}</p>
                              {clause.maxBenefit && (
                                <p className="mt-1 font-medium">Max Benefit: {clause.maxBenefit}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {policyResult.actionItems.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Next Steps</p>
                        <ul className="list-disc pl-4 text-xs text-zinc-700 dark:text-zinc-200">
                          {policyResult.actionItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </Card>
          ) : null}

          {role === "insurer" && insurerTab === "heat" ? (
            <Card
              title="Population Heatmap"
              subtitle="Aggregate risk only — no individual identities (demo)."
            >
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Stable</p>
                    <p className="mt-2 text-2xl font-semibold">{poolCounts.stable}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">At Risk</p>
                    <p className="mt-2 text-2xl font-semibold">{poolCounts.risk}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Critical</p>
                    <p className="mt-2 text-2xl font-semibold">{poolCounts.critical}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-white/10">
                  <p className="font-medium">Pool summary</p>
                  <p className="mt-2 text-zinc-700 dark:text-zinc-200">
                    Total insured pool (demo): {poolCounts.total} users.
                    Heatmap is represented as aggregate counts; no names.
                  </p>
                </div>
              </div>
            </Card>
          ) : null}

          {role === "insurer" && insurerTab === "verify" ? (
            <Card
              title="Verify & Reward (Vitality Credits)"
              subtitle="Issue a challenge; DigiTwin computes locally and returns TRUE/FALSE + proof artifact."
            >
              <div className="grid gap-4">
                <label className="grid gap-1 text-sm">
                  <span className="font-medium">Challenge</span>
                  <select
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value as any)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                  >
                    <option value="active500">Did user burn &gt;500 active calories today?</option>
                    <option value="bmi25">Maintenance of BMI &lt; 25 (demo placeholder)</option>
                  </select>
                </label>

                <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-white/10">
                  <p className="font-medium">Mechanism</p>
                  <p className="mt-2 text-zinc-700 dark:text-zinc-200">
                    Challenge: “{verifyPool.statement}”
                  </p>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    DigiTwin runs locally on the user’s device, computes the answer locally, and sends back only the result + proof.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onIssueCredits}
                    disabled={verifyBusy}
                    className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                  >
                    {verifyBusy ? "Issuing…" : "Issue Vitality Credits"}
                  </button>
                  {verifyError ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{verifyError}</p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-white/10">
                  <p className="font-medium">Population result (demo)</p>
                  <p className="mt-2 text-zinc-700 dark:text-zinc-200">
                    {verifyPool.verified} Users Verified → Credits Released
                  </p>
                  {verifyResult ? (
                    <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-xs dark:bg-white/5">
                      <p className="font-semibold">Proof artifact</p>
                      <p className="mt-1">Scheme: {verifyResult.proof.scheme}</p>
                      <p className="mt-1 break-all">Commitment: {verifyResult.proof.commitment}</p>
                      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{verifyResult.proof.note}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          ) : null}

          {role === "insurer" && insurerTab === "risk" ? (
            <Card
              title="Risk Projector"
              subtitle="Financial projection (demo) based on aggregate pool mix."
            >
              <div className="grid gap-4">
                <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-white/10">
                  <p className="font-medium">Projected Payouts 2026</p>
                  <p className="mt-2 text-zinc-700 dark:text-zinc-200">
                    This demo uses a simple multiplier by risk tier to visualize how interventions reduce projected payouts.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: "Stable", value: poolCounts.stable * 1200 },
                    { label: "At Risk", value: poolCounts.risk * 2400 },
                    { label: "Critical", value: poolCounts.critical * 4200 },
                  ].map((x) => (
                    <div
                      key={x.label}
                      className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10"
                    >
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{x.label}</p>
                      <p className="mt-2 text-2xl font-semibold">${x.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}
        </div>

        {/* Profile Summary Card - Only for Patient Space, shown on right */}
        {role === "user" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(true)}
                    className="relative h-16 w-16 rounded-full overflow-hidden border-4 border-white/30 hover:border-white/50 transition-colors shadow-lg"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                        {onboardingData?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </button>
                  <div className="flex-1 text-white">
                    <p className="font-semibold text-lg">{onboardingData?.name || "User"}</p>
                    <p className="text-sm text-white/80">{profile.age || 32} years • {profile.sex || "Not set"}</p>
                  </div>
                </div>
              </div>
              
              {/* Integrity Score */}
              <div className="p-4 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Health Score</span>
                  <Badge tone={integrityScore >= 80 ? "green" : integrityScore >= 60 ? "amber" : "red"}>
                    {integrityScore >= 80 ? "Excellent" : integrityScore >= 60 ? "Good" : "Needs Attention"}
                  </Badge>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">{integrityScore}</span>
                  <span className="text-zinc-500 text-sm mb-1">/100</span>
                </div>
                <div className="mt-2 h-2 bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cx(
                      "h-full transition-all rounded-full",
                      integrityScore >= 80 ? "bg-emerald-500" : integrityScore >= 60 ? "bg-amber-500" : "bg-red-500"
                    )}
                    style={{ width: `${integrityScore}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-50 dark:bg-white/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">❤️</span>
                    <span className="text-xs text-zinc-500">Heart Rate</span>
                  </div>
                  <p className="text-xl font-semibold">{day.restingHeartRate} <span className="text-xs text-zinc-400">bpm</span></p>
                </div>
                <div className="rounded-xl bg-zinc-50 dark:bg-white/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🩸</span>
                    <span className="text-xs text-zinc-500">Blood Pressure</span>
                  </div>
                  <p className="text-xl font-semibold">{day.systolic}/{day.diastolic}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 dark:bg-white/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs text-zinc-500">Calories</span>
                  </div>
                  <p className="text-xl font-semibold">{day.activeCalories} <span className="text-xs text-zinc-400">kcal</span></p>
                </div>
                <div className="rounded-xl bg-zinc-50 dark:bg-white/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">😴</span>
                    <span className="text-xs text-zinc-500">Sleep</span>
                  </div>
                  <p className="text-xl font-semibold">{day.sleepHours} <span className="text-xs text-zinc-400">hrs</span></p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4 border-t border-zinc-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-zinc-50 dark:bg-white/5 p-2">
                    <p className="text-xs text-zinc-500">Allergies</p>
                    <p className="font-medium truncate">{profile.allergies || "None"}</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 dark:bg-white/5 p-2">
                    <p className="text-xs text-zinc-500">Conditions</p>
                    <p className="font-medium truncate">{profile.conditions || "None"}</p>
                  </div>
                </div>
              </div>

              {/* Demo Dataset Selector */}
              <div className="p-4 border-t border-zinc-100 dark:border-white/5">
                <label className="grid gap-1 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Demo biomarker dataset</span>
                  <select
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                  >
                    {demoPeople.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.displayName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* User Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-white/20">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {onboardingData?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{onboardingData?.name || "User"}</p>
                  <p className="text-xs text-zinc-500">DigiTwin User Profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-white/10">
              {[
                { key: "bio", label: "Biological Profile" },
                { key: "subscription", label: "Subscription" },
                { key: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setProfileTab(tab.key as typeof profileTab)}
                  className={cx(
                    "flex-1 py-3 text-sm font-medium transition border-b-2",
                    profileTab === tab.key
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Biological Profile Tab */}
              {profileTab === "bio" && (
                <div className="grid gap-4">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Used for simulations. Stored in your browser only.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Age</span>
                      <input
                        value={profile.age ?? ""}
                        onChange={(e) =>
                          persist({
                            ...profile,
                            age: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        inputMode="numeric"
                        className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Sex</span>
                      <select
                        value={profile.sex ?? "other"}
                        onChange={(e) =>
                          persist({
                            ...profile,
                            sex: e.target.value as BiologicalProfile["sex"],
                          })
                        }
                        className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                  </div>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Allergies</span>
                    <input
                      value={profile.allergies ?? ""}
                      onChange={(e) => persist({ ...profile, allergies: e.target.value })}
                      placeholder="e.g., Penicillin"
                      className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Conditions</span>
                    <input
                      value={profile.conditions ?? ""}
                      onChange={(e) => persist({ ...profile, conditions: e.target.value })}
                      placeholder="e.g., High blood pressure"
                      className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Blood pressure</span>
                      <input
                        value={profile.bloodPressure ?? ""}
                        onChange={(e) => persist({ ...profile, bloodPressure: e.target.value })}
                        placeholder="e.g., 140/90"
                        className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                      />
                    </label>
                    <label className="flex items-end gap-2 text-sm pb-2">
                      <input
                        type="checkbox"
                        checked={Boolean(profile.smoker)}
                        onChange={(e) =>
                          persist({
                            ...profile,
                            smoker: e.target.checked,
                            cigarettesPerDay: e.target.checked
                              ? profile.cigarettesPerDay ?? 5
                              : 0,
                          })
                        }
                        className="h-4 w-4 rounded border-zinc-300"
                      />
                      <span className="text-zinc-700 dark:text-zinc-200">Smoker</span>
                    </label>
                  </div>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Current meds (optional)</span>
                    <input
                      value={profile.currentMeds ?? ""}
                      onChange={(e) => persist({ ...profile, currentMeds: e.target.value })}
                      placeholder="e.g., Lisinopril 10mg daily"
                      className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Demo biomarker dataset</span>
                    <select
                      value={selectedPersonId}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                    >
                      {demoPeople.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.displayName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {/* Subscription Tab */}
              {profileTab === "subscription" && (
                <div className="grid gap-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-emerald-700 dark:text-emerald-300">DigiTwin Pro</p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">Active subscription</p>
                      </div>
                      <Badge tone="green">Active</Badge>
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-zinc-600 dark:text-zinc-400">Plan</span>
                      <span className="font-medium">Pro (Hackathon Demo)</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-zinc-600 dark:text-zinc-400">Started</span>
                      <span className="font-medium">February 2026</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-zinc-600 dark:text-zinc-400">AI Coach Access</span>
                      <span className="font-medium text-emerald-600">Unlimited</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-white/5">
                      <span className="text-zinc-600 dark:text-zinc-400">Voice Sessions</span>
                      <span className="font-medium text-emerald-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Simulations/day</span>
                      <span className="font-medium">Unlimited</span>
                    </div>
                  </div>
                  <button className="mt-2 w-full h-10 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/5 transition">
                    Manage Subscription
                  </button>
                </div>
              )}

              {/* Settings Tab */}
              {profileTab === "settings" && (
                <div className="grid gap-4">
                  <div className="rounded-xl border border-zinc-200 dark:border-white/10 p-4">
                    <p className="font-medium mb-3">Preferences</p>
                    <div className="grid gap-3 text-sm">
                      <label className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Dark mode</span>
                        <input type="checkbox" className="h-4 w-4 rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Voice feedback</span>
                        <input type="checkbox" className="h-4 w-4 rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Notifications</span>
                        <input type="checkbox" className="h-4 w-4 rounded" />
                      </label>
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 dark:border-white/10 p-4">
                    <p className="font-medium mb-3">Privacy</p>
                    <div className="grid gap-3 text-sm">
                      <p className="text-zinc-600 dark:text-zinc-400">
                        All data is stored locally in your browser. No personal health information is sent to servers.
                      </p>
                      <button className="text-left text-red-600 dark:text-red-400 hover:underline">
                        Clear all local data
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 dark:border-white/10 p-4">
                    <p className="font-medium mb-3">About</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      DigiTwin v0.1.0 — Tech Hackathon Demo
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <LogoMark />
            <span className="text-xs text-zinc-500">© 2026 Tech Hackathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
