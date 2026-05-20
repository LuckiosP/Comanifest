/**
 * Supabase Auth errors sometimes omit `message` or send placeholders.
 * Never return an empty or "{}" string for UI.
 */
export function formatAuthError(
  error: {
    message?: string;
    status?: number;
    code?: string;
    name?: string;
  } | null,
): string {
  if (!error) {
    return "Unknown authentication error.";
  }

  const msg =
    typeof error.message === "string" ? error.message.trim() : "";
  if (msg && msg !== "{}") {
    const trimmed = msg.slice(0, 400);
    if (/flow state/i.test(trimmed)) {
      return `${trimmed} If you clicked “Send magic link” more than once, open only the newest email and use that link once, in the same browser where you requested it.`;
    }
    return trimmed;
  }

  const parts: string[] = [];
  if (error.code != null && String(error.code).trim()) {
    parts.push(`code ${error.code}`);
  }
  if (error.status != null) {
    parts.push(`status ${error.status}`);
  }
  if (parts.length > 0) {
    return `Authentication failed (${parts.join(", ")}). Check Supabase → Authentication → Logs for details.`;
  }

  return "Authentication failed, but Supabase did not return a message. Open Supabase → Authentication → Logs around the time of the attempt, and verify SMTP + redirect URLs.";
}
