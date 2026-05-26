import { getPublicSiteUrl, manifestationPublicUrl } from "@/lib/site-url";
import { sendTransactionalEmail } from "@/lib/notifications/email";
import { MANIFESTATION_CATEGORY_LABELS } from "@/lib/types/manifestation";

import { getModerationReviewEmail } from "./config";
import type { ModerationReviewInput } from "./types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendModerationReviewRequestEmail(
  input: ModerationReviewInput,
  token: string,
  flaggedReason: string,
): Promise<{ ok: boolean; error?: string }> {
  const siteUrl = getPublicSiteUrl();
  const approveUrl = `${siteUrl}/moderation/approve?token=${encodeURIComponent(token)}`;
  const declineUrl = `${siteUrl}/moderation/decline?token=${encodeURIComponent(token)}`;
  const detailUrl = manifestationPublicUrl(input.manifestationId);
  const category =
    MANIFESTATION_CATEGORY_LABELS[input.category] ?? input.category;

  const html = `
    <p>A new manifestation needs review before it can appear in the public feed.</p>
    <p><strong>${escapeHtml(input.title)}</strong></p>
    <p>${escapeHtml(input.intention)}</p>
    <p>Category: ${escapeHtml(category)}</p>
    <p>Flag reason: ${escapeHtml(flaggedReason)}</p>
    ${input.creatorEmail ? `<p>Creator email: ${escapeHtml(input.creatorEmail)}</p>` : ""}
    <p><a href="${detailUrl}">Preview (creator-only until approved)</a></p>
    <p>
      <a href="${approveUrl}">Approve</a>
      ·
      <a href="${declineUrl}">Decline with optional feedback</a>
    </p>
    <p style="color:#666;font-size:12px;">Review links expire in 7 days.</p>
  `.trim();

  return sendTransactionalEmail({
    to: getModerationReviewEmail(),
    subject: `Review manifestation: ${input.title}`,
    html,
  });
}

export async function sendModerationDeclinedEmailToCreator(options: {
  to: string;
  title: string;
  feedback?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  const feedbackBlock = options.feedback?.trim()
    ? `<p><strong>Note from review:</strong> ${escapeHtml(options.feedback.trim())}</p>`
    : "";

  const html = `
    <p>Thanks for sharing your manifestation <strong>${escapeHtml(options.title)}</strong> on Comanifest.</p>
    <p>After a gentle review, we are not publishing it in the public feed right now. This is not a judgment of you — only a check that the wording fits our community guidelines.</p>
    ${feedbackBlock}
    <p>You can edit and submit a new manifestation anytime from your account.</p>
    <p style="color:#666;font-size:12px;">Questions? Reply to this email if you need help.</p>
  `.trim();

  return sendTransactionalEmail({
    to: options.to,
    subject: `Update on your manifestation “${options.title}”`,
    html,
  });
}

export async function sendModerationApprovedEmailToCreator(options: {
  to: string;
  title: string;
  manifestationId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const url = manifestationPublicUrl(options.manifestationId);
  const html = `
    <p>Good news — your manifestation <strong>${escapeHtml(options.title)}</strong> is now live on Comanifest.</p>
    <p><a href="${url}">View and share it</a></p>
  `.trim();

  return sendTransactionalEmail({
    to: options.to,
    subject: `Your manifestation “${options.title}” is live`,
    html,
  });
}
