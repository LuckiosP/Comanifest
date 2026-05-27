import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.log(JSON.stringify({ error: "no .env.local" }));
  process.exit(1);
}

for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!url || !key) {
  console.log(
    JSON.stringify({ error: "missing Supabase URL or key in .env.local" }),
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const m = await supabase.from("manifestations").select("creator_country").limit(1);
const j = await supabase.from("manifestation_joins").select("holder_country").limit(1);

const columnMissing = (err) =>
  err?.code === "42703" ||
  /creator_country|holder_country/i.test(err?.message ?? "");

let migrationApplied = true;
if (columnMissing(m.error) || columnMissing(j.error)) {
  migrationApplied = false;
} else if (m.error || j.error) {
  migrationApplied = "unknown";
}

let rowsWithCreatorCountry = null;
let rowsWithHolderCountry = null;

if (migrationApplied === true) {
  const c1 = await supabase
    .from("manifestations")
    .select("id", { count: "exact", head: true })
    .not("creator_country", "is", null);
  const c2 = await supabase
    .from("manifestation_joins")
    .select("id", { count: "exact", head: true })
    .not("holder_country", "is", null);
  rowsWithCreatorCountry = c1.count ?? 0;
  rowsWithHolderCountry = c2.count ?? 0;
}

console.log(
  JSON.stringify(
    {
      projectUrl: url.replace(/\/$/, ""),
      migrationApplied,
      manifestations: m.error
        ? { ok: false, code: m.error.code, message: m.error.message }
        : { ok: true },
      joins: j.error
        ? { ok: false, code: j.error.code, message: j.error.message }
        : { ok: true },
      rowsWithCreatorCountry,
      rowsWithHolderCountry,
    },
    null,
    2,
  ),
);
