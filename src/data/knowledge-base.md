---
title: DigiTwin Patient Knowledge Base
version: 1.0.0
last_updated: 2026-02-08
total_patients: 5
data_source: DigiTwin Synthetic Patient Database
week_range: 2026-02-02 to 2026-02-08
---

# DigiTwin Patient Knowledge Base

This file is the **single source of truth** for both the Dify knowledge base (clinical narrative for RAG retrieval) and the DigiTwin web application (embedded JSON blocks parsed at runtime).

**Patients:** 5
**Data period:** 2026-02-02 to 2026-02-08

| ID | Name | Age | Gender | Health Score | Risk Level |
|----|------|-----|--------|-------------|------------|
| PT-001 | Sundar Selvaraj | 32 | male | 64/100 | moderate |
| PT-002 | Maria Rodriguez | 47 | female | 68/100 | moderate |
| PT-003 | James Chen | 33 | male | 92/100 | low |
| PT-004 | Sarah Thompson | 57 | female | 42/100 | critical |
| PT-005 | Aisha Okonkwo | 31 | female | 96/100 | low |

---

<!-- PATIENT:PT-001 | name:Sundar Selvaraj | age:32 | gender:male | risk_level:moderate | health_score:76 | conditions:Prediabetes,Dyslipidemia,Seasonal Allergies -->

# Patient Profile: PT-001 — Sundar Selvaraj

## Demographics
- **Patient ID:** PT-001
- **Full Name:** Sundar Selvaraj
- **Date of Birth:** 1993-11-27
- **Age:** 32 years old
- **Gender:** Male
- **Ethnicity:** South Asian
- **Blood Type:** B+ (B positive)
- **Height:** 175 cm
- **Weight:** 78.5 kg
- **BMI:** 25.6 (overweight)
- **Location:** San Francisco, CA, USA
- **Occupation:** Software Engineer (hybrid, 50 hrs/week, 10 hrs screen time)
- **Insurance:** BlueCross BlueShield (BCB-2026-78543)

## Health Scores (as of 2026-02-08)
| Domain | Score (0-100) |
|--------|--------------|
| **Overall** | **76** |
| Cardiovascular | 72 |
| Metabolic | 68 |
| Fitness | 74 |
| Sleep | 65 |
| Nutrition | 78 |
| Mental Wellness | 70 |

## Active Conditions
| Condition | ICD-10 | Diagnosed | Status | Management |
|-----------|--------|-----------|--------|------------|
| Prediabetes | R73.03 | 2024-03-15 | Active | Lifestyle modification |
| Dyslipidemia | E78.5 | 2023-08-22 | Active | Diet and exercise |
| Seasonal Allergies | J30.2 | 2015-04-10 | Controlled | Antihistamines as needed |

## Current Medications
| Medication | Dosage | Frequency | Prescribed For |
|-----------|--------|-----------|----------------|
| Cetirizine | 10mg | Daily as needed | Allergies |

## Allergies
| Allergen | Reaction | Severity |
|----------|----------|----------|
| **Penicillin** | Rash | **Moderate** |
| Pollen | Rhinitis | Mild |

## Family History
| Condition | Relationship | Age at Onset |
|-----------|-------------|--------------|
| Type 2 Diabetes | Father | 55 |
| Hypertension | Mother | 52 |
| Coronary Artery Disease | Paternal grandfather | 65 |

## Biomarkers — Blood Panel (last updated: 2026-02-08)

### Glucose Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Fasting Glucose | 126 | mg/dL | 70-100 | **Elevated** |
| HbA1c | 5.7 | % | 4.0-5.6 | **Borderline** |
| Postprandial Glucose | 132 | mg/dL | 70-140 | Normal |

### Lipid Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Total Cholesterol | 215 | mg/dL | <200 | **Elevated** |
| LDL | 138 | mg/dL | <100 | **Elevated** |
| HDL | 52 | mg/dL | 40-60 | Normal |
| Triglycerides | 165 | mg/dL | <150 | **Elevated** |
| VLDL | 33 | mg/dL | 5-40 | Normal |

### Complete Blood Count (CBC)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| WBC | 6.8 | K/uL | 4.5-11.0 | Normal |
| RBC | 5.1 | M/uL | 4.5-5.5 | Normal |
| Hemoglobin | 15.2 | g/dL | 13.5-17.5 | Normal |
| Hematocrit | 44.5 | % | 38.8-50.0 | Normal |
| Platelets | 245 | K/uL | 150-400 | Normal |

### Metabolic Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Sodium | 140 | mEq/L | 136-145 | Normal |
| Potassium | 4.2 | mEq/L | 3.5-5.0 | Normal |
| Chloride | 101 | mEq/L | 98-106 | Normal |
| Bicarbonate | 24 | mEq/L | 22-29 | Normal |
| BUN | 16 | mg/dL | 7-20 | Normal |
| Creatinine | 1.0 | mg/dL | 0.7-1.3 | Normal |
| eGFR | 98 | mL/min/1.73m2 | 90-120 | Normal |

### Liver Function
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| ALT | 32 | U/L | 7-56 | Normal |
| AST | 28 | U/L | 10-40 | Normal |
| ALP | 68 | U/L | 44-147 | Normal |
| Bilirubin | 0.8 | mg/dL | 0.1-1.2 | Normal |
| Albumin | 4.2 | g/dL | 3.4-5.4 | Normal |

### Thyroid
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| TSH | 2.1 | mIU/L | 0.4-4.0 | Normal |
| Free T4 | 1.2 | ng/dL | 0.8-1.8 | Normal |
| T3 | 125 | ng/dL | 80-200 | Normal |

### Inflammatory Markers
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| CRP | 2.8 | mg/L | 0-3.0 | Normal |
| ESR | 12 | mm/hr | 0-22 | Normal |
| Homocysteine | 11.5 | umol/L | 5-15 | Normal |

### Vitamins & Minerals
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Vitamin D | 32 | ng/mL | 30-100 | Normal |
| Vitamin B12 | 485 | pg/mL | 200-900 | Normal |
| Folate | 12.5 | ng/mL | 3-17 | Normal |
| Iron | 95 | mcg/dL | 60-170 | Normal |
| Ferritin | 125 | ng/mL | 30-400 | Normal |

### Hormones
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Testosterone | 580 | ng/dL | 300-1000 | Normal |
| Cortisol | 14.5 | mcg/dL | 6-23 | Normal |
| Insulin | 8.5 | uIU/mL | 2.6-24.9 | Normal |

## Biomarkers — Cardiovascular (last updated: 2026-02-08)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Systolic BP | 128 | mmHg | 90-120 | **Elevated** |
| Diastolic BP | 84 | mmHg | 60-80 | **Elevated** |
| Resting Heart Rate | 72 | bpm | 60-100 | Normal |
| HRV | 45 | ms | 20-200 | Normal |

### ECG
- Rhythm: Normal sinus rhythm
- PR Interval: 160 ms (normal: 120-200)
- QRS Width: 88 ms (normal: 80-100)
- QT Interval: 400 ms (normal: 350-450)

## Biomarkers — Body Composition
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Body Fat | 24.5 | % | 18-25 | Normal |
| Muscle Mass | 35.2 | kg | 30-45 | Normal |
| Bone Density | 1.15 | g/cm2 | 1.0-1.4 | Normal |
| Visceral Fat | 11 | level | 1-12 | **Borderline** |
| Water Percentage | 55.2 | % | 50-65 | Normal |

## Pharmacogenomics (CRITICAL for drug prescribing)

| Enzyme | Genotype | Metabolizer Status | Affected Drugs |
|--------|----------|-------------------|----------------|
| **CYP2D6** | *1/*2 | Normal | codeine, tramadol, tamoxifen |
| **CYP2C19** | *1/*17 | **Rapid** | clopidogrel, omeprazole, escitalopram |
| **CYP3A4** | *1/*1 | Normal | atorvastatin, cyclosporine |
| **SLCO1B1** | *1A/*1A | Normal risk | simvastatin, atorvastatin |
| **VKORC1** | A/G | Intermediate warfarin sensitivity | warfarin |

**Key pharmacogenomic alerts:**
- CYP2C19 rapid metabolizer: Omeprazole and similar PPIs may have **reduced efficacy**. Consider higher doses or alternative (e.g., pantoprazole).
- CYP2C19 rapid metabolizer: Enhanced clopidogrel activation — standard dosing is effective.
- VKORC1 intermediate: If warfarin is prescribed, start at standard dose with close INR monitoring.

## Genetic Disease Risk
| Disease | Relative Risk | Absolute Risk | Key SNPs |
|---------|--------------|---------------|----------|
| Type 2 Diabetes | 1.45x | 28.5% | rs7903146, rs1801282 |
| Coronary Artery Disease | 1.22x | 18.2% | rs10757278, rs1333049 |
| Hypertension | 1.15x | 35.0% | rs699, rs4961 |
| Alzheimer's Disease | 0.85x (reduced) | 8.5% | rs429358 |
| Colorectal Cancer | 0.92x (reduced) | 4.2% | rs6983267 |

## Genetic Trait Markers
| Trait | Status | Confidence |
|-------|--------|-----------|
| Lactose Intolerance | **Likely** | 85% |
| Caffeine Sensitivity | **Slow metabolizer** | 92% |
| Alcohol Flush | Unlikely | 78% |
| Sleep Pattern | Intermediate chronotype | 65% |

## Carrier Status
| Condition | Status | Variant |
|-----------|--------|---------|
| **Beta-Thalassemia** | **Carrier** | IVS-I-5 G>C |
| Sickle Cell Anemia | Negative | — |
| Cystic Fibrosis | Negative | — |

## Ancestry
- South Asian: 92.5%
- Central Asian: 4.2%
- European: 2.1%
- Other: 1.2%

## Lifestyle

### Activity
- Exercise frequency: 3-4 times per week
- Primary activities: Walking, Yoga, Swimming
- Average daily steps: 7,850
- Active minutes per week: 185
- Sedentary hours per day: 9.5

### Nutrition
- Diet type: Flexitarian
- Meals per day: 3
- Water intake: 2.2 L/day
- Caffeine: 180 mg/day
- Alcohol: 3 drinks/week
- Dietary restrictions: Lactose-reduced
- Supplements: Vitamin D, Omega-3, Magnesium

### Sleep
- Average: 6.5 hours (target: 8 hours)
- Quality: Fair
- Sleep latency: 22 minutes
- Wake-ups: 2 per night
- Sleep debt: 4.5 hours
- Chronotype: Intermediate

### Stress
- Perceived level: 6/10
- Work-life balance: 5/10
- Meditation: 45 minutes/week
- Stressors: Work deadlines, financial planning

### Smoking
- Status: Never smoker

## Surgical History
| Procedure | Date | Facility | Notes |
|-----------|------|----------|-------|
| Appendectomy | 2012-07-20 | Stanford Medical Center | Uncomplicated, laparoscopic |

## Immunizations
| Vaccine | Date | Manufacturer |
|---------|------|-------------|
| COVID-19 Booster | 2025-10-15 | Moderna |
| Influenza | 2025-09-20 | Sanofi |
| Tdap | 2022-06-10 | GSK |

## Longitudinal Data — 7-Day Daily Tracking (2026-02-02 to 2026-02-08)

| Date | Steps | Active Cal | Sleep (hrs) | Sleep Quality | Resting HR | HRV (ms) | Systolic | Diastolic | Glucose | Weight | Stress | Mood | Hydration (L) | Active Min |
|------|-------|-----------|-------------|---------------|------------|-----------|----------|-----------|---------|--------|--------|------|--------------|-----------|
| Feb 08 (Sun) | 6,245 | 420 | 7.8 | 85% | 69 | 48 | 124 | 80 | 96 | 78.5 | 4 | Good | 2.4 | 40 |
| Feb 07 (Sat) | 11,234 | 680 | 7.5 | 88% | 68 | 52 | 122 | 78 | 94 | 78.4 | 3 | Great | 2.8 | 90 |
| Feb 06 (Fri) | 5,678 | 320 | 5.8 | 65% | 74 | 38 | 130 | 86 | 102 | 78.6 | 7 | Stressed | 1.8 | 15 |
| Feb 05 (Thu) | 7,423 | 450 | 6.5 | 75% | 72 | 44 | 127 | 83 | 98 | 78.5 | 6 | Neutral | 2.1 | 30 |
| Feb 04 (Wed) | 9,156 | 560 | 7.1 | 82% | 70 | 50 | 124 | 80 | 95 | 78.5 | 5 | Good | 2.5 | 55 |
| Feb 03 (Tue) | 6,892 | 380 | 6.8 | 78% | 71 | 46 | 128 | 84 | 99 | 78.6 | 6 | Good | 2.3 | 25 |
| Feb 02 (Mon) | 8,234 | 490 | 6.2 | 72% | 73 | 42 | 126 | 82 | 97 | 78.7 | 7 | Neutral | 2.0 | 35 |

### Weekly Workouts
- Feb 08: Yoga 30 min (120 cal)
- Feb 07: Swimming 45 min (350 cal), Walking 40 min (200 cal)
- Feb 06: No workouts (stressed day)
- Feb 05: Walking 25 min (140 cal)
- Feb 04: Yoga 45 min (150 cal), Walking 20 min (100 cal)
- Feb 03: No workouts
- Feb 02: Walking 30 min (180 cal)

## Monthly Trends (6 months)
| Month | Avg Steps | Avg Sleep | Avg Weight | Avg BP |
|-------|-----------|-----------|------------|--------|
| Sep 2025 | 7,200 | 6.3 hrs | 79.8 kg | 130/86 |
| Oct 2025 | 7,450 | 6.4 hrs | 79.5 kg | 129/85 |
| Nov 2025 | 7,100 | 6.2 hrs | 79.2 kg | 128/84 |
| Dec 2025 | 6,800 | 6.5 hrs | 79.8 kg | 130/86 |
| Jan 2026 | 7,650 | 6.6 hrs | 78.9 kg | 127/83 |
| Feb 2026 | 7,838 | 6.8 hrs | 78.5 kg | 126/82 |

## Lab History (Quarterly)
| Date | HbA1c | LDL | HDL | Triglycerides | Fasting Glucose |
|------|-------|-----|-----|---------------|-----------------|
| Feb 2026 | 5.7% | 138 | 52 | 165 | 98 |
| Nov 2025 | 5.8% | 145 | 48 | 178 | 102 |
| Aug 2025 | 5.9% | 152 | 45 | 185 | 105 |
| May 2025 | 6.0% | 158 | 44 | 192 | 108 |

**Trend: Improving** — HbA1c decreased from 6.0% to 5.7% over 9 months. LDL trending down. HDL trending up.

## Real-Time Metrics (2026-02-08 14:30)
- Heart Rate: 74 bpm
- SpO2: 98%
- Respiratory Rate: 15 breaths/min
- Skin Temperature: 36.4 C
- Stress Index: 42/100

## Key Clinical Summary
Sundar is a 32-year-old South Asian male with prediabetes (HbA1c 5.7%, improving), dyslipidemia (elevated LDL 138, triglycerides 165), and mildly elevated blood pressure (128/84). He has a strong family history of T2D (father at 55), hypertension (mother at 52), and CAD (grandfather at 65). Genetically, he has a 1.45x relative risk for T2D and is a beta-thalassemia carrier. He is a CYP2C19 rapid metabolizer (affects omeprazole, escitalopram) and has a Penicillin allergy (rash). He is lactose intolerant (85% confidence) and a slow caffeine metabolizer (92% confidence). His lifestyle modifications over the past 9 months have produced improving lab trends. Key concerns: borderline HbA1c, elevated lipids, suboptimal sleep (6.5 hrs avg), and elevated visceral fat (level 11).

## Structured Data

<!-- APP_DATA:PT-001 -->
```json
{
  "id": "PT-001",
  "demographics": {
    "firstName": "Sundar",
    "lastName": "Selvaraj",
    "dateOfBirth": "1993-11-27",
    "age": 32,
    "gender": "male",
    "ethnicity": "South Asian",
    "bloodType": "B+",
    "height": 175,
    "weight": 78.5,
    "bmi": 25.6,
    "email": "sundar.selvaraj@email.com",
    "phone": "+1-555-0101",
    "address": {
      "street": "1234 Oak Avenue",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102",
      "country": "USA"
    },
    "emergencyContact": {
      "name": "Priya Selvaraj",
      "relationship": "spouse",
      "phone": "+1-555-0102"
    },
    "insurance": {
      "provider": "BlueCross BlueShield",
      "policyNumber": "BCB-2026-78543",
      "groupNumber": "GRP-SF-1001"
    }
  },
  "dashboard": {
    "profileCard": {
      "name": "Sundar Selvaraj",
      "gender": "Male",
      "weight": 78,
      "weightUnit": "Kg",
      "age": 32,
      "bloodType": "B(III)",
      "bloodRh": "Rh+"
    },
    "biomarkerData": [
      {
        "name": "Blood Glucose",
        "value": 98,
        "unit": "mg/dL",
        "status": "normal"
      },
      {
        "name": "Total Cholesterol",
        "value": 215,
        "unit": "mg/dL",
        "status": "elevated"
      },
      {
        "name": "Blood Pressure",
        "value": "128/84",
        "unit": "mmHg",
        "status": "elevated"
      },
      {
        "name": "Heart Rate",
        "value": 72,
        "unit": "bpm",
        "status": "normal"
      },
      {
        "name": "Body Temperature",
        "value": 98.4,
        "unit": "°F",
        "status": "normal"
      },
      {
        "name": "Oxygen Saturation",
        "value": 98,
        "unit": "%",
        "status": "normal"
      }
    ],
    "geneticInsights": [
      {
        "trait": "Caffeine Metabolism",
        "result": "Slow Metabolizer",
        "risk": "medium"
      },
      {
        "trait": "Lactose Tolerance",
        "result": "Reduced Tolerance",
        "risk": "medium"
      },
      {
        "trait": "Type 2 Diabetes Risk",
        "result": "Elevated genetic risk",
        "risk": "high"
      },
      {
        "trait": "Beta-Thalassemia",
        "result": "Carrier",
        "risk": "medium"
      }
    ],
    "lifestyleMetrics": [
      {
        "metric": "Average Sleep",
        "value": "6.5 hrs",
        "target": "8 hrs",
        "progress": 81
      },
      {
        "metric": "Daily Steps",
        "value": "7,850",
        "target": "10,000",
        "progress": 79
      },
      {
        "metric": "Water Intake",
        "value": "2.2 L",
        "target": "2.5 L",
        "progress": 88
      },
      {
        "metric": "Exercise Minutes",
        "value": "26 min",
        "target": "45 min",
        "progress": 58
      }
    ],
    "longitudinalEvents": [
      {
        "date": "Feb 2026",
        "event": "HbA1c improved to 5.7% (was 6.0%)"
      },
      {
        "date": "Nov 2025",
        "event": "Started lifestyle modification program"
      },
      {
        "date": "Aug 2025",
        "event": "Genetic testing completed - Beta-thalassemia carrier identified"
      },
      {
        "date": "Mar 2024",
        "event": "Prediabetes diagnosed, diet counseling initiated"
      }
    ],
    "wearables": [
      {
        "name": "Apple Watch",
        "connected": true,
        "icon": "⌚",
        "color": "bg-gray-900"
      },
      {
        "name": "Withings Scale",
        "connected": true,
        "icon": "⚖️",
        "color": "bg-teal-500"
      },
      {
        "name": "Oura Ring",
        "connected": false,
        "icon": "💍",
        "color": "bg-violet-500"
      }
    ],
    "dailyActivities": [
      {
        "name": "Sleep Tracker",
        "icon": "Moon",
        "color": "bg-indigo-500",
        "active": true
      },
      {
        "name": "Meditation",
        "icon": "Brain",
        "color": "bg-purple-500",
        "active": false
      },
      {
        "name": "Yoga",
        "icon": "Heart",
        "color": "bg-pink-500",
        "active": true
      },
      {
        "name": "Walking",
        "icon": "Footprints",
        "color": "bg-green-500",
        "active": true
      },
      {
        "name": "Swimming",
        "icon": "Waves",
        "color": "bg-blue-500",
        "active": false
      }
    ],
    "mealPlan": {
      "2026-02-08": {
        "breakfast": [
          {
            "emoji": "🍳",
            "name": "Scrambled Eggs",
            "calories": 180
          },
          {
            "emoji": "🍞",
            "name": "Whole Wheat Toast",
            "calories": 80
          },
          {
            "emoji": "🥤",
            "name": "Almond Milk",
            "calories": 40
          }
        ],
        "lunch": [
          {
            "emoji": "🍗",
            "name": "Grilled Chicken",
            "calories": 250
          },
          {
            "emoji": "🥗",
            "name": "Quinoa Salad",
            "calories": 180
          },
          {
            "emoji": "🥒",
            "name": "Cucumber Raita",
            "calories": 60
          }
        ],
        "dinner": [
          {
            "emoji": "🐟",
            "name": "Baked Salmon",
            "calories": 280
          },
          {
            "emoji": "🥦",
            "name": "Steamed Vegetables",
            "calories": 80
          },
          {
            "emoji": "🍚",
            "name": "Brown Rice",
            "calories": 150
          }
        ],
        "snacks": [
          {
            "emoji": "🥜",
            "name": "Mixed Nuts",
            "calories": 120
          },
          {
            "emoji": "🍎",
            "name": "Apple",
            "calories": 80
          }
        ]
      }
    },
    "caloriesAnalysis": {
      "consumed": 2150,
      "burned": 2420,
      "target": 2200,
      "protein": 28,
      "fat": 25,
      "carbs": 47
    }
  },
  "biomarkers": {
    "bloodPanel": {
      "lastUpdated": "2026-02-08T09:15:00Z",
      "glucose": {
        "fasting": {
          "value": 98,
          "unit": "mg/dL",
          "normalRange": [
            70,
            100
          ],
          "status": "normal"
        },
        "hba1c": {
          "value": 5.7,
          "unit": "%",
          "normalRange": [
            4,
            5.6
          ],
          "status": "borderline"
        },
        "postprandial": {
          "value": 132,
          "unit": "mg/dL",
          "normalRange": [
            70,
            140
          ],
          "status": "normal"
        }
      },
      "lipidPanel": {
        "totalCholesterol": {
          "value": 215,
          "unit": "mg/dL",
          "normalRange": [
            0,
            200
          ],
          "status": "elevated"
        },
        "ldl": {
          "value": 138,
          "unit": "mg/dL",
          "normalRange": [
            0,
            100
          ],
          "status": "elevated"
        },
        "hdl": {
          "value": 52,
          "unit": "mg/dL",
          "normalRange": [
            40,
            60
          ],
          "status": "normal"
        },
        "triglycerides": {
          "value": 165,
          "unit": "mg/dL",
          "normalRange": [
            0,
            150
          ],
          "status": "elevated"
        },
        "vldl": {
          "value": 33,
          "unit": "mg/dL",
          "normalRange": [
            5,
            40
          ],
          "status": "normal"
        }
      },
      "cbc": {
        "wbc": {
          "value": 6.8,
          "unit": "K/uL",
          "normalRange": [
            4.5,
            11
          ],
          "status": "normal"
        },
        "rbc": {
          "value": 5.1,
          "unit": "M/uL",
          "normalRange": [
            4.5,
            5.5
          ],
          "status": "normal"
        },
        "hemoglobin": {
          "value": 15.2,
          "unit": "g/dL",
          "normalRange": [
            13.5,
            17.5
          ],
          "status": "normal"
        },
        "hematocrit": {
          "value": 44.5,
          "unit": "%",
          "normalRange": [
            38.8,
            50
          ],
          "status": "normal"
        },
        "platelets": {
          "value": 245,
          "unit": "K/uL",
          "normalRange": [
            150,
            400
          ],
          "status": "normal"
        }
      },
      "metabolicPanel": {
        "sodium": {
          "value": 140,
          "unit": "mEq/L",
          "normalRange": [
            136,
            145
          ],
          "status": "normal"
        },
        "potassium": {
          "value": 4.2,
          "unit": "mEq/L",
          "normalRange": [
            3.5,
            5
          ],
          "status": "normal"
        },
        "chloride": {
          "value": 101,
          "unit": "mEq/L",
          "normalRange": [
            98,
            106
          ],
          "status": "normal"
        },
        "bicarbonate": {
          "value": 24,
          "unit": "mEq/L",
          "normalRange": [
            22,
            29
          ],
          "status": "normal"
        },
        "bun": {
          "value": 16,
          "unit": "mg/dL",
          "normalRange": [
            7,
            20
          ],
          "status": "normal"
        },
        "creatinine": {
          "value": 1,
          "unit": "mg/dL",
          "normalRange": [
            0.7,
            1.3
          ],
          "status": "normal"
        },
        "egfr": {
          "value": 98,
          "unit": "mL/min/1.73m2",
          "normalRange": [
            90,
            120
          ],
          "status": "normal"
        }
      },
      "liverFunction": {
        "alt": {
          "value": 32,
          "unit": "U/L",
          "normalRange": [
            7,
            56
          ],
          "status": "normal"
        },
        "ast": {
          "value": 28,
          "unit": "U/L",
          "normalRange": [
            10,
            40
          ],
          "status": "normal"
        },
        "alp": {
          "value": 68,
          "unit": "U/L",
          "normalRange": [
            44,
            147
          ],
          "status": "normal"
        },
        "bilirubin": {
          "value": 0.8,
          "unit": "mg/dL",
          "normalRange": [
            0.1,
            1.2
          ],
          "status": "normal"
        },
        "albumin": {
          "value": 4.2,
          "unit": "g/dL",
          "normalRange": [
            3.4,
            5.4
          ],
          "status": "normal"
        }
      },
      "thyroid": {
        "tsh": {
          "value": 2.1,
          "unit": "mIU/L",
          "normalRange": [
            0.4,
            4
          ],
          "status": "normal"
        },
        "t4Free": {
          "value": 1.2,
          "unit": "ng/dL",
          "normalRange": [
            0.8,
            1.8
          ],
          "status": "normal"
        },
        "t3": {
          "value": 125,
          "unit": "ng/dL",
          "normalRange": [
            80,
            200
          ],
          "status": "normal"
        }
      },
      "inflammatory": {
        "crp": {
          "value": 2.8,
          "unit": "mg/L",
          "normalRange": [
            0,
            3
          ],
          "status": "normal"
        },
        "esr": {
          "value": 12,
          "unit": "mm/hr",
          "normalRange": [
            0,
            22
          ],
          "status": "normal"
        },
        "homocysteine": {
          "value": 11.5,
          "unit": "umol/L",
          "normalRange": [
            5,
            15
          ],
          "status": "normal"
        }
      },
      "vitamins": {
        "vitaminD": {
          "value": 32,
          "unit": "ng/mL",
          "normalRange": [
            30,
            100
          ],
          "status": "normal"
        },
        "vitaminB12": {
          "value": 485,
          "unit": "pg/mL",
          "normalRange": [
            200,
            900
          ],
          "status": "normal"
        },
        "folate": {
          "value": 12.5,
          "unit": "ng/mL",
          "normalRange": [
            3,
            17
          ],
          "status": "normal"
        },
        "iron": {
          "value": 95,
          "unit": "mcg/dL",
          "normalRange": [
            60,
            170
          ],
          "status": "normal"
        },
        "ferritin": {
          "value": 125,
          "unit": "ng/mL",
          "normalRange": [
            30,
            400
          ],
          "status": "normal"
        }
      },
      "hormones": {
        "testosterone": {
          "value": 580,
          "unit": "ng/dL",
          "normalRange": [
            300,
            1000
          ],
          "status": "normal"
        },
        "cortisol": {
          "value": 14.5,
          "unit": "mcg/dL",
          "normalRange": [
            6,
            23
          ],
          "status": "normal"
        },
        "insulin": {
          "value": 8.5,
          "unit": "uIU/mL",
          "normalRange": [
            2.6,
            24.9
          ],
          "status": "normal"
        }
      }
    },
    "cardiovascular": {
      "lastUpdated": "2026-02-08T07:30:00Z",
      "bloodPressure": {
        "systolic": {
          "value": 128,
          "unit": "mmHg",
          "normalRange": [
            90,
            120
          ],
          "status": "elevated"
        },
        "diastolic": {
          "value": 84,
          "unit": "mmHg",
          "normalRange": [
            60,
            80
          ],
          "status": "elevated"
        }
      },
      "heartRate": {
        "resting": {
          "value": 72,
          "unit": "bpm",
          "normalRange": [
            60,
            100
          ],
          "status": "normal"
        },
        "hrv": {
          "value": 45,
          "unit": "ms",
          "normalRange": [
            20,
            200
          ],
          "status": "normal"
        }
      },
      "ecg": {
        "rhythm": "normal sinus rhythm",
        "prInterval": {
          "value": 160,
          "unit": "ms",
          "normalRange": [
            120,
            200
          ]
        },
        "qrsWidth": {
          "value": 88,
          "unit": "ms",
          "normalRange": [
            80,
            100
          ]
        },
        "qtInterval": {
          "value": 400,
          "unit": "ms",
          "normalRange": [
            350,
            450
          ]
        }
      }
    },
    "bodyComposition": {
      "lastUpdated": "2026-02-08T07:15:00Z",
      "bodyFatPercentage": {
        "value": 24.5,
        "unit": "%",
        "normalRange": [
          18,
          25
        ],
        "status": "normal"
      },
      "muscleMass": {
        "value": 35.2,
        "unit": "kg",
        "normalRange": [
          30,
          45
        ],
        "status": "normal"
      },
      "boneDensity": {
        "value": 1.15,
        "unit": "g/cm2",
        "normalRange": [
          1,
          1.4
        ],
        "status": "normal"
      },
      "visceralFat": {
        "value": 11,
        "unit": "level",
        "normalRange": [
          1,
          12
        ],
        "status": "borderline"
      },
      "waterPercentage": {
        "value": 55.2,
        "unit": "%",
        "normalRange": [
          50,
          65
        ],
        "status": "normal"
      }
    }
  },
  "genetics": {
    "lastUpdated": "2025-08-15T10:00:00Z",
    "ancestry": {
      "southAsian": 92.5,
      "centralAsian": 4.2,
      "european": 2.1,
      "other": 1.2
    },
    "pharmacogenomics": {
      "cyp2d6": {
        "genotype": "*1/*2",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "codeine",
          "tramadol",
          "tamoxifen"
        ]
      },
      "cyp2c19": {
        "genotype": "*1/*17",
        "metabolizerStatus": "rapid",
        "affectedDrugs": [
          "clopidogrel",
          "omeprazole",
          "escitalopram"
        ]
      },
      "cyp3a4": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "atorvastatin",
          "cyclosporine"
        ]
      },
      "slco1b1": {
        "genotype": "*1A/*1A",
        "riskLevel": "normal",
        "affectedDrugs": [
          "simvastatin",
          "atorvastatin"
        ]
      },
      "vkorc1": {
        "genotype": "A/G",
        "warfarinSensitivity": "intermediate"
      }
    },
    "diseaseRisk": {
      "type2Diabetes": {
        "relativeRisk": 1.45,
        "absoluteRisk": 28.5,
        "unit": "%",
        "snps": [
          "rs7903146",
          "rs1801282"
        ]
      },
      "coronaryArteryDisease": {
        "relativeRisk": 1.22,
        "absoluteRisk": 18.2,
        "unit": "%",
        "snps": [
          "rs10757278",
          "rs1333049"
        ]
      },
      "hypertension": {
        "relativeRisk": 1.15,
        "absoluteRisk": 35,
        "unit": "%",
        "snps": [
          "rs699",
          "rs4961"
        ]
      },
      "alzheimerDisease": {
        "relativeRisk": 0.85,
        "absoluteRisk": 8.5,
        "unit": "%",
        "snps": [
          "rs429358"
        ]
      },
      "colorectalCancer": {
        "relativeRisk": 0.92,
        "absoluteRisk": 4.2,
        "unit": "%",
        "snps": [
          "rs6983267"
        ]
      }
    },
    "traitMarkers": {
      "lactoseIntolerance": {
        "status": "likely",
        "confidence": 0.85
      },
      "caffeineSensitivity": {
        "status": "slow metabolizer",
        "confidence": 0.92
      },
      "alcoholFlush": {
        "status": "unlikely",
        "confidence": 0.78
      },
      "sleepPattern": {
        "status": "intermediate chronotype",
        "confidence": 0.65
      }
    },
    "carrierStatus": {
      "betaThalassemia": {
        "status": "carrier",
        "variant": "IVS-I-5 G>C"
      },
      "sickleCellAnemia": {
        "status": "negative"
      },
      "cysticFibrosis": {
        "status": "negative"
      }
    }
  },
  "lifestyle": {
    "lastUpdated": "2026-02-08T07:00:00Z",
    "activity": {
      "exerciseFrequency": "3-4 times per week",
      "primaryActivities": [
        "walking",
        "yoga",
        "swimming"
      ],
      "averageStepsDaily": 7850,
      "activeMinutesWeekly": 185,
      "sedentaryHoursDaily": 9.5
    },
    "nutrition": {
      "dietType": "flexitarian",
      "mealsPerDay": 3,
      "waterIntakeLiters": 2.2,
      "caffeineDaily": {
        "value": 180,
        "unit": "mg"
      },
      "alcoholWeekly": {
        "value": 3,
        "unit": "drinks"
      },
      "restrictions": [
        "lactose-reduced"
      ],
      "supplements": [
        "vitamin D",
        "omega-3",
        "magnesium"
      ]
    },
    "sleep": {
      "averageHours": 6.5,
      "quality": "fair",
      "sleepLatencyMinutes": 22,
      "wakeUps": 2,
      "sleepDebt": 4.5,
      "chronotype": "intermediate"
    },
    "stress": {
      "perceivedLevel": 6,
      "workLifeBalance": 5,
      "meditationMinutesWeekly": 45,
      "stressors": [
        "work deadlines",
        "financial planning"
      ]
    },
    "smoking": {
      "status": "never",
      "packYears": 0
    },
    "occupation": {
      "type": "Software Engineer",
      "hoursPerWeek": 50,
      "workStyle": "hybrid",
      "screenTimeHours": 10
    }
  },
  "medicalHistory": {
    "conditions": [
      {
        "name": "Prediabetes",
        "icd10": "R73.03",
        "diagnosedDate": "2024-03-15",
        "status": "active",
        "managedBy": "lifestyle modification"
      },
      {
        "name": "Dyslipidemia",
        "icd10": "E78.5",
        "diagnosedDate": "2023-08-22",
        "status": "active",
        "managedBy": "diet and exercise"
      },
      {
        "name": "Seasonal Allergies",
        "icd10": "J30.2",
        "diagnosedDate": "2015-04-10",
        "status": "controlled",
        "managedBy": "antihistamines as needed"
      }
    ],
    "surgeries": [
      {
        "procedure": "Appendectomy",
        "date": "2012-07-20",
        "facility": "Stanford Medical Center",
        "notes": "Uncomplicated, laparoscopic"
      }
    ],
    "allergies": [
      {
        "allergen": "Penicillin",
        "reaction": "rash",
        "severity": "moderate"
      },
      {
        "allergen": "Pollen",
        "reaction": "rhinitis",
        "severity": "mild"
      }
    ],
    "medications": [
      {
        "name": "Cetirizine",
        "dosage": "10mg",
        "frequency": "daily as needed",
        "prescribedFor": "allergies"
      }
    ],
    "familyHistory": [
      {
        "condition": "Type 2 Diabetes",
        "relationship": "father",
        "ageAtOnset": 55
      },
      {
        "condition": "Hypertension",
        "relationship": "mother",
        "ageAtOnset": 52
      },
      {
        "condition": "Coronary Artery Disease",
        "relationship": "paternal grandfather",
        "ageAtOnset": 65
      }
    ],
    "immunizations": [
      {
        "name": "COVID-19 Booster",
        "date": "2025-10-15",
        "manufacturer": "Moderna"
      },
      {
        "name": "Influenza",
        "date": "2025-09-20",
        "manufacturer": "Sanofi"
      },
      {
        "name": "Tdap",
        "date": "2022-06-10",
        "manufacturer": "GSK"
      }
    ]
  },
  "longitudinalData": {
    "days": [
      {
        "dateISO": "2026-02-08",
        "dayOfWeek": "Sunday",
        "steps": 6245,
        "activeCalories": 420,
        "caloriesBurned": 2200,
        "caloriesConsumed": 2150,
        "sleepHours": 7.8,
        "sleepQuality": 85,
        "restingHeartRate": 69,
        "hrvMs": 48,
        "systolic": 124,
        "diastolic": 80,
        "glucoseMgDl": 96,
        "weight": 78.5,
        "stressLevel": 4,
        "mood": "good",
        "hydrationLiters": 2.4,
        "activeMinutes": 40,
        "workouts": [
          {
            "type": "yoga",
            "durationMinutes": 30,
            "caloriesBurned": 120
          }
        ]
      },
      {
        "dateISO": "2026-02-07",
        "dayOfWeek": "Saturday",
        "steps": 11234,
        "activeCalories": 680,
        "caloriesBurned": 2780,
        "caloriesConsumed": 2400,
        "sleepHours": 7.5,
        "sleepQuality": 88,
        "restingHeartRate": 68,
        "hrvMs": 52,
        "systolic": 122,
        "diastolic": 78,
        "glucoseMgDl": 94,
        "weight": 78.4,
        "stressLevel": 3,
        "mood": "great",
        "hydrationLiters": 2.8,
        "activeMinutes": 90,
        "workouts": [
          {
            "type": "swimming",
            "durationMinutes": 45,
            "caloriesBurned": 350
          },
          {
            "type": "walking",
            "durationMinutes": 40,
            "caloriesBurned": 200
          }
        ]
      },
      {
        "dateISO": "2026-02-06",
        "dayOfWeek": "Friday",
        "steps": 5678,
        "activeCalories": 320,
        "caloriesBurned": 2150,
        "caloriesConsumed": 2480,
        "sleepHours": 5.8,
        "sleepQuality": 65,
        "restingHeartRate": 74,
        "hrvMs": 38,
        "systolic": 130,
        "diastolic": 86,
        "glucoseMgDl": 102,
        "weight": 78.6,
        "stressLevel": 7,
        "mood": "stressed",
        "hydrationLiters": 1.8,
        "activeMinutes": 15,
        "workouts": []
      },
      {
        "dateISO": "2026-02-05",
        "dayOfWeek": "Thursday",
        "steps": 7423,
        "activeCalories": 450,
        "caloriesBurned": 2380,
        "caloriesConsumed": 2250,
        "sleepHours": 6.5,
        "sleepQuality": 75,
        "restingHeartRate": 72,
        "hrvMs": 44,
        "systolic": 127,
        "diastolic": 83,
        "glucoseMgDl": 98,
        "weight": 78.5,
        "stressLevel": 6,
        "mood": "neutral",
        "hydrationLiters": 2.1,
        "activeMinutes": 30,
        "workouts": [
          {
            "type": "walking",
            "durationMinutes": 25,
            "caloriesBurned": 140
          }
        ]
      },
      {
        "dateISO": "2026-02-04",
        "dayOfWeek": "Wednesday",
        "steps": 9156,
        "activeCalories": 560,
        "caloriesBurned": 2580,
        "caloriesConsumed": 2100,
        "sleepHours": 7.1,
        "sleepQuality": 82,
        "restingHeartRate": 70,
        "hrvMs": 50,
        "systolic": 124,
        "diastolic": 80,
        "glucoseMgDl": 95,
        "weight": 78.5,
        "stressLevel": 5,
        "mood": "good",
        "hydrationLiters": 2.5,
        "activeMinutes": 55,
        "workouts": [
          {
            "type": "yoga",
            "durationMinutes": 45,
            "caloriesBurned": 150
          },
          {
            "type": "walking",
            "durationMinutes": 20,
            "caloriesBurned": 100
          }
        ]
      },
      {
        "dateISO": "2026-02-03",
        "dayOfWeek": "Tuesday",
        "steps": 6892,
        "activeCalories": 380,
        "caloriesBurned": 2280,
        "caloriesConsumed": 2350,
        "sleepHours": 6.8,
        "sleepQuality": 78,
        "restingHeartRate": 71,
        "hrvMs": 46,
        "systolic": 128,
        "diastolic": 84,
        "glucoseMgDl": 99,
        "weight": 78.6,
        "stressLevel": 6,
        "mood": "good",
        "hydrationLiters": 2.3,
        "activeMinutes": 25,
        "workouts": []
      },
      {
        "dateISO": "2026-02-02",
        "dayOfWeek": "Monday",
        "steps": 8234,
        "activeCalories": 490,
        "caloriesBurned": 2450,
        "caloriesConsumed": 2180,
        "sleepHours": 6.2,
        "sleepQuality": 72,
        "restingHeartRate": 73,
        "hrvMs": 42,
        "systolic": 126,
        "diastolic": 82,
        "glucoseMgDl": 97,
        "weight": 78.7,
        "stressLevel": 7,
        "mood": "neutral",
        "hydrationLiters": 2,
        "activeMinutes": 35,
        "workouts": [
          {
            "type": "walking",
            "durationMinutes": 30,
            "caloriesBurned": 180
          }
        ]
      }
    ],
    "monthlyTrends": {
      "2025-09": {
        "avgSteps": 7200,
        "avgSleep": 6.3,
        "avgWeight": 79.8,
        "avgBP": "130/86"
      },
      "2025-10": {
        "avgSteps": 7450,
        "avgSleep": 6.4,
        "avgWeight": 79.5,
        "avgBP": "129/85"
      },
      "2025-11": {
        "avgSteps": 7100,
        "avgSleep": 6.2,
        "avgWeight": 79.2,
        "avgBP": "128/84"
      },
      "2025-12": {
        "avgSteps": 6800,
        "avgSleep": 6.5,
        "avgWeight": 79.8,
        "avgBP": "130/86"
      },
      "2026-01": {
        "avgSteps": 7650,
        "avgSleep": 6.6,
        "avgWeight": 78.9,
        "avgBP": "127/83"
      },
      "2026-02": {
        "avgSteps": 7838,
        "avgSleep": 6.8,
        "avgWeight": 78.5,
        "avgBP": "126/82"
      }
    },
    "labHistory": [
      {
        "date": "2026-02-08",
        "hba1c": 5.7,
        "ldl": 138,
        "hdl": 52,
        "triglycerides": 165,
        "fastingGlucose": 98
      },
      {
        "date": "2025-11-15",
        "hba1c": 5.8,
        "ldl": 145,
        "hdl": 48,
        "triglycerides": 178,
        "fastingGlucose": 102
      },
      {
        "date": "2025-08-10",
        "hba1c": 5.9,
        "ldl": 152,
        "hdl": 45,
        "triglycerides": 185,
        "fastingGlucose": 105
      },
      {
        "date": "2025-05-05",
        "hba1c": 6,
        "ldl": 158,
        "hdl": 44,
        "triglycerides": 192,
        "fastingGlucose": 108
      }
    ]
  },
  "realTimeMetrics": {
    "timestamp": "2026-02-08T14:30:00Z",
    "heartRate": 74,
    "spo2": 98,
    "respiratoryRate": 15,
    "skinTemperature": 36.4,
    "stressIndex": 42
  },
  "healthScores": {
    "lastUpdated": "2026-02-08T14:30:00Z",
    "overall": 76,
    "cardiovascular": 72,
    "metabolic": 68,
    "fitness": 74,
    "sleep": 65,
    "nutrition": 78,
    "mentalWellness": 70
  }
}
```
<!-- /APP_DATA:PT-001 -->

---

<!-- PATIENT:PT-002 | name:Maria Rodriguez | age:47 | gender:female | risk_level:moderate | health_score:68 | conditions:Type 2 Diabetes Mellitus,Hypertension,Osteopenia -->

# Patient Profile: PT-002 — Maria Rodriguez

## Demographics
- **Patient ID:** PT-002
- **Full Name:** Maria Rodriguez
- **Date of Birth:** 1978-11-22
- **Age:** 47 years old
- **Gender:** Female
- **Ethnicity:** Hispanic/Latino
- **Blood Type:** O+ (O positive)
- **Height:** 162 cm
- **Weight:** 68.2 kg
- **BMI:** 26.0 (overweight)
- **Location:** Los Angeles, CA, USA
- **Occupation:** Administrative Assistant
- **Insurance:** Kaiser Permanente (KP-2026-34521)

## Health Scores (as of 2026-02-08)
| Domain | Score (0-100) |
|--------|--------------|
| **Overall** | **68** |
| Cardiovascular | 62 |
| Metabolic | 58 |
| Fitness | 65 |
| Sleep | 78 |
| Nutrition | 72 |
| Mental Wellness | 75 |

## Active Conditions
| Condition | ICD-10 | Diagnosed | Status | Management |
|-----------|--------|-----------|--------|------------|
| Type 2 Diabetes Mellitus | E11.9 | 2022-06-15 | Active | Metformin + lifestyle modification |
| Hypertension | I10 | 2021-03-10 | Active | Lisinopril |
| Osteopenia | M85.80 | 2024-09-20 | Active | Calcium + Vitamin D supplementation |

## Current Medications
| Medication | Dosage | Frequency | Prescribed For |
|-----------|--------|-----------|----------------|
| Metformin | 1000mg | Twice daily | Type 2 Diabetes |
| Lisinopril | 10mg | Once daily | Hypertension |

## Allergies
| Allergen | Reaction | Severity |
|----------|----------|----------|
| **Sulfa drugs** | Rash | **Moderate** |
| Ibuprofen | GI upset | Mild |

## Family History
| Condition | Relationship | Age at Onset |
|-----------|-------------|--------------|
| Type 2 Diabetes | Mother | 48 |
| Type 2 Diabetes | Maternal grandmother | 52 |

## Biomarkers — Blood Panel (last updated: 2026-02-08)

### Glucose Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Fasting Glucose | 118 | mg/dL | 70-100 | **Elevated** |
| HbA1c | 6.4 | % | 4.0-5.6 | **Diabetic** |
| Postprandial Glucose | 168 | mg/dL | 70-140 | **Elevated** |

### Lipid Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Total Cholesterol | 198 | mg/dL | <200 | Normal |
| LDL | 118 | mg/dL | <100 | **Elevated** |
| HDL | 62 | mg/dL | 50-60+ | Optimal |
| Triglycerides | 142 | mg/dL | <150 | Normal |

### Complete Blood Count (CBC)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| WBC | 5.8 | K/uL | 4.5-11.0 | Normal |
| RBC | 4.5 | M/uL | 4.0-5.0 | Normal |
| Hemoglobin | 13.2 | g/dL | 12.0-16.0 | Normal |
| Hematocrit | 39.5 | % | 36.0-44.0 | Normal |
| Platelets | 268 | K/uL | 150-400 | Normal |

### Metabolic Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Sodium | 139 | mEq/L | 136-145 | Normal |
| Potassium | 4.5 | mEq/L | 3.5-5.0 | Normal |
| Chloride | 102 | mEq/L | 98-106 | Normal |
| Bicarbonate | 25 | mEq/L | 22-29 | Normal |
| BUN | 18 | mg/dL | 7-20 | Normal |
| Creatinine | 1.1 | mg/dL | 0.6-1.1 | **Borderline** |
| eGFR | 88 | mL/min/1.73m2 | 90-120 | **Mildly reduced** |

### Liver Function
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| ALT | 24 | U/L | 7-56 | Normal |
| AST | 22 | U/L | 10-40 | Normal |
| ALP | 72 | U/L | 44-147 | Normal |
| Bilirubin | 0.6 | mg/dL | 0.1-1.2 | Normal |
| Albumin | 4.0 | g/dL | 3.4-5.4 | Normal |

### Thyroid
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| TSH | 3.8 | mIU/L | 0.4-4.0 | Normal |
| Free T4 | 1.1 | ng/dL | 0.8-1.8 | Normal |

### Inflammatory Markers
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| CRP | 3.5 | mg/L | 0-3.0 | **Slightly elevated** |
| ESR | 18 | mm/hr | 0-30 | Normal |
| Homocysteine | 12.0 | umol/L | 5-15 | Normal |

### Vitamins & Minerals
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Vitamin D | 35 | ng/mL | 30-100 | Normal |
| Vitamin B12 | 420 | pg/mL | 200-900 | Normal |
| Folate | 14.2 | ng/mL | 3-17 | Normal |
| Iron | 78 | mcg/dL | 60-170 | Normal |
| Ferritin | 68 | ng/mL | 12-150 | Normal |
| Calcium | 9.4 | mg/dL | 8.5-10.5 | Normal |

### Hormones
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Estradiol | 42 | pg/mL | 30-400 | Normal (perimenopausal range) |
| FSH | 18.5 | mIU/mL | 3.5-12.5 | **Elevated** (perimenopausal) |
| Cortisol | 12.8 | mcg/dL | 6-23 | Normal |
| Insulin | 12.5 | uIU/mL | 2.6-24.9 | Normal |

## Biomarkers — Cardiovascular (last updated: 2026-02-08)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Systolic BP | 138 | mmHg | 90-120 | **Stage 1 hypertension** |
| Diastolic BP | 88 | mmHg | 60-80 | **Stage 1 hypertension** |
| Resting Heart Rate | 78 | bpm | 60-100 | Normal |
| HRV | 35 | ms | 20-200 | Normal (lower range) |

### ECG
- Rhythm: Normal sinus rhythm
- PR Interval: 168 ms (normal: 120-200)
- QRS Width: 86 ms (normal: 80-100)
- QT Interval: 410 ms (normal: 350-450)

## Biomarkers — Body Composition
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Body Fat | 32.5 | % | 25-35 | Normal |
| Muscle Mass | 24.8 | kg | 20-35 | Normal |
| Bone Density | 0.95 | g/cm2 | 1.0-1.4 | **Low (osteopenia)** |
| Visceral Fat | 9 | level | 1-12 | Normal |
| Water Percentage | 52.5 | % | 45-60 | Normal |

## Pharmacogenomics (CRITICAL for drug prescribing)

| Enzyme | Genotype | Metabolizer Status | Affected Drugs |
|--------|----------|-------------------|----------------|
| **CYP2D6** | *1/*41 | **Intermediate** | codeine, tramadol, tamoxifen, metoprolol |
| **CYP2C19** | *1/*1 | Normal | clopidogrel, omeprazole, escitalopram |
| **CYP3A4** | *1/*1 | Normal | atorvastatin, amlodipine, cyclosporine |
| **SLCO1B1** | *1A/*5 | **Intermediate risk** | simvastatin, atorvastatin, rosuvastatin |
| **VKORC1** | G/G | Normal warfarin sensitivity | warfarin |

**Key pharmacogenomic alerts:**
- CYP2D6 intermediate metabolizer: Codeine may have **reduced efficacy** due to decreased conversion to morphine. Consider alternative analgesics. Tramadol similarly affected.
- CYP2D6 intermediate metabolizer: Tamoxifen activation may be reduced — if ever needed for breast cancer, consider alternative endocrine therapy.
- SLCO1B1 intermediate risk: Increased risk of **myopathy with high-dose statins** (especially simvastatin >20mg). If statin therapy needed, use low-to-moderate dose rosuvastatin or pravastatin (not SLCO1B1-dependent).
- Metoprolol may have higher-than-expected plasma levels due to CYP2D6 intermediate status — use lower starting dose.

## Genetic Disease Risk
| Disease | Relative Risk | Absolute Risk | Key SNPs |
|---------|--------------|---------------|----------|
| Type 2 Diabetes | 1.65x | 32.5% | rs7903146, rs1801282, rs13266634 |
| Osteoporosis | 1.35x | 22.5% | rs2282679, rs9340799 |
| Coronary Artery Disease | 1.12x | 15.5% | rs10757278 |
| Breast Cancer | 1.08x | 13.2% | rs2981582 |

## Genetic Trait Markers
| Trait | Status | Confidence |
|-------|--------|-----------|
| Lactose Intolerance | Unlikely | 72% |
| Caffeine Sensitivity | Normal metabolizer | 85% |
| Alcohol Flush | Unlikely | 82% |
| Sleep Pattern | Morning chronotype | 70% |

## Carrier Status
| Condition | Status | Variant |
|-----------|--------|---------|
| Beta-Thalassemia | Negative | — |
| Sickle Cell Anemia | Negative | — |
| Cystic Fibrosis | Negative | — |

## Ancestry
- Southern European: 45.2%
- Native American: 38.5%
- African: 12.1%
- Other: 4.2%

## Lifestyle

### Activity
- Exercise frequency: 2-3 times per week
- Primary activities: Walking, Dancing, Gardening
- Average daily steps: 6,200
- Active minutes per week: 125
- Sedentary hours per day: 8.5

### Nutrition
- Diet type: Mediterranean-influenced
- Meals per day: 3
- Water intake: 1.8 L/day
- Caffeine: 120 mg/day
- Alcohol: 2 drinks/week
- Dietary restrictions: Low sodium, diabetic-friendly
- Supplements: Calcium, Vitamin D, Omega-3

### Sleep
- Average: 7.2 hours (target: 7.5 hours)
- Quality: Good
- Sleep latency: 15 minutes
- Wake-ups: 1 per night
- Chronotype: Morning

### Stress
- Perceived level: 4/10
- Work-life balance: 7/10
- Social support: Strong family network
- Stressors: Chronic disease management, aging parents

### Smoking
- Status: Former smoker
- Quit date: 2018
- Pack-years: 8

## Surgical History
| Procedure | Date | Facility | Notes |
|-----------|------|----------|-------|
| Cesarean section | 2005-04-15 | Cedars-Sinai Medical Center | Uncomplicated |
| Cholecystectomy | 2019-11-08 | Kaiser Permanente LA | Laparoscopic, gallstones |

## Immunizations
| Vaccine | Date | Manufacturer |
|---------|------|-------------|
| COVID-19 Booster | 2025-09-22 | Pfizer |
| Influenza | 2025-10-05 | Sanofi |
| Shingrix (dose 1) | 2025-11-15 | GSK |
| Tdap | 2021-08-20 | GSK |

## Longitudinal Data — 7-Day Daily Tracking (2026-02-02 to 2026-02-08)

| Date | Steps | Active Cal | Sleep (hrs) | Sleep Quality | Resting HR | HRV (ms) | Systolic | Diastolic | Glucose | Weight | Stress | Mood | Hydration (L) | Active Min |
|------|-------|-----------|-------------|---------------|------------|-----------|----------|-----------|---------|--------|--------|------|--------------|-----------|
| Feb 08 (Sun) | 7,250 | 380 | 7.5 | 82% | 76 | 38 | 135 | 86 | 115 | 68.2 | 3 | Good | 2.0 | 35 |
| Feb 07 (Sat) | 8,920 | 480 | 7.8 | 88% | 74 | 40 | 132 | 84 | 112 | 68.1 | 2 | Great | 2.2 | 60 |
| Feb 06 (Fri) | 5,450 | 280 | 7.0 | 75% | 80 | 32 | 140 | 90 | 122 | 68.3 | 5 | Neutral | 1.6 | 15 |
| Feb 05 (Thu) | 6,100 | 320 | 7.2 | 78% | 78 | 35 | 138 | 88 | 118 | 68.2 | 4 | Good | 1.8 | 20 |
| Feb 04 (Wed) | 7,800 | 420 | 7.5 | 85% | 76 | 38 | 134 | 85 | 114 | 68.1 | 3 | Good | 2.0 | 45 |
| Feb 03 (Tue) | 5,850 | 290 | 6.8 | 72% | 79 | 33 | 142 | 92 | 125 | 68.4 | 5 | Neutral | 1.5 | 10 |
| Feb 02 (Mon) | 6,430 | 340 | 7.4 | 80% | 77 | 36 | 136 | 87 | 116 | 68.3 | 4 | Good | 1.8 | 25 |

### Weekly Workouts
- Feb 08: Walking 30 min (150 cal)
- Feb 07: Dancing class 45 min (280 cal), Walking 20 min (100 cal)
- Feb 06: No workouts
- Feb 05: Walking 20 min (110 cal)
- Feb 04: Gardening 40 min (200 cal), Walking 15 min (80 cal)
- Feb 03: No workouts
- Feb 02: Walking 25 min (130 cal)

## Monthly Trends (6 months)
| Month | Avg Steps | Avg Sleep | Avg Weight | Avg BP | Avg Glucose |
|-------|-----------|-----------|------------|--------|-------------|
| Sep 2025 | 5,800 | 7.0 hrs | 69.5 kg | 142/92 | 128 |
| Oct 2025 | 5,950 | 7.1 hrs | 69.2 kg | 140/90 | 125 |
| Nov 2025 | 6,000 | 7.0 hrs | 69.0 kg | 140/90 | 124 |
| Dec 2025 | 5,600 | 7.2 hrs | 69.4 kg | 142/91 | 126 |
| Jan 2026 | 6,100 | 7.2 hrs | 68.5 kg | 138/88 | 120 |
| Feb 2026 | 6,829 | 7.3 hrs | 68.2 kg | 137/87 | 117 |

## Lab History (Quarterly)
| Date | HbA1c | Fasting Glucose | LDL | HDL | Triglycerides | Creatinine | eGFR |
|------|-------|-----------------|-----|-----|---------------|------------|------|
| Feb 2026 | 6.4% | 118 | 118 | 62 | 142 | 1.1 | 88 |
| Nov 2025 | 6.6% | 125 | 125 | 58 | 155 | 1.0 | 90 |
| Aug 2025 | 6.8% | 132 | 132 | 52 | 168 | 1.0 | 92 |
| May 2025 | 7.0% | 138 | 140 | 48 | 178 | 0.9 | 95 |

**Trend: Improving** — HbA1c decreased from 7.0% to 6.4% over 9 months. LDL improving. HDL rising. However, creatinine is rising slightly (0.9 to 1.1) and eGFR declining (95 to 88) — monitor renal function closely.

## Real-Time Metrics (2026-02-08 14:30)
- Heart Rate: 76 bpm
- SpO2: 97%
- Respiratory Rate: 16 breaths/min
- Skin Temperature: 36.6 C
- Stress Index: 35/100

## Key Clinical Summary
Maria is a 47-year-old Hispanic woman with Type 2 Diabetes (HbA1c 6.4%, improving from 7.0%), stage 1 hypertension (138/88), and osteopenia (bone density 0.95 g/cm2). She is currently managed on Metformin 1000mg twice daily and Lisinopril 10mg once daily. She has a strong family history of T2D (mother at 48, maternal grandmother at 52) and a genetic relative risk of 1.65x for T2D. She is a CYP2D6 intermediate metabolizer, meaning codeine and tramadol may have reduced efficacy — consider alternative analgesics. SLCO1B1 intermediate risk means increased myopathy risk with high-dose statins; if statin therapy is needed, use low-to-moderate dose rosuvastatin or pravastatin. Her creatinine is borderline (1.1) and eGFR is mildly reduced (88) — monitor renal function closely, especially given diabetes and hypertension. CRP is slightly elevated (3.5), suggesting low-grade systemic inflammation. She is a former smoker (quit 2018, 8 pack-years). Allergic to sulfa drugs (rash) and ibuprofen (GI upset). Perimenopausal (elevated FSH 18.5). Current trends are improving on the Metformin + Lisinopril regimen, but renal function bears watching.

## Structured Data

<!-- APP_DATA:PT-002 -->
```json
{
  "id": "PT-002",
  "demographics": {
    "firstName": "Maria",
    "lastName": "Rodriguez",
    "dateOfBirth": "1978-11-22",
    "age": 47,
    "gender": "female",
    "ethnicity": "Hispanic/Latino",
    "bloodType": "O+",
    "height": 162,
    "weight": 68.2,
    "bmi": 26,
    "email": "maria.rodriguez@email.com",
    "phone": "+1-555-0203",
    "address": {
      "street": "789 Maple Street",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90012",
      "country": "USA"
    },
    "insurance": {
      "provider": "Kaiser Permanente",
      "policyNumber": "KP-2026-34521",
      "groupNumber": "GRP-LA-2002"
    }
  },
  "dashboard": {
    "profileCard": {
      "name": "Maria Rodriguez",
      "gender": "Female",
      "weight": 68,
      "weightUnit": "Kg",
      "age": 47,
      "bloodType": "O(I)",
      "bloodRh": "Rh+"
    },
    "biomarkerData": [
      {
        "name": "Blood Glucose",
        "value": 118,
        "unit": "mg/dL",
        "status": "elevated"
      },
      {
        "name": "Total Cholesterol",
        "value": 198,
        "unit": "mg/dL",
        "status": "normal"
      },
      {
        "name": "Blood Pressure",
        "value": "138/88",
        "unit": "mmHg",
        "status": "stage 1 hypertension"
      },
      {
        "name": "Heart Rate",
        "value": 78,
        "unit": "bpm",
        "status": "normal"
      },
      {
        "name": "Body Temperature",
        "value": 98.6,
        "unit": "°F",
        "status": "normal"
      },
      {
        "name": "Oxygen Saturation",
        "value": 97,
        "unit": "%",
        "status": "normal"
      }
    ],
    "geneticInsights": [
      {
        "trait": "Type 2 Diabetes Risk",
        "result": "High genetic risk",
        "risk": "high"
      },
      {
        "trait": "Osteoporosis Risk",
        "result": "Elevated risk",
        "risk": "medium"
      },
      {
        "trait": "Caffeine Metabolism",
        "result": "Normal Metabolizer",
        "risk": "low"
      },
      {
        "trait": "Drug Metabolism (CYP2D6)",
        "result": "Intermediate metabolizer",
        "risk": "medium"
      }
    ],
    "lifestyleMetrics": [
      {
        "metric": "Average Sleep",
        "value": "7.2 hrs",
        "target": "8 hrs",
        "progress": 90
      },
      {
        "metric": "Daily Steps",
        "value": "6,200",
        "target": "8,000",
        "progress": 78
      },
      {
        "metric": "Water Intake",
        "value": "1.8 L",
        "target": "2.0 L",
        "progress": 90
      },
      {
        "metric": "Exercise Minutes",
        "value": "18 min",
        "target": "30 min",
        "progress": 60
      }
    ],
    "longitudinalEvents": [
      {
        "date": "Feb 2026",
        "event": "HbA1c improved to 6.4% (was 6.8%)"
      },
      {
        "date": "Jan 2026",
        "event": "Endocrinology consultation - medication adjusted"
      },
      {
        "date": "Sep 2024",
        "event": "Osteopenia diagnosed - started calcium supplements"
      },
      {
        "date": "Jun 2022",
        "event": "Type 2 Diabetes diagnosed"
      }
    ],
    "wearables": [
      {
        "name": "Fitbit Sense",
        "connected": true,
        "icon": "📱",
        "color": "bg-teal-500"
      },
      {
        "name": "Dexcom G7",
        "connected": true,
        "icon": "📊",
        "color": "bg-blue-600"
      }
    ],
    "dailyActivities": [
      {
        "name": "Sleep Tracker",
        "icon": "Moon",
        "color": "bg-indigo-500",
        "active": true
      },
      {
        "name": "Walking",
        "icon": "Footprints",
        "color": "bg-green-500",
        "active": true
      },
      {
        "name": "Dancing",
        "icon": "Music",
        "color": "bg-pink-500",
        "active": false
      },
      {
        "name": "Gardening",
        "icon": "Leaf",
        "color": "bg-emerald-500",
        "active": true
      }
    ],
    "mealPlan": {
      "2026-02-08": {
        "breakfast": [
          {
            "emoji": "🥣",
            "name": "Steel Cut Oatmeal",
            "calories": 150
          },
          {
            "emoji": "🫐",
            "name": "Blueberries",
            "calories": 40
          },
          {
            "emoji": "🥛",
            "name": "Low-fat Milk",
            "calories": 80
          }
        ],
        "lunch": [
          {
            "emoji": "🥗",
            "name": "Mediterranean Salad",
            "calories": 200
          },
          {
            "emoji": "🐔",
            "name": "Grilled Chicken",
            "calories": 180
          },
          {
            "emoji": "🫒",
            "name": "Olive Oil Dressing",
            "calories": 60
          }
        ],
        "dinner": [
          {
            "emoji": "🐟",
            "name": "Grilled Tilapia",
            "calories": 200
          },
          {
            "emoji": "🥬",
            "name": "Sauteed Spinach",
            "calories": 50
          },
          {
            "emoji": "🍠",
            "name": "Sweet Potato",
            "calories": 120
          }
        ],
        "snacks": [
          {
            "emoji": "🥒",
            "name": "Cucumber Slices",
            "calories": 15
          },
          {
            "emoji": "🧀",
            "name": "String Cheese",
            "calories": 80
          }
        ]
      }
    },
    "caloriesAnalysis": {
      "consumed": 1850,
      "burned": 2100,
      "target": 1800,
      "protein": 32,
      "fat": 28,
      "carbs": 40
    }
  },
  "biomarkers": {
    "bloodPanel": {
      "lastUpdated": "2026-02-07T11:30:00Z",
      "glucose": {
        "fasting": {
          "value": 118,
          "unit": "mg/dL",
          "normalRange": [
            70,
            100
          ],
          "status": "elevated"
        },
        "hba1c": {
          "value": 6.4,
          "unit": "%",
          "normalRange": [
            4,
            5.6
          ],
          "status": "diabetic"
        },
        "postprandial": {
          "value": 168,
          "unit": "mg/dL",
          "normalRange": [
            70,
            140
          ],
          "status": "elevated"
        }
      },
      "lipidPanel": {
        "totalCholesterol": {
          "value": 198,
          "unit": "mg/dL",
          "normalRange": [
            0,
            200
          ],
          "status": "normal"
        },
        "ldl": {
          "value": 118,
          "unit": "mg/dL",
          "normalRange": [
            0,
            100
          ],
          "status": "elevated"
        },
        "hdl": {
          "value": 62,
          "unit": "mg/dL",
          "normalRange": [
            50,
            60
          ],
          "status": "optimal"
        },
        "triglycerides": {
          "value": 142,
          "unit": "mg/dL",
          "normalRange": [
            0,
            150
          ],
          "status": "normal"
        }
      },
      "cbc": {
        "wbc": {
          "value": 5.8,
          "unit": "K/uL",
          "normalRange": [
            4.5,
            11
          ],
          "status": "normal"
        },
        "rbc": {
          "value": 4.5,
          "unit": "M/uL",
          "normalRange": [
            4,
            5
          ],
          "status": "normal"
        },
        "hemoglobin": {
          "value": 13.2,
          "unit": "g/dL",
          "normalRange": [
            12,
            16
          ],
          "status": "normal"
        },
        "platelets": {
          "value": 268,
          "unit": "K/uL",
          "normalRange": [
            150,
            400
          ],
          "status": "normal"
        }
      },
      "metabolicPanel": {
        "sodium": {
          "value": 139,
          "unit": "mEq/L",
          "normalRange": [
            136,
            145
          ],
          "status": "normal"
        },
        "potassium": {
          "value": 4.5,
          "unit": "mEq/L",
          "normalRange": [
            3.5,
            5
          ],
          "status": "normal"
        },
        "bun": {
          "value": 18,
          "unit": "mg/dL",
          "normalRange": [
            7,
            20
          ],
          "status": "normal"
        },
        "creatinine": {
          "value": 1.1,
          "unit": "mg/dL",
          "normalRange": [
            0.6,
            1.1
          ],
          "status": "borderline"
        },
        "egfr": {
          "value": 88,
          "unit": "mL/min/1.73m2",
          "normalRange": [
            90,
            120
          ],
          "status": "mildly reduced"
        }
      },
      "thyroid": {
        "tsh": {
          "value": 3.8,
          "unit": "mIU/L",
          "normalRange": [
            0.4,
            4
          ],
          "status": "normal"
        }
      },
      "liverFunction": {
        "alt": {
          "value": 24,
          "unit": "U/L",
          "normalRange": [
            7,
            56
          ],
          "status": "normal"
        },
        "ast": {
          "value": 22,
          "unit": "U/L",
          "normalRange": [
            10,
            40
          ],
          "status": "normal"
        }
      },
      "inflammatory": {
        "crp": {
          "value": 3.5,
          "unit": "mg/L",
          "normalRange": [
            0,
            3
          ],
          "status": "slightly elevated"
        }
      },
      "vitamins": {
        "vitaminD": {
          "value": 35,
          "unit": "ng/mL",
          "normalRange": [
            30,
            100
          ],
          "status": "normal"
        }
      }
    },
    "cardiovascular": {
      "lastUpdated": "2026-02-06T09:00:00Z",
      "bloodPressure": {
        "systolic": {
          "value": 138,
          "unit": "mmHg",
          "normalRange": [
            90,
            120
          ],
          "status": "stage 1 hypertension"
        },
        "diastolic": {
          "value": 88,
          "unit": "mmHg",
          "normalRange": [
            60,
            80
          ],
          "status": "elevated"
        }
      },
      "heartRate": {
        "resting": {
          "value": 78,
          "unit": "bpm",
          "normalRange": [
            60,
            100
          ],
          "status": "normal"
        },
        "hrv": {
          "value": 35,
          "unit": "ms",
          "normalRange": [
            20,
            200
          ],
          "status": "normal"
        }
      }
    },
    "bodyComposition": {
      "lastUpdated": "2026-02-05T07:30:00Z",
      "bodyFatPercentage": {
        "value": 32.5,
        "unit": "%",
        "normalRange": [
          21,
          33
        ],
        "status": "normal"
      },
      "boneDensity": {
        "value": 0.95,
        "unit": "g/cm2",
        "normalRange": [
          1,
          1.4
        ],
        "status": "low"
      }
    }
  },
  "genetics": {
    "lastUpdated": "2024-06-20T10:00:00Z",
    "ancestry": {
      "southernEuropean": 45.2,
      "nativeAmerican": 38.5,
      "african": 12.1,
      "other": 4.2
    },
    "diseaseRisk": {
      "type2Diabetes": {
        "relativeRisk": 1.65,
        "absoluteRisk": 32.5,
        "unit": "%"
      },
      "osteoporosis": {
        "relativeRisk": 1.35,
        "absoluteRisk": 22.5,
        "unit": "%"
      }
    },
    "pharmacogenomics": {
      "cyp2d6": {
        "genotype": "*1/*41",
        "metabolizerStatus": "intermediate",
        "affectedDrugs": [
          "codeine",
          "tramadol",
          "tamoxifen",
          "metoprolol"
        ]
      },
      "cyp2c19": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "clopidogrel",
          "omeprazole",
          "escitalopram"
        ]
      },
      "cyp3a4": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "atorvastatin",
          "amlodipine",
          "cyclosporine"
        ]
      },
      "slco1b1": {
        "genotype": "*1A/*5",
        "riskLevel": "intermediate",
        "affectedDrugs": [
          "simvastatin",
          "atorvastatin",
          "rosuvastatin"
        ]
      },
      "vkorc1": {
        "genotype": "G/G",
        "warfarinSensitivity": "normal"
      }
    },
    "traitMarkers": {
      "lactoseIntolerance": {
        "status": "unlikely",
        "confidence": 0.72
      },
      "caffeineSensitivity": {
        "status": "normal metabolizer",
        "confidence": 0.85
      }
    },
    "carrierStatus": {
      "sickleCellAnemia": {
        "status": "negative"
      },
      "cysticFibrosis": {
        "status": "negative"
      }
    }
  },
  "lifestyle": {
    "lastUpdated": "2026-02-08T06:30:00Z",
    "activity": {
      "exerciseFrequency": "2-3 times per week",
      "primaryActivities": [
        "walking",
        "dancing",
        "gardening"
      ],
      "averageStepsDaily": 6200,
      "activeMinutesWeekly": 125,
      "sedentaryHoursDaily": 8
    },
    "nutrition": {
      "dietType": "Mediterranean-influenced",
      "mealsPerDay": 3,
      "waterIntakeLiters": 1.8,
      "restrictions": [
        "low sodium",
        "diabetic-friendly"
      ],
      "supplements": [
        "calcium",
        "vitamin D",
        "omega-3",
        "metformin"
      ]
    },
    "sleep": {
      "averageHours": 7.2,
      "quality": "good",
      "chronotype": "morning"
    },
    "smoking": {
      "status": "former",
      "quitDate": "2018-01-01",
      "packYears": 8
    }
  },
  "medicalHistory": {
    "conditions": [
      {
        "name": "Type 2 Diabetes Mellitus",
        "icd10": "E11.9",
        "diagnosedDate": "2022-06-15",
        "status": "active",
        "managedBy": "metformin + lifestyle"
      },
      {
        "name": "Hypertension",
        "icd10": "I10",
        "diagnosedDate": "2021-03-10",
        "status": "active",
        "managedBy": "lisinopril"
      },
      {
        "name": "Osteopenia",
        "icd10": "M85.80",
        "diagnosedDate": "2024-09-20",
        "status": "active",
        "managedBy": "calcium + vitamin D supplementation"
      }
    ],
    "medications": [
      {
        "name": "Metformin",
        "dosage": "1000mg",
        "frequency": "twice daily",
        "prescribedFor": "diabetes"
      },
      {
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "once daily",
        "prescribedFor": "hypertension"
      }
    ],
    "allergies": [
      {
        "allergen": "Sulfa drugs",
        "reaction": "rash",
        "severity": "moderate"
      },
      {
        "allergen": "Ibuprofen",
        "reaction": "GI upset",
        "severity": "mild"
      }
    ],
    "familyHistory": [
      {
        "condition": "Type 2 Diabetes",
        "relationship": "mother",
        "ageAtOnset": 48
      },
      {
        "condition": "Type 2 Diabetes",
        "relationship": "maternal grandmother",
        "ageAtOnset": 52
      }
    ]
  },
  "longitudinalData": {
    "days": [
      {
        "dateISO": "2026-02-08",
        "steps": 4520,
        "activeCalories": 280,
        "sleepHours": 7.5,
        "restingHeartRate": 78,
        "hrvMs": 34,
        "systolic": 136,
        "diastolic": 86,
        "glucoseMgDl": 118,
        "weight": 68.2
      },
      {
        "dateISO": "2026-02-07",
        "steps": 8234,
        "activeCalories": 420,
        "sleepHours": 7.8,
        "restingHeartRate": 76,
        "hrvMs": 38,
        "systolic": 132,
        "diastolic": 84,
        "glucoseMgDl": 108,
        "weight": 68.1
      },
      {
        "dateISO": "2026-02-06",
        "steps": 6890,
        "activeCalories": 350,
        "sleepHours": 7.3,
        "restingHeartRate": 77,
        "hrvMs": 36,
        "systolic": 138,
        "diastolic": 88,
        "glucoseMgDl": 115,
        "weight": 68.2
      },
      {
        "dateISO": "2026-02-05",
        "steps": 5456,
        "activeCalories": 290,
        "sleepHours": 6.8,
        "restingHeartRate": 79,
        "hrvMs": 32,
        "systolic": 140,
        "diastolic": 90,
        "glucoseMgDl": 128,
        "weight": 68.3
      },
      {
        "dateISO": "2026-02-04",
        "steps": 7120,
        "activeCalories": 380,
        "sleepHours": 7.5,
        "restingHeartRate": 77,
        "hrvMs": 35,
        "systolic": 135,
        "diastolic": 85,
        "glucoseMgDl": 112,
        "weight": 68.2
      },
      {
        "dateISO": "2026-02-03",
        "steps": 6234,
        "activeCalories": 320,
        "sleepHours": 7.2,
        "restingHeartRate": 78,
        "hrvMs": 34,
        "systolic": 138,
        "diastolic": 87,
        "glucoseMgDl": 118,
        "weight": 68.3
      },
      {
        "dateISO": "2026-02-02",
        "steps": 5890,
        "activeCalories": 300,
        "sleepHours": 7,
        "restingHeartRate": 79,
        "hrvMs": 33,
        "systolic": 140,
        "diastolic": 88,
        "glucoseMgDl": 125,
        "weight": 68.4
      }
    ],
    "labHistory": [
      {
        "date": "2026-02-07",
        "hba1c": 6.4,
        "fastingGlucose": 118
      },
      {
        "date": "2025-11-10",
        "hba1c": 6.6,
        "fastingGlucose": 125
      },
      {
        "date": "2025-08-05",
        "hba1c": 6.8,
        "fastingGlucose": 132
      }
    ]
  },
  "healthScores": {
    "lastUpdated": "2026-02-08T14:30:00Z",
    "overall": 68,
    "cardiovascular": 62,
    "metabolic": 58,
    "fitness": 65,
    "sleep": 78,
    "nutrition": 72,
    "mentalWellness": 75
  }
}
```
<!-- /APP_DATA:PT-002 -->

---

<!-- PATIENT:PT-003 | name:James Chen | age:33 | gender:male | risk_level:low | health_score:92 | conditions:Vitamin D Deficiency -->

# Patient Profile: PT-003 — James Chen

## Demographics
- **Patient ID:** PT-003
- **Full Name:** James Chen
- **Date of Birth:** 1992-03-08
- **Age:** 33 years old
- **Gender:** Male
- **Ethnicity:** East Asian
- **Blood Type:** A+ (A positive)
- **Height:** 178 cm
- **Weight:** 72.5 kg
- **BMI:** 22.9 (normal)
- **Location:** Seattle, WA, USA
- **Occupation:** Product Manager (tech industry)
- **Insurance:** Aetna (AET-2026-67890)

## Health Scores (as of 2026-02-08)
| Domain | Score (0-100) |
|--------|--------------|
| **Overall** | **92** |
| Cardiovascular | 95 |
| Metabolic | 90 |
| Fitness | 96 |
| Sleep | 88 |
| Nutrition | 85 |
| Mental Wellness | 88 |

## Active Conditions
| Condition | ICD-10 | Diagnosed | Status | Management |
|-----------|--------|-----------|--------|------------|
| Vitamin D Deficiency | E55.9 | 2025-02-15 | Improving | Vitamin D3 supplementation |

## Current Medications
| Medication | Dosage | Frequency | Prescribed For |
|-----------|--------|-----------|----------------|
| Vitamin D3 | 2000 IU | Once daily | Vitamin D Deficiency |

## Allergies
| Allergen | Reaction | Severity |
|----------|----------|----------|
| **Shellfish** | Anaphylaxis | **SEVERE** |

**ANAPHYLAXIS ALERT:** Patient carries an EpiPen at all times. Shellfish allergy is life-threatening. Avoid all shellfish-derived products including glucosamine supplements derived from shellfish.

## Family History
| Condition | Relationship | Age at Onset |
|-----------|-------------|--------------|
| Gastric Cancer | Paternal grandfather | 72 |

## Biomarkers — Blood Panel (last updated: 2026-02-08)

### Glucose Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Fasting Glucose | 88 | mg/dL | 70-100 | Optimal |
| HbA1c | 5.2 | % | 4.0-5.6 | Optimal |
| Postprandial Glucose | 112 | mg/dL | 70-140 | Normal |

### Lipid Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Total Cholesterol | 175 | mg/dL | <200 | Optimal |
| LDL | 95 | mg/dL | <100 | Optimal |
| HDL | 58 | mg/dL | 40-60 | Normal |
| Triglycerides | 110 | mg/dL | <150 | Optimal |
| VLDL | 22 | mg/dL | 5-40 | Normal |

### Complete Blood Count (CBC)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| WBC | 6.2 | K/uL | 4.5-11.0 | Normal |
| RBC | 5.3 | M/uL | 4.5-5.5 | Normal |
| Hemoglobin | 15.8 | g/dL | 13.5-17.5 | Normal |
| Hematocrit | 46.0 | % | 38.8-50.0 | Normal |
| Platelets | 228 | K/uL | 150-400 | Normal |

### Metabolic Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Sodium | 141 | mEq/L | 136-145 | Normal |
| Potassium | 4.0 | mEq/L | 3.5-5.0 | Normal |
| Chloride | 103 | mEq/L | 98-106 | Normal |
| Bicarbonate | 25 | mEq/L | 22-29 | Normal |
| BUN | 14 | mg/dL | 7-20 | Normal |
| Creatinine | 0.9 | mg/dL | 0.7-1.3 | Normal |
| eGFR | 105 | mL/min/1.73m2 | 90-120 | Normal |

### Liver Function
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| ALT | 22 | U/L | 7-56 | Normal |
| AST | 20 | U/L | 10-40 | Normal |
| ALP | 58 | U/L | 44-147 | Normal |
| Bilirubin | 0.7 | mg/dL | 0.1-1.2 | Normal |
| Albumin | 4.5 | g/dL | 3.4-5.4 | Normal |

### Thyroid
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| TSH | 1.8 | mIU/L | 0.4-4.0 | Normal |
| Free T4 | 1.3 | ng/dL | 0.8-1.8 | Normal |
| T3 | 135 | ng/dL | 80-200 | Normal |

### Inflammatory Markers
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| CRP | 0.8 | mg/L | 0-3.0 | Optimal |
| ESR | 6 | mm/hr | 0-22 | Normal |
| Homocysteine | 8.5 | umol/L | 5-15 | Normal |

### Vitamins & Minerals
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Vitamin D | 28 | ng/mL | 30-100 | **Insufficient** |
| Vitamin B12 | 520 | pg/mL | 200-900 | Normal |
| Folate | 15.2 | ng/mL | 3-17 | Normal |
| Iron | 110 | mcg/dL | 60-170 | Normal |
| Ferritin | 145 | ng/mL | 30-400 | Normal |

### Hormones
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Testosterone | 650 | ng/dL | 300-1000 | Normal |
| Cortisol | 12.5 | mcg/dL | 6-23 | Normal |
| Insulin | 5.8 | uIU/mL | 2.6-24.9 | Normal |

## Biomarkers — Cardiovascular (last updated: 2026-02-08)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Systolic BP | 118 | mmHg | 90-120 | Optimal |
| Diastolic BP | 76 | mmHg | 60-80 | Optimal |
| Resting Heart Rate | 62 | bpm | 60-100 | Athletic |
| HRV | 65 | ms | 20-200 | Excellent |
| VO2 Max | 48 | mL/kg/min | 35-55 | Excellent |

### ECG
- Rhythm: Normal sinus rhythm
- PR Interval: 155 ms (normal: 120-200)
- QRS Width: 82 ms (normal: 80-100)
- QT Interval: 390 ms (normal: 350-450)
- Notable: Sinus bradycardia consistent with athletic conditioning

## Biomarkers — Body Composition
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Body Fat | 16.5 | % | 18-25 | Athletic |
| Muscle Mass | 38.5 | kg | 30-45 | Above average |
| Bone Density | 1.25 | g/cm2 | 1.0-1.4 | Normal |
| Visceral Fat | 5 | level | 1-12 | Low |
| Water Percentage | 60.8 | % | 50-65 | Normal |

## Pharmacogenomics (CRITICAL for drug prescribing)

| Enzyme | Genotype | Metabolizer Status | Affected Drugs |
|--------|----------|-------------------|----------------|
| **CYP2D6** | *1/*1 | Normal | codeine, tramadol, tamoxifen, metoprolol |
| **CYP2C19** | *1/*1 | Normal | clopidogrel, omeprazole, escitalopram |
| **CYP3A4** | *1/*1 | Normal | atorvastatin, amlodipine, cyclosporine |
| **SLCO1B1** | *1A/*1A | Normal risk | simvastatin, atorvastatin |
| **VKORC1** | G/G | Normal warfarin sensitivity | warfarin |

**Key pharmacogenomic notes:**
- All drug-metabolizing enzyme genotypes are normal/wild-type. No pharmacogenomic concerns for standard drug prescribing.
- Standard dosing guidelines apply for all commonly prescribed medications.
- No dose adjustments needed based on pharmacogenomics.

## Genetic Disease Risk
| Disease | Relative Risk | Absolute Risk | Key SNPs |
|---------|--------------|---------------|----------|
| Type 2 Diabetes | 0.82x (reduced) | 8.5% | rs7903146 |
| Coronary Artery Disease | 0.90x (reduced) | 10.2% | rs10757278 |
| Gastric Cancer | 1.18x | 5.2% | rs2294008 |
| Hypertension | 0.95x | 25.0% | rs699 |

## Genetic Trait Markers
| Trait | Status | Confidence |
|-------|--------|-----------|
| Alcohol Flush | **Likely** (ALDH2 variant) | 92% |
| Lactose Intolerance | **Likely** | 88% |
| Caffeine Sensitivity | Fast metabolizer | 90% |
| Sleep Pattern | Intermediate chronotype | 72% |
| Muscle Fiber Composition | Mixed (endurance bias) | 68% |

**Important note on alcohol flush:** ALDH2 *1/*2 heterozygous variant detected. Alcohol flush reaction is likely, causing facial flushing, nausea, and tachycardia after alcohol consumption. Associated with increased risk of esophageal cancer with regular alcohol use. Advise patient to limit alcohol intake.

## Carrier Status
| Condition | Status | Variant |
|-----------|--------|---------|
| Beta-Thalassemia | Negative | — |
| Sickle Cell Anemia | Negative | — |
| Cystic Fibrosis | Negative | — |
| Alpha-Thalassemia | **Carrier** (silent) | --/aa |

## Ancestry
- East Asian: 95.2%
- Southeast Asian: 3.5%
- Other: 1.3%

## Lifestyle

### Activity
- Exercise frequency: 5-6 times per week
- Primary activities: Running, Weight training, Basketball, Hiking
- Average daily steps: 12,500
- Active minutes per week: 420
- Sedentary hours per day: 6.5
- Athletic achievements: Completed Seattle Marathon 2025 (3:42:15), Half Ironman 2025

### Nutrition
- Diet type: High protein, balanced macros
- Meals per day: 4
- Water intake: 3.2 L/day
- Caffeine: 200 mg/day
- Alcohol: 1-2 drinks/week (limited due to alcohol flush)
- Dietary restrictions: Lactose-free, shellfish-free
- Supplements: Whey protein isolate, Creatine monohydrate, Vitamin D3, Fish oil

### Sleep
- Average: 7.5 hours (target: 8 hours)
- Quality: Excellent
- Sleep latency: 10 minutes
- Wake-ups: 0-1 per night
- Chronotype: Intermediate

### Stress
- Perceived level: 3/10
- Work-life balance: 8/10
- Meditation: 60 minutes/week
- Hobbies: Photography, cooking, outdoor sports
- Stressors: Career growth planning

### Smoking
- Status: Never smoker

## Surgical History
| Procedure | Date | Facility | Notes |
|-----------|------|----------|-------|
| No surgical history | — | — | — |

## Immunizations
| Vaccine | Date | Manufacturer |
|---------|------|-------------|
| COVID-19 Booster | 2025-10-28 | Pfizer |
| Influenza | 2025-09-15 | Sanofi |
| Hepatitis B (booster) | 2024-03-20 | Merck |
| Tdap | 2023-05-10 | GSK |

## Longitudinal Data — 7-Day Daily Tracking (2026-02-02 to 2026-02-08)

| Date | Steps | Active Cal | Sleep (hrs) | Sleep Quality | Resting HR | HRV (ms) | Systolic | Diastolic | Glucose | Weight | Stress | Mood | Hydration (L) | Active Min |
|------|-------|-----------|-------------|---------------|------------|-----------|----------|-----------|---------|--------|--------|------|--------------|-----------|
| Feb 08 (Sun) | 15,320 | 820 | 8.0 | 92% | 60 | 68 | 116 | 74 | 86 | 72.5 | 2 | Great | 3.5 | 90 |
| Feb 07 (Sat) | 18,450 | 1,050 | 7.8 | 90% | 58 | 72 | 114 | 72 | 84 | 72.4 | 2 | Great | 3.8 | 120 |
| Feb 06 (Fri) | 10,250 | 580 | 7.2 | 85% | 64 | 62 | 120 | 78 | 90 | 72.6 | 4 | Good | 3.0 | 45 |
| Feb 05 (Thu) | 13,450 | 720 | 7.5 | 88% | 62 | 66 | 118 | 76 | 88 | 72.5 | 3 | Good | 3.2 | 75 |
| Feb 04 (Wed) | 11,800 | 650 | 7.8 | 90% | 61 | 68 | 116 | 74 | 86 | 72.4 | 2 | Great | 3.4 | 60 |
| Feb 03 (Tue) | 14,250 | 780 | 7.2 | 85% | 63 | 64 | 118 | 76 | 88 | 72.6 | 3 | Good | 3.2 | 80 |
| Feb 02 (Mon) | 9,850 | 520 | 7.5 | 88% | 62 | 65 | 120 | 78 | 90 | 72.5 | 3 | Good | 3.0 | 50 |

### Weekly Workouts
- Feb 08: Running 10K (55 min, 620 cal), Stretching 20 min (60 cal)
- Feb 07: Hiking 3 hrs (750 cal), Weight training 45 min (280 cal)
- Feb 06: Rest day — light walking only
- Feb 05: Weight training 60 min (380 cal), Basketball pickup 45 min (320 cal)
- Feb 04: Running 8K (42 min, 480 cal), Core training 20 min (120 cal)
- Feb 03: Weight training 60 min (380 cal), Running 5K (25 min, 320 cal)
- Feb 02: Rest day — light walking, yoga 30 min (100 cal)

## Monthly Trends (6 months)
| Month | Avg Steps | Avg Sleep | Avg Weight | Avg BP | Avg Resting HR |
|-------|-----------|-----------|------------|--------|----------------|
| Sep 2025 | 11,800 | 7.3 hrs | 73.2 kg | 120/78 | 64 |
| Oct 2025 | 12,200 | 7.4 hrs | 73.0 kg | 118/76 | 63 |
| Nov 2025 | 12,000 | 7.2 hrs | 72.8 kg | 118/76 | 63 |
| Dec 2025 | 11,500 | 7.5 hrs | 73.0 kg | 120/78 | 64 |
| Jan 2026 | 12,400 | 7.5 hrs | 72.6 kg | 118/76 | 62 |
| Feb 2026 | 13,339 | 7.6 hrs | 72.5 kg | 117/75 | 61 |

## Lab History (Quarterly)
| Date | HbA1c | Fasting Glucose | LDL | HDL | Triglycerides | Vitamin D |
|------|-------|-----------------|-----|-----|---------------|-----------|
| Feb 2026 | 5.2% | 88 | 95 | 58 | 110 | 28 |
| Nov 2025 | 5.2% | 86 | 92 | 56 | 108 | 22 |
| Aug 2025 | 5.1% | 85 | 90 | 55 | 105 | 18 |
| May 2025 | 5.2% | 88 | 98 | 54 | 115 | 15 |

**Trend: Stable and optimal.** All metabolic markers consistently excellent. Vitamin D improving with supplementation (15 to 28 ng/mL over 9 months) but still below target of 30. Continue current supplementation; consider dose increase to 4000 IU if no improvement by next quarter.

## Real-Time Metrics (2026-02-08 14:30)
- Heart Rate: 64 bpm
- SpO2: 99%
- Respiratory Rate: 14 breaths/min
- Skin Temperature: 36.2 C
- Stress Index: 18/100

## Key Clinical Summary
James is a highly fit 33-year-old East Asian male in excellent overall health (health score 92/100). His only active condition is Vitamin D deficiency (28 ng/mL, improving with 2000 IU D3 supplementation from a low of 15 ng/mL). He has a SEVERE shellfish allergy with anaphylaxis risk and carries an EpiPen. He has a likely alcohol flush reaction (ALDH2 variant, 92% confidence), which increases esophageal cancer risk with regular alcohol use — he appropriately limits consumption. He is likely lactose intolerant (88% confidence) and follows a lactose-free diet. All pharmacogenomics are normal/wild-type — no drug metabolism concerns for standard medications. He is an alpha-thalassemia silent carrier. His cardiovascular fitness is excellent (VO2 max 48 mL/kg/min, resting HR 62, HRV 65 ms), consistent with his marathon and triathlon training. He completed the Seattle Marathon in 2025 (3:42:15). Family history notable for gastric cancer in paternal grandfather at 72 — genetic risk slightly elevated at 1.18x. Recommend: continue vitamin D supplementation (possibly increase dose), maintain current fitness regimen, annual gastric cancer screening starting at age 40 given family history and East Asian ethnicity.

## Structured Data

<!-- APP_DATA:PT-003 -->
```json
{
  "id": "PT-003",
  "demographics": {
    "firstName": "James",
    "lastName": "Chen",
    "dateOfBirth": "1992-03-08",
    "age": 33,
    "gender": "male",
    "ethnicity": "East Asian",
    "bloodType": "A+",
    "height": 178,
    "weight": 72.5,
    "bmi": 22.9,
    "email": "james.chen@email.com",
    "phone": "+1-555-0305",
    "address": {
      "street": "456 Pine Lane",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98101",
      "country": "USA"
    },
    "insurance": {
      "provider": "Aetna",
      "policyNumber": "AET-2026-67890",
      "groupNumber": "GRP-SEA-3003"
    }
  },
  "dashboard": {
    "profileCard": {
      "name": "James Chen",
      "gender": "Male",
      "weight": 72,
      "weightUnit": "Kg",
      "age": 33,
      "bloodType": "A(II)",
      "bloodRh": "Rh+"
    },
    "biomarkerData": [
      {
        "name": "Blood Glucose",
        "value": 88,
        "unit": "mg/dL",
        "status": "optimal"
      },
      {
        "name": "Total Cholesterol",
        "value": 175,
        "unit": "mg/dL",
        "status": "optimal"
      },
      {
        "name": "Blood Pressure",
        "value": "118/76",
        "unit": "mmHg",
        "status": "optimal"
      },
      {
        "name": "Heart Rate",
        "value": 62,
        "unit": "bpm",
        "status": "athletic"
      },
      {
        "name": "Body Temperature",
        "value": 98.4,
        "unit": "°F",
        "status": "normal"
      },
      {
        "name": "Oxygen Saturation",
        "value": 99,
        "unit": "%",
        "status": "excellent"
      }
    ],
    "geneticInsights": [
      {
        "trait": "Alcohol Flush Reaction",
        "result": "Likely (ALDH2 variant)",
        "risk": "medium"
      },
      {
        "trait": "Lactose Tolerance",
        "result": "Likely Intolerant",
        "risk": "low"
      },
      {
        "trait": "Caffeine Metabolism",
        "result": "Fast Metabolizer",
        "risk": "low"
      },
      {
        "trait": "Athletic Performance",
        "result": "Enhanced endurance",
        "risk": "low"
      }
    ],
    "lifestyleMetrics": [
      {
        "metric": "Average Sleep",
        "value": "7.5 hrs",
        "target": "8 hrs",
        "progress": 94
      },
      {
        "metric": "Daily Steps",
        "value": "12,500",
        "target": "10,000",
        "progress": 100
      },
      {
        "metric": "Water Intake",
        "value": "3.2 L",
        "target": "3.0 L",
        "progress": 100
      },
      {
        "metric": "Exercise Minutes",
        "value": "60 min",
        "target": "45 min",
        "progress": 100
      }
    ],
    "longitudinalEvents": [
      {
        "date": "Feb 2026",
        "event": "VO2 max improved to 48 mL/kg/min"
      },
      {
        "date": "Feb 2025",
        "event": "Vitamin D supplementation started"
      },
      {
        "date": "Jan 2025",
        "event": "Completed marathon - 3:42:15"
      },
      {
        "date": "Aug 2024",
        "event": "First comprehensive health screening - excellent results"
      }
    ],
    "wearables": [
      {
        "name": "Garmin Fenix 8",
        "connected": true,
        "icon": "⌚",
        "color": "bg-blue-600"
      },
      {
        "name": "Whoop 4.0",
        "connected": true,
        "icon": "💪",
        "color": "bg-green-600"
      },
      {
        "name": "Oura Ring",
        "connected": true,
        "icon": "💍",
        "color": "bg-violet-500"
      }
    ],
    "dailyActivities": [
      {
        "name": "Sleep Tracker",
        "icon": "Moon",
        "color": "bg-indigo-500",
        "active": true
      },
      {
        "name": "Running",
        "icon": "Footprints",
        "color": "bg-orange-500",
        "active": true
      },
      {
        "name": "Weight Training",
        "icon": "Dumbbell",
        "color": "bg-gray-500",
        "active": true
      },
      {
        "name": "Basketball",
        "icon": "Circle",
        "color": "bg-amber-500",
        "active": true
      },
      {
        "name": "Hiking",
        "icon": "Mountain",
        "color": "bg-green-600",
        "active": false
      }
    ],
    "mealPlan": {
      "2026-02-08": {
        "breakfast": [
          {
            "emoji": "🥚",
            "name": "Egg White Omelette",
            "calories": 150
          },
          {
            "emoji": "🍌",
            "name": "Banana",
            "calories": 90
          },
          {
            "emoji": "🥤",
            "name": "Protein Shake",
            "calories": 180
          }
        ],
        "lunch": [
          {
            "emoji": "🍗",
            "name": "Grilled Chicken Breast",
            "calories": 280
          },
          {
            "emoji": "🍚",
            "name": "Brown Rice",
            "calories": 150
          },
          {
            "emoji": "🥦",
            "name": "Steamed Broccoli",
            "calories": 50
          }
        ],
        "dinner": [
          {
            "emoji": "🥩",
            "name": "Lean Steak",
            "calories": 320
          },
          {
            "emoji": "🥔",
            "name": "Baked Potato",
            "calories": 160
          },
          {
            "emoji": "🥗",
            "name": "Mixed Greens",
            "calories": 40
          }
        ],
        "snacks": [
          {
            "emoji": "🥜",
            "name": "Almonds",
            "calories": 160
          },
          {
            "emoji": "🍎",
            "name": "Apple",
            "calories": 80
          },
          {
            "emoji": "🧀",
            "name": "Cottage Cheese",
            "calories": 120
          }
        ]
      }
    },
    "caloriesAnalysis": {
      "consumed": 2780,
      "burned": 3200,
      "target": 2800,
      "protein": 35,
      "fat": 25,
      "carbs": 40
    }
  },
  "biomarkers": {
    "bloodPanel": {
      "lastUpdated": "2026-02-05T10:00:00Z",
      "glucose": {
        "fasting": {
          "value": 88,
          "unit": "mg/dL",
          "normalRange": [
            70,
            100
          ],
          "status": "optimal"
        },
        "hba1c": {
          "value": 5.2,
          "unit": "%",
          "normalRange": [
            4,
            5.6
          ],
          "status": "optimal"
        }
      },
      "lipidPanel": {
        "totalCholesterol": {
          "value": 175,
          "unit": "mg/dL",
          "normalRange": [
            0,
            200
          ],
          "status": "optimal"
        },
        "ldl": {
          "value": 95,
          "unit": "mg/dL",
          "normalRange": [
            0,
            100
          ],
          "status": "optimal"
        },
        "hdl": {
          "value": 58,
          "unit": "mg/dL",
          "normalRange": [
            40,
            60
          ],
          "status": "good"
        },
        "triglycerides": {
          "value": 110,
          "unit": "mg/dL",
          "normalRange": [
            0,
            150
          ],
          "status": "optimal"
        }
      },
      "vitamins": {
        "vitaminD": {
          "value": 28,
          "unit": "ng/mL",
          "normalRange": [
            30,
            100
          ],
          "status": "insufficient"
        }
      },
      "metabolicPanel": {
        "creatinine": {
          "value": 0.9,
          "unit": "mg/dL",
          "normalRange": [
            0.7,
            1.3
          ],
          "status": "normal"
        },
        "egfr": {
          "value": 105,
          "unit": "mL/min/1.73m2",
          "normalRange": [
            90,
            120
          ],
          "status": "normal"
        },
        "bun": {
          "value": 14,
          "unit": "mg/dL",
          "normalRange": [
            7,
            20
          ],
          "status": "normal"
        }
      },
      "liverFunction": {
        "alt": {
          "value": 22,
          "unit": "U/L",
          "normalRange": [
            7,
            56
          ],
          "status": "normal"
        },
        "ast": {
          "value": 20,
          "unit": "U/L",
          "normalRange": [
            10,
            40
          ],
          "status": "normal"
        }
      },
      "inflammatory": {
        "crp": {
          "value": 0.8,
          "unit": "mg/L",
          "normalRange": [
            0,
            3
          ],
          "status": "optimal"
        }
      }
    },
    "cardiovascular": {
      "bloodPressure": {
        "systolic": {
          "value": 118,
          "unit": "mmHg",
          "status": "optimal"
        },
        "diastolic": {
          "value": 76,
          "unit": "mmHg",
          "status": "optimal"
        }
      },
      "heartRate": {
        "resting": {
          "value": 62,
          "unit": "bpm",
          "status": "athletic"
        },
        "hrv": {
          "value": 65,
          "unit": "ms",
          "status": "excellent"
        },
        "vo2Max": {
          "value": 48,
          "unit": "mL/kg/min",
          "status": "excellent"
        }
      }
    },
    "bodyComposition": {
      "bodyFatPercentage": {
        "value": 16.5,
        "unit": "%",
        "status": "athletic"
      },
      "muscleMass": {
        "value": 38.5,
        "unit": "kg",
        "status": "above average"
      }
    }
  },
  "genetics": {
    "ancestry": {
      "eastAsian": 95.2,
      "southeastAsian": 3.5,
      "other": 1.3
    },
    "traitMarkers": {
      "alcoholFlush": {
        "status": "likely",
        "confidence": 0.92
      },
      "lactoseIntolerance": {
        "status": "likely",
        "confidence": 0.88
      },
      "caffeineSensitivity": {
        "status": "fast metabolizer",
        "confidence": 0.9
      }
    },
    "pharmacogenomics": {
      "cyp2d6": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "codeine",
          "tramadol",
          "tamoxifen"
        ]
      },
      "cyp2c19": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "clopidogrel",
          "omeprazole"
        ]
      },
      "cyp3a4": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "atorvastatin",
          "cyclosporine"
        ]
      },
      "slco1b1": {
        "genotype": "*1A/*1A",
        "riskLevel": "normal",
        "affectedDrugs": [
          "simvastatin",
          "atorvastatin"
        ]
      },
      "vkorc1": {
        "genotype": "G/G",
        "warfarinSensitivity": "normal"
      }
    },
    "diseaseRisk": {
      "type2Diabetes": {
        "relativeRisk": 0.82,
        "absoluteRisk": 8.5,
        "unit": "%"
      },
      "coronaryArteryDisease": {
        "relativeRisk": 0.9,
        "absoluteRisk": 10.2,
        "unit": "%"
      }
    },
    "carrierStatus": {
      "sickleCellAnemia": {
        "status": "negative"
      },
      "cysticFibrosis": {
        "status": "negative"
      }
    }
  },
  "lifestyle": {
    "activity": {
      "exerciseFrequency": "5-6 times per week",
      "primaryActivities": [
        "running",
        "weight training",
        "basketball",
        "hiking"
      ],
      "averageStepsDaily": 12500,
      "activeMinutesWeekly": 420
    },
    "nutrition": {
      "dietType": "high protein",
      "mealsPerDay": 4,
      "waterIntakeLiters": 3.2,
      "restrictions": [
        "lactose-free"
      ],
      "supplements": [
        "whey protein",
        "creatine",
        "vitamin D",
        "fish oil"
      ]
    },
    "sleep": {
      "averageHours": 7.5,
      "quality": "excellent"
    },
    "smoking": {
      "status": "never"
    }
  },
  "medicalHistory": {
    "conditions": [
      {
        "name": "Vitamin D Deficiency",
        "icd10": "E55.9",
        "diagnosedDate": "2025-02-15",
        "status": "improving",
        "managedBy": "supplementation"
      }
    ],
    "allergies": [
      {
        "allergen": "Shellfish",
        "reaction": "anaphylaxis",
        "severity": "severe"
      }
    ],
    "medications": [
      {
        "name": "Vitamin D3",
        "dosage": "2000 IU",
        "frequency": "daily",
        "prescribedFor": "vitamin D deficiency"
      }
    ],
    "familyHistory": [
      {
        "condition": "Gastric Cancer",
        "relationship": "paternal grandfather",
        "ageAtOnset": 72
      }
    ]
  },
  "longitudinalData": {
    "days": [
      {
        "dateISO": "2026-02-08",
        "steps": 10540,
        "activeCalories": 680,
        "sleepHours": 7.8,
        "restingHeartRate": 61,
        "hrvMs": 68,
        "systolic": 116,
        "diastolic": 74,
        "glucoseMgDl": 86,
        "weight": 72.5
      },
      {
        "dateISO": "2026-02-07",
        "steps": 15230,
        "activeCalories": 920,
        "sleepHours": 8,
        "restingHeartRate": 59,
        "hrvMs": 72,
        "systolic": 114,
        "diastolic": 72,
        "glucoseMgDl": 84,
        "weight": 72.3
      },
      {
        "dateISO": "2026-02-06",
        "steps": 12680,
        "activeCalories": 780,
        "sleepHours": 7.6,
        "restingHeartRate": 62,
        "hrvMs": 66,
        "systolic": 118,
        "diastolic": 76,
        "glucoseMgDl": 88,
        "weight": 72.4
      },
      {
        "dateISO": "2026-02-05",
        "steps": 8920,
        "activeCalories": 520,
        "sleepHours": 7,
        "restingHeartRate": 64,
        "hrvMs": 62,
        "systolic": 120,
        "diastolic": 78,
        "glucoseMgDl": 90,
        "weight": 72.5
      },
      {
        "dateISO": "2026-02-04",
        "steps": 14230,
        "activeCalories": 880,
        "sleepHours": 7.5,
        "restingHeartRate": 60,
        "hrvMs": 70,
        "systolic": 115,
        "diastolic": 74,
        "glucoseMgDl": 85,
        "weight": 72.4
      },
      {
        "dateISO": "2026-02-03",
        "steps": 11890,
        "activeCalories": 720,
        "sleepHours": 7.8,
        "restingHeartRate": 61,
        "hrvMs": 68,
        "systolic": 117,
        "diastolic": 75,
        "glucoseMgDl": 87,
        "weight": 72.5
      },
      {
        "dateISO": "2026-02-02",
        "steps": 13450,
        "activeCalories": 820,
        "sleepHours": 7.2,
        "restingHeartRate": 62,
        "hrvMs": 65,
        "systolic": 118,
        "diastolic": 76,
        "glucoseMgDl": 88,
        "weight": 72.6
      }
    ]
  },
  "healthScores": {
    "lastUpdated": "2026-02-08T14:30:00Z",
    "overall": 92,
    "cardiovascular": 95,
    "metabolic": 90,
    "fitness": 96,
    "sleep": 88,
    "nutrition": 85,
    "mentalWellness": 88
  }
}
```
<!-- /APP_DATA:PT-003 -->

---

<!-- PATIENT:PT-004 | name:Sarah Thompson | age:57 | gender:female | risk_level:critical | health_score:42 | conditions:Type 2 Diabetes Mellitus,Hypertension,Obesity,Hypothyroidism,Obstructive Sleep Apnea -->

# Patient Profile: PT-004 — Sarah Thompson

## Demographics
- **Patient ID:** PT-004
- **Full Name:** Sarah Thompson
- **Date of Birth:** 1968-09-30
- **Age:** 57 years old
- **Gender:** Female
- **Ethnicity:** Caucasian
- **Blood Type:** AB- (AB negative)
- **Height:** 165 cm
- **Weight:** 82.5 kg
- **BMI:** 30.3 (obese class I)
- **Location:** Boston, MA, USA
- **Occupation:** Office Manager
- **Insurance:** United Healthcare (UHC-2026-11223)

## Health Scores (as of 2026-02-08)
| Domain | Score (0-100) |
|--------|--------------|
| **Overall** | **42** |
| Cardiovascular | 35 |
| Metabolic | 32 |
| Fitness | 38 |
| Sleep | 28 |
| Nutrition | 45 |
| Mental Wellness | 40 |

**WARNING: Multiple domains critically low. High-risk patient requiring intensive multidisciplinary management.**

## Active Conditions
| Condition | ICD-10 | Diagnosed | Status | Management |
|-----------|--------|-----------|--------|------------|
| Type 2 Diabetes Mellitus | E11.9 | 2018-04-20 | **Poorly controlled** | Metformin + Glipizide |
| Hypertension | I10 | 2015-08-15 | **Uncontrolled** | Amlodipine + Lisinopril |
| Obesity | E66.9 | 2016-01-10 | Active | Lifestyle modification (limited compliance) |
| Hypothyroidism | E03.9 | 2020-03-25 | **Undertreated** | Levothyroxine |
| Obstructive Sleep Apnea | G47.33 | 2021-09-10 | Active | CPAP (compliance only 45%) |

## Current Medications (6 drugs — HIGH polypharmacy risk)
| Medication | Dosage | Frequency | Prescribed For | Concerns |
|-----------|--------|-----------|----------------|----------|
| Metformin | 1000mg | Twice daily | Type 2 Diabetes | Monitor renal function |
| Glipizide | 5mg | Once daily | Type 2 Diabetes | Hypoglycemia risk |
| Amlodipine | 10mg | Once daily | Hypertension | CYP3A4 substrate — monitor with intermediate metabolizer status |
| Lisinopril | 20mg | Once daily | Hypertension | **CONCERN: Patient reports persistent dry cough — ACE inhibitor side effect** |
| Levothyroxine | 75mcg | Once daily | Hypothyroidism | TSH still elevated — may need dose increase |
| Atorvastatin | 40mg | Once daily | Dyslipidemia | **HIGH CONCERN: CYP3A4 intermediate + SLCO1B1 intermediate = elevated myopathy risk** |

**Polypharmacy alert:** 6 concurrent medications. Risk of drug-drug interactions is significant. Key interactions to monitor: Metformin + renal function, Atorvastatin + CYP3A4/SLCO1B1 pharmacogenomics, Lisinopril + ACE cough.

## Allergies
| Allergen | Reaction | Severity |
|----------|----------|----------|
| **ACE inhibitor cough** | Persistent dry cough | **Moderate** |
| **Aspirin** | GI bleeding | **Moderate** |

**Clinical note on ACE inhibitor cough:** Patient is currently on Lisinopril (an ACE inhibitor) and reports persistent dry cough. This is a known class effect. Consider switching to an ARB (e.g., losartan, valsartan) for equivalent BP control without the cough.

## Family History
| Condition | Relationship | Age at Onset |
|-----------|-------------|--------------|
| Type 2 Diabetes | Father | 50 |
| **Heart attack** | Father | **62** |
| **Stroke** | Mother | **70** |
| Hypertension | Mother | 55 |

**High-risk family history:** Both parents with cardiovascular events. Father had MI at 62 and T2D at 50. Mother had stroke at 70.

## Biomarkers — Blood Panel (last updated: 2026-02-08)

### Glucose Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Fasting Glucose | 135 | mg/dL | 70-100 | **High** |
| HbA1c | 7.2 | % | 4.0-5.6 | **Poorly controlled diabetes** |
| Postprandial Glucose | 195 | mg/dL | 70-140 | **High** |

### Lipid Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Total Cholesterol | 242 | mg/dL | <200 | **High** |
| LDL | 162 | mg/dL | <100 | **High** |
| HDL | 42 | mg/dL | 50-60+ | **Low** |
| Triglycerides | 195 | mg/dL | <150 | **Elevated** |
| VLDL | 39 | mg/dL | 5-40 | Normal |

### Complete Blood Count (CBC)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| WBC | 7.8 | K/uL | 4.5-11.0 | Normal |
| RBC | 4.2 | M/uL | 4.0-5.0 | Normal |
| Hemoglobin | 12.5 | g/dL | 12.0-16.0 | Normal |
| Hematocrit | 37.8 | % | 36.0-44.0 | Normal |
| Platelets | 285 | K/uL | 150-400 | Normal |

### Metabolic Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Sodium | 138 | mEq/L | 136-145 | Normal |
| Potassium | 4.8 | mEq/L | 3.5-5.0 | Normal |
| Chloride | 100 | mEq/L | 98-106 | Normal |
| Bicarbonate | 23 | mEq/L | 22-29 | Normal |
| BUN | 22 | mg/dL | 7-20 | **Slightly elevated** |
| Creatinine | 1.2 | mg/dL | 0.6-1.1 | **Slightly elevated** |
| eGFR | 72 | mL/min/1.73m2 | 90-120 | **Mildly reduced (Stage 2 CKD)** |

### Liver Function
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| ALT | 38 | U/L | 7-56 | Normal |
| AST | 42 | U/L | 10-40 | **Slightly elevated** |
| ALP | 85 | U/L | 44-147 | Normal |
| Bilirubin | 0.9 | mg/dL | 0.1-1.2 | Normal |
| Albumin | 3.8 | g/dL | 3.4-5.4 | Normal |

**Note on AST elevation:** AST 42 is slightly above normal range. Given patient is on Atorvastatin 40mg AND is a CYP3A4 intermediate metabolizer, this may indicate early statin hepatotoxicity. Recommend monitoring liver enzymes quarterly. If AST continues to rise, consider dose reduction or switch to pravastatin (not CYP3A4 dependent).

### Thyroid
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| TSH | 5.2 | mIU/L | 0.4-4.0 | **Elevated (undertreated)** |
| Free T4 | 0.9 | ng/dL | 0.8-1.8 | Low-normal |
| T3 | 85 | ng/dL | 80-200 | Low-normal |

**Thyroid note:** TSH 5.2 with low-normal Free T4 (0.9) and T3 (85) indicates undertreated hypothyroidism on current Levothyroxine 75mcg. Consider increasing dose to 88mcg or 100mcg. Undertreated hypothyroidism contributes to elevated cholesterol, weight gain, fatigue, and poor sleep — all of which are present in this patient.

### Inflammatory Markers
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| CRP | 4.8 | mg/L | 0-3.0 | **Elevated** |
| ESR | 25 | mm/hr | 0-30 | Normal (upper range) |
| Homocysteine | 14.8 | umol/L | 5-15 | Normal (upper range) |

**Inflammation note:** CRP 4.8 indicates systemic inflammation, likely multifactorial: obesity, poorly controlled diabetes, smoking, and sleep apnea all contribute. Elevated CRP is an independent cardiovascular risk factor.

### Vitamins & Minerals
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Vitamin D | 18 | ng/mL | 30-100 | **Deficient** |
| Vitamin B12 | 310 | pg/mL | 200-900 | Normal (lower range) |
| Folate | 8.5 | ng/mL | 3-17 | Normal |
| Iron | 65 | mcg/dL | 60-170 | Normal (lower range) |
| Ferritin | 42 | ng/mL | 12-150 | Normal |

### Hormones
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Estradiol | 15 | pg/mL | <30 (postmenopausal) | Postmenopausal |
| FSH | 65 | mIU/mL | >30 (postmenopausal) | Postmenopausal |
| Cortisol | 18.5 | mcg/dL | 6-23 | Normal (upper range) |
| Insulin | 18.5 | uIU/mL | 2.6-24.9 | Normal (upper range — insulin resistance likely) |

## Biomarkers — Cardiovascular (last updated: 2026-02-08)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Systolic BP | 148 | mmHg | 90-120 | **Stage 2 hypertension** |
| Diastolic BP | 94 | mmHg | 60-80 | **Stage 2 hypertension** |
| Resting Heart Rate | 82 | bpm | 60-100 | Normal |
| HRV | 22 | ms | 20-200 | **Low** |

### ECG
- Rhythm: Normal sinus rhythm
- PR Interval: 175 ms (normal: 120-200)
- QRS Width: 92 ms (normal: 80-100)
- QT Interval: 425 ms (normal: 350-450)
- Notable: Non-specific ST-T wave changes — recommend cardiology follow-up

## Biomarkers — Body Composition
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Body Fat | 38.5 | % | 25-35 | **High** |
| Muscle Mass | 22.5 | kg | 20-35 | Normal (lower range) |
| Bone Density | 1.02 | g/cm2 | 1.0-1.4 | Normal (lower range) |
| Visceral Fat | 14 | level | 1-12 | **High** |
| Water Percentage | 48.2 | % | 45-60 | Normal (lower range) |

## Pharmacogenomics (CRITICAL for drug prescribing)

| Enzyme | Genotype | Metabolizer Status | Affected Drugs |
|--------|----------|-------------------|----------------|
| **CYP2D6** | *1/*4 | **Intermediate** | codeine, tramadol, metoprolol, tamoxifen |
| **CYP2C19** | *1/*2 | **Intermediate** | clopidogrel, omeprazole, escitalopram |
| **CYP3A4** | *1/*22 | **Intermediate** | atorvastatin, amlodipine, cyclosporine |
| **SLCO1B1** | *1A/*5 | **Intermediate risk** | simvastatin, atorvastatin, rosuvastatin |
| **VKORC1** | A/A | **HIGH warfarin sensitivity** | warfarin |

**CRITICAL pharmacogenomic alerts:**

1. **ATORVASTATIN (CURRENT MED — 40mg):** Patient is a CYP3A4 intermediate metabolizer AND SLCO1B1 intermediate risk. This dual risk significantly increases atorvastatin accumulation and myopathy risk. The current 40mg dose may be excessive. **Recommend:** Reduce atorvastatin dose or switch to rosuvastatin (lower CYP3A4 dependence) or pravastatin (not CYP3A4/SLCO1B1 dependent). Monitor CK levels and liver enzymes closely. AST is already slightly elevated (42).

2. **AMLODIPINE (CURRENT MED — 10mg):** CYP3A4 intermediate metabolizer may lead to higher-than-expected plasma levels. Monitor for excessive hypotension, peripheral edema, and dizziness.

3. **CYP2D6 intermediate metabolizer:** Codeine has reduced efficacy (less conversion to morphine). Tramadol similarly affected. If pain management needed, avoid codeine/tramadol — use non-CYP2D6 alternatives. Metoprolol may have higher plasma levels — use lower starting dose.

4. **CYP2C19 intermediate metabolizer:** Clopidogrel may have **reduced activation** — if antiplatelet therapy needed, consider prasugrel or ticagrelor instead. Omeprazole may have increased exposure — standard doses may be adequate or consider dose reduction. Escitalopram may have higher levels — start at lower dose.

5. **VKORC1 A/A — HIGH warfarin sensitivity:** If warfarin is EVER prescribed, use a **VERY low starting dose** (approximately 50% of standard). This patient would require frequent INR monitoring and slow dose titration. Consider DOACs as alternatives if anticoagulation needed.

## Genetic Disease Risk
| Disease | Relative Risk | Absolute Risk | Key SNPs |
|---------|--------------|---------------|----------|
| Type 2 Diabetes | 1.85x | 45.5% | rs7903146, rs1801282, rs13266634 |
| Coronary Artery Disease | 1.55x | 28.5% | rs10757278, rs1333049, rs4977574 |
| Hypothyroidism | 1.42x | 18.5% | rs12885526, rs965513 |
| Stroke | 1.28x | 15.2% | rs2200733, rs12425791 |
| Breast Cancer | 1.15x | 14.5% | rs2981582, rs3803662 |

## Genetic Trait Markers
| Trait | Status | Confidence |
|-------|--------|-----------|
| Lactose Intolerance | Unlikely | 82% |
| Caffeine Sensitivity | Normal metabolizer | 78% |
| Nicotine Dependence | **High predisposition** | 88% |
| Alcohol Flush | Unlikely | 80% |
| Sleep Pattern | Intermediate chronotype | 60% |

**Note on nicotine dependence:** Genetic predisposition to nicotine dependence is HIGH (88% confidence). Patient is a current smoker (10 cigarettes/day, 25 pack-years). This genetic predisposition may explain difficulty quitting. Consider pharmacogenomics-guided smoking cessation therapy (e.g., varenicline). Given CYP2D6 intermediate status, bupropion may have higher plasma levels — start at lower dose.

## Carrier Status
| Condition | Status | Variant |
|-----------|--------|---------|
| Beta-Thalassemia | Negative | — |
| Sickle Cell Anemia | Negative | — |
| Cystic Fibrosis | Negative | — |
| Factor V Leiden | **Heterozygous carrier** | rs6025 G>A |

**Factor V Leiden note:** Heterozygous carrier increases venous thromboembolism (VTE) risk by approximately 5-7x. Combined with obesity, smoking, and sedentary lifestyle, VTE risk is further elevated. This is especially important for: surgical planning, hormone replacement therapy decisions, long-distance travel. DVT prophylaxis should be considered for any immobilization >48 hours.

## Ancestry
- Northern European: 68.5%
- Western European: 22.8%
- Eastern European: 5.5%
- Other: 3.2%

## Lifestyle

### Activity
- Exercise frequency: 1-2 times per week
- Primary activities: Walking (limited)
- Average daily steps: 4,200
- Active minutes per week: 75
- Sedentary hours per day: 11

### Nutrition
- Diet type: Standard American Diet
- Meals per day: 3 (plus frequent snacking)
- Water intake: 1.2 L/day (insufficient)
- Caffeine: 300 mg/day
- Alcohol: 5-6 drinks/week
- Dietary restrictions: None currently
- Supplements: None currently (Vitamin D deficiency NOT being supplemented)

### Sleep
- Average: 5.5 hours (target: 7-8 hours)
- Quality: Poor
- Sleep latency: 35 minutes
- Wake-ups: 4-5 per night
- Sleep apnea: Diagnosed, AHI 22 events/hour (moderate)
- CPAP compliance: 45% (poor — uses only 3-4 nights/week, removes during night)
- Sleep debt: 10.5 hours/week
- Daytime sleepiness: Severe (Epworth Sleepiness Scale: 15/24)

### Stress
- Perceived level: 8/10
- Work-life balance: 3/10
- Caregiver burden: High (caring for elderly mother)
- Stressors: Chronic health management, financial stress, caregiver burden, work pressure
- Mental health screening: PHQ-9 score 12 (moderate depression — consider evaluation)

### Smoking
- Status: **Current smoker**
- Cigarettes per day: 10
- Pack-years: 25
- Quit attempts: 3 (most recent 2023)
- Genetic predisposition to nicotine dependence: HIGH (88%)

## Surgical History
| Procedure | Date | Facility | Notes |
|-----------|------|----------|-------|
| Hysterectomy | 2015-06-12 | Massachusetts General Hospital | Uterine fibroids, uncomplicated |
| Right knee arthroscopy | 2019-03-22 | Boston Medical Center | Meniscal tear repair |

## Immunizations
| Vaccine | Date | Manufacturer |
|---------|------|-------------|
| COVID-19 Booster | 2025-10-02 | Moderna |
| Influenza | 2025-09-28 | Sanofi |
| Pneumococcal (PCV20) | 2025-11-10 | Pfizer |
| Shingrix (completed series) | 2024-08-15 | GSK |
| Tdap | 2020-05-10 | GSK |

## Longitudinal Data — 7-Day Daily Tracking (2026-02-02 to 2026-02-08)

| Date | Steps | Active Cal | Sleep (hrs) | Sleep Quality | Resting HR | HRV (ms) | Systolic | Diastolic | Glucose | Weight | Stress | Mood | Hydration (L) | Active Min |
|------|-------|-----------|-------------|---------------|------------|-----------|----------|-----------|---------|--------|--------|------|--------------|-----------|
| Feb 08 (Sun) | 3,250 | 180 | 5.2 | 42% | 84 | 20 | 150 | 96 | 138 | 82.5 | 8 | Low | 1.0 | 10 |
| Feb 07 (Sat) | 5,450 | 280 | 6.0 | 55% | 80 | 25 | 145 | 92 | 130 | 82.4 | 6 | Neutral | 1.4 | 25 |
| Feb 06 (Fri) | 3,800 | 200 | 4.8 | 35% | 86 | 18 | 152 | 98 | 142 | 82.6 | 9 | Low | 0.8 | 5 |
| Feb 05 (Thu) | 4,200 | 220 | 5.5 | 48% | 82 | 22 | 148 | 94 | 135 | 82.5 | 8 | Low | 1.2 | 15 |
| Feb 04 (Wed) | 4,800 | 250 | 5.8 | 52% | 81 | 24 | 146 | 92 | 132 | 82.4 | 7 | Neutral | 1.3 | 20 |
| Feb 03 (Tue) | 3,600 | 190 | 5.0 | 38% | 85 | 19 | 150 | 96 | 140 | 82.7 | 9 | Low | 0.9 | 5 |
| Feb 02 (Mon) | 4,500 | 230 | 5.2 | 45% | 83 | 22 | 148 | 94 | 136 | 82.6 | 8 | Low | 1.1 | 10 |

### Weekly Workouts
- Feb 08: No structured workouts
- Feb 07: Walking 25 min (120 cal)
- Feb 06: No workouts
- Feb 05: Walking 15 min (80 cal)
- Feb 04: Walking 20 min (100 cal)
- Feb 03: No workouts
- Feb 02: Walking 10 min (60 cal)

**Activity concern:** Only 4,229 average daily steps. Only 75 active minutes/week (WHO recommends 150). Extremely sedentary lifestyle is a major modifiable risk factor.

## Monthly Trends (6 months)
| Month | Avg Steps | Avg Sleep | Avg Weight | Avg BP | Avg Glucose | Avg Stress |
|-------|-----------|-----------|------------|--------|-------------|------------|
| Sep 2025 | 4,800 | 5.8 hrs | 81.0 kg | 142/90 | 125 | 7 |
| Oct 2025 | 4,500 | 5.5 hrs | 81.4 kg | 144/92 | 128 | 7 |
| Nov 2025 | 4,200 | 5.4 hrs | 81.8 kg | 145/92 | 130 | 8 |
| Dec 2025 | 3,900 | 5.2 hrs | 82.2 kg | 146/93 | 132 | 8 |
| Jan 2026 | 4,100 | 5.3 hrs | 82.4 kg | 147/94 | 134 | 8 |
| Feb 2026 | 4,229 | 5.4 hrs | 82.5 kg | 148/95 | 136 | 8 |

**Trend: WORSENING across all metrics.** Weight gaining (81.0 to 82.5 kg in 6 months). BP increasing. Glucose increasing. Sleep deteriorating. Steps declining. Stress remaining high.

## Lab History (Quarterly)
| Date | HbA1c | Fasting Glucose | LDL | HDL | Triglycerides | TSH | AST | Creatinine | eGFR |
|------|-------|-----------------|-----|-----|---------------|-----|-----|------------|------|
| Feb 2026 | **7.2%** | **135** | **162** | 42 | **195** | **5.2** | **42** | **1.2** | **72** |
| Nov 2025 | 7.0% | 128 | 155 | 44 | 185 | 4.8 | 38 | 1.1 | 78 |
| Aug 2025 | 6.8% | 122 | 148 | 45 | 175 | 4.5 | 35 | 1.0 | 82 |
| May 2025 | 6.6% | 118 | 142 | 48 | 168 | 4.2 | 32 | 0.9 | 88 |

**Trend: WORSENING** — HbA1c has risen from 6.6% to 7.2% over 9 months despite dual diabetes therapy (Metformin + Glipizide). LDL rising despite 40mg atorvastatin (concern: atorvastatin may not be effective at standard dose given CYP3A4 intermediate status, OR patient is non-compliant). TSH rising (undertreated hypothyroidism). AST trending up (possible statin hepatotoxicity). Creatinine rising and eGFR falling (early CKD progression).

## Real-Time Metrics (2026-02-08 14:30)
- Heart Rate: 84 bpm
- SpO2: 95% (borderline — likely related to OSA and smoking)
- Respiratory Rate: 18 breaths/min
- Skin Temperature: 36.8 C
- Stress Index: 72/100

## Key Clinical Summary
Sarah is a complex, high-risk 57-year-old Caucasian woman with multiple poorly controlled conditions: Type 2 Diabetes (HbA1c 7.2%, worsening despite dual therapy), uncontrolled stage 2 hypertension (148/94), obesity (BMI 30.3), undertreated hypothyroidism (TSH 5.2), and obstructive sleep apnea with poor CPAP compliance (45%). She is on 6 medications, representing significant polypharmacy risk. Her pharmacogenomics reveal multiple intermediate metabolizer statuses that critically affect her current medications: CYP3A4 intermediate metabolizer on atorvastatin 40mg leads to drug accumulation and increased myopathy risk, compounded by SLCO1B1 intermediate risk — her AST is already elevated at 42 (possible early statin hepatotoxicity). She is a CYP2C19 intermediate metabolizer (affects clopidogrel activation if ever needed) and has VKORC1 A/A high warfarin sensitivity (use very low dose if ever needed). She is a heterozygous Factor V Leiden carrier, increasing VTE risk, which is further elevated by her obesity, smoking, and sedentary lifestyle. She is a current smoker (10 cigarettes/day, 25 pack-years) with HIGH genetic predisposition to nicotine dependence (88%). She reports persistent ACE inhibitor cough while on Lisinopril — should switch to an ARB. Vitamin D is deficient (18 ng/mL) and NOT being supplemented. All trends are worsening: weight gaining, BP increasing, glucose rising, sleep deteriorating, renal function declining (eGFR 72, down from 88 in 9 months). CRP is elevated (4.8) indicating systemic inflammation. PHQ-9 score 12 suggests moderate depression. She has strong family history of CVD (father MI at 62, mother stroke at 70). Immediate action items: (1) address ACE inhibitor cough by switching Lisinopril to ARB, (2) evaluate atorvastatin dosing given CYP3A4/SLCO1B1 status, (3) increase Levothyroxine dose, (4) improve CPAP compliance, (5) initiate Vitamin D supplementation, (6) smoking cessation program, (7) evaluate for depression, (8) consider third-line diabetes agent (e.g., GLP-1 RA) given worsening HbA1c.

## Structured Data

<!-- APP_DATA:PT-004 -->
```json
{
  "id": "PT-004",
  "demographics": {
    "firstName": "Sarah",
    "lastName": "Thompson",
    "dateOfBirth": "1968-09-30",
    "age": 57,
    "gender": "female",
    "ethnicity": "Caucasian",
    "bloodType": "AB-",
    "height": 165,
    "weight": 82.5,
    "bmi": 30.3,
    "email": "sarah.thompson@email.com",
    "phone": "+1-555-0407",
    "address": {
      "street": "321 Elm Drive",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02101",
      "country": "USA"
    },
    "insurance": {
      "provider": "United Healthcare",
      "policyNumber": "UHC-2026-11223",
      "groupNumber": "GRP-BOS-4004"
    }
  },
  "dashboard": {
    "profileCard": {
      "name": "Sarah Thompson",
      "gender": "Female",
      "weight": 82,
      "weightUnit": "Kg",
      "age": 57,
      "bloodType": "AB(IV)",
      "bloodRh": "Rh-"
    },
    "biomarkerData": [
      {
        "name": "Blood Glucose",
        "value": 135,
        "unit": "mg/dL",
        "status": "high"
      },
      {
        "name": "Total Cholesterol",
        "value": 242,
        "unit": "mg/dL",
        "status": "high"
      },
      {
        "name": "Blood Pressure",
        "value": "148/94",
        "unit": "mmHg",
        "status": "stage 2 hypertension"
      },
      {
        "name": "Heart Rate",
        "value": 82,
        "unit": "bpm",
        "status": "normal"
      },
      {
        "name": "Body Temperature",
        "value": 98.8,
        "unit": "°F",
        "status": "normal"
      },
      {
        "name": "Oxygen Saturation",
        "value": 94,
        "unit": "%",
        "status": "low normal"
      }
    ],
    "geneticInsights": [
      {
        "trait": "Type 2 Diabetes Risk",
        "result": "Very High genetic risk",
        "risk": "high"
      },
      {
        "trait": "Cardiovascular Risk",
        "result": "Elevated risk",
        "risk": "high"
      },
      {
        "trait": "Hypothyroidism Risk",
        "result": "Elevated risk",
        "risk": "medium"
      },
      {
        "trait": "Nicotine Dependence",
        "result": "High genetic predisposition",
        "risk": "high"
      }
    ],
    "lifestyleMetrics": [
      {
        "metric": "Average Sleep",
        "value": "5.5 hrs",
        "target": "7 hrs",
        "progress": 79
      },
      {
        "metric": "Daily Steps",
        "value": "4,200",
        "target": "7,500",
        "progress": 56
      },
      {
        "metric": "Water Intake",
        "value": "1.2 L",
        "target": "2.0 L",
        "progress": 60
      },
      {
        "metric": "Exercise Minutes",
        "value": "11 min",
        "target": "30 min",
        "progress": 37
      }
    ],
    "longitudinalEvents": [
      {
        "date": "Dec 2025",
        "event": "ER visit - chest pain evaluation (cardiac workup negative)"
      },
      {
        "date": "Sep 2021",
        "event": "Sleep apnea diagnosed - CPAP prescribed"
      },
      {
        "date": "Apr 2018",
        "event": "Type 2 Diabetes diagnosed"
      },
      {
        "date": "Aug 2015",
        "event": "Hypertension diagnosed"
      }
    ],
    "wearables": [
      {
        "name": "Apple Watch",
        "connected": false,
        "icon": "⌚",
        "color": "bg-gray-900"
      },
      {
        "name": "CPAP Machine",
        "connected": true,
        "icon": "😴",
        "color": "bg-blue-500"
      }
    ],
    "dailyActivities": [
      {
        "name": "Sleep Tracker",
        "icon": "Moon",
        "color": "bg-indigo-500",
        "active": false
      },
      {
        "name": "Walking",
        "icon": "Footprints",
        "color": "bg-green-500",
        "active": false
      },
      {
        "name": "Medication",
        "icon": "Pill",
        "color": "bg-red-500",
        "active": true
      }
    ],
    "mealPlan": {
      "2026-02-08": {
        "breakfast": [
          {
            "emoji": "☕",
            "name": "Coffee with cream",
            "calories": 80
          },
          {
            "emoji": "🥐",
            "name": "Croissant",
            "calories": 280
          }
        ],
        "lunch": [
          {
            "emoji": "🥪",
            "name": "Deli Sandwich",
            "calories": 520
          },
          {
            "emoji": "🥤",
            "name": "Soda",
            "calories": 180
          },
          {
            "emoji": "🍟",
            "name": "French Fries",
            "calories": 320
          }
        ],
        "dinner": [
          {
            "emoji": "🍝",
            "name": "Pasta Alfredo",
            "calories": 680
          },
          {
            "emoji": "🥖",
            "name": "Garlic Bread",
            "calories": 200
          },
          {
            "emoji": "🍷",
            "name": "Wine",
            "calories": 125
          }
        ],
        "snacks": [
          {
            "emoji": "🍪",
            "name": "Cookies",
            "calories": 280
          },
          {
            "emoji": "🍫",
            "name": "Chocolate",
            "calories": 210
          }
        ]
      }
    },
    "caloriesAnalysis": {
      "consumed": 2875,
      "burned": 1850,
      "target": 1800,
      "protein": 18,
      "fat": 38,
      "carbs": 44
    }
  },
  "biomarkers": {
    "bloodPanel": {
      "lastUpdated": "2026-02-06T14:00:00Z",
      "glucose": {
        "fasting": {
          "value": 135,
          "unit": "mg/dL",
          "normalRange": [
            70,
            100
          ],
          "status": "high"
        },
        "hba1c": {
          "value": 7.2,
          "unit": "%",
          "normalRange": [
            4,
            5.6
          ],
          "status": "poorly controlled"
        }
      },
      "lipidPanel": {
        "totalCholesterol": {
          "value": 242,
          "unit": "mg/dL",
          "normalRange": [
            0,
            200
          ],
          "status": "high"
        },
        "ldl": {
          "value": 162,
          "unit": "mg/dL",
          "normalRange": [
            0,
            100
          ],
          "status": "high"
        },
        "hdl": {
          "value": 42,
          "unit": "mg/dL",
          "normalRange": [
            50,
            60
          ],
          "status": "low"
        },
        "triglycerides": {
          "value": 195,
          "unit": "mg/dL",
          "normalRange": [
            0,
            150
          ],
          "status": "elevated"
        }
      },
      "liverFunction": {
        "ast": {
          "value": 42,
          "unit": "U/L",
          "normalRange": [
            10,
            40
          ],
          "status": "slightly elevated"
        }
      },
      "inflammatory": {
        "crp": {
          "value": 4.8,
          "unit": "mg/L",
          "normalRange": [
            0,
            3
          ],
          "status": "elevated"
        }
      },
      "metabolicPanel": {
        "creatinine": {
          "value": 1.2,
          "unit": "mg/dL",
          "normalRange": [
            0.6,
            1.1
          ],
          "status": "slightly elevated"
        },
        "egfr": {
          "value": 72,
          "unit": "mL/min/1.73m2",
          "normalRange": [
            90,
            120
          ],
          "status": "mildly reduced"
        },
        "bun": {
          "value": 22,
          "unit": "mg/dL",
          "normalRange": [
            7,
            20
          ],
          "status": "slightly elevated"
        },
        "potassium": {
          "value": 4.8,
          "unit": "mEq/L",
          "normalRange": [
            3.5,
            5
          ],
          "status": "normal"
        }
      },
      "thyroid": {
        "tsh": {
          "value": 5.2,
          "unit": "mIU/L",
          "normalRange": [
            0.4,
            4
          ],
          "status": "elevated"
        }
      }
    },
    "cardiovascular": {
      "bloodPressure": {
        "systolic": {
          "value": 148,
          "unit": "mmHg",
          "status": "stage 2 hypertension"
        },
        "diastolic": {
          "value": 94,
          "unit": "mmHg",
          "status": "stage 2 hypertension"
        }
      },
      "heartRate": {
        "resting": {
          "value": 82,
          "unit": "bpm",
          "status": "normal"
        }
      }
    },
    "bodyComposition": {
      "bodyFatPercentage": {
        "value": 38.5,
        "unit": "%",
        "status": "high"
      },
      "visceralFat": {
        "value": 14,
        "unit": "level",
        "status": "high"
      }
    }
  },
  "genetics": {
    "ancestry": {
      "northernEuropean": 68.5,
      "westernEuropean": 22.8,
      "other": 8.7
    },
    "pharmacogenomics": {
      "cyp2d6": {
        "genotype": "*1/*4",
        "metabolizerStatus": "intermediate",
        "affectedDrugs": [
          "codeine",
          "tramadol",
          "metoprolol"
        ]
      },
      "cyp2c19": {
        "genotype": "*1/*2",
        "metabolizerStatus": "intermediate",
        "affectedDrugs": [
          "clopidogrel",
          "omeprazole",
          "escitalopram"
        ]
      },
      "cyp3a4": {
        "genotype": "*1/*22",
        "metabolizerStatus": "intermediate",
        "affectedDrugs": [
          "atorvastatin",
          "amlodipine",
          "cyclosporine"
        ]
      },
      "slco1b1": {
        "genotype": "*1A/*5",
        "riskLevel": "intermediate",
        "affectedDrugs": [
          "simvastatin",
          "atorvastatin"
        ]
      },
      "vkorc1": {
        "genotype": "A/A",
        "warfarinSensitivity": "high"
      }
    },
    "diseaseRisk": {
      "type2Diabetes": {
        "relativeRisk": 1.85,
        "absoluteRisk": 45.5,
        "unit": "%"
      },
      "coronaryArteryDisease": {
        "relativeRisk": 1.55,
        "absoluteRisk": 28.5,
        "unit": "%"
      },
      "hypothyroidism": {
        "relativeRisk": 1.42,
        "absoluteRisk": 18.5,
        "unit": "%"
      }
    },
    "traitMarkers": {
      "lactoseIntolerance": {
        "status": "unlikely",
        "confidence": 0.82
      },
      "caffeineSensitivity": {
        "status": "normal metabolizer",
        "confidence": 0.78
      },
      "nicotineDependence": {
        "status": "high predisposition",
        "confidence": 0.88
      }
    },
    "carrierStatus": {
      "sickleCellAnemia": {
        "status": "negative"
      },
      "cysticFibrosis": {
        "status": "negative"
      }
    }
  },
  "lifestyle": {
    "activity": {
      "exerciseFrequency": "1-2 times per week",
      "primaryActivities": [
        "walking"
      ],
      "averageStepsDaily": 4200,
      "activeMinutesWeekly": 75,
      "sedentaryHoursDaily": 11
    },
    "nutrition": {
      "dietType": "standard American",
      "mealsPerDay": 3,
      "waterIntakeLiters": 1.2
    },
    "sleep": {
      "averageHours": 5.5,
      "quality": "poor",
      "sleepApnea": true,
      "cpapCompliance": 45
    },
    "smoking": {
      "status": "current",
      "cigarettesPerDay": 10,
      "packYears": 25
    }
  },
  "medicalHistory": {
    "conditions": [
      {
        "name": "Type 2 Diabetes Mellitus",
        "icd10": "E11.9",
        "diagnosedDate": "2018-04-20",
        "status": "poorly controlled"
      },
      {
        "name": "Hypertension",
        "icd10": "I10",
        "diagnosedDate": "2015-08-15",
        "status": "uncontrolled"
      },
      {
        "name": "Obesity",
        "icd10": "E66.9",
        "diagnosedDate": "2016-01-10",
        "status": "active"
      },
      {
        "name": "Hypothyroidism",
        "icd10": "E03.9",
        "diagnosedDate": "2020-03-25",
        "status": "undertreated"
      },
      {
        "name": "Obstructive Sleep Apnea",
        "icd10": "G47.33",
        "diagnosedDate": "2021-09-10",
        "status": "active"
      }
    ],
    "medications": [
      {
        "name": "Metformin",
        "dosage": "1000mg",
        "frequency": "twice daily"
      },
      {
        "name": "Glipizide",
        "dosage": "5mg",
        "frequency": "once daily"
      },
      {
        "name": "Amlodipine",
        "dosage": "10mg",
        "frequency": "once daily"
      },
      {
        "name": "Lisinopril",
        "dosage": "20mg",
        "frequency": "once daily"
      },
      {
        "name": "Levothyroxine",
        "dosage": "75mcg",
        "frequency": "once daily"
      },
      {
        "name": "Atorvastatin",
        "dosage": "40mg",
        "frequency": "once daily"
      }
    ],
    "allergies": [
      {
        "allergen": "ACE inhibitor cough",
        "reaction": "persistent dry cough",
        "severity": "moderate"
      },
      {
        "allergen": "Aspirin",
        "reaction": "GI bleeding",
        "severity": "moderate"
      }
    ],
    "familyHistory": [
      {
        "condition": "Type 2 Diabetes",
        "relationship": "father",
        "ageAtOnset": 50
      },
      {
        "condition": "Heart Attack",
        "relationship": "father",
        "ageAtOnset": 62
      },
      {
        "condition": "Stroke",
        "relationship": "mother",
        "ageAtOnset": 70
      }
    ]
  },
  "longitudinalData": {
    "days": [
      {
        "dateISO": "2026-02-08",
        "steps": 3450,
        "activeCalories": 180,
        "sleepHours": 5.2,
        "restingHeartRate": 84,
        "hrvMs": 22,
        "systolic": 152,
        "diastolic": 96,
        "glucoseMgDl": 155,
        "weight": 82.5
      },
      {
        "dateISO": "2026-02-07",
        "steps": 5120,
        "activeCalories": 260,
        "sleepHours": 5.5,
        "restingHeartRate": 82,
        "hrvMs": 24,
        "systolic": 148,
        "diastolic": 94,
        "glucoseMgDl": 148,
        "weight": 82.4
      },
      {
        "dateISO": "2026-02-06",
        "steps": 4890,
        "activeCalories": 240,
        "sleepHours": 5.8,
        "restingHeartRate": 81,
        "hrvMs": 25,
        "systolic": 146,
        "diastolic": 92,
        "glucoseMgDl": 135,
        "weight": 82.5
      },
      {
        "dateISO": "2026-02-05",
        "steps": 3780,
        "activeCalories": 190,
        "sleepHours": 6,
        "restingHeartRate": 80,
        "hrvMs": 26,
        "systolic": 144,
        "diastolic": 90,
        "glucoseMgDl": 142,
        "weight": 82.5
      },
      {
        "dateISO": "2026-02-04",
        "steps": 4560,
        "activeCalories": 220,
        "sleepHours": 5,
        "restingHeartRate": 83,
        "hrvMs": 21,
        "systolic": 150,
        "diastolic": 95,
        "glucoseMgDl": 152,
        "weight": 82.6
      },
      {
        "dateISO": "2026-02-03",
        "steps": 4120,
        "activeCalories": 210,
        "sleepHours": 5.5,
        "restingHeartRate": 82,
        "hrvMs": 23,
        "systolic": 148,
        "diastolic": 93,
        "glucoseMgDl": 138,
        "weight": 82.7
      },
      {
        "dateISO": "2026-02-02",
        "steps": 3890,
        "activeCalories": 195,
        "sleepHours": 5.2,
        "restingHeartRate": 84,
        "hrvMs": 20,
        "systolic": 150,
        "diastolic": 94,
        "glucoseMgDl": 145,
        "weight": 82.8
      }
    ],
    "labHistory": [
      {
        "date": "2026-02-06",
        "hba1c": 7.2,
        "ldl": 162,
        "fastingGlucose": 135
      },
      {
        "date": "2025-11-05",
        "hba1c": 7,
        "ldl": 155,
        "fastingGlucose": 128
      },
      {
        "date": "2025-08-10",
        "hba1c": 6.8,
        "ldl": 148,
        "fastingGlucose": 122
      }
    ]
  },
  "healthScores": {
    "lastUpdated": "2026-02-08T14:30:00Z",
    "overall": 42,
    "cardiovascular": 35,
    "metabolic": 32,
    "fitness": 38,
    "sleep": 28,
    "nutrition": 45,
    "mentalWellness": 40
  }
}
```
<!-- /APP_DATA:PT-004 -->

---

<!-- PATIENT:PT-005 | name:Aisha Okonkwo | age:31 | gender:female | risk_level:low | health_score:96 | conditions:Sickle Cell Trait -->

# Patient Profile: PT-005 — Aisha Okonkwo

## Demographics
- **Patient ID:** PT-005
- **Full Name:** Aisha Okonkwo
- **Date of Birth:** 1995-01-17
- **Age:** 31 years old
- **Gender:** Female
- **Ethnicity:** African/Nigerian
- **Blood Type:** O- (O negative)
- **Height:** 170 cm
- **Weight:** 62.0 kg
- **BMI:** 21.5 (normal)
- **Location:** Austin, TX, USA
- **Occupation:** Biomedical Engineer
- **Insurance:** Cigna (CIG-2026-44556)

## Health Scores (as of 2026-02-08)
| Domain | Score (0-100) |
|--------|--------------|
| **Overall** | **96** |
| Cardiovascular | 98 |
| Metabolic | 95 |
| Fitness | 98 |
| Sleep | 95 |
| Nutrition | 92 |
| Mental Wellness | 94 |

## Active Conditions
| Condition | ICD-10 | Diagnosed | Status | Management |
|-----------|--------|-----------|--------|------------|
| Sickle Cell Trait | D57.3 | 1995-01-20 (at birth) | Stable | Asymptomatic carrier — monitoring only |

## Current Medications
| Medication | Dosage | Frequency | Prescribed For |
|-----------|--------|-----------|----------------|
| None (prescription medications) | — | — | — |

### Supplements Only
| Supplement | Dosage | Frequency |
|-----------|--------|-----------|
| Vitamin B12 | 1000 mcg | Once daily |
| Iron (ferrous sulfate) | 65 mg | Once daily |
| Vitamin D3 | 2000 IU | Once daily |

## Allergies
| Allergen | Reaction | Severity |
|----------|----------|----------|
| Latex | Contact dermatitis | Mild |

**Latex allergy note:** Inform all healthcare providers. Use non-latex gloves for all examinations and procedures. Latex-free alternatives should be used for all medical devices (catheters, tourniquets, etc.).

## Family History
| Condition | Relationship | Age at Onset |
|-----------|-------------|--------------|
| Sickle Cell Disease | Brother | At birth |
| Hypertension | Father | 58 |

## Biomarkers — Blood Panel (last updated: 2026-02-08)

### Glucose Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Fasting Glucose | 82 | mg/dL | 70-100 | Optimal |
| HbA1c | 5.0 | % | 4.0-5.6 | Optimal |
| Postprandial Glucose | 105 | mg/dL | 70-140 | Normal |

### Lipid Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Total Cholesterol | 168 | mg/dL | <200 | Optimal |
| LDL | 88 | mg/dL | <100 | Optimal |
| HDL | 68 | mg/dL | 50-60+ | Excellent |
| Triglycerides | 75 | mg/dL | <150 | Optimal |
| VLDL | 15 | mg/dL | 5-40 | Normal |

### Complete Blood Count (CBC)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| WBC | 5.8 | K/uL | 4.5-11.0 | Normal |
| RBC | 4.6 | M/uL | 4.0-5.0 | Normal |
| Hemoglobin | 13.8 | g/dL | 12.0-16.0 | Normal |
| Hematocrit | 41.2 | % | 36.0-44.0 | Normal |
| Platelets | 255 | K/uL | 150-400 | Normal |
| MCV | 82 | fL | 80-100 | Normal |
| MCH | 28.5 | pg | 27-33 | Normal |
| RDW | 14.2 | % | 11.5-14.5 | Normal |

**Sickle cell trait note:** CBC is normal. HbS is approximately 38% (typical for sickle cell trait carriers). No evidence of anemia. Hemoglobin electrophoresis confirmed HbAS pattern.

### Metabolic Panel
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Sodium | 140 | mEq/L | 136-145 | Normal |
| Potassium | 4.1 | mEq/L | 3.5-5.0 | Normal |
| Chloride | 102 | mEq/L | 98-106 | Normal |
| Bicarbonate | 25 | mEq/L | 22-29 | Normal |
| BUN | 12 | mg/dL | 7-20 | Normal |
| Creatinine | 0.8 | mg/dL | 0.6-1.1 | Normal |
| eGFR | 112 | mL/min/1.73m2 | 90-120 | Normal |

### Liver Function
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| ALT | 18 | U/L | 7-56 | Normal |
| AST | 20 | U/L | 10-40 | Normal |
| ALP | 55 | U/L | 44-147 | Normal |
| Bilirubin | 0.5 | mg/dL | 0.1-1.2 | Normal |
| Albumin | 4.5 | g/dL | 3.4-5.4 | Normal |

### Thyroid
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| TSH | 1.5 | mIU/L | 0.4-4.0 | Normal |
| Free T4 | 1.4 | ng/dL | 0.8-1.8 | Normal |
| T3 | 142 | ng/dL | 80-200 | Normal |

### Inflammatory Markers
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| CRP | 0.5 | mg/L | 0-3.0 | Optimal |
| ESR | 5 | mm/hr | 0-20 | Normal |
| Homocysteine | 7.2 | umol/L | 5-15 | Normal |

### Vitamins & Minerals
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Vitamin D | 42 | ng/mL | 30-100 | Normal |
| Vitamin B12 | 380 | pg/mL | 200-900 | Normal |
| Folate | 16.5 | ng/mL | 3-17 | Normal |
| Iron | 85 | mcg/dL | 60-170 | Normal |
| Ferritin | 55 | ng/mL | 12-150 | Normal |

### Hormones
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Estradiol | 125 | pg/mL | 30-400 | Normal |
| Progesterone | 12.5 | ng/mL | 1.8-24 (luteal) | Normal |
| Cortisol | 10.2 | mcg/dL | 6-23 | Normal |
| Insulin | 4.8 | uIU/mL | 2.6-24.9 | Normal (optimal) |
| Testosterone | 42 | ng/dL | 15-70 | Normal |

## Biomarkers — Cardiovascular (last updated: 2026-02-08)
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Systolic BP | 112 | mmHg | 90-120 | Optimal |
| Diastolic BP | 72 | mmHg | 60-80 | Optimal |
| Resting Heart Rate | 58 | bpm | 60-100 | Athletic |
| HRV | 72 | ms | 20-200 | Excellent |
| VO2 Max | 52 | mL/kg/min | 35-50 | **Elite** |

### ECG
- Rhythm: Normal sinus rhythm
- PR Interval: 150 ms (normal: 120-200)
- QRS Width: 80 ms (normal: 80-100)
- QT Interval: 385 ms (normal: 350-450)
- Notable: Sinus bradycardia consistent with elite athletic conditioning

## Biomarkers — Body Composition
| Marker | Value | Unit | Normal Range | Status |
|--------|-------|------|-------------|--------|
| Body Fat | 22.0 | % | 20-30 | Fit |
| Muscle Mass | 28.5 | kg | 22-35 | Athletic |
| Bone Density | 1.28 | g/cm2 | 1.0-1.4 | Normal |
| Visceral Fat | 4 | level | 1-12 | Low |
| Water Percentage | 58.5 | % | 45-60 | Normal |

## Pharmacogenomics (CRITICAL for drug prescribing)

| Enzyme | Genotype | Metabolizer Status | Affected Drugs |
|--------|----------|-------------------|----------------|
| **CYP2D6** | *1/*17 | **ULTRARAPID** | codeine, tramadol, tamoxifen, metoprolol |
| **CYP2C19** | *1/*1 | Normal | clopidogrel, omeprazole, escitalopram |
| **CYP3A4** | *1/*1 | Normal | atorvastatin, amlodipine, cyclosporine |
| **SLCO1B1** | *1A/*1A | Normal risk | simvastatin, atorvastatin |
| **VKORC1** | G/G | Normal warfarin sensitivity | warfarin |

### CRITICAL PHARMACOGENOMIC ALERT — CYP2D6 ULTRARAPID METABOLIZER

**This is the most important pharmacogenomic finding for this patient.**

**CONTRAINDICATED medications:**
- **Codeine** — CONTRAINDICATED. Ultrarapid CYP2D6 converts codeine to morphine too rapidly, causing dangerously high morphine levels. Risk of respiratory depression, sedation, and death. This applies to ALL codeine-containing products including combination products (e.g., Tylenol #3).
- **Tramadol** — CONTRAINDICATED. Same mechanism as codeine. Rapid conversion to active metabolite O-desmethyltramadol. Risk of respiratory depression and seizures.

**Medications requiring caution:**
- **Metoprolol** — May be cleared too quickly, resulting in subtherapeutic levels. If beta-blocker needed, use atenolol, bisoprolol, or carvedilol (not primarily CYP2D6 dependent).
- **Tamoxifen** — Enhanced activation to endoxifen. If ever needed for breast cancer, standard dosing is acceptable but monitor for increased side effects.
- **Ondansetron** — May have reduced efficacy due to rapid metabolism.

**Safe alternatives for pain management:**
- Morphine (direct, bypasses CYP2D6)
- Hydromorphone
- NSAIDs (acetaminophen, naproxen, celecoxib)
- Non-opioid alternatives preferred for this patient

## Genetic Disease Risk
| Disease | Relative Risk | Absolute Risk | Key SNPs |
|---------|--------------|---------------|----------|
| Type 2 Diabetes | 0.75x (reduced) | 6.8% | rs7903146 |
| Sickle Cell Crisis | 1.10x | 2.5% | rs334 (HbS) |
| Hypertension | 1.25x | 22.0% | rs699, rs5186 |
| Breast Cancer | 0.88x (reduced) | 10.5% | rs2981582 |

**Sickle cell trait note on disease risk:** While sickle cell trait carriers (HbAS) are generally asymptomatic, risk of complications increases with: extreme dehydration, high altitude (>8,000 ft), extreme physical exertion, and general anesthesia. Hypertensive kidney disease risk is slightly increased in sickle cell trait carriers.

## Genetic Trait Markers
| Trait | Status | Confidence |
|-------|--------|-----------|
| Lactose Intolerance | **Likely** | 78% |
| Caffeine Sensitivity | Fast metabolizer | 85% |
| Alcohol Flush | Unlikely | 90% |
| Sprint vs Endurance | Mixed (endurance bias) | 75% |
| Sleep Pattern | Morning chronotype | 80% |

## Carrier Status
| Condition | Status | Variant |
|-----------|--------|---------|
| **Sickle Cell Anemia** | **CARRIER (HbAS)** | HbS variant (rs334, Glu6Val) |
| Cystic Fibrosis | Negative | — |
| Beta-Thalassemia | Negative | — |
| G6PD Deficiency | Negative | — |

**Sickle cell carrier counseling:** Patient carries one copy of the HbS variant (sickle cell trait, HbAS). She is NOT affected by sickle cell disease but can pass the trait to offspring. If partner also carries HbS, there is a 25% chance of sickle cell disease in each child. Genetic counseling recommended before family planning. Her brother has sickle cell disease (HbSS).

**Anesthesia considerations for sickle cell trait:**
- Maintain adequate hydration and oxygenation during any surgical procedures
- Avoid hypothermia, acidosis, and hypoxia
- Use pulse oximetry monitoring
- Tourniquet use should be minimized
- Inform anesthesiologist of sickle cell trait status

## Ancestry
- West African: 82.5%
- Central African: 12.3%
- European: 4.2%
- Other: 1.0%

## Lifestyle

### Activity
- Exercise frequency: 6 times per week
- Primary activities: Running, CrossFit, Cycling, Rock climbing
- Average daily steps: 14,500
- Active minutes per week: 480
- Sedentary hours per day: 5
- Athletic achievements: Completed Ironman 70.3 Austin 2025 (5:28:42), multiple half-marathons, CrossFit Level 1 certified

### Nutrition
- Diet type: Plant-forward (primarily plant-based with occasional fish)
- Meals per day: 4
- Water intake: 3.5 L/day
- Caffeine: 100 mg/day (one coffee)
- Alcohol: Rare (1-2 drinks/month)
- Dietary restrictions: Lactose-reduced (lactose intolerance likely)
- Supplements: Vitamin B12 (1000 mcg), Iron (65 mg), Vitamin D3 (2000 IU)

### Sleep
- Average: 8.0 hours (target: 8 hours)
- Quality: Excellent
- Sleep latency: 8 minutes
- Wake-ups: 0-1 per night
- Chronotype: Morning (early riser, 5:30 AM)
- Sleep hygiene: Excellent — consistent schedule, no screens 1 hr before bed

### Stress
- Perceived level: 3/10
- Work-life balance: 8/10
- Meditation: 120 minutes/week (daily practice)
- Hobbies: Rock climbing, yoga, painting, volunteering
- Social support: Strong friend and community network

### Smoking
- Status: Never smoker

## Surgical History
| Procedure | Date | Facility | Notes |
|-----------|------|----------|-------|
| No surgical history | — | — | — |

## Immunizations
| Vaccine | Date | Manufacturer |
|---------|------|-------------|
| COVID-19 Booster | 2025-11-05 | Moderna |
| Influenza | 2025-10-12 | Sanofi |
| HPV (completed series) | 2012-03-15 | Merck |
| Tdap | 2022-09-18 | GSK |
| Meningococcal (booster) | 2021-01-20 | Sanofi |

## Longitudinal Data — 7-Day Daily Tracking (2026-02-02 to 2026-02-08)

| Date | Steps | Active Cal | Sleep (hrs) | Sleep Quality | Resting HR | HRV (ms) | Systolic | Diastolic | Glucose | Weight | Stress | Mood | Hydration (L) | Active Min |
|------|-------|-----------|-------------|---------------|------------|-----------|----------|-----------|---------|--------|--------|------|--------------|-----------|
| Feb 08 (Sun) | 16,850 | 920 | 8.2 | 95% | 56 | 75 | 110 | 70 | 80 | 62.0 | 2 | Great | 3.8 | 95 |
| Feb 07 (Sat) | 20,350 | 1,180 | 8.0 | 92% | 55 | 78 | 108 | 68 | 78 | 61.9 | 2 | Great | 4.0 | 130 |
| Feb 06 (Fri) | 12,450 | 680 | 7.8 | 90% | 60 | 70 | 114 | 74 | 84 | 62.1 | 3 | Good | 3.2 | 55 |
| Feb 05 (Thu) | 15,200 | 850 | 8.0 | 92% | 58 | 72 | 112 | 72 | 82 | 62.0 | 2 | Great | 3.5 | 85 |
| Feb 04 (Wed) | 13,800 | 750 | 8.2 | 95% | 57 | 74 | 110 | 70 | 80 | 61.9 | 2 | Great | 3.6 | 70 |
| Feb 03 (Tue) | 14,600 | 800 | 7.5 | 88% | 59 | 70 | 114 | 74 | 84 | 62.1 | 3 | Good | 3.4 | 75 |
| Feb 02 (Mon) | 11,250 | 620 | 8.0 | 92% | 58 | 72 | 112 | 72 | 82 | 62.0 | 3 | Good | 3.2 | 60 |

### Weekly Workouts
- Feb 08: Running 12K (58 min, 620 cal), Yoga 30 min (80 cal)
- Feb 07: CrossFit WOD 60 min (550 cal), Cycling 45 min (420 cal), Stretching 15 min (40 cal)
- Feb 06: Rest day — light walking, mobility work 20 min
- Feb 05: Running intervals 45 min (480 cal), Rock climbing 60 min (350 cal)
- Feb 04: CrossFit WOD 50 min (480 cal), Swimming 30 min (220 cal)
- Feb 03: Running 8K (38 min, 420 cal), Weight training 45 min (280 cal)
- Feb 02: Cycling 40 min (380 cal), Core training 20 min (100 cal)

## Monthly Trends (6 months)
| Month | Avg Steps | Avg Sleep | Avg Weight | Avg BP | Avg Resting HR | Avg HRV |
|-------|-----------|-----------|------------|--------|----------------|---------|
| Sep 2025 | 13,800 | 7.8 hrs | 62.5 kg | 114/74 | 60 | 68 |
| Oct 2025 | 14,200 | 7.9 hrs | 62.3 kg | 112/72 | 59 | 70 |
| Nov 2025 | 14,000 | 8.0 hrs | 62.2 kg | 112/72 | 58 | 71 |
| Dec 2025 | 13,500 | 8.0 hrs | 62.4 kg | 114/74 | 59 | 70 |
| Jan 2026 | 14,400 | 8.0 hrs | 62.1 kg | 112/72 | 58 | 72 |
| Feb 2026 | 14,929 | 7.9 hrs | 62.0 kg | 111/71 | 58 | 73 |

**Trend: Consistently optimal.** All metrics stable and excellent. Slight improvements in resting HR and HRV reflecting continued cardiovascular conditioning.

## Lab History (Quarterly)
| Date | HbA1c | Fasting Glucose | LDL | HDL | Triglycerides | CRP | Vitamin D |
|------|-------|-----------------|-----|-----|---------------|-----|-----------|
| Feb 2026 | 5.0% | 82 | 88 | 68 | 75 | 0.5 | 42 |
| Nov 2025 | 5.0% | 84 | 90 | 66 | 78 | 0.6 | 38 |
| Aug 2025 | 5.1% | 85 | 92 | 65 | 80 | 0.7 | 35 |
| May 2025 | 5.0% | 83 | 90 | 64 | 82 | 0.6 | 32 |

**Trend: Consistently optimal.** All biomarkers within ideal ranges across all quarters. HDL trending up (64 to 68). Vitamin D improving with supplementation (32 to 42).

## Real-Time Metrics (2026-02-08 14:30)
- Heart Rate: 60 bpm
- SpO2: 99%
- Respiratory Rate: 13 breaths/min
- Skin Temperature: 36.3 C
- Stress Index: 15/100

## Key Clinical Summary
Aisha is an elite-level athlete, 31-year-old Nigerian woman in optimal health (health score 96/100). Her only medical condition is sickle cell trait (HbAS, diagnosed at birth, asymptomatic carrier). Her brother has sickle cell disease (HbSS). The MOST CRITICAL pharmacogenomic finding is that she is a CYP2D6 ultrarapid metabolizer — codeine and tramadol are CONTRAINDICATED due to rapid conversion to active metabolites causing toxicity risk (respiratory depression, potential death). If opioid pain management is ever needed, use morphine directly or non-CYP2D6 pathways. Metoprolol may be cleared too quickly if a beta-blocker is ever needed — use alternatives. She has a mild latex allergy (contact dermatitis). All other pharmacogenomics are normal. Her cardiovascular fitness is elite (VO2 max 52 mL/kg/min, resting HR 58, HRV 72 ms). She completed an Ironman 70.3 triathlon in 2025 (5:28:42) and is CrossFit Level 1 certified. All biomarkers are optimal across the board — glucose, lipids, inflammatory markers, liver function, renal function, thyroid, vitamins, and hormones all normal. She follows a plant-forward diet, exercises 6 times per week (480 active minutes), sleeps 8 hours with excellent quality, and has a daily meditation practice. She is likely lactose intolerant (78% confidence) and manages this through diet. Important considerations for sickle cell trait: avoid extreme dehydration, caution at high altitude (>8,000 ft), inform anesthesiologist before any procedures, and genetic counseling recommended for family planning. Disease risk is low across the board, with a slight elevation in hypertension risk (1.25x) — monitor blood pressure longitudinally.

## Structured Data

<!-- APP_DATA:PT-005 -->
```json
{
  "id": "PT-005",
  "demographics": {
    "firstName": "Aisha",
    "lastName": "Okonkwo",
    "dateOfBirth": "1995-01-17",
    "age": 31,
    "gender": "female",
    "ethnicity": "African/Nigerian",
    "bloodType": "O-",
    "height": 170,
    "weight": 62,
    "bmi": 21.5,
    "email": "aisha.okonkwo@email.com",
    "phone": "+1-555-0509",
    "address": {
      "street": "567 Willow Court",
      "city": "Austin",
      "state": "TX",
      "zipCode": "78701",
      "country": "USA"
    },
    "insurance": {
      "provider": "Cigna",
      "policyNumber": "CIG-2026-44556",
      "groupNumber": "GRP-AUS-5005"
    }
  },
  "dashboard": {
    "profileCard": {
      "name": "Aisha Okonkwo",
      "gender": "Female",
      "weight": 62,
      "weightUnit": "Kg",
      "age": 31,
      "bloodType": "O(I)",
      "bloodRh": "Rh-"
    },
    "biomarkerData": [
      {
        "name": "Blood Glucose",
        "value": 82,
        "unit": "mg/dL",
        "status": "optimal"
      },
      {
        "name": "Total Cholesterol",
        "value": 168,
        "unit": "mg/dL",
        "status": "optimal"
      },
      {
        "name": "Blood Pressure",
        "value": "112/72",
        "unit": "mmHg",
        "status": "optimal"
      },
      {
        "name": "Heart Rate",
        "value": 58,
        "unit": "bpm",
        "status": "athletic"
      },
      {
        "name": "Body Temperature",
        "value": 98.2,
        "unit": "°F",
        "status": "normal"
      },
      {
        "name": "Oxygen Saturation",
        "value": 99,
        "unit": "%",
        "status": "excellent"
      }
    ],
    "geneticInsights": [
      {
        "trait": "Sickle Cell Trait",
        "result": "Carrier (HbAS)",
        "risk": "medium"
      },
      {
        "trait": "Athletic Performance",
        "result": "Elite endurance potential",
        "risk": "low"
      },
      {
        "trait": "Drug Metabolism (CYP2D6)",
        "result": "Ultrarapid metabolizer",
        "risk": "medium"
      },
      {
        "trait": "Vitamin D Processing",
        "result": "Efficient",
        "risk": "low"
      }
    ],
    "lifestyleMetrics": [
      {
        "metric": "Average Sleep",
        "value": "8.0 hrs",
        "target": "8 hrs",
        "progress": 100
      },
      {
        "metric": "Daily Steps",
        "value": "14,500",
        "target": "10,000",
        "progress": 100
      },
      {
        "metric": "Water Intake",
        "value": "3.5 L",
        "target": "3.0 L",
        "progress": 100
      },
      {
        "metric": "Exercise Minutes",
        "value": "69 min",
        "target": "45 min",
        "progress": 100
      }
    ],
    "longitudinalEvents": [
      {
        "date": "Feb 2026",
        "event": "VO2 max reached 52 mL/kg/min - elite level"
      },
      {
        "date": "Sep 2025",
        "event": "Completed Ironman 70.3 triathlon"
      },
      {
        "date": "Aug 2025",
        "event": "Annual checkup - all markers optimal"
      },
      {
        "date": "Jan 1995",
        "event": "Sickle cell trait identified at birth - asymptomatic"
      }
    ],
    "wearables": [
      {
        "name": "Garmin Forerunner",
        "connected": true,
        "icon": "⌚",
        "color": "bg-blue-600"
      },
      {
        "name": "Whoop 4.0",
        "connected": true,
        "icon": "💪",
        "color": "bg-green-600"
      },
      {
        "name": "Oura Ring",
        "connected": true,
        "icon": "💍",
        "color": "bg-violet-500"
      },
      {
        "name": "Wahoo Bike",
        "connected": true,
        "icon": "🚴",
        "color": "bg-orange-500"
      }
    ],
    "dailyActivities": [
      {
        "name": "Sleep Tracker",
        "icon": "Moon",
        "color": "bg-indigo-500",
        "active": true
      },
      {
        "name": "Running",
        "icon": "Footprints",
        "color": "bg-orange-500",
        "active": true
      },
      {
        "name": "CrossFit",
        "icon": "Dumbbell",
        "color": "bg-red-500",
        "active": true
      },
      {
        "name": "Cycling",
        "icon": "Bike",
        "color": "bg-blue-500",
        "active": true
      },
      {
        "name": "Meditation",
        "icon": "Brain",
        "color": "bg-purple-500",
        "active": true
      },
      {
        "name": "Rock Climbing",
        "icon": "Mountain",
        "color": "bg-amber-500",
        "active": false
      }
    ],
    "mealPlan": {
      "2026-02-08": {
        "breakfast": [
          {
            "emoji": "🥣",
            "name": "Overnight Oats",
            "calories": 280
          },
          {
            "emoji": "🫐",
            "name": "Mixed Berries",
            "calories": 60
          },
          {
            "emoji": "🥜",
            "name": "Almond Butter",
            "calories": 90
          }
        ],
        "lunch": [
          {
            "emoji": "🥗",
            "name": "Power Salad",
            "calories": 320
          },
          {
            "emoji": "🍗",
            "name": "Grilled Chicken",
            "calories": 200
          },
          {
            "emoji": "🥑",
            "name": "Avocado",
            "calories": 160
          }
        ],
        "dinner": [
          {
            "emoji": "🐟",
            "name": "Grilled Salmon",
            "calories": 350
          },
          {
            "emoji": "🍠",
            "name": "Roasted Sweet Potato",
            "calories": 180
          },
          {
            "emoji": "🥬",
            "name": "Kale Salad",
            "calories": 80
          }
        ],
        "snacks": [
          {
            "emoji": "🍌",
            "name": "Banana",
            "calories": 90
          },
          {
            "emoji": "🥤",
            "name": "Protein Smoothie",
            "calories": 250
          },
          {
            "emoji": "🥕",
            "name": "Carrots & Hummus",
            "calories": 120
          }
        ]
      }
    },
    "caloriesAnalysis": {
      "consumed": 2680,
      "burned": 3100,
      "target": 2700,
      "protein": 30,
      "fat": 28,
      "carbs": 42
    }
  },
  "biomarkers": {
    "bloodPanel": {
      "lastUpdated": "2026-02-04T09:30:00Z",
      "glucose": {
        "fasting": {
          "value": 82,
          "unit": "mg/dL",
          "status": "optimal"
        },
        "hba1c": {
          "value": 5,
          "unit": "%",
          "status": "optimal"
        }
      },
      "lipidPanel": {
        "totalCholesterol": {
          "value": 168,
          "unit": "mg/dL",
          "status": "optimal"
        },
        "ldl": {
          "value": 88,
          "unit": "mg/dL",
          "status": "optimal"
        },
        "hdl": {
          "value": 68,
          "unit": "mg/dL",
          "status": "excellent"
        },
        "triglycerides": {
          "value": 75,
          "unit": "mg/dL",
          "status": "optimal"
        }
      },
      "cbc": {
        "wbc": {
          "value": 5.8,
          "unit": "K/uL",
          "normalRange": [
            4.5,
            11
          ],
          "status": "normal"
        },
        "rbc": {
          "value": 4.6,
          "unit": "M/uL",
          "normalRange": [
            4,
            5
          ],
          "status": "normal"
        },
        "hemoglobin": {
          "value": 13.8,
          "unit": "g/dL",
          "normalRange": [
            12,
            16
          ],
          "status": "normal"
        },
        "platelets": {
          "value": 255,
          "unit": "K/uL",
          "normalRange": [
            150,
            400
          ],
          "status": "normal"
        }
      },
      "metabolicPanel": {
        "creatinine": {
          "value": 0.8,
          "unit": "mg/dL",
          "normalRange": [
            0.6,
            1.1
          ],
          "status": "normal"
        },
        "egfr": {
          "value": 112,
          "unit": "mL/min/1.73m2",
          "normalRange": [
            90,
            120
          ],
          "status": "normal"
        },
        "bun": {
          "value": 12,
          "unit": "mg/dL",
          "normalRange": [
            7,
            20
          ],
          "status": "normal"
        }
      },
      "liverFunction": {
        "alt": {
          "value": 18,
          "unit": "U/L",
          "normalRange": [
            7,
            56
          ],
          "status": "normal"
        },
        "ast": {
          "value": 20,
          "unit": "U/L",
          "normalRange": [
            10,
            40
          ],
          "status": "normal"
        }
      },
      "inflammatory": {
        "crp": {
          "value": 0.5,
          "unit": "mg/L",
          "normalRange": [
            0,
            3
          ],
          "status": "optimal"
        }
      },
      "vitamins": {
        "vitaminD": {
          "value": 42,
          "unit": "ng/mL",
          "normalRange": [
            30,
            100
          ],
          "status": "normal"
        },
        "iron": {
          "value": 85,
          "unit": "mcg/dL",
          "normalRange": [
            60,
            170
          ],
          "status": "normal"
        },
        "vitaminB12": {
          "value": 380,
          "unit": "pg/mL",
          "normalRange": [
            200,
            900
          ],
          "status": "normal"
        }
      }
    },
    "cardiovascular": {
      "bloodPressure": {
        "systolic": {
          "value": 112,
          "unit": "mmHg",
          "status": "optimal"
        },
        "diastolic": {
          "value": 72,
          "unit": "mmHg",
          "status": "optimal"
        }
      },
      "heartRate": {
        "resting": {
          "value": 58,
          "unit": "bpm",
          "status": "athletic"
        },
        "hrv": {
          "value": 72,
          "unit": "ms",
          "status": "excellent"
        },
        "vo2Max": {
          "value": 52,
          "unit": "mL/kg/min",
          "status": "elite"
        }
      }
    },
    "bodyComposition": {
      "bodyFatPercentage": {
        "value": 22,
        "unit": "%",
        "status": "fit"
      },
      "muscleMass": {
        "value": 28.5,
        "unit": "kg",
        "status": "athletic"
      }
    }
  },
  "genetics": {
    "ancestry": {
      "westAfrican": 82.5,
      "centralAfrican": 12.3,
      "european": 4.2,
      "other": 1
    },
    "carrierStatus": {
      "sickleCellAnemia": {
        "status": "carrier",
        "variant": "HbS"
      },
      "cysticFibrosis": {
        "status": "negative"
      }
    },
    "pharmacogenomics": {
      "cyp2d6": {
        "genotype": "*1/*17",
        "metabolizerStatus": "ultrarapid",
        "affectedDrugs": [
          "codeine",
          "tramadol",
          "tamoxifen",
          "metoprolol"
        ]
      },
      "cyp2c19": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "clopidogrel",
          "omeprazole"
        ]
      },
      "cyp3a4": {
        "genotype": "*1/*1",
        "metabolizerStatus": "normal",
        "affectedDrugs": [
          "atorvastatin",
          "cyclosporine"
        ]
      },
      "slco1b1": {
        "genotype": "*1A/*1A",
        "riskLevel": "normal",
        "affectedDrugs": [
          "simvastatin",
          "atorvastatin"
        ]
      },
      "vkorc1": {
        "genotype": "G/G",
        "warfarinSensitivity": "normal"
      }
    },
    "diseaseRisk": {
      "type2Diabetes": {
        "relativeRisk": 0.75,
        "absoluteRisk": 6.8,
        "unit": "%"
      },
      "sickleCellCrisis": {
        "relativeRisk": 1.1,
        "absoluteRisk": 2.5,
        "unit": "%"
      },
      "hypertension": {
        "relativeRisk": 1.25,
        "absoluteRisk": 22,
        "unit": "%"
      }
    },
    "traitMarkers": {
      "lactoseIntolerance": {
        "status": "likely",
        "confidence": 0.78
      },
      "caffeineSensitivity": {
        "status": "fast metabolizer",
        "confidence": 0.85
      }
    }
  },
  "lifestyle": {
    "activity": {
      "exerciseFrequency": "6 times per week",
      "primaryActivities": [
        "running",
        "CrossFit",
        "cycling",
        "rock climbing"
      ],
      "averageStepsDaily": 14500,
      "activeMinutesWeekly": 480
    },
    "nutrition": {
      "dietType": "plant-forward",
      "mealsPerDay": 4,
      "waterIntakeLiters": 3.5,
      "supplements": [
        "B12",
        "iron",
        "vitamin D"
      ]
    },
    "sleep": {
      "averageHours": 8,
      "quality": "excellent"
    },
    "stress": {
      "perceivedLevel": 3,
      "meditationMinutesWeekly": 120
    },
    "smoking": {
      "status": "never"
    }
  },
  "medicalHistory": {
    "conditions": [
      {
        "name": "Sickle Cell Trait",
        "icd10": "D57.3",
        "diagnosedDate": "1995-01-20",
        "status": "stable",
        "notes": "Asymptomatic carrier"
      }
    ],
    "allergies": [
      {
        "allergen": "Latex",
        "reaction": "contact dermatitis",
        "severity": "mild"
      }
    ],
    "medications": [],
    "familyHistory": [
      {
        "condition": "Sickle Cell Disease",
        "relationship": "brother",
        "ageAtOnset": 0
      }
    ]
  },
  "longitudinalData": {
    "days": [
      {
        "dateISO": "2026-02-08",
        "steps": 9870,
        "activeCalories": 720,
        "sleepHours": 8,
        "restingHeartRate": 57,
        "hrvMs": 74,
        "systolic": 110,
        "diastolic": 70,
        "glucoseMgDl": 80,
        "weight": 62
      },
      {
        "dateISO": "2026-02-07",
        "steps": 18920,
        "activeCalories": 1280,
        "sleepHours": 8.5,
        "restingHeartRate": 55,
        "hrvMs": 78,
        "systolic": 108,
        "diastolic": 68,
        "glucoseMgDl": 78,
        "weight": 61.9
      },
      {
        "dateISO": "2026-02-06",
        "steps": 14890,
        "activeCalories": 980,
        "sleepHours": 8,
        "restingHeartRate": 58,
        "hrvMs": 72,
        "systolic": 112,
        "diastolic": 72,
        "glucoseMgDl": 82,
        "weight": 61.8
      },
      {
        "dateISO": "2026-02-05",
        "steps": 12340,
        "activeCalories": 820,
        "sleepHours": 7.5,
        "restingHeartRate": 59,
        "hrvMs": 70,
        "systolic": 114,
        "diastolic": 74,
        "glucoseMgDl": 84,
        "weight": 62
      },
      {
        "dateISO": "2026-02-04",
        "steps": 16780,
        "activeCalories": 1120,
        "sleepHours": 8,
        "restingHeartRate": 56,
        "hrvMs": 76,
        "systolic": 110,
        "diastolic": 70,
        "glucoseMgDl": 80,
        "weight": 61.9
      },
      {
        "dateISO": "2026-02-03",
        "steps": 13450,
        "activeCalories": 880,
        "sleepHours": 8.2,
        "restingHeartRate": 57,
        "hrvMs": 74,
        "systolic": 111,
        "diastolic": 71,
        "glucoseMgDl": 81,
        "weight": 62
      },
      {
        "dateISO": "2026-02-02",
        "steps": 15230,
        "activeCalories": 1020,
        "sleepHours": 7.8,
        "restingHeartRate": 58,
        "hrvMs": 72,
        "systolic": 112,
        "diastolic": 72,
        "glucoseMgDl": 82,
        "weight": 62.1
      }
    ]
  },
  "healthScores": {
    "lastUpdated": "2026-02-08T14:30:00Z",
    "overall": 96,
    "cardiovascular": 98,
    "metabolic": 95,
    "fitness": 98,
    "sleep": 95,
    "nutrition": 92,
    "mentalWellness": 94
  }
}
```
<!-- /APP_DATA:PT-005 -->

---

## Global Data

<!-- APP_DATA:GLOBAL -->
```json
{
  "metadata": {
    "version": "1.0.0",
    "generatedAt": "2026-02-08T14:30:00Z",
    "dataSource": "DigiTwin Synthetic Patient Database",
    "weekRange": {
      "start": "2026-02-02",
      "end": "2026-02-08"
    }
  },
  "realWorldData": {
    "environmentalFactors": {
      "2026-02-02": {
        "airQualityIndex": 42,
        "pollenCount": "low",
        "uvIndex": 2,
        "humidity": 65,
        "temperature": {
          "high": 58,
          "low": 42,
          "unit": "F"
        }
      },
      "2026-02-03": {
        "airQualityIndex": 38,
        "pollenCount": "low",
        "uvIndex": 2,
        "humidity": 70,
        "temperature": {
          "high": 55,
          "low": 40,
          "unit": "F"
        }
      },
      "2026-02-04": {
        "airQualityIndex": 52,
        "pollenCount": "low",
        "uvIndex": 3,
        "humidity": 55,
        "temperature": {
          "high": 62,
          "low": 45,
          "unit": "F"
        }
      },
      "2026-02-05": {
        "airQualityIndex": 48,
        "pollenCount": "low",
        "uvIndex": 2,
        "humidity": 68,
        "temperature": {
          "high": 58,
          "low": 44,
          "unit": "F"
        }
      },
      "2026-02-06": {
        "airQualityIndex": 35,
        "pollenCount": "low",
        "uvIndex": 3,
        "humidity": 60,
        "temperature": {
          "high": 64,
          "low": 48,
          "unit": "F"
        }
      },
      "2026-02-07": {
        "airQualityIndex": 28,
        "pollenCount": "low",
        "uvIndex": 4,
        "humidity": 52,
        "temperature": {
          "high": 68,
          "low": 50,
          "unit": "F"
        }
      },
      "2026-02-08": {
        "airQualityIndex": 32,
        "pollenCount": "low",
        "uvIndex": 3,
        "humidity": 58,
        "temperature": {
          "high": 65,
          "low": 48,
          "unit": "F"
        }
      }
    },
    "healthcareClaims": {
      "PT-001": [
        {
          "date": "2026-02-08",
          "type": "lab",
          "description": "Comprehensive Metabolic Panel",
          "cost": 125,
          "covered": 100
        },
        {
          "date": "2025-11-15",
          "type": "office visit",
          "description": "Annual Physical",
          "cost": 250,
          "covered": 250
        }
      ],
      "PT-002": [
        {
          "date": "2026-02-07",
          "type": "lab",
          "description": "HbA1c + Lipid Panel",
          "cost": 150,
          "covered": 120
        },
        {
          "date": "2026-01-15",
          "type": "specialist",
          "description": "Endocrinology Consultation",
          "cost": 350,
          "covered": 280
        }
      ],
      "PT-004": [
        {
          "date": "2026-02-06",
          "type": "lab",
          "description": "Comprehensive Labs",
          "cost": 280,
          "covered": 224
        },
        {
          "date": "2026-01-20",
          "type": "DME",
          "description": "CPAP Supplies",
          "cost": 180,
          "covered": 144
        },
        {
          "date": "2025-12-10",
          "type": "ER",
          "description": "Chest Pain Evaluation",
          "cost": 2500,
          "covered": 2000
        }
      ]
    },
    "socialDeterminants": {
      "PT-001": {
        "foodAccess": "high",
        "transportationAccess": "high",
        "socialSupport": "strong",
        "educationLevel": "masters",
        "incomeLevel": "upper-middle"
      },
      "PT-002": {
        "foodAccess": "high",
        "transportationAccess": "moderate",
        "socialSupport": "strong",
        "educationLevel": "bachelors",
        "incomeLevel": "middle"
      },
      "PT-003": {
        "foodAccess": "high",
        "transportationAccess": "high",
        "socialSupport": "moderate",
        "educationLevel": "bachelors",
        "incomeLevel": "upper-middle"
      },
      "PT-004": {
        "foodAccess": "moderate",
        "transportationAccess": "moderate",
        "socialSupport": "limited",
        "educationLevel": "associate",
        "incomeLevel": "lower-middle"
      },
      "PT-005": {
        "foodAccess": "high",
        "transportationAccess": "high",
        "socialSupport": "strong",
        "educationLevel": "doctorate",
        "incomeLevel": "upper-middle"
      }
    }
  }
}
```
<!-- /APP_DATA:GLOBAL -->
