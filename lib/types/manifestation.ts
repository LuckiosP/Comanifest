export type ManifestationCategory =
  | "weather"
  | "global"
  | "personal"
  | "sports"
  | "wellbeing"
  | "symbolic"
  | "other";

export type ManifestationStatus = "active" | "pending" | "archived" | "deleted";

export type Manifestation = {
  id: string;
  created_at: string;
  title: string;
  intention: string;
  category: ManifestationCategory;
  timeframe: string | null;
  join_count: number;
  ends_at: string;
  status: ManifestationStatus;
  creator_reflection: string | null;
  creator_reflection_success: boolean | null;
  reflected_at: string | null;
  moderation_flagged_reason: string | null;
  moderation_reviewed_at: string | null;
  moderation_reviewed_by: string | null;
  moderation_decline_feedback: string | null;
  /** ISO country at create; operator aggregates only — not shown in public UI. */
  creator_country?: string | null;
};

/** Feed/detail row with server-computed viewer flags (no `user_id` exposed). */
export type ManifestationListRow = Manifestation & {
  viewer_has_joined: boolean;
  viewer_is_creator: boolean;
};

export const MANIFESTATION_STATUS_LABELS: Record<ManifestationStatus, string> = {
  active: "Active",
  pending: "Awaiting review",
  archived: "Archived",
  deleted: "Deleted",
};

export const MANIFESTATION_CATEGORY_LABELS: Record<
  ManifestationCategory,
  string
> = {
  weather: "Weather & seasons",
  global: "Global & peace",
  personal: "Personal milestones",
  sports: "Sports & play",
  wellbeing: "Calm & wellbeing",
  symbolic: "Symbolic & creative",
  other: "Other",
};
