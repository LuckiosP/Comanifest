"use client";

import { useActionState, useCallback, useEffect, useState } from "react";

import {
  createManifestation,
  type CreateManifestationState,
} from "@/app/actions/manifestations";
import { SimilarManifestationsPanel } from "@/app/components/SimilarManifestationsPanel";
import { TurnstileCaptchaRow } from "@/app/components/TurnstileCaptchaRow";
import { ensureAnonymousBrowserSession } from "@/lib/auth/ensure-anonymous-browser-session";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getTurnstileSiteKey, isSupabaseConfigured } from "@/lib/supabase/config";
import {
  MANIFEST_ENDS_LABEL,
  MANIFEST_SUBMIT,
  MANIFEST_SUBMIT_PENDING,
} from "@/lib/manifestations/intention-copy";
import { localTodayDateInputValue } from "@/lib/manifestations/dates";
import {
  MANIFESTATION_CATEGORY_LABELS,
  type ManifestationCategory,
} from "@/lib/types/manifestation";

const initialState: CreateManifestationState = {};

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

export function CreateManifestationForm() {
  const [state, formAction, pending] = useActionState(
    createManifestation,
    initialState,
  );
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured());
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [intention, setIntention] = useState("");
  const turnstileSiteKey = getTurnstileSiteKey();

  const onCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        if (!cancelled) {
          setAuthReady(false);
          setAuthError("Could not create the Supabase browser client.");
        }
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        setAuthReady(true);
        setAuthError(null);
        return;
      }

      if (turnstileSiteKey && !captchaToken) {
        if (!cancelled) {
          setAuthReady(false);
          setAuthError(null);
        }
        return;
      }

      const result = await ensureAnonymousBrowserSession(supabase, captchaToken);
      if (cancelled) return;
      if (!result.ok) {
        setAuthReady(false);
        const msg = result.message.toLowerCase();
        if (msg.includes("anonymous") && msg.includes("disabled")) {
          setAuthError(
            "Anonymous sign-ins are off in your Supabase project. In the dashboard: Authentication → Providers → enable Anonymous, then click “Try again” below.",
          );
        } else if (msg.includes("captcha")) {
          setAuthError(
            turnstileSiteKey
              ? "Security check failed or expired. Click “Try again” below."
              : "Supabase CAPTCHA is enabled but this app has no Turnstile site key. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env.local (see .env.example), then try again.",
          );
        } else {
          setAuthError(`Could not start a session: ${result.message}`);
        }
        return;
      }
      setAuthReady(true);
      setAuthError(null);
    })();

    return () => {
      cancelled = true;
    };
  }, [retryTick, captchaToken, turnstileSiteKey]);

  const configured = isSupabaseConfigured();
  const disabled = pending || !authReady;

  const categories = Object.keys(MANIFESTATION_CATEGORY_LABELS) as ManifestationCategory[];
  const minEndDate = localTodayDateInputValue();

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {!configured ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          Add <code className="rounded bg-white/60 px-1 dark:bg-stone-900">.env.local</code>{" "}
          with your Supabase URL and anon key (see{" "}
          <code className="rounded bg-white/60 px-1 dark:bg-stone-900">.env.example</code>
          ) to save manifestations to the database. This form is read-only until then.
        </p>
      ) : null}

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      {configured && turnstileSiteKey && !authReady && !authError ? (
        <TurnstileCaptchaRow
          resetKey={retryTick}
          onToken={setCaptchaToken}
          onExpire={onCaptchaExpire}
          caption="Quick security check before we create your session."
        />
      ) : null}

      {authError && configured ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p>{authError}</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-violet-800 underline-offset-2 hover:underline dark:text-violet-300"
            onClick={() => {
              setAuthError(null);
              setAuthReady(false);
              setCaptchaToken(null);
              setRetryTick((n) => n + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : null}

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        Desired outcome (short title)
        <input
          name="title"
          required
          minLength={3}
          maxLength={200}
          disabled={!configured || disabled}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Sunshine and ease for the park gathering"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        Intention behind it
        <textarea
          name="intention"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          disabled={!configured || disabled}
          value={intention}
          onChange={(event) => setIntention(event.target.value)}
          placeholder="What are we holding together, in a spirit of kindness and possibility?"
          className={`${inputClass} resize-y min-h-[120px]`}
        />
      </label>

      {configured ? (
        <SimilarManifestationsPanel title={title} intention={intention} />
      ) : null}

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        Category
        <select
          name="category"
          required
          defaultValue="wellbeing"
          disabled={!configured || disabled}
          className={inputClass}
        >
          {categories.map((key) => (
            <option key={key} value={key}>
              {MANIFESTATION_CATEGORY_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        {MANIFEST_ENDS_LABEL}
        <input
          type="date"
          name="ends_at"
          required
          min={minEndDate}
          disabled={!configured || disabled}
          className={inputClass}
        />
        <span className="mt-1 text-xs font-normal text-stone-500 dark:text-stone-400">
          When this manifestation closes — required for every new post.
        </span>
      </label>

      <button
        type="submit"
        disabled={!configured || disabled}
        className="inline-flex h-12 items-center justify-center rounded-full bg-violet-600 px-8 text-base font-medium text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        {pending
          ? MANIFEST_SUBMIT_PENDING
          : !authReady && configured
            ? "Preparing session…"
            : MANIFEST_SUBMIT}
      </button>
    </form>
  );
}
