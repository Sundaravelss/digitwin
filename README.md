# DigiTwin - The Biological Integrity Agent

> **Tech Europe Paris AI Hackathon Entry**
> A privacy-first digital twin platform for patients, doctors, and insurers.

![DigiTwin](https://img.shields.io/badge/DigiTwin-Privacy%20First-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19-61dafb)

## Vision

DigiTwin creates a **biological digital twin** that empowers users to understand their health without exposing raw biometric data. We simulate treatments, predict outcomes, and verify health achievements — all while keeping sensitive data private.

---

## Architecture

```
+---------------------------------------------------------------+
|                       DigiTwin Platform                       |
+-------------------+---------------------+---------------------+
|  Patient Space    |   Doctor Space      |   Insurer Space     |
+-------------------+---------------------+---------------------+
| - 3D Avatar +     | - Patient Status    | - Promos Dashboard  |
|   Integrity Score |   (Stable/At Risk/  |   (KPIs, Funnel,    |
| - Health          |   Critical)         |   Categories)       |
|   Companion Chat  | - Treatment Sim     | - Policy Decoder    |
| - Nutrition Coach |   (+ Drug Check)    |   (RAG)             |
|   (24/7 + Voice)  | - Patient Intake    | - Verify & Reward   |
| - Food Scanner    |   Analyzer (Dify)   |   (Zero-Knowledge)  |
| - Body Overview   |                     |                     |
| - Meal Plan       |                     |                     |
| - Wearables       |                     |                     |
| - Health Benefits |                     |                     |
| - Biological Data |                     |                     |
+-------------------+---------------------+---------------------+
                             |
                             v
+---------------------------------------------------------------+
|                    Partner Technologies                        |
+-----------------+-----------+-----------+---------------------+
|    OpenAI       |   Dify    |   fal.ai  | Web Speech API      |
|  GPT-4o Vision  | Workflows | Avatar &  | Voice Nutrition     |
|  JSON Outputs   | RAG, Web  | Future    | Coach (Browser-     |
|                 | Scraping  | Self Viz  | native)             |
+-----------------+-----------+-----------+---------------------+
```

---

## Key Features

### Patient Space

| Feature | Description |
|---------|-------------|
| **My DigiTwin** | 3D avatar (Three.js) + Integrity Score computed from biomarker data |
| **Body Overview** | Interactive anatomy with floating biomarker labels and heatmap indicators |
| **Health Companion** | AI chat — simulate food, medication, and habit impact on your biomarkers |
| **Nutrition Coach (24/7)** | Text and voice-based nutrition guidance, meal planning, portion control |
| **Food Scanner** | Upload a food image — GPT-4o estimates calories and suggests burn activities |
| **Meal Plan** | Editable daily meal breakdown with calorie and macronutrient tracking |
| **Biological Data** | Genetic insights, lifestyle metrics, and longitudinal health events |
| **Statistics Chart** | Weekly and monthly activity trends (Recharts) |
| **Wearables** | Connect Apple Watch, Fitbit, Garmin, Samsung, WHOOP, Oura Ring |
| **Health Benefits** | View and enroll in insurance health promos with progress tracking |

### Doctor Space

| Feature | Description |
|---------|-------------|
| **My Patients Status** | Patient roster with Stable / At Risk / Critical badges |
| **Treatment Simulator** | Select patient, view biomarkers, simulate treatment with 7/30/90/180-day projections |
| **Drug Interaction Check** | Dify-powered analysis of drug safety against current medications |
| **Patient Intake Analyzer** | Dify workflow for processing patient intake forms |

### Insurer Space

| Feature | Description |
|---------|-------------|
| **Promos Dashboard** | KPI cards, enrollment funnel, category breakdown, program performance table |
| **Policy Decoder** | Dify RAG answers "Is gym membership covered?" from policy documents |
| **Verify & Reward** | Zero-Knowledge proof concept — user proves "burned >500 cal" without exposing raw data |

---

## Getting Started

### Prerequisites

- **Node.js 18+** (recommended: 20+)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/Sundaravelss/digitwin.git
cd digitwin

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# Required for AI features
OPENAI_API_KEY=sk-...

# Optional: Dify integration (workflows, RAG, web search)
DIFY_API_URL=https://api.dify.ai/v1
DIFY_API_KEY=app-...
DIFY_TREATMENT_API_KEY=app-...
DIFY_INTAKE_API_KEY=app-...

# Optional: fal.ai image generation (Avatar, Future Self)
FAL_KEY=...
FAL_MODEL=... # e.g., fal-ai/flux/dev
```

### Running the App

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/health-companion` | AI health companion (food, medication, habit simulation) |
| `POST /api/nutrition/coach` | 24/7 nutrition coach chat |
| `POST /api/nutrition/analyze` | Food image → calorie estimate + burn suggestions |
| `POST /api/nutrition/deep-scan` | Deep nutritional analysis via Dify |
| `POST /api/nutrition/voice-coach` | Voice-based nutrition guidance |
| `POST /api/doctor/treatment-sim` | Treatment simulation + drug interaction check |
| `POST /api/avatar/generate` | Generate 3D avatar from user photo (fal.ai) |
| `POST /api/patient-intake` | Patient intake form processing (Dify workflow) |
| `POST /api/future-self` | Habit-based aging visualization |
| `POST /api/policy/decoder` | Policy RAG queries |
| `POST /api/insurer/promos` | Health promo dashboard data |
| `POST /api/verify/proof` | Zero-Knowledge proof generation |

---

## Privacy Shield

DigiTwin implements **data minimization** and **purpose limitation**:

### Zero-Knowledge Verification (Concept)

```
+--------------+     Challenge      +--------------+
|   Insurer    | -----------------> |   DigiTwin   |
|              |                    |   (Local)    |
|              | <----------------- |              |
|              |   TRUE/FALSE      |  Computes    |
|              |   + ZK Proof      |  Locally     |
+--------------+                    +--------------+
```

1. **Insurer issues challenge**: "Did user burn >500 active calories today?"
2. **DigiTwin computes locally**: Raw biometrics never leave the device
3. **Only result shared**: TRUE/FALSE + cryptographic proof

### Data Storage

- **Browser localStorage**: Profile, avatar URL, onboarding data
- **No server-side PHI**: API calls are stateless
- **Anonymization**: Doctor/insurer views use anonymized demo data

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.6, React 19, TypeScript 5.x |
| **Styling** | Tailwind CSS 4, PostCSS 4 |
| **UI Components** | Radix UI (60+ primitives), Lucide React icons |
| **3D Graphics** | Three.js, @react-three/fiber, @react-three/drei |
| **Charts** | Recharts |
| **State Management** | React Context, TanStack React Query |
| **Forms** | React Hook Form, Zod validation |
| **Backend** | Next.js API Routes (Edge Runtime) |
| **AI/ML** | OpenAI GPT-4o (vision + reasoning), Dify (workflows, RAG) |
| **Image Generation** | fal.ai (avatar, future-self visualization) |
| **Voice** | Web Speech API (browser-native) |
| **Notifications** | Sonner (toast system) |

---

## Project Structure

```
digitwin/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main single-page app (role-based views)
│   │   ├── layout.tsx                  # Root layout with Providers
│   │   ├── globals.css                 # Tailwind theme + custom variables
│   │   └── api/
│   │       ├── _lib/                   # Shared utilities
│   │       │   ├── env.ts              # Environment helpers
│   │       │   ├── dify.ts             # Dify streaming, workflows, RAG
│   │       │   ├── openai.ts           # OpenAI JSON API wrapper
│   │       │   ├── fal.ts              # fal.ai image generation
│   │       │   ├── base64.ts           # File conversion utilities
│   │       │   └── hash.ts             # Hash utilities
│   │       ├── avatar/generate/        # 3D avatar from photo
│   │       ├── health-companion/       # AI health companion chat
│   │       ├── nutrition/
│   │       │   ├── coach/              # 24/7 nutrition chat
│   │       │   ├── analyze/            # Food image analysis
│   │       │   ├── deep-scan/          # Dify deep nutritional scan
│   │       │   └── voice-coach/        # Voice nutrition guidance
│   │       ├── doctor/treatment-sim/   # Treatment simulator + drug check
│   │       ├── patient-intake/         # Patient intake Dify workflow
│   │       ├── insurer/promos/         # Health promo dashboard
│   │       ├── policy/decoder/         # Policy RAG Q&A
│   │       ├── verify/proof/           # ZK proof demo
│   │       └── future-self/            # Aging visualization
│   ├── components/
│   │   ├── Providers.tsx               # QueryClient, ThemeProvider, Toaster
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx             # Navigation + role switcher
│   │   │   ├── Header.tsx              # Top navigation bar
│   │   │   ├── DigiTwinAvatar.tsx      # Avatar + Integrity Score
│   │   │   ├── Avatar3D.tsx            # Three.js 3D avatar renderer
│   │   │   ├── HealthCompanion.tsx     # Food/med/habit simulator chat
│   │   │   ├── NutritionCoach.tsx      # 24/7 nutrition chat interface
│   │   │   ├── TreatmentSimulator.tsx  # Doctor treatment simulation
│   │   │   ├── StatisticsChart.tsx     # Weekly/monthly activity charts
│   │   │   ├── ActivitySummary.tsx     # Workout breakdown
│   │   │   ├── BodyOverview.tsx        # Anatomy biomarker heatmap
│   │   │   ├── BiologicalData.tsx      # Genetics, lifestyle, events
│   │   │   ├── MealPlan.tsx            # Daily meal breakdown
│   │   │   ├── CaloriesAnalysis.tsx    # Macronutrient breakdown
│   │   │   ├── WearablesCard.tsx       # Connected devices status
│   │   │   ├── HealthBenefits.tsx      # Insurance promo enrollment
│   │   │   ├── InsurerPromosDashboard.tsx # KPI dashboard
│   │   │   ├── PolicyDecoder.tsx       # Policy Q&A interface
│   │   │   ├── ZeroKnowledgeVerify.tsx # ZK proof demo
│   │   │   ├── DoctorPatientList.tsx   # Doctor's patient roster
│   │   │   ├── PatientIntakeAnalyzer.tsx # Dify intake workflow
│   │   │   ├── ProfileCard.tsx         # User profile summary
│   │   │   └── SettingsDialog.tsx      # Settings modal
│   │   └── ui/                         # 60+ Radix UI components
│   ├── context/
│   │   ├── UserAvatarContext.tsx        # Avatar generation & storage
│   │   └── MealPlanContext.tsx          # Meal plan state management
│   ├── hooks/
│   │   ├── use-toast.ts                # Toast notification hook
│   │   └── use-mobile.tsx              # Mobile breakpoint detection
│   ├── data/
│   │   ├── knowledge-base.md           # Single source of truth (clinical + JSON)
│   │   ├── patientData.ts              # Parsed dashboard data
│   │   ├── parseKnowledgeBase.ts       # Knowledge-base parser
│   │   └── patients.json               # Patient database
│   ├── lib/
│   │   ├── demoBiomarkers.ts           # Demo biomarker datasets
│   │   └── utils.ts                    # Utility functions
│   └── assets/                         # Static assets
├── scripts/
│   ├── build-knowledge-base.mjs        # Builds knowledge-base.md from sources
│   └── dify-publish.mjs                # Publishes workflows to Dify
├── docs/
│   ├── DIFY_WORKFLOW_SETUP.md          # Dify configuration guide
│   └── knowledge-base/                 # Clinical narratives per patient
├── public/
│   └── models/avatar.glb              # Default 3D avatar model
├── package.json
├── next.config.ts                      # Markdown raw-loader config
├── tsconfig.json
└── README.md
```

---

## Knowledge Base & Data Pipeline

DigiTwin uses a **single source of truth** pattern:

1. **Clinical narratives** live in `docs/knowledge-base/*.md` (one per patient)
2. **Structured data** lives in `src/data/patients.json`
3. The `scripts/build-knowledge-base.mjs` script merges both into `src/data/knowledge-base.md`
4. This file is loaded at build time via `raw-loader` and parsed by `parseKnowledgeBase.ts`
5. The same knowledge base is uploaded to Dify for RAG queries

---

## Partner Technologies

### OpenAI (Required)
- **GPT-4o**: Powers all AI reasoning, vision analysis, JSON outputs
- **Use cases**: Food recognition, drug interaction analysis, health coaching, clinical reasoning

### Dify (Optional)
- **Chatflows**: Multi-step AI conversations (health companion, nutrition)
- **Workflows**: Patient intake processing, drug interaction checks
- **RAG**: Policy document Q&A with retrieval-augmented generation
- **Web Scraping**: Fetch latest drug interaction studies
- **Streaming**: Real-time agent thinking visualization

### fal.ai (Optional)
- **Avatar Generation**: Create 3D character portraits from user photos
- **Future Self**: Habit-based aging visualizations

### Web Speech API (Browser-native)
- **Voice Input**: Hands-free nutrition coaching
- **No external dependency**: Works in modern browsers

---

## Demo Data

The app includes demo biomarker datasets for testing without external APIs:

| Profile | Status | Key Traits |
|---------|--------|------------|
| **You (Demo)** | Stable (85/100) | Balanced baseline user |
| **Alex M.** | At Risk | High BP, poor sleep, low HRV |
| **Sam R.** | Stable | Good metrics across the board |
| **Taylor K.** | Critical | Very high BP, low HRV, minimal activity |

Each profile includes 5 days of longitudinal data: steps, active calories, sleep hours, resting heart rate, HRV, blood pressure, and glucose.

**Integrity Score** is calculated as a weighted composite:
- 30% sleep quality
- 25% activity level
- 15% daily steps
- 15% resting heart rate
- 15% heart rate variability

---

## Disclaimer

**DigiTwin is an educational demonstration only.**

- Not intended for medical diagnosis or treatment
- Not a substitute for professional medical advice
- Demo data is synthetic and for illustration only
- Privacy Shield is a conceptual demonstration

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Tech Europe Paris AI Hackathon organizers
- OpenAI, Dify, and fal.ai for partner technologies

---

**Built for Tech Europe Paris AI Hackathon**
