import Link from "next/link";
import { redirect } from "next/navigation";

import { SessionStatusCallout } from "../components/SessionStatusCallout";
import { SignInForm } from "../components/SignInForm";
import { SiteHeader } from "../components/SiteHeader";
import { isEmailSignedInUser, isGuestSession } from "@/lib/auth/session-kind";
import { SIGN_IN_GUEST_CONTEXT } from "@/lib/manifestations/intention-copy";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

function decodeExchangeMessage(raw: string | undefined): string | null {
  if (raw == null || !String(raw).trim()) {
    return null;
  }
  try {
    const decoded = decodeURIComponent(String(raw)).trim();
    if (!decoded || decoded === "{}") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

type Props = {  searchParams: Promise<{
    next?: string;
    error?: string;
    message?: string;
  }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const { next: nextRaw, error, message } = await searchParams;
  const next = safeNextPath(nextRaw);

  let guestOnSignIn = false;
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const user = await getServerAuthUser(supabase);
      if (isEmailSignedInUser(user)) {
        redirect(next);
      }
      guestOnSignIn = isGuestSession(user);
    }
  }

  let errorText: string | null = null;
  if (error === "missing_code") {
    errorText = "That sign-in link was incomplete. Request a new magic link.";
  } else if (error === "not_configured") {
    errorText = "Supabase is not configured in this environment.";
  } else if (error === "exchange") {
    const decoded = decodeExchangeMessage(message);
    errorText = decoded
      ? `Sign-in failed: ${decoded}`
      : "Sign-in failed after you used the email link. Supabase did not return a clear error (common with SMTP misconfiguration). In the dashboard: Authentication → check SMTP host/port/user/password and sender email; Authentication → URL configuration; then Authentication → Logs for the exact failure. Request a new magic link after fixing.";
  } else if (error) {    errorText = "Something went wrong during sign-in. Try again.";
  }

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            We&apos;ll email you a one-time link — no password to remember.
            After signing in, you&apos;ll return to{" "}
            <span className="font-medium text-stone-800 dark:text-stone-200">
              {next === "/" ? "home" : next}
            </span>
            .
          </p>
        </div>

        {errorText ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
          >
            {errorText}
          </p>
        ) : null}

        {guestOnSignIn ? (
          <>
            <SessionStatusCallout variant="guest" showSignInLink={false} />
            <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {SIGN_IN_GUEST_CONTEXT}
            </p>
          </>
        ) : null}

        <SignInForm nextPath={next} />

        <Link
          href={next}
          className="text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
        >
          ← Back without signing in
        </Link>
      </main>
    </div>
  );
}
