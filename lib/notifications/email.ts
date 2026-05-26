import { manifestationPublicUrl } from "@/lib/site-url";

import {
  getNotificationFromEmail,
  getNotificationReplyToEmail,
  getResendApiKey,
  isEmailNotificationsConfigured,
} from "./config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail(
  input: SendEmailInput,
): Promise<{ ok: boolean; error?: string }> {
  if (!isEmailNotificationsConfigured()) {
    return { ok: false, error: "Email is not configured." };
  }

  const replyTo = getNotificationReplyToEmail();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getResendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getNotificationFromEmail(),
      reply_to: replyTo,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: body || response.statusText };
  }

  return { ok: true };
}

export function buildInstantHoldEmailHtml(options: {
  title: string;
  joinCount: number;
  manifestationId: string;
}): string {
  const url = manifestationPublicUrl(options.manifestationId);
  return `
    <p>Someone new is holding your manifestation <strong>${escapeHtml(options.title)}</strong>.</p>
    <p>${options.joinCount} ${options.joinCount === 1 ? "person is" : "people are"} holding it now.</p>
    <p><a href="${url}">View on Comanifest</a></p>
    <p style="color:#666;font-size:12px;">Private commitment notes are never included in these emails.</p>
  `.trim();
}

export function buildDigestHoldEmailHtml(options: {
  frequency: "daily" | "weekly";
  items: Array<{ title: string; joinCount: number; manifestationId: string }>;
}): string {
  const intro =
    options.frequency === "daily"
      ? "Here is your daily hold update:"
      : "Here is your weekly hold update:";
  const rows = options.items
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.title)}</strong> — ${item.joinCount} holding · <a href="${manifestationPublicUrl(item.manifestationId)}">View</a></li>`,
    )
    .join("");

  return `
    <p>${intro}</p>
    <ul>${rows}</ul>
    <p style="color:#666;font-size:12px;">Change frequency anytime in My account on Comanifest.</p>
  `.trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
