export type ManifestationCategory =
  | "weather"
  | "global"
  | "personal"
  | "sports"
  | "wellbeing"
  | "symbolic"
  | "other";

export type Manifestation = {
  id: string;
  created_at: string;
  title: string;
  intention: string;
  category: ManifestationCategory;
  timeframe: string | null;
  join_count: number;
};

/** Feed/detail row with server-computed viewer flags (no `user_id` exposed). */
export type ManifestationListRow = Manifestation & {
  viewer_has_joined: boolean;
  viewer_is_creator: boolean;
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
