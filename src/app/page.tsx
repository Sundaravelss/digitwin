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
  const [userTab, setUserTab] = useState<"my" | "cast" | "recover" | "coach">("my");
  
  // User Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState<"bio" | "subscription" | "settings">("bio");
  
  // Nutrition Coach: Voice mode
  const [coachMode, setCoachMode] = useState<"text" | "voice">("text");
  const [coachListening, setCoachListening] = useState(false);
  const [doctorTab, setDoctorTab] = useState<"deck" | "lab" | "evidence" | "treatment">("deck");
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

  // Load promos on tab change
  useEffect(() => {
    if (role === "insurer" && insurerTab === "promos" && promos.length === 0) {
      onLoadPromos();
    }
  }, [role, insurerTab]);

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
    <div className="min-h-screen">
      <header className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <LogoMark />
            <div className="flex items-center gap-3">
              {onboardingData?.name && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Hi, {onboardingData.name}
                </span>
              )}
              <Badge tone="zinc">{headerSubtitle}</Badge>
              {/* User Profile Button */}
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-white/20 hover:border-zinc-400 dark:hover:border-white/40 transition-colors"
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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Privacy-first demo — educational simulation only (not medical advice).
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Segmented
            value={role}
            onChange={(k) => setRole(k as any)}
            options={[
              { key: "user", label: "User View" },
              { key: "doctor", label: "Doctor View" },
              { key: "insurer", label: "Insurer View" },
            ]}
          />

          {role === "user" ? (
            <Segmented
              value={userTab}
              onChange={(k) => setUserTab(k as any)}
              options={[
                { key: "my", label: "My DigiTwin" },
                { key: "cast", label: "Future Cast" },
                { key: "coach", label: "Nutrition Coach" },
                { key: "recover", label: "Recovery Coach" },
              ]}
            />
          ) : null}

          {role === "doctor" ? (
            <Segmented
              value={doctorTab}
              onChange={(k) => setDoctorTab(k as any)}
              options={[
                { key: "deck", label: "Patient Deck" },
                { key: "treatment", label: "Treatment Sim" },
                { key: "lab", label: "Drug Interactions" },
                { key: "evidence", label: "Evidence" },
              ]}
            />
          ) : null}

          {role === "insurer" ? (
            <Segmented
              value={insurerTab}
              onChange={(k) => setInsurerTab(k as any)}
              options={[
                { key: "promos", label: "Health Promos" },
                { key: "policy", label: "Policy Decoder" },
                { key: "heat", label: "Population" },
                { key: "verify", label: "Verify & Reward" },
                { key: "risk", label: "Risk Projector" },
              ]}
            />
          ) : null}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-14 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <Card
          title="Quick Profile"
          subtitle="Click to edit your full profile"
        >
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/10 p-3 hover:bg-zinc-50 dark:hover:bg-white/5 transition text-left"
            >
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-white/20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {onboardingData?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{onboardingData?.name || "User"}</p>
                <p className="text-xs text-zinc-500">{profile.age || 32} years • {profile.sex || "Not set"}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-zinc-50 dark:bg-white/5 p-2">
                <p className="text-xs text-zinc-500">Allergies</p>
                <p className="font-medium truncate">{profile.allergies || "None"}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 dark:bg-white/5 p-2">
                <p className="text-xs text-zinc-500">BP</p>
                <p className="font-medium">{profile.bloodPressure || "N/A"}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 dark:bg-white/5 p-2">
                <p className="text-xs text-zinc-500">Conditions</p>
                <p className="font-medium truncate">{profile.conditions || "None"}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 dark:bg-white/5 p-2">
                <p className="text-xs text-zinc-500">Smoker</p>
                <p className="font-medium">{profile.smoker ? "Yes" : "No"}</p>
              </div>
            </div>

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
        </Card>

        <div className="lg:col-span-2">
          {role === "user" && userTab === "my" ? (
            <Card
              title="My DigiTwin"
              subtitle="Your avatar + Integrity Score powered by on-device biomarker aggregation (demo data)."
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

          {role === "user" && userTab === "cast" ? (
            <Card
              title="Metabolic Simulator"
              subtitle="Simulate the impact of food, meds, and habits using AI + Dify workflows."
            >
              <div className="grid gap-6">
                <div className="grid gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                  <p className="text-sm font-semibold">Medication</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => setMedImage(e.target.files?.[0] ?? null)}
                    className="text-sm"
                  />
                  <input
                    value={medText}
                    onChange={(e) => setMedText(e.target.value)}
                    placeholder='Optional: type medication name (e.g., "Amoxicillin")'
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onRunMedCast}
                      disabled={medBusy}
                      className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                    >
                      {medBusy ? "Simulating…" : "Run Interaction Check"}
                    </button>
                    {medError ? (
                      <p className="text-sm text-red-600 dark:text-red-400">{medError}</p>
                    ) : null}
                  </div>
                  {medResult ? (
                    <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <Pill level={medResult.riskLevel} />
                        <p className="text-sm font-semibold">{medResult.headline}</p>
                      </div>
                      <p className="mt-3 text-sm leading-6">{medResult.explanation}</p>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                  <p className="text-sm font-semibold">Food</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => setFoodImage(e.target.files?.[0] ?? null)}
                    className="text-sm"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onAnalyzeFood}
                      disabled={foodBusy}
                      className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                    >
                      {foodBusy ? "Analyzing…" : "Analyze food"}
                    </button>
                    {foodError ? (
                      <p className="text-sm text-red-600 dark:text-red-400">{foodError}</p>
                    ) : null}
                  </div>

                  {nutrition ? (
                    <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                      <p className="text-sm font-semibold">
                        ~{nutrition.estimatedCalories} kcal ({nutrition.confidence} confidence)
                      </p>
                      {typeof foodDelta === "number" ? (
                        <p className="mt-2 text-sm">
                          <span className="font-medium">Prediction:</span> +{foodDelta}% Inflammation if eaten.
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{nutrition.whatISee}</p>
                      <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm dark:bg-white/5">
                        <p className="font-medium">Burn suggestion</p>
                        <p className="mt-1">{nutrition.burnSuggestion.minutes} min of {nutrition.burnSuggestion.activity}</p>
                        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{nutrition.burnSuggestion.note}</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Deep Scan Nutritionist (Dify Workflow) */}
                <div className="grid gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-white/10 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Deep-Scan Nutritionist</p>
                    <Badge tone="amber">Dify Workflow</Badge>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Scrapes official nutritional PDFs to find hidden sodium, trans fats, and glucose impact.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => setDeepScanImage(e.target.files?.[0] ?? null)}
                    className="text-sm"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onDeepScan}
                      disabled={deepScanBusy}
                      className="h-10 rounded-xl bg-amber-600 px-4 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {deepScanBusy ? "Deep Scanning…" : "Run Deep Scan"}
                    </button>
                    {deepScanError ? (
                      <p className="text-sm text-red-600 dark:text-red-400">{deepScanError}</p>
                    ) : null}
                  </div>

                  {deepScan ? (
                    <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{deepScan.identified}</p>
                        <Badge tone={deepScan.source === "dify" ? "green" : "zinc"}>
                          {deepScan.source.toUpperCase()}
                        </Badge>
                      </div>
                      {deepScan.brand && <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{deepScan.brand} • {deepScan.servingSize}</p>}
                      
                      <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-white/5">
                          <p className="text-zinc-600 dark:text-zinc-400">Calories</p>
                          <p className="font-medium">{deepScan.nutritionFacts.calories}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-white/5">
                          <p className="text-zinc-600 dark:text-zinc-400">Sodium</p>
                          <p className="font-medium">{deepScan.nutritionFacts.sodium}mg</p>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-white/5">
                          <p className="text-zinc-600 dark:text-zinc-400">Trans Fat</p>
                          <p className="font-medium">{deepScan.nutritionFacts.transFat}g</p>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-white/5">
                          <p className="text-zinc-600 dark:text-zinc-400">Sugar</p>
                          <p className="font-medium">{deepScan.nutritionFacts.sugar}g</p>
                        </div>
                      </div>

                      {deepScan.hiddenConcerns.length > 0 && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs dark:bg-red-900/20">
                          <p className="font-medium text-red-700 dark:text-red-300">Hidden Concerns</p>
                          <ul className="mt-1 list-disc pl-4 text-red-600 dark:text-red-400">
                            {deepScan.hiddenConcerns.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      )}

                      <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs dark:bg-amber-900/20">
                        <p className="font-medium text-amber-700 dark:text-amber-300">
                          Glucose Impact: {deepScan.glucoseImpact.spikePrediction.replace("_", " ").toUpperCase()}
                        </p>
                        <p className="mt-1 text-amber-600 dark:text-amber-400">
                          Peak in ~{deepScan.glucoseImpact.peakTimeMinutes} min • {deepScan.glucoseImpact.explanation}
                        </p>
                      </div>

                      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
                        {deepScan.metabolicConsequence.shortTerm}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Future Self (Habits Input) */}
                <div className="grid gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-white/10 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Future Self Simulator</p>
                    <Badge tone="zinc">fal Vision</Badge>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Input your habits to see an aged version of yourself using AI visualization.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Sleep (hours/night)</span>
                      <input
                        type="number"
                        min="0"
                        max="12"
                        value={habitsInput.sleepHours}
                        onChange={(e) => setHabitsInput({ ...habitsInput, sleepHours: Number(e.target.value) })}
                        className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                      />
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Exercise (min/week)</span>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={habitsInput.exerciseMinutes}
                        onChange={(e) => setHabitsInput({ ...habitsInput, exerciseMinutes: Number(e.target.value) })}
                        className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                      />
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Stress Level</span>
                      <select
                        value={habitsInput.stressLevel}
                        onChange={(e) => setHabitsInput({ ...habitsInput, stressLevel: e.target.value as "low" | "moderate" | "high" })}
                        className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Diet Quality</span>
                      <select
                        value={habitsInput.dietQuality}
                        onChange={(e) => setHabitsInput({ ...habitsInput, dietQuality: e.target.value as "poor" | "fair" | "good" | "excellent" })}
                        className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                      >
                        <option value="poor">Poor</option>
                        <option value="fair">Fair</option>
                        <option value="good">Good</option>
                        <option value="excellent">Excellent</option>
                      </select>
                    </label>
                  </div>
                  
                  <label className="grid gap-1 text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Custom habit (optional)</span>
                    <input
                      value={habitsInput.customHabit}
                      onChange={(e) => setHabitsInput({ ...habitsInput, customHabit: e.target.value })}
                      placeholder='e.g., "sleeping 4 hours", "drinking 3 coffees daily"'
                      className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                    />
                  </label>
                  
                  <div className="flex flex-wrap gap-2">
                    {(["current", "aged", "recover"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFutureSelfMode(m)}
                        className={cx(
                          "rounded-full px-3 py-1.5 text-xs font-medium transition",
                          futureSelfMode === m
                            ? "bg-purple-600 text-white"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200"
                        )}
                      >
                        {m === "current" ? "Current" : m === "aged" ? "Aged (Bad Habits)" : "Recovery"}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => setFutureSelfImage(e.target.files?.[0] ?? null)}
                    className="text-sm"
                  />
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onFutureSelf}
                      disabled={futureSelfBusy}
                      className="h-10 rounded-xl bg-purple-600 px-4 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {futureSelfBusy ? "Generating…" : "Generate Future Self"}
                    </button>
                    {futureSelfError ? (
                      <p className="text-sm text-red-600 dark:text-red-400">{futureSelfError}</p>
                    ) : null}
                  </div>

                  {futureSelf ? (
                    <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                      {futureSelf.imageUrl && (
                        <img
                          src={futureSelf.imageUrl}
                          alt="Future self visualization"
                          className="w-full rounded-xl mb-3"
                        />
                      )}
                      <p className="text-sm">{futureSelf.caption}</p>
                      {futureSelf.agingAcceleration && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs dark:bg-red-900/20">
                          <p className="font-medium text-red-700 dark:text-red-300">
                            Biological Age Impact: +{futureSelf.agingAcceleration.yearsAdded} years
                          </p>
                          {futureSelf.agingAcceleration.topFactors.length > 0 && (
                            <ul className="mt-1 list-disc pl-4 text-red-600 dark:text-red-400">
                              {futureSelf.agingAcceleration.topFactors.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                          )}
                          <p className="mt-2">
                            {futureSelf.agingAcceleration.reversible
                              ? "✓ Reversible with lifestyle changes"
                              : "⚠ May require significant intervention"}
                          </p>
                        </div>
                      )}
                      {futureSelf.notes && (
                        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{futureSelf.notes}</p>
                      )}
                    </div>
                  ) : null}
                </div>
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

          {role === "user" && userTab === "recover" ? (
            <Card
              title="Recover"
              subtitle="Action: Start Gradium Voice Session (browser speech-to-text demo)."
            >
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onStartVoice}
                    disabled={listening}
                    className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                  >
                    {listening ? "Listening…" : "Start Gradium Voice Session"}
                  </button>
                  <button
                    type="button"
                    onClick={onCoach}
                    disabled={voiceBusy || !transcript.trim()}
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50"
                  >
                    {voiceBusy ? "Coaching…" : "Get coaching"}
                  </button>
                  {voiceError ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{voiceError}</p>
                  ) : null}
                </div>

                <label className="grid gap-1 text-sm">
                  <span className="font-medium">Transcript</span>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows={3}
                    placeholder="Say or type: 'My knee feels stiff—am I pushing too hard?'"
                    className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                  />
                </label>

                {voiceReply ? (
                  <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-white/10">
                    <p className="font-semibold">Coach</p>
                    <p className="mt-2 leading-6">{voiceReply.reply}</p>
                    <div className="mt-4 grid gap-3">
                      <div>
                        <p className="font-medium">Next prompts</p>
                        <ul className="mt-2 list-disc pl-5 text-zinc-700 dark:text-zinc-200">
                          {voiceReply.nextPrompts.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">Safety</p>
                        <ul className="mt-2 list-disc pl-5 text-zinc-700 dark:text-zinc-200">
                          {voiceReply.safety.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
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
              subtitle="Simulate treatment outcomes on the patient's digital twin (inspired by BioTwin.ai)"
            >
              <div className="grid gap-4">
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Run predictive simulations to see how different treatments might affect the patient's biomarkers over time.
                    This is an educational visualization only — not clinical decision support.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Treatment Name</span>
                      <input
                        value={treatmentName}
                        onChange={(e) => setTreatmentName(e.target.value)}
                        placeholder="e.g., Metformin"
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

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onRunTreatmentSim}
                    disabled={treatmentBusy || !treatmentName.trim()}
                    className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {treatmentBusy ? "Simulating…" : "Run Treatment Simulation"}
                  </button>
                  {treatmentError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{treatmentError}</p>
                  )}
                </div>

                {treatmentResult && (
                  <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-semibold">{treatmentResult.treatmentName}</p>
                      <Badge tone={treatmentResult.source === "dify_enhanced" ? "green" : "zinc"}>
                        {treatmentResult.source.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

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

          {role === "doctor" && doctorTab === "lab" ? (
            <Card
              title="Sim-Lab"
              subtitle="Run Interaction Check with a drag-and-drop drug simulation (demo)."
            >
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  {drugCatalog.map((name) => (
                    <div
                      key={name}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", name)}
                      className="cursor-grab rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-white/10 dark:bg-zinc-950"
                      title="Drag me"
                    >
                      {name}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {([
                    { slot: "A", value: slotA },
                    { slot: "B", value: slotB },
                  ] as const).map((s) => (
                    <div
                      key={s.slot}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const name = e.dataTransfer.getData("text/plain");
                        if (name) onDropDrug(s.slot, name);
                      }}
                      className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm dark:border-white/20 dark:bg-white/5"
                    >
                      <p className="font-medium">Slot {s.slot}</p>
                      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        {s.value ? s.value : "Drop a drug here"}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => (s.slot === "A" ? setSlotA("") : setSlotB(""))}
                          className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onRunInteractionCheck}
                    disabled={labBusy}
                    className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                  >
                    {labBusy ? "Checking…" : "Run Interaction Check"}
                  </button>
                  {labError ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{labError}</p>
                  ) : null}
                </div>

                {labResult ? (
                  <div className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <Pill level={labResult.riskLevel} />
                      <p className="text-sm font-semibold">{labResult.headline}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6">{labResult.explanation}</p>
                  </div>
                ) : null}
              </div>
            </Card>
          ) : null}

          {role === "doctor" && doctorTab === "evidence" ? (
            <Card
              title="Evidence"
              subtitle="Links to papers/resources justifying the AI’s advice (Dify if configured)."
            >
              <div className="grid gap-4">
                <label className="grid gap-1 text-sm">
                  <span className="font-medium">Query</span>
                  <input
                    value={evidenceQuery}
                    onChange={(e) => setEvidenceQuery(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
                  />
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onFetchEvidence}
                    disabled={evidenceBusy}
                    className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                  >
                    {evidenceBusy ? "Retrieving…" : "Retrieve evidence"}
                  </button>
                  {evidenceError ? (
                    <p className="text-sm text-red-600 dark:text-red-400">{evidenceError}</p>
                  ) : null}
                </div>

                {evidence ? (
                  <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Results</p>
                      <Badge tone="zinc">Source: {evidence.source}</Badge>
                    </div>
                    <div className="mt-3 grid gap-3">
                      {evidence.items.map((it) => (
                        <a
                          key={it.title}
                          href={it.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-zinc-200 bg-white p-3 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5"
                        >
                          <p className="font-medium">{it.title}</p>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{it.note}</p>
                          <p className="mt-2 text-xs text-zinc-500">{it.url}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          ) : null}

          {role === "insurer" && insurerTab === "promos" ? (
            <Card
              title="Health Promos & Incentives"
              subtitle="Launch personalized health programs that reward users for improving their health."
            >
              <div className="grid gap-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        Better health = Lower premiums
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                        Users who complete health challenges earn discounts and rewards
                      </p>
                    </div>
                    {totalSavings > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Total Savings</p>
                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">${totalSavings}</p>
                      </div>
                    )}
                  </div>
                </div>

                {promosBusy ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full mx-auto" />
                    <p className="mt-2 text-sm text-zinc-500">Loading promos...</p>
                  </div>
                ) : promosError ? (
                  <p className="text-sm text-red-600 dark:text-red-400">{promosError}</p>
                ) : (
                  <div className="grid gap-3">
                    {promos.map((promo) => (
                      <div
                        key={promo.id}
                        className={`rounded-xl border p-4 transition ${
                          promo.status === "completed"
                            ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                            : promo.status === "enrolled"
                              ? "border-blue-300 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10"
                              : "border-zinc-200 dark:border-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">{promo.name}</p>
                              <Badge
                                tone={
                                  promo.status === "completed" ? "green" :
                                  promo.status === "enrolled" ? "amber" : "zinc"
                                }
                              >
                                {promo.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                              {promo.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <span className="text-zinc-500">
                                Target: {promo.requirements.target} {promo.requirements.unit}
                              </span>
                              <span className="text-zinc-500">
                                Duration: {promo.requirements.duration}
                              </span>
                            </div>
                            
                            {promo.enrolled && promo.progress !== undefined && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span className="font-medium">{promo.progress}%</span>
                                </div>
                                <div className="h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      promo.progress >= 100 ? "bg-emerald-500" : "bg-blue-500"
                                    }`}
                                    style={{ width: `${Math.min(100, promo.progress)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-zinc-500">Reward</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">
                              {promo.reward.type === "discount" ? `${promo.reward.value}% OFF` :
                               promo.reward.type === "cashback" ? `$${promo.reward.value}` :
                               promo.reward.type === "credits" ? `$${promo.reward.value}` :
                               `$${promo.reward.value}`}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1 max-w-24">{promo.reward.description}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          {!promo.enrolled ? (
                            <button
                              type="button"
                              onClick={() => onEnrollPromo(promo.id)}
                              className="px-3 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-xs font-medium"
                            >
                              Enroll Now
                            </button>
                          ) : promo.status === "enrolled" ? (
                            <button
                              type="button"
                              onClick={() => onCheckProgress(promo.id)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
                            >
                              Check Progress
                            </button>
                          ) : promo.status === "completed" ? (
                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                              ✓ Completed
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {promos.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-zinc-500">No promos available</p>
                        <button
                          type="button"
                          onClick={onLoadPromos}
                          className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                          Refresh
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
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

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          DigiTwin is a demo. No PHI is stored server-side by default; browser localStorage holds mocked profile + avatar URL.
        </p>
      </footer>
    </div>
  );
}
