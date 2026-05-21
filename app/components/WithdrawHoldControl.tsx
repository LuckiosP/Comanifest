"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  withdrawHold,
  type WithdrawHoldState,
} from "@/app/actions/join-manifestation";
import {
  HOLD_WITHDRAW_CONFIRM,
  HOLD_WITHDRAW_CTA,
  HOLD_WITHDRAW_PENDING,
} from "@/lib/manifestations/intention-copy";

const initialState: WithdrawHoldState = {};

type WithdrawHoldControlProps = {
  manifestationId: string;
  variant?: "inline" | "compact";
  onWithdrawn?: () => void;
};

export function WithdrawHoldControl({
  manifestationId,
  variant = "inline",
  onWithdrawn,
}: WithdrawHoldControlProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    withdrawHold,
    initialState,
  );
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setExpanded(false);
      onWithdrawn?.();
      router.refresh();
    }
  }, [state?.success, router, onWithdrawn]);

  if (variant === "compact" && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-fit text-sm font-medium text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
      >
        {HOLD_WITHDRAW_CTA}
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className={`flex flex-col gap-2 ${variant === "inline" ? "max-w-xs text-right" : "max-w-sm"}`}
    >
      <input type="hidden" name="manifestation_id" value={manifestationId} />

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      {state?.success ? (
        <p className="text-xs text-emerald-800 dark:text-emerald-200">
          {state.success}
        </p>
      ) : (
        <>
          <label className="flex cursor-pointer items-start gap-2 text-left text-xs text-stone-700 dark:text-stone-200">
            <input
              type="checkbox"
              name="affirm_withdraw"
              value="on"
              required
              disabled={pending}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-violet-600 focus:ring-violet-500 dark:border-stone-600"
            />
            <span>{HOLD_WITHDRAW_CONFIRM}</span>
          </label>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {variant === "compact" ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => setExpanded(false)}
                className="text-xs font-medium text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-9 items-center justify-center rounded-full border border-stone-300 bg-white px-4 text-xs font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              {pending ? HOLD_WITHDRAW_PENDING : HOLD_WITHDRAW_CTA}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
