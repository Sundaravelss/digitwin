#!/usr/bin/env node
/**
 * dify-publish.mjs — Publish a Dify workflow via the Console API
 *
 * Quick start:
 *   1. Open cloud.dify.ai → DevTools (F12) → Console tab
 *   2. Paste:  copy(document.cookie)
 *   3. Run:    node scripts/dify-publish.mjs
 *   4. Paste the cookie when prompted (or use DIFY_COOKIE env var)
 *
 * Actions (pass as first arg):
 *   publish   (default) — Publish the current workflow draft
 *   draft     — Fetch the current draft JSON (debug)
 *   export    — Export the app DSL YAML
 *
 * Environment variables:
 *   DIFY_COOKIE   — Full cookie string (skips interactive prompt)
 *   DIFY_APP_ID   — Override app ID
 *   DIFY_APP      — Shorthand: "patient" or "treatment" (default: patient)
 *   DIFY_BASE_URL — Base URL (default: https://cloud.dify.ai)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COOKIE_FILE = join(__dirname, ".dify-cookie");

const DIFY_BASE_URL = process.env.DIFY_BASE_URL || "https://cloud.dify.ai";

// ── App IDs ───────────────────────────────────────────────────────────
const APP_IDS = {
  patient: "49a5a470-eb83-4736-bfc1-a637e392582b",
  treatment: "da051130-6599-415c-827e-0c6d4c98e7bf",
};

const appShorthand = process.env.DIFY_APP || "patient";
const DIFY_APP_ID = process.env.DIFY_APP_ID || APP_IDS[appShorthand] || APP_IDS.patient;
const action = process.argv[2] || "publish";

// ── Cookie loading (env → file → interactive prompt) ──────────────────
async function getCookie() {
  // 1. From environment variable
  if (process.env.DIFY_COOKIE) {
    console.log("  Cookie source: DIFY_COOKIE env var");
    return process.env.DIFY_COOKIE;
  }

  // 2. From cached file (if not expired)
  if (existsSync(COOKIE_FILE)) {
    const cached = readFileSync(COOKIE_FILE, "utf-8").trim();
    if (cached) {
      // Check if the access token JWT is still valid
      const expiry = extractJwtExpiry(cached);
      if (expiry && expiry > Date.now() / 1000) {
        const remaining = Math.round((expiry - Date.now() / 1000) / 60);
        console.log(`  Cookie source: cached file (~${remaining} min remaining)`);
        return cached;
      }
      console.log("  Cached cookie expired, need fresh one.");
    }
  }

  // 3. Interactive prompt
  console.log(`
┌─────────────────────────────────────────────────────────┐
│  Fresh cookie needed from cloud.dify.ai                 │
│                                                         │
│  1. Open https://cloud.dify.ai in Chrome                │
│  2. DevTools (F12) → Console tab                        │
│  3. Paste:  copy(document.cookie)                       │
│  4. Paste the result below (Cmd+V) then press Enter     │
└─────────────────────────────────────────────────────────┘
`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const cookie = await new Promise((resolve) => {
    rl.question("Cookie: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

  if (!cookie) {
    console.error("No cookie provided. Exiting.");
    process.exit(1);
  }

  // Cache it for subsequent runs
  writeFileSync(COOKIE_FILE, cookie, "utf-8");
  console.log(`  Cookie cached to ${COOKIE_FILE}`);
  return cookie;
}

// ── JWT helpers ───────────────────────────────────────────────────────
function extractJwtExpiry(cookie) {
  const match = cookie.match(/__Host-access_token=([^;]+)/);
  if (!match) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(match[1].split(".")[1], "base64").toString()
    );
    return payload.exp;
  } catch {
    return null;
  }
}

function extractCsrfToken(cookie) {
  const match = cookie.match(/__Host-csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

// ── API helper ────────────────────────────────────────────────────────
async function difyApi(cookie, method, path, body = null) {
  const url = `${DIFY_BASE_URL}${path}`;
  const csrfToken = extractCsrfToken(cookie);

  const headers = {
    "Content-Type": "application/json",
    Cookie: cookie,
    Accept: "*/*",
    "User-Agent": "dify-publish-script/1.0",
  };
  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const opts = { method, headers };
  if (body) {
    opts.body = JSON.stringify(body);
  }

  console.log(`  → ${method} ${url}`);
  const res = await fetch(url, opts);
  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    // If token expired, delete cached cookie and suggest re-run
    if (res.status === 401) {
      if (existsSync(COOKIE_FILE)) {
        const { unlinkSync } = await import("fs");
        unlinkSync(COOKIE_FILE);
      }
      console.error(`\n✗ 401 Unauthorized — token expired or invalid.`);
      console.error(`  Cached cookie cleared. Re-run the script to paste a fresh one.`);
    } else {
      console.error(`\n✗ ${res.status} ${res.statusText}`);
      console.error(typeof data === "string" ? data : JSON.stringify(data, null, 2));
    }
    process.exit(1);
  }

  return { data, headers: res.headers };
}

// ── Actions ───────────────────────────────────────────────────────────
async function publish(cookie) {
  const appName = Object.entries(APP_IDS).find(([, v]) => v === DIFY_APP_ID)?.[0] || "unknown";
  console.log(`\n  Publishing "${appName}" workflow (${DIFY_APP_ID})...\n`);

  const { data } = await difyApi(
    cookie,
    "POST",
    `/console/api/apps/${DIFY_APP_ID}/workflows/publish`,
    {}
  );

  console.log("\n✓ Workflow published successfully!");
  if (data?.created_at) console.log(`  Created at: ${data.created_at}`);
  if (data?.id) console.log(`  Version ID: ${data.id}`);
  console.log(`  App URL: ${DIFY_BASE_URL}/app/${DIFY_APP_ID}/workflow`);
  return data;
}

async function getDraft(cookie) {
  console.log(`\n  Fetching draft for app ${DIFY_APP_ID}...\n`);
  const { data } = await difyApi(
    cookie,
    "GET",
    `/console/api/apps/${DIFY_APP_ID}/workflows/draft`
  );

  // Show summary instead of raw dump
  const graph = data?.graph || {};
  const nodes = graph?.nodes || [];
  const edges = graph?.edges || [];
  console.log(`  Nodes: ${nodes.length}`);
  console.log(`  Edges: ${edges.length}`);
  nodes.forEach((n) => {
    console.log(`    [${n.id}] ${n.data?.title || n.data?.type || "?"} (${n.data?.type})`);
  });
  console.log("\n✓ Draft fetched.");
  return data;
}

async function exportApp(cookie) {
  console.log(`\n  Exporting DSL for app ${DIFY_APP_ID}...\n`);
  const { data } = await difyApi(
    cookie,
    "GET",
    `/console/api/apps/${DIFY_APP_ID}/export`
  );

  if (data?.data) {
    // Write to a file next to the existing workflow YAMLs
    const outPath = join(__dirname, "..", "docs", "dify-workflows", `exported-${appShorthand}.yml`);
    writeFileSync(outPath, data.data, "utf-8");
    console.log(`  Written to: ${outPath}`);
  } else {
    console.log(JSON.stringify(data, null, 2).slice(0, 3000));
  }
  console.log("\n✓ Export complete.");
  return data;
}

// ── Main ──────────────────────────────────────────────────────────────
const actions = { publish, draft: getDraft, export: exportApp };

if (!actions[action]) {
  console.error(`Unknown action: "${action}". Valid: ${Object.keys(actions).join(", ")}`);
  process.exit(1);
}

console.log(`\n🔧 dify-publish — action: ${action}, app: ${appShorthand}`);

try {
  const cookie = await getCookie();
  await actions[action](cookie);
} catch (err) {
  console.error(`\n✗ Error: ${err.message}`);
  if (err.cause) console.error("  Cause:", err.cause);
  process.exit(1);
}
