# DigiTwin - The Biological Integrity Agent

> **Tech Europe Paris AI Hackathon Entry**  
> A privacy-first digital twin platform for patients, doctors, and insurers.

![DigiTwin](https://img.shields.io/badge/DigiTwin-Privacy%20First-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🎯 Vision

DigiTwin creates a **biological digital twin** that empowers users to understand their health without exposing raw biometric data. We simulate treatments, predict outcomes, and verify health achievements—all while keeping sensitive data private.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DigiTwin Platform                         │
├─────────────────┬─────────────────────┬─────────────────────────┤
│  Patient Space  │   Doctor Space      │    Insurer Space        │
├─────────────────┼─────────────────────┼─────────────────────────┤
│ • My DigiTwin   │ • Patient Status    │ • Promos Dashboard      │
│ • Health        │ • Treatment Sim     │ • Policy Decoder (RAG)  │
│   Companion     │   (+ Drug Check)    │ • Verify & Reward (ZK)  │
│ • Nutrition     │                     │                         │
│   Coach (24/7)  │                     │                         │
│ • Health        │                     │                         │
│   Benefits      │                     │                         │
└─────────────────┴─────────────────────┴─────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Partner Technologies                         │
├─────────────────┬─────────────────┬─────────────────┬───────────┤
│    OpenAI       │      Dify       │      fal        │  Gradium  │
│  GPT-4o Vision  │ Workflows & RAG │ Image Generation│  Browser  │
│  JSON Outputs   │  Web Scraping   │ Future Self Viz │ Speech API│
└─────────────────┴─────────────────┴─────────────────┴───────────┘
```

---

## ✨ Key Features

### 👤 Patient Space

| Feature | Description |
|---------|-------------|
| **Onboarding** | Personalized setup with health goals, wearable selection, dietary preferences (skippable) |
| **My DigiTwin** | Avatar visualization + Integrity Score from biomarker data (steps, sleep, heart rate, HRV, BP) |
| **Wearables Integration** | Connect Apple Watch, Fitbit, Garmin, Samsung, WHOOP, Oura Ring |
| **Health Companion** | AI chat companion—show health trends, simulate food/medication impact, get personalized insights |
| **Nutrition Coach (24/7)** | AI-powered nutrition guidance available anytime—meal planning, portion control, healthy alternatives |
| **Food Scanner** | Upload food images → calorie estimation + burn suggestions |
| **Deep-Scan Nutritionist** | Dify workflow scrapes official nutrition PDFs for hidden sodium, trans fats, glucose impact |
| **Health Benefits** | View and enroll in insurance health promos—earn rewards for achieving health goals |

### 🩺 Doctor Space

| Feature | Description |
|---------|-------------|
| **My Patients Status** | View anonymized patients with Stable/At Risk/Critical badges |
| **Treatment Simulation** | Select patient → view biomarkers → simulate treatment with drug interaction checking (Dify-powered) |

### 🏦 Insurer Space

| Feature | Description |
|---------|-------------|
| **Promos Dashboard** | KPI cards, enrollment funnel, category breakdown, and full program performance table |
| **Policy Decoder** | Dify RAG answers "Is gym membership covered?" from policy documents |
| **Verify & Reward** | Zero-Knowledge proof concept—user proves "burned >500 cal" without exposing raw data |

---

## 🚀 Getting Started

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

# Optional: fal.ai image generation (Future Self, metabolic visualization)
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

## 🔧 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/health-companion` | AI health companion (trends, food, medication impact) |
| `POST /api/nutrition/coach` | 24/7 Nutrition coach chat |
| `POST /api/nutrition/analyze` | Food image → calorie estimate |
| `POST /api/nutrition/deep-scan` | Deep nutritional analysis (Dify) |
| `POST /api/doctor/treatment-sim` | Treatment simulation + drug interaction check |
| `POST /api/future-self` | Habit-based aging visualization |
| `POST /api/policy/decoder` | Policy RAG queries |
| `POST /api/insurer/promos` | Health promo dashboard data |
| `POST /api/verify/proof` | Zero-Knowledge proof generation |

---

## 🔐 Privacy Shield

DigiTwin implements **data minimization** and **purpose limitation**:

### Zero-Knowledge Verification (Concept)

```
┌──────────────┐     Challenge      ┌──────────────┐
│   Insurer    │ ───────────────► │   DigiTwin   │
│              │                   │   (Local)    │
│              │ ◄─────────────── │              │
│              │   TRUE/FALSE     │  Computes    │
│              │   + ZK Proof     │  Locally     │
└──────────────┘                   └──────────────┘
```

1. **Insurer issues challenge**: "Did user burn >500 active calories today?"
2. **DigiTwin computes locally**: Raw biometrics never leave the device
3. **Only result shared**: TRUE/FALSE + cryptographic proof

### Data Storage

- **Browser localStorage**: Profile, avatar URL, onboarding data
- **No server-side PHI**: API calls are stateless
- **Anonymization**: Doctor/insurer views use anonymized demo data

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16.1.6, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Next.js Edge Runtime (API Routes) |
| **AI/ML** | OpenAI GPT-4o (vision, reasoning), Dify (workflows, RAG) |
| **Image Gen** | fal.ai (Future Self visualization) |
| **Voice** | Web Speech API (Gradium-compatible) |

---

## 📁 Project Structure

```
digitwin/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main single-page app
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Tailwind styles
│   │   └── api/
│   │       ├── _lib/             # Shared utilities
│   │       │   ├── env.ts
│   │       │   ├── dify.ts       # Dify streaming + interactions
│   │       │   ├── openai.ts
│   │       │   └── fal.ts
│   │       ├── health-companion/ # AI health companion chat
│   │       ├── nutrition/
│   │       │   ├── coach/        # 24/7 nutrition chat
│   │       │   ├── analyze/      # Food image analysis
│   │       │   └── deep-scan/    # Dify nutritional scan
│   │       ├── doctor/
│   │       │   └── treatment-sim/ # Treatment sim + drug check
│   │       ├── insurer/
│   │       │   └── promos/       # Health promo system
│   │       ├── future-self/      # Aging visualization
│   │       ├── policy/decoder/   # Policy RAG
│   │       └── verify/proof/     # ZK proof demo
│   ├── components/
│   │   └── Onboarding.tsx        # User onboarding flow
│   └── lib/
│       └── demoBiomarkers.ts     # Demo health data
├── docs/
│   └── DIFY_WORKFLOW_SETUP.md    # Dify setup guide
├── public/
├── package.json
└── README.md
```

---

## 🤝 Partner Technologies

### OpenAI (Required)
- **GPT-4o**: Powers all AI reasoning, vision analysis, JSON outputs
- **Use case**: Food recognition, drug interaction analysis, coaching

### Dify (Optional)
- **Chatflows**: Nutrition analysis workflows
- **Drug Interaction Check**: Fetch latest drug studies via web scraping
- **RAG**: Policy document Q&A
- **Streaming**: Real-time agent thinking visualization

### fal.ai (Optional)
- **Image Generation**: Future Self visualization
- **Metabolic Consequences**: Visual representations

### Gradium (Browser-native)
- **Web Speech API**: Voice input for nutrition coaching
- **No external dependency**: Works in modern browsers

---

## 📋 Demo Data

The app includes demo biomarker datasets for testing:
- **You (Demo)**: Stable baseline user
- **Alex M.**: At-risk profile (high BP, poor sleep)
- **Sam R.**: Stable, good metrics
- **Taylor K.**: Critical profile (very high BP, low HRV)

---

## ⚠️ Disclaimer

**DigiTwin is an educational demonstration only.**

- Not intended for medical diagnosis or treatment
- Not a substitute for professional medical advice
- Demo data is synthetic and for illustration only
- Privacy Shield is a conceptual demonstration

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [BioTwin.ai](https://biotwin.ai/) for treatment simulation inspiration
- Tech Europe Paris AI Hackathon organizers
- OpenAI, Dify, and fal.ai for partner technologies

---

**Built with ❤️ for Tech Europe Paris AI Hackathon**
