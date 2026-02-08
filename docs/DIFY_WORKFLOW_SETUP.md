# Dify Agentic Workflow Setup Guide

This guide explains how to set up **agentic Dify workflows** for DigiTwin's two core simulation use cases:

1. **Patient Space** -- Food, snack, or medication intake simulation with biomarker projections
2. **Doctor Space** -- Treatment simulation with dosage, drug interactions, and outcome projections

Both workflows are designed to be **agentic**: they autonomously retrieve data from the patient knowledge base (`src/data/patients.json`), call external APIs/web search, reason over patient-specific biomarkers and pharmacogenomics, and produce structured simulation outputs including text analysis and chart-ready data.

---

## Architecture Overview

```
                          DigiTwin App
                               │
                ┌──────────────┴──────────────┐
                │                             │
        Patient Space                  Doctor Space
        (Health Companion)             (Treatment Simulator)
                │                             │
                ▼                             ▼
   POST /api/health-companion     POST /api/doctor/treatment-sim
                │                             │
                └──────────┬──────────────────┘
                           ▼
                    Dify Agent Workflow
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Knowledge Base   Custom Tools   Web Search
        (Markdown KB     (OpenAPI specs  (Drug info,
         - biomarkers     for Nutrition   latest
         - genetics       APIs, FDA       research)
         - pharmagenomics DrugBank)
         - medical history
         - longitudinal data)
              │            │            │
              └────────────┼────────────┘
                           ▼
                   LLM Reasoning Chain
                   (Multi-step analysis)
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Text Analysis   Chart Data    Suggestions
        (impact         (biomarker    (follow-up
         summary)        projections)  actions)
```

---

## Quick Start: Import Pre-Built Workflows

Two ready-to-import Dify workflow DSL files are available in `docs/dify-workflows/`:

| File | Use Case | Nodes |
|------|----------|-------|
| `digitwin-patient-intake-workflow.yml` | Patient Health Companion (food/med analysis) | Start → KB → Classify → IF food/med → USDA/OpenFDA → Cross-Reference LLM → Simulation LLM → Code Validate → Answer |
| `digitwin-treatment-sim-workflow.yml` | Doctor Treatment Simulator | Start → KB + OpenFDA (parallel) → PGx LLM → DDI LLM → Safety LLM → Trajectory LLM → Summary LLM → Code Validate → Answer |

### Import Steps

1. **Create Knowledge Base first**: In Dify, go to **Knowledge** → **Create Knowledge Base** → name it `patient-profiles` → upload all 5 Markdown files from `docs/knowledge-base/` → wait for indexing to complete
2. **Copy your KB ID**: It's visible in the browser URL when viewing the KB (e.g. `https://cloud.dify.ai/datasets/abc123...` → the ID is `abc123...`)
3. **Import workflow**: Go to **Studio** → **Create App** → **Import DSL** → upload the `.yml` file
4. **Update KB reference**: Open the workflow, click the **Knowledge Retrieval** node(s), and select your `patient-profiles` knowledge base (replacing the placeholder `REPLACE_WITH_YOUR_KB_ID`)
5. **Set environment variables**: For the Patient Intake workflow, go to workflow settings and set `USDA_API_KEY` (free at https://fdc.nal.usda.gov/api-key-signup)
6. **Choose your LLM provider**: Each LLM node defaults to `openai/gpt-4o`. Change the model in each node if you prefer Claude or another provider.
7. **Publish** the app and copy the API key into your `.env` as `DIFY_API_KEY`

---

## Prerequisites

1. A Dify account (cloud at https://cloud.dify.ai or self-hosted)
2. API access enabled
3. DigiTwin `.env` configured with `DIFY_API_URL` and `DIFY_API_KEY`

---

## Patient Data Source: `src/data/patients.json`

DigiTwin's knowledge base is the `patients.json` file containing **5 synthetic patients** with comprehensive medical profiles. This is the ground truth the Dify agent queries for every simulation.

### Patients Overview

| ID | Name | Age | Gender | Key Conditions | Health Score | Risk Profile |
|----|------|-----|--------|----------------|--------------|--------------|
| PT-001 | Sundar Selvaraj | 32 | Male | Prediabetes, Dyslipidemia | 76/100 | Elevated genetic T2D risk, family hx of diabetes & CAD |
| PT-002 | Maria Rodriguez | 47 | Female | Type 2 Diabetes, Hypertension, Osteopenia | 68/100 | On Metformin + Lisinopril, former smoker |
| PT-003 | James Chen | 33 | Male | Vitamin D Deficiency | 92/100 | Healthy athlete, shellfish allergy (severe) |
| PT-004 | Sarah Thompson | 57 | Female | T2D (poorly controlled), HTN (uncontrolled), Obesity, Hypothyroidism, OSA | 42/100 | 6 medications, current smoker, CPAP non-compliant |
| PT-005 | Aisha Okonkwo | 31 | Female | Sickle Cell Trait (carrier) | 96/100 | Ultrarapid CYP2D6 metabolizer, optimal health |

### Full Patient JSON Schema

Each patient object contains these top-level sections:

```
patient
├── id                          # "PT-001" through "PT-005"
├── demographics
│   ├── firstName, lastName, dateOfBirth, age, gender, ethnicity
│   ├── bloodType, height (cm), weight (kg), bmi
│   ├── email, phone, address { street, city, state, zipCode, country }
│   ├── emergencyContact { name, relationship, phone }
│   └── insurance { provider, policyNumber, groupNumber }
│
├── dashboard                   # UI-ready display data
│   ├── profileCard { name, gender, weight, age, bloodType, bloodRh }
│   ├── biomarkerData []        # 6 key metrics with status badges
│   ├── geneticInsights []      # 4 trait/risk cards
│   ├── lifestyleMetrics []     # 4 progress-bar metrics (sleep, steps, water, exercise)
│   ├── longitudinalEvents []   # Timeline of major health events
│   ├── wearables []            # Connected devices (Apple Watch, Withings, Oura Ring)
│   ├── dailyActivities []      # Activity tracker toggles
│   ├── mealPlan { "YYYY-MM-DD": { breakfast[], lunch[], dinner[], snacks[] } }
│   └── caloriesAnalysis { consumed, burned, target, protein%, fat%, carbs% }
│
├── biomarkers                  # Full clinical lab data
│   ├── bloodPanel
│   │   ├── glucose { fasting, hba1c, postprandial }  # each: { value, unit, normalRange, status }
│   │   ├── lipidPanel { totalCholesterol, ldl, hdl, triglycerides, vldl }
│   │   ├── cbc { wbc, rbc, hemoglobin, hematocrit, platelets }
│   │   ├── metabolicPanel { sodium, potassium, chloride, bicarbonate, bun, creatinine, egfr }
│   │   ├── liverFunction { alt, ast, alp, bilirubin, albumin }
│   │   ├── thyroid { tsh, t4Free, t3 }
│   │   ├── inflammatory { crp, esr, homocysteine }
│   │   ├── vitamins { vitaminD, vitaminB12, folate, iron, ferritin }
│   │   └── hormones { testosterone, cortisol, insulin }
│   ├── cardiovascular
│   │   ├── bloodPressure { systolic, diastolic }
│   │   ├── heartRate { resting, hrv, vo2Max }
│   │   └── ecg { rhythm, prInterval, qrsWidth, qtInterval }
│   └── bodyComposition
│       └── bodyFatPercentage, muscleMass, boneDensity, visceralFat, waterPercentage
│
├── genetics
│   ├── ancestry { southAsian: 92.5%, ... }
│   ├── pharmacogenomics         # CRITICAL for drug metabolism
│   │   ├── cyp2d6  { genotype, metabolizerStatus, affectedDrugs[] }
│   │   ├── cyp2c19 { genotype, metabolizerStatus, affectedDrugs[] }
│   │   ├── cyp3a4  { genotype, metabolizerStatus, affectedDrugs[] }
│   │   ├── slco1b1 { genotype, riskLevel, affectedDrugs[] }
│   │   └── vkorc1  { genotype, warfarinSensitivity }
│   ├── diseaseRisk
│   │   └── type2Diabetes, coronaryArteryDisease, hypertension, etc.
│   │       each: { relativeRisk, absoluteRisk, unit, snps[] }
│   ├── traitMarkers { lactoseIntolerance, caffeineSensitivity, alcoholFlush, sleepPattern }
│   └── carrierStatus { betaThalassemia, sickleCellAnemia, cysticFibrosis }
│
├── lifestyle
│   ├── activity { exerciseFrequency, primaryActivities[], avgStepsDaily, activeMinutesWeekly }
│   ├── nutrition { dietType, mealsPerDay, waterIntake, restrictions[], supplements[] }
│   ├── sleep { averageHours, quality, sleepLatency, wakeUps, sleepDebt, chronotype }
│   ├── stress { perceivedLevel, stressors[] }
│   ├── smoking { status, packYears, cigarettesPerDay }
│   └── occupation { type, hoursPerWeek, workStyle, screenTimeHours }
│
├── medicalHistory
│   ├── conditions []           # { name, icd10, diagnosedDate, status, managedBy }
│   ├── surgeries []            # { procedure, date, facility, notes }
│   ├── allergies []            # { allergen, reaction, severity }
│   ├── medications []          # { name, dosage, frequency, prescribedFor }
│   ├── familyHistory []        # { condition, relationship, ageAtOnset }
│   └── immunizations []        # { name, date, manufacturer }
│
├── longitudinalData
│   ├── days []                 # 7 days of daily tracking
│   │   └── dateISO, steps, activeCalories, caloriesBurned, caloriesConsumed,
│   │       sleepHours, sleepQuality (0-100), restingHeartRate, hrvMs,
│   │       systolic, diastolic, glucoseMgDl, weight, stressLevel (1-10),
│   │       mood, hydrationLiters, activeMinutes, workouts[]
│   ├── monthlyTrends {}        # 6 months: avgSteps, avgSleep, avgWeight, avgBP
│   └── labHistory []           # Quarterly labs: hba1c, ldl, hdl, triglycerides, fastingGlucose
│
├── realTimeMetrics             # Current wearable readings
│   └── heartRate, spo2, respiratoryRate, skinTemperature, stressIndex
│
└── healthScores                # Composite scores (0-100)
    └── overall, cardiovascular, metabolic, fitness, sleep, nutrition, mentalWellness
```

> The file also includes `realWorldData` with environmental factors (AQI, pollen, UV), healthcare claims, and social determinants of health per patient.

---

## Use Case 1: Patient Space -- Food / Snack / Medication Intake Simulation

### What It Does

When a patient uploads a food photo, mentions a snack, or logs a medication in the Health Companion chat, the Dify agent workflow:

1. **Retrieves the patient's full profile** from the knowledge base -- biomarkers, genetics, pharmacogenomics, conditions, allergies, current meds, lifestyle, and longitudinal trends
2. **Identifies the item** -- uses vision (food photo) or text parsing to determine what the patient consumed or is about to take
3. **Fetches nutritional or pharmaceutical data** via HTTP tool (USDA FoodData Central, Open Food Facts, OpenFDA, DrugBank) or web search
4. **Cross-references with patient context** -- checks drug-drug interactions, allergen cross-reactivity, pharmacogenomic metabolism rates, disease risk amplification, and dietary restriction violations
5. **Runs a time-series simulation** projecting biomarker changes over hours/days/weeks, grounded in the patient's actual baseline values and longitudinal trends
6. **Returns structured JSON** with text analysis, chart-ready projection data, and actionable suggestions

### Dify Application Setup

1. Log into Dify -> **Create Application** -> Select **"Agent"**
2. Name it: `DigiTwin Patient Intake Analyzer`
3. Select a capable model (GPT-4o or Claude recommended for vision + reasoning)
4. Enable **Stream mode** (required for thinking steps in the UI)

### Knowledge Base Setup

Create a Dify Knowledge Base named `patient-profiles` and upload the pre-built Markdown patient profiles from `docs/knowledge-base/`. Dify does **not** support `.json` files for knowledge base upload.

**Recommended: Upload the 5 Markdown files** from `docs/knowledge-base/`:

| File | Patient | Size |
|------|---------|------|
| `PT-001-Sundar-Selvaraj.md` | Sundar Selvaraj (32M, prediabetes) | ~15 KB |
| `PT-002-Maria-Rodriguez.md` | Maria Rodriguez (47F, T2D + HTN) | ~12 KB |
| `PT-003-James-Chen.md` | James Chen (33M, healthy athlete) | ~12 KB |
| `PT-004-Sarah-Thompson.md` | Sarah Thompson (57F, complex multi-morbid) | ~15 KB |
| `PT-005-Aisha-Okonkwo.md` | Aisha Okonkwo (31F, elite athlete, sickle cell carrier) | ~12 KB |

These Markdown files contain the full clinical data from `src/data/patients.json` formatted for optimal RAG retrieval: structured tables, bolded abnormal values, prominent pharmacogenomics sections, clinical summaries, and longitudinal data. Upload all 5 files to a single Dify knowledge base.

> **Why Markdown?** Dify's knowledge base only supports: XLS, MARKDOWN, EPUB, HTML, MDX, PPTX, VTT, XML, MSG, XLSX, PROPERTIES, CSV, DOC, TXT, EML, PDF, MD, PPT, DOCX, HTM. The Markdown format with tables provides better chunking and retrieval than raw JSON.

**Alternative:** If you prefer JSON-style data, you can rename `patients.json` to `patients.txt` and upload it, but retrieval quality will be lower.

**Source of truth:** `src/data/patients.json` remains the canonical data source for both the UI and the knowledge base files. If you modify patient data in the JSON, regenerate the Markdown files accordingly.

Example excerpt from a Markdown patient profile (PT-001 Sundar Selvaraj):

```json
{
  "id": "PT-001",
  "demographics": {
    "firstName": "Sundar",
    "lastName": "Selvaraj",
    "age": 32,
    "gender": "male",
    "ethnicity": "South Asian",
    "bloodType": "B+",
    "height": 175,
    "weight": 78.5,
    "bmi": 25.6
  },
  "biomarkers": {
    "bloodPanel": {
      "glucose": {
        "fasting": { "value": 98, "unit": "mg/dL", "normalRange": [70, 100], "status": "normal" },
        "hba1c": { "value": 5.7, "unit": "%", "normalRange": [4.0, 5.6], "status": "borderline" },
        "postprandial": { "value": 132, "unit": "mg/dL", "normalRange": [70, 140], "status": "normal" }
      },
      "lipidPanel": {
        "totalCholesterol": { "value": 215, "unit": "mg/dL", "status": "elevated" },
        "ldl": { "value": 138, "unit": "mg/dL", "status": "elevated" },
        "hdl": { "value": 52, "unit": "mg/dL", "status": "normal" },
        "triglycerides": { "value": 165, "unit": "mg/dL", "status": "elevated" }
      },
      "inflammatory": {
        "crp": { "value": 2.8, "unit": "mg/L", "status": "normal" }
      }
    },
    "cardiovascular": {
      "bloodPressure": {
        "systolic": { "value": 128, "status": "elevated" },
        "diastolic": { "value": 84, "status": "elevated" }
      },
      "heartRate": {
        "resting": { "value": 72, "status": "normal" },
        "hrv": { "value": 45, "unit": "ms" }
      }
    }
  },
  "genetics": {
    "pharmacogenomics": {
      "cyp2d6": { "genotype": "*1/*2", "metabolizerStatus": "normal", "affectedDrugs": ["codeine", "tramadol", "tamoxifen"] },
      "cyp2c19": { "genotype": "*1/*17", "metabolizerStatus": "rapid", "affectedDrugs": ["clopidogrel", "omeprazole", "escitalopram"] },
      "cyp3a4": { "genotype": "*1/*1", "metabolizerStatus": "normal", "affectedDrugs": ["atorvastatin", "cyclosporine"] },
      "slco1b1": { "genotype": "*1A/*1A", "riskLevel": "normal", "affectedDrugs": ["simvastatin", "atorvastatin"] },
      "vkorc1": { "genotype": "A/G", "warfarinSensitivity": "intermediate" }
    },
    "diseaseRisk": {
      "type2Diabetes": { "relativeRisk": 1.45, "absoluteRisk": 28.5, "unit": "%" },
      "coronaryArteryDisease": { "relativeRisk": 1.22, "absoluteRisk": 18.2, "unit": "%" },
      "hypertension": { "relativeRisk": 1.15, "absoluteRisk": 35.0, "unit": "%" }
    },
    "traitMarkers": {
      "lactoseIntolerance": { "status": "likely", "confidence": 0.85 },
      "caffeineSensitivity": { "status": "slow metabolizer", "confidence": 0.92 }
    },
    "carrierStatus": {
      "betaThalassemia": { "status": "carrier", "variant": "IVS-I-5 G>C" }
    }
  },
  "lifestyle": {
    "nutrition": {
      "dietType": "flexitarian",
      "restrictions": ["lactose-reduced"],
      "supplements": ["vitamin D", "omega-3", "magnesium"]
    },
    "sleep": { "averageHours": 6.5, "quality": "fair" },
    "smoking": { "status": "never" }
  },
  "medicalHistory": {
    "conditions": [
      { "name": "Prediabetes", "icd10": "R73.03", "status": "active", "managedBy": "lifestyle modification" },
      { "name": "Dyslipidemia", "icd10": "E78.5", "status": "active", "managedBy": "diet and exercise" },
      { "name": "Seasonal Allergies", "icd10": "J30.2", "status": "controlled" }
    ],
    "allergies": [
      { "allergen": "Penicillin", "reaction": "rash", "severity": "moderate" },
      { "allergen": "Pollen", "reaction": "rhinitis", "severity": "mild" }
    ],
    "medications": [
      { "name": "Cetirizine", "dosage": "10mg", "frequency": "daily as needed", "prescribedFor": "allergies" }
    ],
    "familyHistory": [
      { "condition": "Type 2 Diabetes", "relationship": "father", "ageAtOnset": 55 },
      { "condition": "Hypertension", "relationship": "mother", "ageAtOnset": 52 },
      { "condition": "Coronary Artery Disease", "relationship": "paternal grandfather", "ageAtOnset": 65 }
    ]
  },
  "longitudinalData": {
    "labHistory": [
      { "date": "2026-02-08", "hba1c": 5.7, "ldl": 138, "hdl": 52, "triglycerides": 165, "fastingGlucose": 98 },
      { "date": "2025-11-15", "hba1c": 5.8, "ldl": 145, "hdl": 48, "triglycerides": 178, "fastingGlucose": 102 },
      { "date": "2025-08-10", "hba1c": 5.9, "ldl": 152, "hdl": 45, "triglycerides": 185, "fastingGlucose": 105 },
      { "date": "2025-05-05", "hba1c": 6.0, "ldl": 158, "hdl": 44, "triglycerides": 192, "fastingGlucose": 108 }
    ]
  },
  "healthScores": {
    "overall": 76, "cardiovascular": 72, "metabolic": 68, "fitness": 74,
    "sleep": 65, "nutrition": 78, "mentalWellness": 70
  }
}
```

### Agent Tools Configuration

Add these tools to the Dify Agent:

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Knowledge Retrieval** | Look up patient profile, biomarkers, genetics, history | Point to `patient-profiles` knowledge base |
| **Custom Tool** | Fetch nutrition data from USDA/Open Food Facts | Create via OpenAPI spec; Base URL: `https://api.nal.usda.gov/fdc/v1/` (requires free API key) |
| **Custom Tool** | Fetch drug data from OpenFDA | Create via OpenAPI spec; Base URL: `https://api.fda.gov/drug/` |
| **Web Search** | Fall back to web for unlisted items | Enabled with SerpAPI or Dify built-in |

> **Note**: Dify Agents do not have a built-in "HTTP Request" tool. To call external APIs, create **Custom Tools** in Dify (Settings > Tools > Custom) by providing an OpenAPI/Swagger JSON spec for each API. The agent can then invoke these tools autonomously. See the [Dify Custom Tool docs](https://docs.dify.ai/guides/tools/custom-tool) for details.

### System Prompt (Patient Intake Agent)

```
You are a Biological Digital Twin health simulation agent. You have access to a comprehensive patient database containing demographics, full blood panels, genetics (pharmacogenomics, disease risk, trait markers), medical history, lifestyle data, and 7-day longitudinal tracking.

When a patient reports consuming food, a snack, a supplement, or a medication, you must:

## Step 1: Retrieve Patient Context
- Use the Knowledge Retrieval tool to look up the patient's full profile by patient ID (e.g., PT-001)
- Extract and note:
  - Current conditions (with ICD-10 codes and management status)
  - Current medications (name, dosage, frequency)
  - Allergies (allergen, reaction type, severity)
  - Baseline biomarkers: fasting glucose, HbA1c, lipid panel, BP, HR, HRV, CRP
  - Pharmacogenomics: CYP2D6, CYP2C19, CYP3A4, SLCO1B1, VKORC1 metabolizer status
  - Genetic disease risk: relative risk for T2D, CAD, hypertension, etc.
  - Trait markers: lactose intolerance, caffeine sensitivity, alcohol flush
  - Dietary restrictions and current supplements
  - Family history of relevant conditions
  - Recent longitudinal trends (7-day daily data + lab history trajectory)
  - Health scores (overall, cardiovascular, metabolic, fitness, sleep, nutrition, mental wellness)

## Step 2: Identify the Intake Item
- If an image is provided, analyze it to identify the food/drink/medication
- If text only, parse the item name, quantity, and any dosage information
- Classify as: "food", "snack", "beverage", "supplement", or "medication"

## Step 3: Fetch Item Data
- For FOOD/SNACK/BEVERAGE: Use the USDA FoodData Central API or Open Food Facts API to get:
  - Calories, protein, carbs, fat, sodium, sugar, fiber
  - Glycemic index if available
  - Any known allergens (check against patient's allergy list)
  - Lactose/gluten/caffeine content (check against patient trait markers)
- For MEDICATION/SUPPLEMENT: Use the OpenFDA Drug API or web search to get:
  - Active ingredients, mechanism of action
  - Known drug-drug interactions
  - Contraindications
  - CYP enzyme pathways (cross-reference with patient's pharmacogenomic profile)
  - Common side effects
- If the API returns no results, use Web Search as fallback

## Step 4: Cross-Reference with Patient Profile
- Check for drug-drug interactions with current medications list
- Check for allergen cross-reactivity (e.g., cephalosporin risk with Penicillin allergy)
- Check pharmacogenomic interactions:
  - If patient is CYP2D6 ultrarapid metabolizer (e.g., PT-005): warn about rapid drug clearance
  - If patient is CYP2C19 rapid metabolizer (e.g., PT-001): flag affected drugs like omeprazole
  - If drug is metabolized by CYP3A4: check patient's genotype
- Evaluate impact given current conditions:
  - High-sugar food + prediabetic/diabetic patient -> glucose spike warning
  - High-sodium food + hypertensive patient -> BP impact warning
  - Caffeine + slow caffeine metabolizer -> prolonged stimulant effect
  - Lactose-containing food + lactose intolerant patient -> GI distress warning
- Factor in genetic disease risk amplification (e.g., high-fat meal for patient with elevated CAD risk)
- Check against dietary restrictions (lactose-reduced, diabetic-friendly, low sodium, etc.)
- Flag any contraindications

## Step 5: Simulate Biomarker Impact Over Time
Generate a time-series projection grounded in the patient's ACTUAL baseline values from their biomarker data.

Timepoints: [0h (baseline), 1h, 2h, 4h, 8h, 24h, 3d, 7d, 14d, 30d]

Biomarkers to project (use patient's real baseline as day-0 values):
- glucose_mg_dl (use patient's fasting glucose as baseline, e.g., PT-001: 98, PT-002: 118, PT-004: 135)
- hba1c_percent (only changes meaningfully at 14d+ timepoints)
- crp_mg_l (inflammatory marker, baseline from patient's inflammatory panel)
- resting_heart_rate (from cardiovascular.heartRate.resting)
- hrv_ms (from cardiovascular.heartRate.hrv)
- systolic / diastolic (from cardiovascular.bloodPressure)
- energy_level (derived from healthScores.fitness and sleep quality)
- sleep_quality_impact ("improved", "neutral", "degraded")
- overall_health_delta (-20 to +10, relative to patient's healthScores.overall)

For food/snacks: Focus on 0h-24h for acute effects (glucose spike, inflammation), 3d-30d for cumulative patterns
For medications: Focus on 1h-30d for therapeutic ramp-up, factor in CYP metabolizer status for onset/duration

Use the patient's labHistory trajectory to inform realistic improvement/decline rates.

## Step 6: Format Response
Return your analysis as structured JSON:

{
  "patient_id": "PT-001",
  "patient_name": "Sundar Selvaraj",
  "item_identified": "string",
  "item_category": "food | snack | beverage | supplement | medication",
  "nutritional_or_pharma_data": {
    "calories": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number,
    "sodium_mg": number,
    "sugar_g": number,
    "fiber_g": number,
    "glycemic_index": number | null,
    "active_ingredients": ["string"] | null,
    "mechanism": "string" | null,
    "cyp_pathways": ["CYP2D6", "CYP3A4"] | null
  },
  "patient_alerts": [
    {
      "type": "interaction | allergy | contraindication | pharmacogenomic | dietary_restriction | disease_risk",
      "severity": "low | moderate | high | critical",
      "message": "string",
      "evidence": "string (e.g., CYP2C19 rapid metabolizer, Penicillin allergy on record)"
    }
  ],
  "simulation": {
    "timepoints": ["0h", "1h", "2h", "4h", "8h", "24h", "3d", "7d", "14d", "30d"],
    "projections": {
      "glucose_mg_dl":       [98, 148, 132, 112, 100, 97, 98, 97, 96, 95],
      "crp_mg_l":            [2.8, 2.8, 3.0, 3.2, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5],
      "resting_heart_rate":  [72, 75, 74, 73, 72, 72, 72, 71, 71, 70],
      "hrv_ms":              [45, 42, 43, 44, 45, 45, 46, 46, 47, 48],
      "systolic":            [128, 131, 130, 129, 128, 128, 127, 127, 126, 125],
      "diastolic":           [84, 86, 85, 84, 84, 84, 83, 83, 82, 82],
      "overall_health_delta":[0, -4, -3, -1, 0, 0, 1, 1, 2, 3]
    },
    "sleep_quality_impact": "neutral",
    "peak_glucose_time": "1h",
    "return_to_baseline": "4h",
    "health_score_impact": {
      "metabolic": -2,
      "cardiovascular": -1,
      "overall": -1
    }
  },
  "text_summary": "Detailed 3-5 sentence summary personalized to this patient's profile",
  "concern": "string | null",
  "pharmacogenomic_note": "string | null (e.g., 'CYP2C19 rapid metabolizer -- omeprazole may have reduced efficacy')",
  "suggestions": ["string", "string", "string"]
}

IMPORTANT:
- All simulation values MUST start from the patient's actual baseline biomarker values
- Factor in pharmacogenomic metabolizer status when simulating medication effects
- Reference the patient's labHistory trajectory for realistic change rates
- Account for current medications that may buffer or amplify effects
- Consider genetic disease risk when assessing long-term impact
- This is for simulation/educational purposes only -- always include a disclaimer
```

### Workflow Variant (Alternative to Agent)

If you prefer a deterministic pipeline over an autonomous agent, build it as a Dify **Workflow**:

```
[Start]
  |  Inputs: patient_id, item_text, item_image_url (optional)
  v
[Knowledge Retrieval] -- Query patient-profiles by patient_id
  |  -> Extract: biomarkers, genetics.pharmacogenomics, medicalHistory, lifestyle
  v
[Conditional Branch]
  |-- Has image? -> [LLM Vision Node] Identify food/med from image
  '-- Text only  -> [LLM Node] Parse item name and quantity
  v
[Parallel Branches]
  |-- [HTTP Request] -> USDA FoodData Central API (if food/snack)
  |-- [HTTP Request] -> OpenFDA Drug API (if medication)
  '-- [Web Search] -> Fallback for unlisted items
  v
[LLM Node] -- Cross-reference: patient profile + pharmacogenomics + item data -> alerts
  v
[LLM Node] -- Generate time-series simulation using patient's actual baselines
  v
[Code Node] -- Validate JSON, clamp to realistic ranges, verify baselines match patient data
  v
[Answer] -- Return structured simulation response
```

#### Workflow Input Variables

| Variable | Type | Description |
|----------|------|-------------|
| `patient_id` | string | Patient identifier (`PT-001` through `PT-005`) |
| `item_text` | string | User's description of what they ate/took (e.g., "Big Mac and large fries") |
| `item_image_url` | string (optional) | URL of uploaded food/medication photo |
| `simulation_window` | string | `"acute"` (0-24h) or `"extended"` (0-30d) or `"both"` |

---

## Use Case 2: Doctor Space -- Treatment Simulation

### What It Does

When a doctor selects a patient and enters a proposed treatment (medication, procedure, lifestyle change), the Dify agent workflow:

1. **Retrieves the patient's full profile** including pharmacogenomics, lab history, current medications (with dosages), all conditions, and organ function markers (eGFR, liver enzymes)
2. **Fetches detailed drug/treatment data** via FDA API, DrugBank, or web search
3. **Checks drug-drug interactions** against the patient's current medication list
4. **Evaluates pharmacogenomic compatibility** -- checks if the drug is metabolized by CYP enzymes the patient has variant alleles for
5. **Evaluates contraindications** given the patient's conditions, allergies, and organ function
6. **Simulates biomarker trajectory** over the treatment period (7, 30, 90, or 180 days) using actual baseline values and lab history trends
7. **Proposes alternative treatments** if risks are high, factoring in the patient's pharmacogenomic profile
8. **Returns structured JSON** with efficacy scores, risk scores, chart-ready projections, clinical notes, and monitoring recommendations

### Dify Application Setup

1. Log into Dify -> **Create Application** -> Select **"Agent"**
2. Name it: `DigiTwin Treatment Simulator`
3. Select a capable model (GPT-4o or Claude recommended)
4. Enable **Stream mode** for real-time thinking steps in the Doctor UI

### Knowledge Base Setup

Reuse the same `patient-profiles` knowledge base from Use Case 1. Optionally add a second knowledge base:

**`treatment-protocols` Knowledge Base** -- Upload treatment protocol documents, drug formulary data, or clinical guidelines in PDF/text format. The agent will use RAG to ground its recommendations in evidence.

Example protocol entry:
```json
{
  "drug_name": "Metformin",
  "class": "Biguanide",
  "indications": ["Type 2 Diabetes", "Pre-diabetes", "PCOS"],
  "contraindications": ["eGFR < 30", "Metabolic acidosis", "Hepatic impairment"],
  "cyp_metabolism": "Not significantly CYP-metabolized (renal clearance)",
  "common_interactions": [
    { "drug": "Insulin", "severity": "moderate", "effect": "Increased hypoglycemia risk" },
    { "drug": "Contrast dye", "severity": "high", "effect": "Lactic acidosis risk" },
    { "drug": "Glipizide", "severity": "moderate", "effect": "Additive hypoglycemia" }
  ],
  "dosing": {
    "initial": "500mg once daily",
    "titration": "Increase by 500mg weekly",
    "max": "2000mg/day in divided doses"
  },
  "monitoring": ["Renal function (eGFR) every 3-6 months", "B12 levels annually", "HbA1c every 3 months"],
  "expected_outcomes": {
    "hba1c_reduction": "1.0-1.5%",
    "glucose_reduction_mg_dl": "20-40",
    "weight_effect": "Neutral to slight loss",
    "time_to_effect": "2-4 weeks"
  }
}
```

### Agent Tools Configuration

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Knowledge Retrieval** | Patient profiles + treatment protocols | Point to both knowledge bases |
| **Custom Tool** | OpenFDA drug interaction lookup | Create via OpenAPI spec; `https://api.fda.gov/drug/label.json` |
| **Custom Tool** | DrugBank API (if licensed) | Create via OpenAPI spec; for detailed pharmacokinetics and CYP data |
| **Web Search** | Latest clinical evidence, off-label uses | SerpAPI or Dify built-in |

> **Note**: Same as above -- create Custom Tools in Dify for each external API using OpenAPI specs. Dify Agents call these tools autonomously based on the system prompt instructions.

### System Prompt (Treatment Simulation Agent)

```
You are a clinical decision support AI for doctors using the DigiTwin platform. You have access to comprehensive patient profiles with full blood panels, pharmacogenomics (CYP2D6, CYP2C19, CYP3A4, SLCO1B1, VKORC1), genetic disease risk, family history, longitudinal lab trends, and current medication regimens.

When a doctor proposes a treatment for a patient, you must perform a thorough simulation.

## Step 1: Retrieve Patient Context
- Use Knowledge Retrieval to look up the patient's full profile by patient_id (e.g., PT-002, PT-004)
- Extract and note ALL of the following:
  - Demographics: age, gender, ethnicity, BMI
  - Conditions: each with ICD-10, status, current management
  - Current medications: each with dosage, frequency, indication
  - Allergies: each with reaction type and severity
  - Full biomarker baselines:
    - Glucose panel: fasting, HbA1c, postprandial
    - Lipid panel: total cholesterol, LDL, HDL, triglycerides
    - Metabolic panel: creatinine, eGFR, BUN (for renal clearance assessment)
    - Liver function: ALT, AST (for hepatic metabolism assessment)
    - Thyroid: TSH, T4 (if relevant to treatment)
    - Inflammatory: CRP, ESR
    - Cardiovascular: BP, resting HR, HRV
  - Pharmacogenomics (CRITICAL for drug dosing):
    - CYP2D6 metabolizer status and affected drugs
    - CYP2C19 metabolizer status and affected drugs
    - CYP3A4 metabolizer status and affected drugs
    - SLCO1B1 risk level (statin myopathy risk)
    - VKORC1 warfarin sensitivity
  - Genetic disease risk: relative risks for relevant conditions
  - Family history: especially conditions related to proposed treatment
  - Lab history trajectory: is the patient improving or declining over recent quarters?
  - Health scores: overall and per-domain
  - Smoking status, sleep quality, exercise level (affect drug response)

## Step 2: Analyze the Proposed Treatment
- Parse the treatment details: name, type (medication/procedure/lifestyle/combination), dosage, duration
- Use the Custom Tool (OpenFDA / DrugBank) to fetch official drug data
- Use Web Search if needed for latest clinical evidence or off-label information
- If a treatment-protocols knowledge base exists, retrieve relevant protocol documents
- Identify which CYP enzymes metabolize this drug

## Step 3: Pharmacogenomic Assessment
THIS IS CRITICAL AND UNIQUE TO DIGITWIN:
- Check if the proposed drug is metabolized by any CYP enzyme for which the patient has a variant:
  - Poor metabolizer -> drug accumulation risk, reduce dose
  - Rapid/ultrarapid metabolizer -> subtherapeutic levels, may need higher dose or alternative
  - Normal metabolizer -> standard dosing appropriate
- Check SLCO1B1 status for statins (myopathy risk)
- Check VKORC1 status for warfarin (dosing sensitivity)
- Example: PT-005 (Aisha) is CYP2D6 ultrarapid -- codeine converts too rapidly to morphine (toxicity risk)
- Example: PT-001 (Sundar) is CYP2C19 rapid -- omeprazole may have reduced efficacy

## Step 4: Drug Interaction Analysis
For each current medication the patient takes:
- Check for known drug-drug interactions with the proposed treatment
- Classify severity: low, moderate, high, contraindicated
- Describe the mechanism and clinical significance
- Flag any that require dosage adjustment or monitoring
- Example: PT-004 (Sarah) takes 6 medications -- extensive interaction checking required
  - Metformin + Glipizide + new drug: triple interaction risk
  - Atorvastatin interactions via CYP3A4

## Step 5: Contraindication & Allergy Check
- Cross-reference the proposed treatment against patient conditions
- Check for allergy cross-reactivity (e.g., PT-001: Penicillin allergy -> cephalosporin caution)
- Evaluate organ function:
  - eGFR for renally-cleared drugs (PT-002 has mildly reduced eGFR of 88)
  - ALT/AST for hepatically-metabolized drugs (PT-004 has elevated AST of 42)
- Flag any absolute or relative contraindications

## Step 6: Simulate Biomarker Trajectory
Generate projections using the patient's ACTUAL baseline biomarker values.

Simulation periods and intervals:
- 7d sim: [day 0, 1, 2, 3, 5, 7]
- 30d sim: [day 0, 1, 3, 7, 14, 21, 30]
- 90d sim: [day 0, 3, 7, 14, 30, 60, 90]
- 180d sim: [day 0, 7, 14, 30, 60, 90, 120, 180]

Biomarkers to project (starting from patient's actual values):
- blood_pressure (format: "130/85")
- glucose_mg_dl (fasting)
- hba1c_percent (for 90d+ sims)
- resting_heart_rate
- hrv_ms
- crp_mg_l (inflammatory marker)
- ldl_mg_dl (for statin/lipid treatments)
- overall_health (0-100, from healthScores.overall)

Model realistic pharmacokinetic/pharmacodynamic curves:
- Onset delay (most medications take days-weeks for full effect)
- Dose-response relationship
- CYP metabolizer status affects onset speed and steady-state levels
- Side effect timeline (early GI effects for metformin, late myopathy for statins)
- Tolerance/adaptation effects
- Use labHistory to calibrate: if patient's HbA1c dropped 0.1% per quarter on current regimen, factor that trend

## Step 7: Alternative Treatments
If the risk score > 40 or there are significant interactions:
- Propose 2-3 alternative treatments
- For each: name, expected efficacy (0-100), and reason
- Factor in pharmacogenomics when recommending alternatives
  - If patient is poor CYP2D6 metabolizer and drug requires CYP2D6, suggest alternative pathway drug
- Consider the patient's specific comorbidities, organ function, and current regimen

## Step 8: Format Response
Return structured JSON:

{
  "patient_id": "PT-004",
  "patient_name": "Sarah Thompson",
  "treatment_name": "string",
  "treatment_type": "medication | procedure | lifestyle | combination",
  "efficacy_score": number (0-100),
  "risk_score": number (0-100),
  "pharmacogenomic_assessment": {
    "relevant_enzymes": ["CYP3A4", "CYP2D6"],
    "patient_metabolizer_status": "normal | rapid | poor | ultrarapid",
    "dosing_recommendation": "standard | reduce | increase | avoid",
    "notes": "string"
  },
  "drug_interactions": [
    {
      "drug": "string (current medication name)",
      "severity": "low | moderate | high | contraindicated",
      "description": "string",
      "action_required": "string (e.g., monitor INR, reduce dose, separate timing)"
    }
  ],
  "expected_outcomes": {
    "positive": ["string"],
    "risks": ["string"],
    "side_effects": ["string"]
  },
  "projections": [
    {
      "day": number,
      "blood_pressure": "string",
      "glucose_mg_dl": number,
      "hba1c_percent": number | null,
      "resting_heart_rate": number,
      "hrv_ms": number,
      "crp_mg_l": number,
      "ldl_mg_dl": number | null,
      "overall_health": number
    }
  ],
  "alternative_treatments": [
    {
      "name": "string",
      "efficacy": number,
      "reason": "string",
      "pharmacogenomic_advantage": "string | null"
    }
  ],
  "monitoring_recommendations": ["string"],
  "clinical_notes": "string (2-4 sentence summary referencing patient-specific factors)",
  "warnings": ["string"],
  "thinking_steps": ["string (each reasoning step the agent took)"]
}

IMPORTANT:
- All projections must start from the patient's ACTUAL baseline biomarker values (not generic defaults)
- ALWAYS check pharmacogenomics before recommending any medication
- Account for polypharmacy risk (PT-004 is on 6 medications)
- Factor in the patient's labHistory trend when projecting outcomes
- Consider organ function (eGFR, liver enzymes) for drug clearance
- Be conservative with efficacy claims -- use evidence-based ranges
- This is for clinical simulation purposes -- always recommend physician oversight
```

### Workflow Variant (Alternative to Agent)

```
[Start]
  |  Inputs: patient_id, treatment_name, treatment_type, dosage, duration, simulation_days
  v
[Knowledge Retrieval] -- Query patient-profiles by patient_id
  |  -> Extract: biomarkers, pharmacogenomics, medications, conditions, eGFR, liver function
  v
[Knowledge Retrieval] -- Query treatment-protocols by treatment_name
  v
[Parallel Branches]
  |-- [HTTP Request] -> OpenFDA: drug label + interactions + CYP pathways
  '-- [Web Search] -> Latest clinical evidence for treatment
  v
[LLM Node 1] -- Pharmacogenomic Assessment
  |  Input: patient CYP profile + drug CYP metabolism pathway
  |  Output: metabolizer impact, dosing recommendation
  v
[LLM Node 2] -- Drug Interaction Analysis
  |  Input: patient meds + proposed treatment + FDA data
  |  Output: interactions[] with severity and required actions
  v
[LLM Node 3] -- Contraindication & Organ Function Check
  |  Input: patient conditions/allergies/eGFR/liver enzymes + drug data
  |  Output: risk_score, warnings[], contraindications
  v
[LLM Node 4] -- Biomarker Trajectory Simulation
  |  Input: actual baseline biomarkers + pharmacokinetics + CYP metabolizer effect + interactions
  |  Output: projections[] array (day-by-day from real baselines)
  v
[LLM Node 5] -- Clinical Summary & Alternatives
  |  Input: all previous outputs + pharmacogenomic profile
  |  Output: clinical_notes, alternative_treatments[] (with PGx advantages), monitoring[]
  v
[Code Node] -- Validate JSON, verify baselines match patient data, clamp to realistic ranges
  v
[Answer] -- Return complete simulation response
```

#### Workflow Input Variables

| Variable | Type | Description |
|----------|------|-------------|
| `patient_id` | string | Patient identifier (`PT-001` through `PT-005`) |
| `treatment_name` | string | Name of proposed treatment (e.g., "Atorvastatin") |
| `treatment_type` | string | `"medication"`, `"procedure"`, `"lifestyle"`, or `"combination"` |
| `dosage` | string | Dosage details (e.g., "10mg once daily") |
| `duration` | string | Intended treatment duration (e.g., "90 days") |
| `simulation_days` | number | Projection window: 7, 30, 90, or 180 |

---

## Environment Configuration

Add these to your `.env` file:

```bash
# Dify Configuration
DIFY_API_URL=https://api.dify.ai           # or your self-hosted URL
DIFY_API_KEY=app-xxxxxxxxxxxx               # API key for the Patient Intake Agent
DIFY_TREATMENT_API_KEY=app-yyyyyyyyyyyy     # (Optional) Separate key for Doctor Treatment Agent

# External API Keys (used by Dify Custom Tools / Workflow HTTP Request nodes)
USDA_API_KEY=your-usda-key                  # Free at https://fdc.nal.usda.gov/api-key-signup
```

> If using a single Dify agent for both use cases, one `DIFY_API_KEY` is sufficient.

---

## How DigiTwin Calls These Workflows

### Patient Space: Health Companion Route

**Endpoint:** `POST /api/health-companion`

The route sends a streaming request to Dify with:
```json
{
  "query": "Patient uploaded: Big Mac and large fries. Patient ID: PT-001. Simulate biomarker impact.",
  "inputs": {
    "patient_id": "PT-001",
    "item_text": "Big Mac and large fries",
    "item_image_url": "https://...",
    "simulation_window": "both"
  },
  "response_mode": "streaming",
  "user": "patient-PT-001"
}
```

The app parses the structured JSON response to populate:
- **Nutrition card** -- calories, macros, glycemic index
- **Alert badges** -- interaction warnings, allergy flags, pharmacogenomic notes, dietary restriction violations
- **Biomarker projection chart** -- Recharts line/area chart using the `simulation.projections` data
- **Text summary** -- conversational explanation personalized to this patient's conditions
- **Suggestion chips** -- follow-up actions the patient can take

### Doctor Space: Treatment Simulation Route

**Endpoint:** `POST /api/doctor/treatment-sim`

The route sends a streaming request to Dify with:
```json
{
  "query": "Simulate treatment: Atorvastatin 20mg daily for patient PT-004 (Sarah Thompson). Duration: 90 days.",
  "inputs": {
    "patient_id": "PT-004",
    "treatment_name": "Atorvastatin",
    "treatment_type": "medication",
    "dosage": "20mg once daily",
    "duration": "90 days",
    "simulation_days": 90
  },
  "response_mode": "streaming",
  "user": "doctor-session-123"
}
```

The app parses the response to populate:
- **Efficacy/Risk gauges** -- circular score indicators
- **Pharmacogenomic badge** -- metabolizer status and dosing recommendation
- **Drug interaction table** -- severity-coded interaction list (critical for PT-004's 6-drug regimen)
- **Biomarker trajectory chart** -- multi-line Recharts chart with day-by-day projections from actual baselines
- **Expected outcomes panel** -- positive outcomes, risks, side effects
- **Alternative treatments** -- ranked alternatives with pharmacogenomic advantage notes
- **Thinking steps timeline** -- real-time display of the agent's reasoning process
- **Clinical notes** -- summary referencing patient-specific factors

---

## Chart Data Integration

Both use cases produce chart-ready projection data. Here's how it maps to Recharts components in DigiTwin:

### Patient Biomarker Chart (Acute + Extended)

```typescript
// From simulation.projections -- values start from patient's actual baselines
const chartData = simulation.timepoints.map((t, i) => ({
  time: t,
  glucose: simulation.projections.glucose_mg_dl[i],      // starts from patient's fasting glucose
  crp: simulation.projections.crp_mg_l[i],               // starts from patient's CRP
  heartRate: simulation.projections.resting_heart_rate[i], // starts from patient's resting HR
  hrv: simulation.projections.hrv_ms[i],
  systolic: simulation.projections.systolic[i],
}));

// Render with Recharts <LineChart> or <AreaChart>
// X-axis: time (0h -> 30d)
// Y-axis: biomarker values (multi-line, color-coded)
// Add reference bands for normalRange from patient's biomarker data
```

### Doctor Projection Chart (Treatment Timeline)

```typescript
// From projections[] -- all values grounded in patient's actual baselines
const chartData = projections.map(p => ({
  day: `Day ${p.day}`,
  glucose: p.glucose_mg_dl,
  hba1c: p.hba1c_percent,
  ldl: p.ldl_mg_dl,
  crp: p.crp_mg_l,
  overallHealth: p.overall_health,
  heartRate: p.resting_heart_rate,
  hrv: p.hrv_ms,
}));

// Render with Recharts <LineChart>
// X-axis: day (Day 0 -> Day 180)
// Y-axis: biomarker values
// Add reference lines for normalRange from patient's biomarker data
// Highlight pharmacogenomic-adjusted onset delay if applicable
```

---

## Testing the Integration

### Patient Space Test Scenarios

1. Start dev server: `npm run dev`
2. Open **Patient Space** -> **Health Companion** chat

**Test 1 -- Food for prediabetic patient (PT-001 Sundar):**
- Type: "I just had a Big Mac, large fries, and a Coke"
- Expected: Glucose spike warning (HbA1c 5.7%, prediabetic), high sodium/fat alert (elevated BP 128/84), lactose content flag (lactose intolerant trait), suggestion to walk 30 min

**Test 2 -- Medication for patient with allergy (PT-001 Sundar):**
- Type: "Doctor prescribed amoxicillin for my sore throat"
- Expected: Penicillin allergy alert (amoxicillin is a penicillin), severity: critical, suggest alternative antibiotic

**Test 3 -- Caffeine for slow metabolizer (PT-001 Sundar):**
- Type: "I had a double espresso"
- Expected: Caffeine sensitivity flag (slow metabolizer, 92% confidence), prolonged stimulant effect warning, sleep quality impact

**Test 4 -- High-sugar food for diabetic patient (PT-004 Sarah):**
- Type: "I ate a slice of chocolate cake"
- Expected: Severe glucose spike warning (baseline fasting glucose 135, HbA1c 7.2%), interaction with Metformin/Glipizide regimen, long recovery time

### Doctor Space Test Scenarios

1. Navigate to **Doctor Space** -> **Treatment Simulation**

**Test 1 -- Statin for patient with CYP3A4 interaction (PT-004 Sarah):**
- Select patient: Sarah Thompson (PT-004)
- Treatment: "Atorvastatin 40mg daily" (she's already on it -- test dose increase)
- Expected: CYP3A4 metabolizer check, interaction with her 5 other meds, liver enzyme concern (AST 42 elevated), SLCO1B1 genotype check for myopathy risk

**Test 2 -- New antihypertensive for patient on Lisinopril (PT-002 Maria):**
- Select patient: Maria Rodriguez (PT-002)
- Treatment: "Amlodipine 5mg daily" (adding to existing Lisinopril 10mg)
- Expected: Dual antihypertensive benefit assessment, Metformin interaction check, eGFR 88 noted, BP trajectory from 138/88 downward

**Test 3 -- Pain medication for ultrarapid metabolizer (PT-005 Aisha):**
- Select patient: Aisha Okonkwo (PT-005)
- Treatment: "Codeine 30mg as needed"
- Expected: CRITICAL pharmacogenomic alert -- CYP2D6 ultrarapid metabolizer, codeine converts too rapidly to morphine, toxicity risk, suggest tramadol alternative or non-opioid

---

## Troubleshooting

### "DEMO" source instead of "DIFY ENHANCED"

1. Verify `.env` has correct `DIFY_API_URL` and `DIFY_API_KEY`
2. Restart the dev server after changing `.env`
3. Check browser console and server logs for API errors
4. Confirm the Dify app is published and the API key is active

### No thinking steps displayed

1. Thinking steps require Dify **streaming mode** -- verify it's enabled in the Dify app settings
2. Agent-type apps produce more thinking steps than Chat Assistants or Workflows
3. Check that `response_mode: "streaming"` is being sent in the API call

### Knowledge base not returning patient data

1. Verify the knowledge base is indexed and active in Dify
2. Check that patient IDs (`PT-001` through `PT-005`) match what the app sends
3. If using split JSONs, ensure each file contains the patient's `id` field
4. Test the knowledge base directly in the Dify playground before integrating

### Pharmacogenomic data not being used

1. Verify the `genetics.pharmacogenomics` section is included in the knowledge base documents
2. Check that the system prompt explicitly instructs the agent to cross-reference CYP enzymes
3. Not all patients have pharmacogenomics data -- PT-003 (James) has limited genetic data

### External API calls failing in Dify tools

1. Confirm API keys are configured in the Custom Tool settings (for Agents) or HTTP Request node (for Workflows)
2. For Custom Tools: verify the OpenAPI spec is valid JSON and the auth header/query param is set correctly
3. USDA FoodData Central requires a free API key -- register at https://fdc.nal.usda.gov/api-key-signup
4. OpenFDA endpoints are public but rate-limited -- add retry logic
5. Test API calls independently with curl before configuring in Dify

### Chart data not rendering

1. Verify the Dify response contains valid `projections` arrays with numeric values
2. Check that projection baselines match the patient's actual biomarker values
3. The app's JSON parser expects the exact field names documented above

---

## Self-Hosting Dify (Optional)

For production, data privacy, or to avoid rate limits:

```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
docker compose up -d
```

Then update `.env`:
```bash
DIFY_API_URL=http://localhost:5001  # or your domain
```

Self-hosting gives you:
- Full control over data residency (important for patient health data)
- No rate limits
- Custom model providers (Azure OpenAI, local LLMs, etc.)
- Enterprise SSO and audit logging

---

## Security Notes

1. **Never commit API keys** to version control -- use `.env` and `.gitignore`
2. **Patient data in `patients.json` is synthetic** -- safe for hackathon demo, but production systems must use real anonymized/consented data
3. **Pharmacogenomic data is highly sensitive** -- in production, this requires additional access controls
4. **Rate limit your API routes** to prevent abuse
5. **Validate Dify responses** server-side before sending to the client
6. **HIPAA/GDPR considerations** -- for production, ensure Dify instance is compliant with health data regulations
7. The current implementation is for **demo/hackathon purposes** -- production use requires proper authentication, audit logging, and clinical validation

---

## Resources

- [Dify Documentation](https://docs.dify.ai)
- [Dify Agent Guide](https://docs.dify.ai/guides/application-orchestrate/agent)
- [Dify Workflow Guide](https://docs.dify.ai/guides/workflow)
- [Dify Knowledge Base](https://docs.dify.ai/guides/knowledge-base)
- [Dify API Reference](https://docs.dify.ai/guides/application-publishing/developing-with-apis)
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide)
- [OpenFDA API](https://open.fda.gov/apis/)
- [PharmGKB (Pharmacogenomics Knowledge Base)](https://www.pharmgkb.org/)
- [CPIC Guidelines (Clinical Pharmacogenetics)](https://cpicpgx.org/)
- [Dify GitHub](https://github.com/langgenius/dify)
