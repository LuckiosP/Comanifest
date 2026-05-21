"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { formatAuthError } from "@/lib/auth/format-auth-error";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type SignInFormProps = {
  nextPath: string;
};

export function SignInForm({ nextPath }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();
  const next = safeNextPath(nextPath);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setInfo(null);

    if (!configured) {
      setFormError("Supabase is not configured (.env.local).");
      return;
    }

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setFormError("Enter a valid email address.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setFormError("Could not create the Supabase client.");
      return;
    }

    setPending(true);
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const isAnonymousGuest = Boolean(session?.user?.is_anonymous);

    if (session?.user && !session.user.is_anonymous) {
      setPending(false);
      setFormError(
        "You are already signed in with email. Sign out first if you need a different account.",
      );
      return;
    }

    const { error } = isAnonymousGuest
      ? await supabase.auth.updateUser(
          { email: trimmed },
          { emailRedirectTo: redirectTo },
        )
      : await supabase.auth.signInWithOtp({
          email: trimmed,
          options: {
            emailRedirectTo: redirectTo,
            shouldCreateUser: true,
          },
        });
    setPending(false);

    if (error) {
      const raw = formatAuthError(error);
      const lower = raw.toLowerCase();
      if (lower.includes("rate limit") || lower.includes("email rate")) {
        setFormError(
          "Supabase is temporarily limiting how many sign-in emails this project can send (this often happens while testing magic links). Wait a bit, avoid clicking “Send magic link” many times in a row, or add custom SMTP under Supabase → Authentication → Settings so mail isn’t as restricted.",
        );
        return;
      }
      if (
        isAnonymousGuest &&
        (lower.includes("already") ||
          lower.includes("registered") ||
          lower.includes("exists"))
      ) {
        setFormError(
          "That email already has an account. Sign out, open Sign in again without browsing as a guest first, and request a magic link — or contact support to merge guest manifestations.",
        );
        return;
      }
      setFormError(raw);
      return;
    }

    setInfo(
      isAnonymousGuest
        ? "Check your inbox for a confirmation link. Open it in this same browser so your guest manifestations stay on this account."
        : "Check your inbox for a sign-in link. If nothing arrives in a minute, look in spam, or confirm Email auth is enabled in your Supabase project.",
    );
  }

  if (!configured) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        Add your Supabase URL and anon key to <code className="rounded bg-white/60 px-1 dark:bg-stone-900">.env.local</code>{" "}
        first, then reload this page.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {formError}
        </p>
      ) : null}
      {info ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
          {info}
        </p>
      ) : null}

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
          placeholder="you@example.com"
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        {pending ? "Sending link…" : "Send magic link"}
      </button>

      <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
        If you manifested or held something as a guest, stay in this browser,
        then sign in here — we attach your email to the same guest account so
        your manifestations stay yours. Opening the link in a different browser
        can split accounts.
      </p>
    </form>
  );
}
