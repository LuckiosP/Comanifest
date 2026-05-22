"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  closeManifestation,
  type CloseManifestationState,
} from "@/app/actions/manifestation-closure";
import { isManifestationPastEndDate } from "@/lib/manifestations/lifecycle";
import {
  MANIFEST_CLOSE_CONFIRM,
  MANIFEST_CLOSE_CTA,
  MANIFEST_CLOSE_EARLY_CTA,
  MANIFEST_CLOSE_EARLY_HINT,
  MANIFEST_CLOSE_PAST_END_PROMPT,
  MANIFEST_CLOSE_PENDING,
  MANIFEST_CLOSE_REFLECTION_LABEL,
  MANIFEST_CLOSE_REFLECTION_PLACEHOLDER,
  MANIFEST_CLOSE_SUCCESS_LABEL,
  MANIFEST_CLOSE_SUCCESS_NO,
  MANIFEST_CLOSE_SUCCESS_UNSURE,
  MANIFEST_CLOSE_SUCCESS_YES,
} from "@/lib/manifestations/intention-copy";
import {
  REFLECTION_MAX_LEN,
  REFLECTION_MIN_LEN,
} from "@/lib/manifestations/reflection-bounds";
import type { Manifestation } from "@/lib/types/manifestation";

const initialState: CloseManifestationState = {};

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type CloseManifestationControlProps = {
  manifestationId: string;
  endsAt: string;
  variant?: "detail" | "compact";
};

export function CloseManifestationControl({
  manifestationId,
  endsAt,
  variant = "detail",
}: CloseManifestationControlProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    closeManifestation,
    initialState,
  );
  const [expanded, setExpanded] = useState(variant === "detail");
  const pastEnd = isManifestationPastEndDate({ ends_at: endsAt } as Manifestation);
  const ctaLabel = pastEnd ? MANIFEST_CLOSE_CTA : MANIFEST_CLOSE_EARLY_CTA;

  useEffect(() => {
    if (state?.success) {
      setExpanded(false);
      router.refresh();
    }
  }, [state?.success, router]);

  if (state?.success) {
    return (
      <p className="text-sm text-emerald-800 dark:text-emerald-200">{state.success}</p>
    );
  }

  return (
    <div
      id="close-manifestation"
      className="flex flex-col gap-3 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-4 dark:border-violet-900/50 dark:bg-violet-950/20"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
          {ctaLabel}
        </h3>
        <p className="text-sm leading-relaxed text-violet-900/90 dark:text-violet-200/90">
          {pastEnd ? MANIFEST_CLOSE_PAST_END_PROMPT : MANIFEST_CLOSE_EARLY_HINT}
        </p>
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      {expanded ? (
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="manifestation_id" value={manifestationId} />

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-stone-700 dark:text-stone-200">
              {MANIFEST_CLOSE_SUCCESS_LABEL}
            </legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {(
                [
                  ["yes", MANIFEST_CLOSE_SUCCESS_YES],
                  ["unsure", MANIFEST_CLOSE_SUCCESS_UNSURE],
                  ["no", MANIFEST_CLOSE_SUCCESS_NO],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
                >
                  <input
                    type="radio"
                    name="reflection_success"
                    value={value}
                    required
                    disabled={pending}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
            {MANIFEST_CLOSE_REFLECTION_LABEL}
            <textarea
              name="creator_reflection"
              required
              minLength={REFLECTION_MIN_LEN}
              maxLength={REFLECTION_MAX_LEN}
              rows={variant === "detail" ? 5 : 4}
              disabled={pending}
              placeholder={MANIFEST_CLOSE_REFLECTION_PLACEHOLDER}
              className={`${inputClass} resize-y min-h-[96px]`}
            />
            <span className="mt-0.5 text-xs font-normal text-stone-500 dark:text-stone-400">
              {REFLECTION_MIN_LEN}–{REFLECTION_MAX_LEN} characters
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2 text-sm text-stone-700 dark:text-stone-200">
            <input
              type="checkbox"
              name="affirm_close"
              value="on"
              required
              disabled={pending}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-violet-600 focus:ring-violet-500 dark:border-stone-600"
            />
            <span>{MANIFEST_CLOSE_CONFIRM}</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {variant === "compact" ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => setExpanded(false)}
                className="text-sm font-medium text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              {pending ? MANIFEST_CLOSE_PENDING : ctaLabel}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex h-10 w-full items-center justify-center rounded-full border border-violet-300 bg-white px-5 text-sm font-medium text-violet-900 shadow-sm transition hover:bg-violet-50 sm:w-auto sm:self-start dark:border-violet-700 dark:bg-stone-900 dark:text-violet-100 dark:hover:bg-violet-950/40"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
