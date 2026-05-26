import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ManifestationListRow } from "@/lib/types/manifestation";

import {
  formatSupabaseQueryError,
  type ManifestationSort,
} from "./queries";

const MANIFESTATION_SELECT =
  "id, created_at, user_id, title, intention, category, timeframe, join_count, ends_at, status, creator_reflection, creator_reflection_success, reflected_at, moderation_flagged_reason, moderation_reviewed_at, moderation_reviewed_by, moderation_decline_feedback";

const PHASE1_MIGRATION_HINT =
  "Run docs/supabase-phase1-lifecycle-migration.sql in the Supabase SQL Editor.";

type DbManifestationRow = ManifestationListRow & { user_id: string };

function sortRows(
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

function toListRow(
  row: DbManifestationRow,
  userId: string,
  joinedIds: Set<string>,
): ManifestationListRow {
  const { user_id: creatorId, ...rest } = row;
  return {
    ...rest,
    viewer_has_joined: joinedIds.has(row.id),
    viewer_is_creator: creatorId === userId,
  };
}

export type AccountManifestationsResult = {
  created: ManifestationListRow[];
  holding: ManifestationListRow[];
  hint?: string;
};

export async function listAccountManifestations(
  userId: string,
  sort: ManifestationSort = "newest",
): Promise<AccountManifestationsResult> {
  if (!isSupabaseConfigured()) {
    return {
      created: [],
      holding: [],
      hint: "Add Supabase keys in .env.local to load your manifestations.",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      created: [],
      holding: [],
      hint: "Could not create a Supabase client.",
    };
  }

  const { data: createdRaw, error: createdErr } = await supabase
    .from("manifestations")
    .select(MANIFESTATION_SELECT)
    .eq("user_id", userId)
    .neq("status", "deleted")
    .order("created_at", { ascending: false });

  if (createdErr) {
    const hint = createdErr.message.includes("ends_at")
      ? `${PHASE1_MIGRATION_HINT} ${formatSupabaseQueryError(createdErr)}`
      : formatSupabaseQueryError(createdErr);
    return { created: [], holding: [], hint };
  }

  const { data: joinRows, error: joinErr } = await supabase
    .from("manifestation_joins")
    .select("manifestation_id")
    .eq("user_id", userId);

  if (joinErr) {
    return {
      created: [],
      holding: [],
      hint: formatSupabaseQueryError(joinErr),
    };
  }

  const heldIds = (joinRows ?? []).map(
    (row) => row.manifestation_id as string,
  );

  let holdingRaw: DbManifestationRow[] = [];
  if (heldIds.length > 0) {
    const { data: heldData, error: heldErr } = await supabase
      .from("manifestations")
      .select(MANIFESTATION_SELECT)
      .in("id", heldIds)
      .neq("status", "deleted");

    if (heldErr) {
      return {
        created: [],
        holding: [],
        hint: formatSupabaseQueryError(heldErr),
      };
    }

    holdingRaw = (heldData ?? []) as DbManifestationRow[];
  }

  const joinedIds = new Set(heldIds);
  const created = sortRows(
    ((createdRaw ?? []) as DbManifestationRow[]).map((row) =>
      toListRow(row, userId, joinedIds),
    ),
    sort,
  );
  const holding = sortRows(
    holdingRaw.map((row) => toListRow(row, userId, joinedIds)),
    sort,
  );

  return { created, holding };
}
