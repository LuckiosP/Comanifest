import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ensures the browser has a Supabase session, creating an anonymous user if needed.
 * When the project uses CAPTCHA for anonymous sign-in, pass the Turnstile token.
 */
export async function ensureAnonymousBrowserSession(
  supabase: SupabaseClient,
  captchaToken?: string | null,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    return { ok: true };
  }
  const { error } = await supabase.auth.signInAnonymously(
    captchaToken ? { options: { captchaToken } } : undefined,
  );
  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true };
}
