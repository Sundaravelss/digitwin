# DigiTwin - Agent Development Notes

> Reference document for AI agents and developers working on the DigiTwin project.
> Last updated: 2025-02-08

---

## Hackathon Context

- **Event:** Tech Europe Paris AI Hackathon
- **Location:** NeonNoir, 14 Rue le Peletier, 75009 Paris
- **Team size:** Max 5
- **Submission deadline:** Sunday 14:00
- **Submission requirements:**
  - 2-minute video demo (Loom or equivalent)
  - Public GitHub repository with README, setup instructions, and documentation
  - Must use **minimum 3 partner technologies**

### Partner Technologies Available

| Partner | What it provides | Status in project |
|---------|-----------------|-------------------|
| **OpenAI** | GPT-4o models, vision, reasoning | **Integrated** - used for nutrition analysis, health companion, treatment notes |
| **Dify** | AI workflow orchestration, RAG, web scraping | **Integrated** - used for treatment sim, drug interactions, policy decoder, deep-scan |
| **fal.ai** | Image generation (Flux model) | **Integrated** - used for Future Self aging visualization |
| **Gradium** | Voice AI / browser speech API | **Integrated** - browser Web Speech API for voice nutrition coaching |
| **Lovable** | Coding agent | Not used |
| **Dust** | AI agent platform | Not used |
| **Alpic/Skybridge** | ChatGPT App framework + MCP | Not yet integrated (stretch goal) |

**Current count: 4 partner technologies (OpenAI, Dify, fal.ai, Gradium) - requirement met.**

### Judging Criteria

- **Creativity** of the solution
- **Technical complexity**
- **Bonus points** for effective use of partner technologies
- Finalists: 5-minute live presentation before jury

### Prizes Targeted

- **Best use of Dify:** EUR 500 cash (side challenge)
- **Open Innovation Track:** Qualification for finalist stage
- **Finalist prizes:** OpenAI credits, Lovable, Gradium credits, Dify Pro Plan

---

## Core Concept

**App Name:** DigiTwin
**Tagline:** "Every person deserves a virtual twin"
**Pitch:** A Biological Digital Twin operating system that simulates the metabolic and physiological impact of choices *before they happen*. Virtual testing before actual treatment. It aligns incentives between Patients, Doctors, and Insurers using predictive AI to save lives and costs.

**Platform:** Next.js web application (potential ChatGPT App via Alpic/Skybridge as stretch goal)

**Interaction modalities:** Text, image upload, voice input

**Backed by:** Simulated biological model + Dify-powered "Cortex" for AI reasoning

### What is a Virtual Twin?

A virtual twin is not a static health profile or a simple score. It is a **dynamic, evolving digital replica** of an individual's biological systems, built from multiple layers of real data:

| Data Layer | Description |
|------------|-------------|
| **Biomarkers** | Blood chemistry, metabolic markers, physiological measurements |
| **Genetics** | DNA-level insights: predispositions, drug responses, risk profiles |
| **Lifestyle** | Sleep, activity, nutrition, behaviors from wearables and self-reports |
| **Longitudinal History** | Years of health data revealing trends and trajectories |

### The Twin Lifecycle

1. **Create** — Twin is born from initial data: biomarkers, wearable streams, baseline health
2. **Update** — Every new data point enriches the twin: lab results, lifestyle changes, new readings
3. **Simulate** — Run "what-if" scenarios: test interventions, predict outcomes without risk
4. **Decide** — Clinicians and individuals make informed, simulation-tested decisions

### The Problem We Solve

Healthcare is reactive. Most spending goes to chronic diseases that are largely preventable with early intervention. DigiTwin shifts the model:

- **Fewer diagnostic errors** — personalized baselines catch anomalies earlier
- **Reduced unnecessary spending** — simulate before prescribing
- **Engaged citizens** — people take ownership of their health journey
- **Lower chronic disease burden** — prevent rather than treat

### Three-Stakeholder Alignment

DigiTwin serves all three sides of the healthcare equation through one platform:

- **Patients** — optimize daily health, understand consequences of choices, get personalized AI coaching
- **Doctors** — monitor patients, simulate treatments and drug interactions before prescribing
- **Insurers** — reduce costs through preventive programs, verify health achievements with privacy-preserving proofs

---

## Three Modes (Role Switching)

The app supports three distinct user roles, each with their own dashboard and feature set. Switching is done via the sidebar/header.

### A. Patient Mode ("The Guardian")

**Goal:** Optimize daily health and recovery.

**Features:**

1. **DigiTwin 3D Dashboard (Home)**
   - 3D user avatar (Three.js) inside an integrity score ring
   - Dashboard showing current DigiTwin status: activity, health metrics, biomarkers
   - Statistics charts, daily activities, body overview
   - Wearables card (Apple Watch, Fitbit, Garmin, etc.)

2. **Health Companion**
   - Chat-based AI assistant for health questions
   - Simulate medicine prescriptions and their effects
   - Side effects analysis based on user's specific condition
   - Personalized care recommendations

3. **Nutrition Coach (24/7)**
   - Suggest what to eat and what to avoid based on health profile
   - **Food Scanner:** Upload a photo of food -> AI predicts glucose spike, calorie count, macro breakdown
   - **Visual Consequences:** Generate image of user avatar looking bloated/tired after bad food choices (via fal.ai)
   - **Deep-Scan Nutritionist:** Dify workflow scrapes official nutrition data for hidden sodium, trans fats, glucose impact
   - Voice-based coaching via Gradium/Web Speech API

4. **Future Self / Habit Impact**
   - User inputs bad habits (e.g., "eating pizza daily", "sleeping 4 hours")
   - OR wearable data tracks poor patterns automatically
   - Agent generates an **aged version** of the user's face showing long-term impact (via fal.ai)
   - Shows reversibility assessment and recovery timeline

5. **Health Benefits**
   - View and enroll in insurance health promotion programs
   - Earn rewards for achieving health goals

6. **Biological Data**
   - Detailed biomarker tracking and trends
   - Steps, calories, sleep, heart rate, HRV, blood pressure, glucose

### B. Doctor Mode

**Goal:** Monitor patients and simulate treatment outcomes.

**Features:**

1. **My Patients Status**
   - View list of patients with risk status badges (Stable / At Risk / Critical)
   - Anonymized patient data with integrity scores
   - Click a patient to view their biomarkers

2. **Treatment Simulation**
   - Doctor selects a patient -> gets their biomarkers and health profile
   - Inputs treatment information (drug, dosage, duration)
   - **Drug Interaction Check:** Part of the treatment simulation itself
     - When simulation launches, it queries Dify workflow to check drug information from medical APIs
     - Considers multiple drugs the patient may be on
     - Flags interactions, contraindications, severity levels
   - **Biomarker Projections:** Shows predicted biomarker changes over the simulation period
   - **Thinking Steps:** Visualizes AI reasoning process in real-time (Dify streaming)
   - **Clinical Notes:** AI-generated summary of simulation results

### C. Insurer Mode

**Goal:** Manage health promotions, decode policies, verify achievements.

**Features:**

1. **Promos Dashboard**
   - KPI cards: total programs, active enrollments, goal achievements, cost savings
   - Enrollment funnel visualization
   - Category breakdown (Fitness, Nutrition, Mental Health, Prevention)
   - Full program performance table

2. **Policy Decoder (RAG)**
   - Dify RAG-powered Q&A over insurance policy documents
   - Users ask natural language questions like "Is gym membership covered?"
   - Returns answers with source citations from policy PDFs

3. **Zero-Knowledge Verify & Reward**
   - Privacy-preserving proof concept
   - Insurer issues challenge (e.g., "Did user burn >500 calories?")
   - DigiTwin computes locally, returns TRUE/FALSE + cryptographic proof
   - Raw biometric data never leaves the device

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.1.6, React 19, TypeScript 5, Tailwind CSS 4 |
| UI Components | Radix UI + shadcn/ui (60+ components) |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Charts | Recharts |
| State | TanStack React Query |
| Forms | React Hook Form + Zod |
| Backend | Next.js API Routes (Edge Runtime) |
| AI Orchestration | Dify (streaming workflows, RAG, web scraping) |
| AI Models | OpenAI GPT-4o (vision, JSON reasoning) |
| Image Gen | fal.ai Flux model |
| Voice | Web Speech API (Gradium-compatible) |

### API Endpoints (17 total)

**Patient:**
- `POST /api/health-companion` - AI health chat
- `POST /api/nutrition/coach` - Nutrition guidance chat
- `POST /api/nutrition/analyze` - Food image -> calorie analysis
- `POST /api/nutrition/deep-scan` - Dify deep nutritional analysis
- `POST /api/nutrition/voice-coach` - Voice-based nutrition coaching
- `POST /api/future-self` - Aging visualization from habits
- `POST /api/visualize/consequence` - Health consequence visualization
- `POST /api/evidence` - Medical evidence retrieval
- `POST /api/med-sim` - Medication simulation
- `POST /api/lifestyle/smoking` - Smoking impact analysis
- `POST /api/preop/coach` - Pre-operative guidance
- `POST /api/preop/timeline` - Surgery timeline
- `POST /api/recover/voice` - Recovery voice coaching

**Doctor:**
- `POST /api/doctor/treatment-sim` - Treatment simulation + drug interactions

**Insurer:**
- `POST /api/insurer/promos` - Health promo dashboard data
- `POST /api/policy/decoder` - Policy RAG queries
- `POST /api/verify/proof` - Zero-knowledge proof generation

### Demo Data

4 demo personas in `src/lib/demoBiomarkers.ts`:
1. **You (Demo)** - Stable baseline (9,800 steps, 63 bpm, 128/82 BP)
2. **Alex M.** - At Risk (poor sleep 5.1h, elevated BP 141/92)
3. **Sam R.** - Stable, excellent metrics (11,300 steps, 58 bpm)
4. **Taylor K.** - Critical (2,400 steps, BP 162/102, HR 92 bpm)

**Integrity Score formula (0-100):**
- Sleep: 0-30 pts (optimal: 8h)
- Activity: 0-25 pts (optimal: 600 cal)
- Steps: 0-15 pts (optimal: 10,000)
- Resting HR: 0-15 pts (lower = better)
- HRV: 0-15 pts (higher = better)

---

## Key Development Principles

1. **Demo-first:** Everything must be demo-able in a 2-minute video and 5-minute live pitch. Prioritize visual impact and smooth UX over technical depth.

2. **Graceful degradation:** All AI features have fallback/demo modes when API keys are missing. The app should work (with mock data) even without external services.

3. **Role switching is core UX:** The mode switch between Patient/Doctor/Insurer is the central narrative of the pitch - showing how one platform aligns all three stakeholders.

4. **Partner tech showcase:** Each integration should be clearly visible and impactful. The Dify integration is especially important for the side challenge (EUR 500).

5. **Privacy narrative:** Zero-Knowledge proof concept and "data never leaves device" messaging are key differentiators.

6. **Visual impact:** 3D avatar, fal.ai generated images, streaming AI thinking steps - these create "wow moments" for the demo.

---

## What's Built vs. What Needs Work

### Fully Built
- Role-based dashboard with sidebar and header navigation
- 3D DigiTwin avatar with integrity score ring
- Health Companion chat interface
- Nutrition Coach with food scanner and deep-scan
- Treatment Simulator with drug interaction checking and thinking steps
- Doctor patient list with risk badges
- Insurer promos dashboard with KPIs
- Policy Decoder (RAG)
- Zero-Knowledge Verify concept
- Future Self aging visualization
- Onboarding flow
- 60+ shadcn/ui components
- Full API layer (17 endpoints)
- Demo biomarker data for 4 personas

### Potential Improvements / Stretch Goals
- ChatGPT App version via Alpic/Skybridge (would add another partner tech)
- Real wearable data integration (currently conceptual)
- More polished 3D avatar (currently basic Three.js sphere)
- Additional Dify workflows for more features
- More visual consequence generation scenarios
- Video demo recording and submission prep

---

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...

# Dify (strongly recommended for full demo)
DIFY_API_URL=https://api.dify.ai/v1
DIFY_API_KEY=app-...

# fal.ai (for Future Self visualization)
FAL_KEY=...
FAL_MODEL=fal-ai/flux/dev

# Optional overrides
OPENAI_MODEL=gpt-4o-mini
```

---

## File Reference

| Key File | Purpose |
|----------|---------|
| `src/app/page.tsx` | Main SPA - all role dashboards, tab routing |
| `src/app/layout.tsx` | Root layout with metadata |
| `src/components/dashboard/Header.tsx` | Top nav with role switcher |
| `src/components/dashboard/Sidebar.tsx` | Left sidebar with role-specific tabs |
| `src/components/dashboard/DigiTwinAvatar.tsx` | 3D avatar with integrity ring |
| `src/components/dashboard/HealthCompanion.tsx` | AI health chat UI |
| `src/components/dashboard/NutritionCoach.tsx` | Nutrition guidance UI |
| `src/components/dashboard/TreatmentSimulator.tsx` | Doctor treatment sim UI |
| `src/components/dashboard/DoctorPatientList.tsx` | Patient management UI |
| `src/components/dashboard/PolicyDecoder.tsx` | RAG policy Q&A UI |
| `src/components/dashboard/ZeroKnowledgeVerify.tsx` | ZK proof concept UI |
| `src/components/dashboard/InsurerPromosDashboard.tsx` | Promo analytics UI |
| `src/app/api/_lib/dify.ts` | Dify streaming + drug interaction helper |
| `src/app/api/_lib/openai.ts` | OpenAI GPT-4o vision + JSON helper |
| `src/app/api/_lib/fal.ts` | fal.ai image generation helper |
| `src/lib/demoBiomarkers.ts` | Demo persona data (4 users) |
| `docs/DIFY_WORKFLOW_SETUP.md` | Dify integration guide |
