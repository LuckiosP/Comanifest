import { getModerationReviewEmail } from "@/lib/moderation/config";

/** Comma-separated allowlist in ADMIN_OPERATOR_EMAILS; falls back to moderation review inbox. */
export function getAdminOperatorEmails(): string[] {
  const raw = process.env.ADMIN_OPERATOR_EMAILS?.trim();
  const fromEnv = raw
    ? raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [];

  if (fromEnv.length > 0) {
    return [...new Set(fromEnv)];
  }

  const fallback = getModerationReviewEmail().trim().toLowerCase();
  return fallback ? [fallback] : [];
}

export function isAdminDashboardConfigured(): boolean {
  return getAdminOperatorEmails().length > 0;
}
