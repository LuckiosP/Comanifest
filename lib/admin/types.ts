import type { ManifestationCategory, ManifestationStatus } from "@/lib/types/manifestation";

export type AdminBreakdownRow = {
  key: string;
  label: string;
  count: number;
};

export type AdminDashboardStats = {
  generatedAt: string;
  overview: {
    manifestations: number;
    holds: number;
    pendingReview: number;
    closedWithReflection: number;
    manifestationsLast7Days: number;
    holdsLast7Days: number;
  };
  traffic: {
    /** Number of pageview events captured via Vercel Analytics Drains. */
    pageviewsLast7Days: number;
    /** Approx unique visitors (distinct sessionId) over last 7 days. */
    visitorsLast7Days: number;
    topPagesLast7Days: AdminBreakdownRow[];
    /** Whether traffic data is missing because drain isn’t configured yet. */
    missing: boolean;
    /** Whether the dataset was capped for performance. */
    capped: boolean;
  } | null;
  byStatus: AdminBreakdownRow[];
  byCategory: AdminBreakdownRow[];
  creatorCountries: AdminBreakdownRow[];
  holderCountries: AdminBreakdownRow[];
  participants: {
    distinctCreators: number;
    distinctHolders: number;
    distinctParticipants: number;
  };
  authUsers: {
    total: number;
    emailSignedIn: number;
    guestOnly: number;
    capped: boolean;
  } | null;
};

export type AdminStatsFetchResult =
  | { ok: true; stats: AdminDashboardStats }
  | { ok: false; error: string };

export const ADMIN_STATUS_ORDER: ManifestationStatus[] = [
  "active",
  "pending",
  "archived",
  "deleted",
];

export const ADMIN_CATEGORY_ORDER: ManifestationCategory[] = [
  "weather",
  "global",
  "personal",
  "sports",
  "wellbeing",
  "symbolic",
  "other",
];
