import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sql = readFileSync(resolve(process.cwd(), "supabase/schema.sql"), "utf8");

const endpoints = [
  `${url}/pg/query`,
  `${url}/pg-meta/default/query`,
  `${url}/pg-meta/query`,
];

async function tryRun(endpoint, body) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text, endpoint };
}

async function main() {
  console.log("Applying schema to", url);

  for (const endpoint of endpoints) {
    for (const body of [{ query: sql }, { sql }]) {
      try {
        const result = await tryRun(endpoint, body);
        console.log(endpoint, result.status, result.text.slice(0, 300));
        if (result.ok) {
          console.log("Schema applied via", endpoint);
          return;
        }
      } catch (err) {
        console.log("Failed", endpoint, err.message);
      }
    }
  }

  // Fallback: probe REST to see if tables already exist
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await admin.from("site_settings").select("key").limit(1);
  if (!error) {
    console.log("Tables already exist. Skipping SQL apply.");
    return;
  }

  console.error("Could not apply SQL automatically:", error.message);
  console.error("Open the Supabase SQL editor and run supabase/schema.sql, then re-run npm run db:setup");
  process.exit(2);
}

main();
