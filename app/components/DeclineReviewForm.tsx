"use client";

import { useActionState } from "react";

import {
  declineManifestationReview,
  type DeclineModerationState,
} from "@/app/actions/moderation-decline";
import {
  MODERATION_DECLINE_FEEDBACK_LABEL,
  MODERATION_DECLINE_HINT,
  MODERATION_DECLINE_SUBMIT,
  MODERATION_DECLINE_SUBMIT_PENDING,
} from "@/lib/manifestations/intention-copy";

const initialState: DeclineModerationState = {};

const textareaClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type DeclineReviewFormProps = {
  token: string;
};

export function DeclineReviewForm({ token }: DeclineReviewFormProps) {
  const [state, formAction, pending] = useActionState(
    declineManifestationReview,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        {MODERATION_DECLINE_HINT}
      </p>

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        {MODERATION_DECLINE_FEEDBACK_LABEL}
        <textarea
          name="feedback"
          rows={5}
          maxLength={1000}
          disabled={pending}
          className={textareaClass}
          placeholder="Optional — e.g. Could you rephrase without targeting a specific person?"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 w-fit items-center justify-center rounded-full bg-stone-800 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white"
      >
        {pending ? MODERATION_DECLINE_SUBMIT_PENDING : MODERATION_DECLINE_SUBMIT}
      </button>
    </form>
  );
}
