import { accountEmailLabel } from "@/lib/auth/session-kind";
import {
  assessManifestationContent,
  formatModerationFlagReason,
} from "@/lib/moderation/content-filter";
import { sendModerationReviewRequestEmail } from "@/lib/moderation/emails";
import { storeModerationReviewToken } from "@/lib/moderation/review-tokens";
import type { ManifestationCategory } from "@/lib/types/manifestation";
import type { User } from "@supabase/supabase-js";

export async function queuePendingModerationReview(options: {
  manifestationId: string;
  title: string;
  intention: string;
  category: ManifestationCategory;
  flaggedReason: string;
  creator: User;
}): Promise<void> {
  const token = await storeModerationReviewToken(options.manifestationId);
  if (!token) {
    return;
  }

  await sendModerationReviewRequestEmail(
    {
      manifestationId: options.manifestationId,
      title: options.title,
      intention: options.intention,
      category: options.category,
      creatorEmail: accountEmailLabel(options.creator),
    },
    token,
    options.flaggedReason,
  );
}

export function resolveInitialManifestationStatus(
  title: string,
  intention: string,
): { status: "active" | "pending"; flaggedReason: string | null } {
  const assessment = assessManifestationContent(title, intention);
  if (!assessment.flagged) {
    return { status: "active", flaggedReason: null };
  }

  return {
    status: "pending",
    flaggedReason: formatModerationFlagReason(assessment.reasons),
  };
}
