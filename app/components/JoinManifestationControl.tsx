"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  joinManifestation,
  type JoinManifestationState,
} from "@/app/actions/join-manifestation";
import { TurnstileCaptchaRow } from "@/app/components/TurnstileCaptchaRow";
import { WithdrawHoldControl } from "@/app/components/WithdrawHoldControl";
import { ensureAnonymousBrowserSession } from "@/lib/auth/ensure-anonymous-browser-session";
import {
  JOIN_COMMITMENT_MAX_LEN,
  JOIN_COMMITMENT_MIN_LEN,
} from "@/lib/manifestations/join-bounds";
import {
  HOLD_BADGE,
  HOLD_CTA,
  HOLD_CTA_EXPAND,
  HOLD_SUBMIT_PENDING,
} from "@/lib/manifestations/intention-copy";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getTurnstileSiteKey, isSupabaseConfigured } from "@/lib/supabase/config";

const initialJoinState: JoinManifestationState = {};

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type JoinManifestationControlProps = {
  manifestationId: string;
  joinsEnabled: boolean;
  withdrawEnabled?: boolean;
  viewerHasJoined: boolean;
  viewerIsCreator: boolean;
  variant: "card" | "detail";
};

export function JoinManifestationControl({
  manifestationId,
  joinsEnabled,
  withdrawEnabled = joinsEnabled,
  viewerHasJoined,
  viewerIsCreator,
  variant,
}: JoinManifestationControlProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    joinManifestation,
    initialJoinState,
  );
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured());
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(variant === "detail");
  const turnstileSiteKey = getTurnstileSiteKey();

  const onCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  useEffect(() => {
    if (!joinsEnabled) {
      return;
    }
    if (variant === "card" && !expanded) {
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
            "Anonymous sign-ins are off in Supabase (Authentication → Providers → Anonymous). Enable them, then “Try again”.",
          );
        } else if (msg.includes("captcha")) {
          setAuthError(
            turnstileSiteKey
              ? "Security check failed or expired. Click “Try again”."
              : "Supabase CAPTCHA is on but this app has no Turnstile site key. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env.local (see .env.example).",
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
  }, [
    joinsEnabled,
    retryTick,
    captchaToken,
    turnstileSiteKey,
    variant,
    expanded,
  ]);

  if (!joinsEnabled) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          disabled
          title="Holding is available when the app is connected to your Supabase project"
          className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-400 dark:border-stone-600 dark:text-stone-500"
        >
          Hold
        </button>
      </div>
    );
  }

  if (viewerIsCreator) {
    return (
      <p className="max-w-xs text-right text-xs text-stone-500 dark:text-stone-400">
        You started this manifestation — you&apos;re already holding it.
      </p>
    );
  }

  if (viewerHasJoined || state?.success) {
    return (
      <div
        className={`flex flex-col gap-2 ${variant === "card" ? "items-end text-right" : "items-start"}`}
      >
        <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
          {HOLD_BADGE}
        </span>
        {viewerHasJoined && withdrawEnabled ? (
          <WithdrawHoldControl
            manifestationId={manifestationId}
            variant={variant === "card" ? "compact" : "inline"}
          />
        ) : null}
      </div>
    );
  }

  if (variant === "card" && !expanded) {
    return (
      <div className="flex flex-col items-end gap-2 text-right">
        {authError ? (
          <div className="w-full max-w-xs rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100 sm:max-w-sm">
            <p>{authError}</p>
            <button
              type="button"
              className="mt-2 font-medium text-violet-800 underline-offset-2 hover:underline dark:text-violet-300"
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
        <button
          type="button"
          disabled={Boolean(authError)}
          onClick={() => setExpanded(true)}
          className="rounded-full border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 shadow-sm transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-100 dark:hover:bg-violet-900/60"
        >
          {HOLD_CTA_EXPAND}
        </button>
      </div>
    );
  }

  const disabled = pending || !authReady;

  return (
    <form
      action={formAction}
      className={`flex w-full flex-col gap-3 ${variant === "card" ? "max-w-sm sm:max-w-xs" : "max-w-lg"}`}
    >
      <input type="hidden" name="manifestation_id" value={manifestationId} />

      {variant === "card" ? (
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            setCaptchaToken(null);
          }}
          className="self-end text-xs font-medium text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
        >
          Cancel
        </button>
      ) : null}

      {turnstileSiteKey && !authReady && !authError ? (
        <TurnstileCaptchaRow
          resetKey={retryTick}
          onToken={setCaptchaToken}
          onExpire={onCaptchaExpire}
          caption="Quick security check before you can hold with the circle."
        />
      ) : null}

      {authError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p>{authError}</p>
          <button
            type="button"
            className="mt-2 font-medium text-violet-800 underline-offset-2 hover:underline dark:text-violet-300"
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

      <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300">
        This is a quiet commitment: a short note for yourself (stored with your
        account) and a confirmation — not a throwaway click.
      </p>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      <label className="flex flex-col text-xs font-medium text-stone-700 dark:text-stone-200">
        What draws you here? (private to you)
        <textarea
          name="commitment_note"
          required
          minLength={JOIN_COMMITMENT_MIN_LEN}
          maxLength={JOIN_COMMITMENT_MAX_LEN}
          rows={variant === "detail" ? 4 : 3}
          disabled={disabled}
          placeholder="A sentence or two — what you're willing to hold, in good faith?"
          className={`${inputClass} resize-y min-h-[72px]`}
        />
        <span className="mt-0.5 font-normal text-stone-500 dark:text-stone-400">
          {JOIN_COMMITMENT_MIN_LEN}–{JOIN_COMMITMENT_MAX_LEN} characters
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-2 text-xs text-stone-700 dark:text-stone-200">
        <input
          type="checkbox"
          name="affirm"
          value="on"
          required
          disabled={disabled}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-violet-600 focus:ring-violet-500 dark:border-stone-600"
        />
        <span>
          I hold this intention sincerely and kindly — not to poke fun, spam, or
          cause harm.
        </span>
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-10 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        {pending
          ? HOLD_SUBMIT_PENDING
          : !authReady
            ? "Preparing session…"
            : HOLD_CTA}
      </button>
    </form>
  );
}
