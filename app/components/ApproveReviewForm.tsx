"use client";

import { useActionState } from "react";

import {
  approveManifestationReview,
  type ApproveModerationState,
} from "@/app/actions/moderation-approve";
import {
  MODERATION_APPROVE_HINT,
  MODERATION_APPROVE_SUBMIT,
  MODERATION_APPROVE_SUBMIT_PENDING,
} from "@/lib/manifestations/intention-copy";

const initialState: ApproveModerationState = {};

type ApproveReviewFormProps = {
  token: string;
};

export function ApproveReviewForm({ token }: ApproveReviewFormProps) {
  const [state, formAction, pending] = useActionState(
    approveManifestationReview,
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
        {MODERATION_APPROVE_HINT}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 w-fit cursor-pointer items-center justify-center rounded-full bg-violet-700 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-600 dark:hover:bg-violet-500"
      >
        {pending ? MODERATION_APPROVE_SUBMIT_PENDING : MODERATION_APPROVE_SUBMIT}
      </button>
    </form>
  );
}
