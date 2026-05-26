import { createClient } from "@supabase/supabase-js";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

export function createServiceSupabaseClient() {
  const url = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isEmailNotificationsConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.NOTIFICATION_FROM_EMAIL?.trim(),
  );
}

export function getNotificationFromEmail(): string | undefined {
  return process.env.NOTIFICATION_FROM_EMAIL?.trim();
}

/** Where replies to transactional mail should go (hello@ inbox, not the send-only From address). */
export function getNotificationReplyToEmail(): string {
  return (
    process.env.NOTIFICATION_REPLY_TO_EMAIL?.trim() ||
    process.env.MODERATION_REVIEW_EMAIL?.trim() ||
    "hello@comanifest.org"
  );
}

export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim();
}
