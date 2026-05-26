import type { ManifestationCategory } from "@/lib/types/manifestation";

export type ModerationReviewResult =
  | { ok: true; manifestationId: string; title: string }
  | { ok: false; error: string };

export type ModerationFlagResult = {
  flagged: boolean;
  reasons: string[];
};

export type ModerationManifestationFields = {
  moderation_flagged_reason: string | null;
  moderation_reviewed_at: string | null;
  moderation_reviewed_by: string | null;
  moderation_decline_feedback: string | null;
};

export type ModerationReviewInput = {
  manifestationId: string;
  title: string;
  intention: string;
  category: ManifestationCategory;
  creatorEmail?: string | null;
};
