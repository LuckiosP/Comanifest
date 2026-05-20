import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./config";
import "./prefer-ipv4-dns";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function createServerSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    return null;
  }

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component without mutable cookies — middleware refreshes session.
          }
        },
      },
    },
  );
}

/**
 * Prefer `getUser()` (validates JWT with Supabase). If there is no user, fall back to
 * `getSession()` from cookies so inserts still work when the auth API round-trip fails
 * (e.g. transient network/TLS) but the browser session is present.
 */
export async function getServerAuthUser(
  supabase: SupabaseClient,
): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return user;
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}
