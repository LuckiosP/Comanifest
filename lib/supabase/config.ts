/** Strip BOM / whitespace so `.env.local` parses reliably (Windows editors sometimes add BOM). */
function normalizeEnvValue(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const trimmed = value.replace(/^\uFEFF/, "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getSupabaseUrl(): string | undefined {
  return normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string | undefined {
  return normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Cloudflare Turnstile site key (public). Pair with Supabase Auth → CAPTCHA protection. */
export function getTurnstileSiteKey(): string | undefined {
  return normalizeEnvValue(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
