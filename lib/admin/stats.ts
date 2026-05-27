import type { SupabaseClient } from "@supabase/supabase-js";

import { countByKey, rowsInLastDays } from "@/lib/admin/aggregate";
import type { AdminDashboardStats, AdminStatsFetchResult } from "@/lib/admin/types";
import { ADMIN_CATEGORY_ORDER, ADMIN_STATUS_ORDER } from "@/lib/admin/types";
import {
  MANIFESTATION_CATEGORY_LABELS,
  MANIFESTATION_STATUS_LABELS,
} from "@/lib/types/manifestation";
import type { ManifestationCategory, ManifestationStatus } from "@/lib/types/manifestation";

const AUTH_USER_PAGE_SIZE = 200;
const AUTH_USER_MAX_PAGES = 50;
const ANALYTICS_MAX_ROWS = 5000;

type AnalyticsEventRow = {
  event_type: "pageview" | "event" | string;
  session_id: number | null;
  path: string | null;
  timestamp: string;
};

type ManifestationStatsRow = {
  status: ManifestationStatus;
  category: ManifestationCategory;
  creator_country: string | null;
  created_at: string;
  reflected_at: string | null;
};

type JoinStatsRow = {
  holder_country: string | null;
  created_at: string;
  user_id: string;
};

function orderedBreakdown<T extends string>(
  order: readonly T[],
  counts: Map<string, number>,
  labels: Record<T, string>,
): { key: string; label: string; count: number }[] {
  const seen = new Set<string>();
  const rows: { key: string; label: string; count: number }[] = [];

  for (const key of order) {
    seen.add(key);
    rows.push({
      key,
      label: labels[key],
      count: counts.get(key) ?? 0,
    });
  }

  for (const [key, count] of counts) {
    if (!seen.has(key)) {
      rows.push({ key, label: key, count });
    }
  }

  return rows;
}

async function fetchAuthUserCounts(
  supabase: SupabaseClient,
): Promise<AdminDashboardStats["authUsers"]> {
  let total = 0;
  let emailSignedIn = 0;
  let guestOnly = 0;
  let capped = false;

  for (let page = 1; page <= AUTH_USER_MAX_PAGES; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: AUTH_USER_PAGE_SIZE,
    });

    if (error) {
      return null;
    }

    const users = data.users;
    if (users.length === 0) {
      break;
    }

    for (const user of users) {
      total++;
      const hasConfirmedEmail =
        Boolean(user.email?.trim()) &&
        (!user.is_anonymous || Boolean(user.email_confirmed_at));

      if (hasConfirmedEmail) {
        emailSignedIn++;
      } else if (user.is_anonymous) {
        guestOnly++;
      }
    }

    if (users.length < AUTH_USER_PAGE_SIZE) {
      break;
    }

    if (page === AUTH_USER_MAX_PAGES) {
      capped = true;
    }
  }

  return { total, emailSignedIn, guestOnly, capped };
}

export async function fetchAdminDashboardStats(
  supabase: SupabaseClient,
): Promise<AdminStatsFetchResult> {
  const cutoffIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [manifestResult, joinsResult, trafficResult] = await Promise.all([
    supabase
      .from("manifestations")
      .select("status, category, creator_country, created_at, reflected_at, user_id"),
    supabase
      .from("manifestation_joins")
      .select("holder_country, created_at, user_id"),
    supabase
      .from("vercel_analytics_events")
      .select("event_type, session_id, path, timestamp")
      .gte("timestamp", cutoffIso)
      .limit(ANALYTICS_MAX_ROWS),
  ]);

  if (manifestResult.error) {
    return { ok: false, error: manifestResult.error.message };
  }
  if (joinsResult.error) {
    return { ok: false, error: joinsResult.error.message };
  }

  const manifestRows = (manifestResult.data ?? []) as (ManifestationStatsRow & {
    user_id: string;
  })[];
  const joinRows = (joinsResult.data ?? []) as JoinStatsRow[];

  const traffic = (() => {
    if (trafficResult.error) {
      // Table likely missing until the drain migration is run.
      return {
        pageviewsLast7Days: 0,
        visitorsLast7Days: 0,
        topPagesLast7Days: [],
        missing: true,
        capped: false,
      } satisfies NonNullable<AdminDashboardStats["traffic"]>;
    }

    const rows = (trafficResult.data ?? []) as AnalyticsEventRow[];
    const capped = rows.length >= ANALYTICS_MAX_ROWS;

    const pageviews = rows.filter((r) => r.event_type === "pageview");
    const visitorIds = new Set<number>();
    const byPath = new Map<string, number>();

    for (const row of pageviews) {
      if (row.session_id != null) {
        visitorIds.add(row.session_id);
      }
      const path = row.path?.trim() || "/";
      byPath.set(path, (byPath.get(path) ?? 0) + 1);
    }

    const topPagesLast7Days = [...byPath.entries()]
      .map(([key, count]) => ({ key, label: key, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 8);

    return {
      pageviewsLast7Days: pageviews.length,
      visitorsLast7Days: visitorIds.size,
      topPagesLast7Days,
      missing: false,
      capped,
    } satisfies NonNullable<AdminDashboardStats["traffic"]>;
  })();

  const statusCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  let pendingReview = 0;
  let closedWithReflection = 0;
  const creatorIds = new Set<string>();

  for (const row of manifestRows) {
    statusCounts.set(row.status, (statusCounts.get(row.status) ?? 0) + 1);
    categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
    if (row.status === "pending") {
      pendingReview++;
    }
    if (row.reflected_at) {
      closedWithReflection++;
    }
    creatorIds.add(row.user_id);
  }

  const holderIds = new Set(joinRows.map((r) => r.user_id));
  const participantIds = new Set([...creatorIds, ...holderIds]);

  const authUsers = await fetchAuthUserCounts(supabase);

  const stats: AdminDashboardStats = {
    generatedAt: new Date().toISOString(),
    overview: {
      manifestations: manifestRows.length,
      holds: joinRows.length,
      pendingReview,
      closedWithReflection,
      manifestationsLast7Days: rowsInLastDays(
        manifestRows.map((r) => r.created_at),
        7,
      ),
      holdsLast7Days: rowsInLastDays(joinRows.map((r) => r.created_at), 7),
    },
    traffic,
    byStatus: orderedBreakdown(
      ADMIN_STATUS_ORDER,
      statusCounts,
      MANIFESTATION_STATUS_LABELS,
    ),
    byCategory: orderedBreakdown(
      ADMIN_CATEGORY_ORDER,
      categoryCounts,
      MANIFESTATION_CATEGORY_LABELS,
    ),
    creatorCountries: countByKey(
      manifestRows.map((r) => r.creator_country),
      { limit: 12 },
    ),
    holderCountries: countByKey(
      joinRows.map((r) => r.holder_country),
      { limit: 12 },
    ),
    participants: {
      distinctCreators: creatorIds.size,
      distinctHolders: holderIds.size,
      distinctParticipants: participantIds.size,
    },
    authUsers,
  };

  return { ok: true, stats };
}
