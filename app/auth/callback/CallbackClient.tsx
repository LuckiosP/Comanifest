"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { formatAuthError } from "@/lib/auth/format-auth-error";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    const code = searchParams.get("code");
    const next = safeNextPath(searchParams.get("next"));

    if (!isSupabaseConfigured()) {
      router.replace("/sign-in?error=not_configured");
      return;
    }

    if (!code) {
      router.replace("/sign-in?error=missing_code");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      router.replace("/sign-in?error=not_configured");
      return;
    }

    let cancelled = false;

    void (async () => {
      // `createBrowserClient` enables `detectSessionInUrl` by default, so auth
      // `initialize()` already exchanges `?code=` once and clears the PKCE
      // verifier. Calling `exchangeCodeForSession` again triggers
      // "PKCE code verifier not found in storage".
      const { error: initError } = await supabase.auth.initialize();
      if (cancelled) return;

      if (initError) {
        const detail = formatAuthError(initError);
        const msg = encodeURIComponent(detail.slice(0, 400));
        router.replace(`/sign-in?error=exchange&message=${msg}`);
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionError || !session) {
        const fallback =
          "Could not establish a session after sign-in. Try requesting a new magic link.";
        router.replace(
          `/sign-in?error=exchange&message=${encodeURIComponent(fallback)}`,
        );
        return;
      }

      setMessage("Redirecting…");
      router.replace(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <p className="text-center text-sm text-stone-600 dark:text-stone-300">
      {message}
    </p>
  );
}

export function AuthCallbackClient() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-stone-600 dark:text-stone-300">
          Loading…
        </p>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
