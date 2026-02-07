# Dify Workflow Setup Guide

This guide explains how to set up Dify workflows for the DigiTwin Treatment Simulation feature.

## Overview

The Treatment Simulation in Doctor Space uses Dify's streaming API to:
1. Check drug interactions using medical knowledge
2. Analyze patient conditions and contraindications
3. Provide clinical notes and recommendations
4. Show AI "thinking steps" during analysis

## Prerequisites

1. A Dify account (https://dify.ai or self-hosted instance)
2. API access enabled for your Dify application

---

## Step 1: Create a Dify Application

### Option A: Chat Assistant (Recommended for Quick Setup)

1. Log into Dify (https://cloud.dify.ai)
2. Click **"Create Application"** → Select **"Chat Assistant"**
3. Name it: `DigiTwin Treatment Advisor`
4. Configure the system prompt:

```
You are a clinical decision support AI for doctors. You help analyze treatment options and drug interactions for patients.

When given a treatment simulation request:

1. INTERACTIONS: List any drug-drug interactions between the proposed treatment and current medications
2. WARNINGS: Note contraindications based on patient conditions
3. ALLERGY RISKS: Check for cross-reactivity with known allergies
4. CLINICAL NOTES: Provide evidence-based treatment insights

Format your response with clear sections:
- Start each section with the header in CAPS
- Use bullet points for individual items
- Be concise but comprehensive

Important: This is for simulation purposes only. Always recommend physician oversight.
```

5. Click **Publish**

### Option B: Agent Workflow (For Advanced Use with Thinking Steps)

1. Log into Dify
2. Click **"Create Application"** → Select **"Agent"**
3. Name it: `DigiTwin Medical Agent`
4. Add Tools:
   - **HTTP Request** tool for calling medical APIs (optional: FDA API, DrugBank, etc.)
   - **Web Search** tool for recent drug information (optional)
5. Configure Agent reasoning to show thinking steps
6. Set up the system instructions similar to Option A

---

## Step 2: Get API Credentials

1. In your Dify app, click **"API Access"** in the left sidebar
2. Copy the **API Key** (looks like: `app-xxxxxxxxxxxx`)
3. Note the **API Base URL**:
   - Cloud: `https://api.dify.ai`
   - Self-hosted: Your instance URL (e.g., `https://dify.your-domain.com`)

---

## Step 3: Configure DigiTwin

Add these environment variables to your `.env` file:

```bash
# Dify Configuration
DIFY_API_URL=https://api.dify.ai   # or your self-hosted URL
DIFY_API_KEY=app-xxxxxxxxxxxx       # your API key from Step 2
```

---

## Step 4: Test the Integration

1. Start the DigiTwin dev server: `npm run dev`
2. Navigate to **Doctor Space** → **Treatment Simulation**
3. Select a patient and enter a treatment (e.g., "Metformin 500mg")
4. Click **Run Treatment Simulation**
5. You should see:
   - AI thinking animation during processing
   - Drug interactions (if any detected)
   - Clinical notes from Dify
   - Source badge showing "DIFY ENHANCED"

---

## Advanced: Creating a Custom Workflow

For more sophisticated analysis, create a Dify **Workflow**:

### Workflow Structure

```
[Start] 
  ↓
[Variable Assignment] - Extract treatment name, patient info
  ↓
[LLM Node 1] - Analyze drug interactions
  ↓
[LLM Node 2] - Check contraindications
  ↓
[LLM Node 3] - Generate clinical notes
  ↓
[Answer] - Combine results
```

### Workflow Variables

Define input variables:
- `treatment_name` (string)
- `treatment_type` (string)
- `dosage` (string)
- `patient_conditions` (string)
- `current_meds` (string)
- `allergies` (string)

### Sample LLM Prompts

**Node 1 - Drug Interactions:**
```
Analyze potential drug interactions for {{treatment_name}} with these current medications: {{current_meds}}

List any significant interactions with severity (low/moderate/high/contraindicated).
```

**Node 2 - Contraindications:**
```
Check {{treatment_name}} for contraindications given these conditions: {{patient_conditions}}
Known allergies: {{allergies}}

Identify any contraindications or cross-reactivity risks.
```

**Node 3 - Clinical Notes:**
```
Provide clinical recommendations for {{treatment_name}} ({{dosage}}) in a patient with:
- Conditions: {{patient_conditions}}
- Current medications: {{current_meds}}

Give a 2-3 sentence clinical summary.
```

---

## API Response Format

The DigiTwin integration expects Dify responses in this format:

```
INTERACTIONS:
- [interaction description]
- [interaction description]

WARNINGS/CAUTIONS:
- [warning description]

CLINICAL NOTES:
[Clinical summary and recommendations]
```

The app parses these sections to extract:
- Drug interactions (with severity detection)
- Warnings and contraindications
- Clinical notes for display

---

## Troubleshooting

### "DEMO" source instead of "DIFY ENHANCED"

1. Check `.env` has correct `DIFY_API_URL` and `DIFY_API_KEY`
2. Restart the dev server after changing `.env`
3. Check browser console for API errors

### No thinking steps displayed

1. Thinking steps require Dify streaming mode to work
2. Verify your Dify app has "Stream mode" enabled
3. Agent-type apps show more thinking steps than Chat Assistants

### API Rate Limits

1. Dify Cloud has rate limits based on your plan
2. Add error handling for rate limit responses
3. Consider self-hosting Dify for production use

---

## Self-Hosting Dify (Optional)

For production or data privacy requirements:

```bash
# Clone Dify
git clone https://github.com/langgenius/dify.git
cd dify/docker

# Start with Docker Compose
docker compose up -d
```

Then update your `.env`:
```bash
DIFY_API_URL=http://localhost:5001  # or your domain
```

---

## Security Notes

1. Never commit API keys to version control
2. Use environment variables for all secrets
3. Consider rate limiting your API routes
4. The current implementation is for demo/hackathon purposes
5. For production, add proper authentication and audit logging

---

## Resources

- [Dify Documentation](https://docs.dify.ai)
- [Dify API Reference](https://docs.dify.ai/guides/application-publishing/developing-with-apis)
- [Dify GitHub](https://github.com/langgenius/dify)
