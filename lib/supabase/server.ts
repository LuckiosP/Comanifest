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

/** Validates the session JWT with Supabase Auth (no cookie-only fallback). */
export async function getServerAuthUser(
  supabase: SupabaseClient,
): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}
