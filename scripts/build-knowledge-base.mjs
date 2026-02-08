#!/usr/bin/env node
/**
 * Assembles the single-source-of-truth knowledge-base.md from:
 *   - docs/knowledge-base/*.md  (clinical narratives for Dify RAG)
 *   - src/data/patients.json    (structured JSON for the app)
 *
 * Output: src/data/knowledge-base.md
 *
 * The generated file is then imported by the app at build time via
 * webpack raw-loader and parsed by parseKnowledgeBase.ts.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Load sources ──────────────────────────────────────────────────
const patientsJson = JSON.parse(
  readFileSync(join(ROOT, "src/data/patients.json"), "utf-8")
);
const patients = patientsJson.patients;
const kbDir = join(ROOT, "docs/knowledge-base");
const mdFiles = readdirSync(kbDir)
  .filter((f) => f.startsWith("PT-") && f.endsWith(".md"))
  .sort();

// ── Risk-level helper ─────────────────────────────────────────────
function riskLevel(score) {
  if (score >= 85) return "low";
  if (score >= 65) return "moderate";
  if (score >= 45) return "high";
  return "critical";
}

// ── Build the output ──────────────────────────────────────────────
const sections = [];

// Header
sections.push(`---
title: DigiTwin Patient Knowledge Base
version: 1.0.0
last_updated: 2026-02-08
total_patients: ${patients.length}
data_source: DigiTwin Synthetic Patient Database
week_range: ${patientsJson.metadata.weekRange.start} to ${patientsJson.metadata.weekRange.end}
---

# DigiTwin Patient Knowledge Base

This file is the **single source of truth** for both the Dify knowledge base (clinical narrative for RAG retrieval) and the DigiTwin web application (embedded JSON blocks parsed at runtime).

**Patients:** ${patients.length}
**Data period:** ${patientsJson.metadata.weekRange.start} to ${patientsJson.metadata.weekRange.end}

| ID | Name | Age | Gender | Health Score | Risk Level |
|----|------|-----|--------|-------------|------------|
${patients
  .map(
    (p) =>
      `| ${p.id} | ${p.demographics.firstName} ${p.demographics.lastName} | ${p.demographics.age} | ${p.demographics.gender} | ${p.healthScores.overall}/100 | ${riskLevel(p.healthScores.overall)} |`
  )
  .join("\n")}
`);

// Per-patient sections
for (let i = 0; i < patients.length; i++) {
  const patient = patients[i];
  const score = patient.healthScores.overall;
  const conditions = (patient.medicalHistory?.conditions || [])
    .map((c) => c.name)
    .join(",");
  const name = `${patient.demographics.firstName} ${patient.demographics.lastName}`;

  // Find matching .md file
  const mdFile = mdFiles.find((f) => f.startsWith(patient.id));
  let clinicalNarrative = "";
  if (mdFile) {
    clinicalNarrative = readFileSync(join(kbDir, mdFile), "utf-8");
    // Remove any leading # title line (we provide our own)
    clinicalNarrative = clinicalNarrative
      .replace(/^#\s+.*\n/, "")
      .trim();
  }

  sections.push(`---

<!-- PATIENT:${patient.id} | name:${name} | age:${patient.demographics.age} | gender:${patient.demographics.gender} | risk_level:${riskLevel(score)} | health_score:${score} | conditions:${conditions} -->

# Patient Profile: ${patient.id} — ${name}

${clinicalNarrative}

## Structured Data

<!-- APP_DATA:${patient.id} -->
\`\`\`json
${JSON.stringify(patient, null, 2)}
\`\`\`
<!-- /APP_DATA:${patient.id} -->
`);
}

// Global data section
const globalData = {
  metadata: patientsJson.metadata,
  realWorldData: patientsJson.realWorldData,
};

sections.push(`---

## Global Data

<!-- APP_DATA:GLOBAL -->
\`\`\`json
${JSON.stringify(globalData, null, 2)}
\`\`\`
<!-- /APP_DATA:GLOBAL -->
`);

// ── Write output ──────────────────────────────────────────────────
const output = sections.join("\n");
const outPath = join(ROOT, "src/data/knowledge-base.md");
writeFileSync(outPath, output, "utf-8");

const lines = output.split("\n").length;
const sizeKB = (Buffer.byteLength(output, "utf-8") / 1024).toFixed(1);
console.log(`✓ knowledge-base.md generated: ${lines} lines, ${sizeKB} KB`);
console.log(`  → ${outPath}`);
