"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  sendSignInEmail,
  signInEmailSuccessMessage,
} from "@/lib/auth/sign-in-flow";
import {
  accountEmailLabel,
  isGuestSession,
} from "@/lib/auth/session-kind";
import {
  SIGN_IN_ALREADY_SIGNED_IN,
  SIGN_IN_GUEST_CONTEXT,
} from "@/lib/manifestations/intention-copy";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type SignInFormProps = {
  nextPath: string;
};

export function SignInForm({ nextPath }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const configured = isSupabaseConfigured();
  const next = nextPath;

  useEffect(() => {
    if (!configured) {
      setCheckingSession(false);
      return;
    }

    let cancelled = false;
    void (async () => {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        if (!cancelled) setCheckingSession(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setSignedInEmail(accountEmailLabel(user));
      setIsGuest(isGuestSession(user));
      setCheckingSession(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [configured]);

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

    const result = await sendSignInEmail(supabase, trimmed, redirectTo);
    setPending(false);

    if (!result.ok) {
      const lower = result.message.toLowerCase();
      if (lower.includes("rate limit") || lower.includes("email rate")) {
        setFormError(
          "Supabase is temporarily limiting how many sign-in emails this project can send (this often happens while testing magic links). Wait a bit, avoid clicking “Send magic link” many times in a row, or add custom SMTP under Supabase → Authentication → Settings so mail isn’t as restricted.",
        );
        return;
      }
      if (lower.includes("already signed in")) {
        setSignedInEmail(trimmed);
      }
      setFormError(result.message);
      return;
    }

    setInfo(signInEmailSuccessMessage(result.mode));
    if (result.mode === "existing-account") {
      setIsGuest(false);
      router.refresh();
    }
  }

  if (!configured) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        Add your Supabase URL and anon key to <code className="rounded bg-white/60 px-1 dark:bg-stone-900">.env.local</code>{" "}
        first, then reload this page.
      </p>
    );
  }

  if (checkingSession) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400">Checking session…</p>
    );
  }

  if (signedInEmail) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
        <p>
          {SIGN_IN_ALREADY_SIGNED_IN}{" "}
          <span className="font-medium">{signedInEmail}</span>.
        </p>
        <Link
          href={next}
          className="font-medium text-violet-800 underline-offset-2 hover:underline dark:text-violet-300"
        >
          Continue to {next === "/" ? "home" : next} →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isGuest ? (
        <p className="rounded-xl border border-violet-200/80 bg-violet-50/70 px-3 py-2 text-sm text-violet-950 dark:border-violet-900/50 dark:bg-violet-950/25 dark:text-violet-100">
          {SIGN_IN_GUEST_CONTEXT}
        </p>
      ) : null}

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
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        {pending ? "Sending link…" : "Send magic link"}
      </button>
    </form>
  );
}
