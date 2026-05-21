import { SAMPLE_MANIFESTATIONS } from "@/lib/manifestations/sample-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  Manifestation,
  ManifestationListRow,
} from "@/lib/types/manifestation";

export function formatSupabaseQueryError(error: {
  message: string;
  cause?: unknown;
}): string {
  const parts = [error.message.trim()];
  const { cause } = error;
  if (cause instanceof Error && cause.message) {
    parts.push(cause.message.trim());
  } else if (
    cause &&
    typeof cause === "object" &&
    "code" in cause &&
    typeof (cause as { code: unknown }).code === "string"
  ) {
    parts.push(`code ${(cause as { code: string }).code}`);
  }
  return parts.filter(Boolean).join(" — ");
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MANIFESTATION_SELECT =
  "id, created_at, user_id, title, intention, category, timeframe, join_count, ends_at, status, creator_reflection, creator_reflection_success, reflected_at";

const PHASE1_MIGRATION_HINT =
  "Run docs/supabase-phase1-lifecycle-migration.sql in the Supabase SQL Editor (adds ends_at and status).";

export type ManifestationSort = "newest" | "joined";

function sortManifestations(
  rows: ManifestationListRow[],
  sort: ManifestationSort,
): ManifestationListRow[] {
  const copy = [...rows];
  if (sort === "joined") {
    return copy.sort(
      (a, b) =>
        b.join_count - a.join_count ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
  return copy.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

type DbManifestationRow = Manifestation & { user_id: string };

function sampleListRows(sort: ManifestationSort): ManifestationListRow[] {
  const rows: ManifestationListRow[] = SAMPLE_MANIFESTATIONS.map((m) => ({
    ...m,
    viewer_has_joined: false,
    viewer_is_creator: false,
  }));
  return sortManifestations(rows, sort);
}

export async function listManifestations(sort: ManifestationSort): Promise<{
  rows: ManifestationListRow[];
  source: "live" | "sample";
  hint?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      source: "sample",
      rows: sampleListRows(sort),
      hint: "Add Supabase keys in .env.local to load real manifestations.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      source: "sample",
      rows: sampleListRows(sort),
      hint: "Could not create a Supabase client.",
    };
  }

  const { data, error } = await supabase
    .from("manifestations")
    .select(MANIFESTATION_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    const hint = error.message.includes("ends_at")
      ? `${PHASE1_MIGRATION_HINT} Error: ${formatSupabaseQueryError(error)}`
      : `Showing examples while Supabase returned an error: ${formatSupabaseQueryError(error)}`;
    return {
      source: "sample",
      rows: sampleListRows(sort),
      hint,
    };
  }

  const raw = (data ?? []) as DbManifestationRow[];

  if (raw.length === 0) {
    return { source: "live", rows: [] };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let joinedIds = new Set<string>();
  if (user) {
    const ids = raw.map((r) => r.id);
    const { data: joinRows, error: joinErr } = await supabase
      .from("manifestation_joins")
      .select("manifestation_id")
      .eq("user_id", user.id)
      .in("manifestation_id", ids);

    if (!joinErr && joinRows) {
      joinedIds = new Set(
        joinRows.map((j) => j.manifestation_id as string),
      );
    }
  }

  const rows: ManifestationListRow[] = raw.map((r) => {
    const { user_id: creatorId, ...rest } = r;
    return {
      ...rest,
      viewer_has_joined: joinedIds.has(r.id),
      viewer_is_creator: Boolean(user && user.id === creatorId),
    };
  });

  return { source: "live", rows: sortManifestations(rows, sort) };
}

/** Cheap server round-trip so create (and other pages) can show the same connectivity hints as the feed. */
export async function probeManifestationsTable(): Promise<{ hint?: string }> {
  if (!isSupabaseConfigured()) {
    return {};
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { hint: "Could not create a Supabase client." };
  }

  const { error } = await supabase
    .from("manifestations")
    .select("id")
    .limit(1);

  if (error) {
    return {
      hint: `Cannot reach Supabase or the manifestations table: ${formatSupabaseQueryError(error)}. Saving may fail until this is fixed.`,
    };
  }

  return {};
}

export async function getManifestationById(id: string): Promise<{
  row: Manifestation;
  source: "live" | "sample";
  hint?: string;
  viewer_has_joined: boolean;
  viewer_is_creator: boolean;
} | null> {
  const sample = SAMPLE_MANIFESTATIONS.find((m) => m.id === id);
  if (sample) {
    const hint = isSupabaseConfigured()
      ? "Example manifestation — not from your database."
      : undefined;
    return {
      row: sample,
      source: "sample",
      hint,
      viewer_has_joined: false,
      viewer_is_creator: false,
    };
  }

  if (!UUID_RE.test(id)) {
    return null;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("manifestations")
    .select(MANIFESTATION_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const db = data as DbManifestationRow;
  if (db.status === "deleted") {
    return null;
  }
  const { user_id: creatorId, ...row } = db;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let viewer_has_joined = false;
  if (user) {
    const { data: joinRow } = await supabase
      .from("manifestation_joins")
      .select("id")
      .eq("manifestation_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    viewer_has_joined = Boolean(joinRow);
  }

  return {
    row,
    source: "live",
    viewer_has_joined,
    viewer_is_creator: Boolean(user && user.id === creatorId),
  };
}
