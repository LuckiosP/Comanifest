"use client";

import { useActionState } from "react";

import {
  saveNotificationPreferences,
  type NotificationPreferencesState,
} from "@/app/actions/notification-preferences";
import {
  NOTIFICATIONS_FREQUENCY_DAILY,
  NOTIFICATIONS_FREQUENCY_INSTANT,
  NOTIFICATIONS_FREQUENCY_LABEL,
  NOTIFICATIONS_FREQUENCY_OFF,
  NOTIFICATIONS_FREQUENCY_WEEKLY,
  NOTIFICATIONS_SAVE,
  NOTIFICATIONS_SAVE_PENDING,
  NOTIFICATIONS_SAVE_SUCCESS,
} from "@/lib/manifestations/intention-copy";
import type { HoldUpdatesFrequency } from "@/lib/notifications/preferences";

const initialState: NotificationPreferencesState = {};

const selectClass =
  "mt-1 w-full max-w-md rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type NotificationPreferencesFormProps = {
  initialFrequency: HoldUpdatesFrequency;
  disabled?: boolean;
};

export function NotificationPreferencesForm({
  initialFrequency,
  disabled = false,
}: NotificationPreferencesFormProps) {
  const [state, formAction, pending] = useActionState(
    saveNotificationPreferences,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      {state?.success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          {NOTIFICATIONS_SAVE_SUCCESS}
        </p>
      ) : null}

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        {NOTIFICATIONS_FREQUENCY_LABEL}
        <select
          name="hold_updates_frequency"
          defaultValue={initialFrequency}
          disabled={disabled || pending}
          className={selectClass}
        >
          <option value="off">{NOTIFICATIONS_FREQUENCY_OFF}</option>
          <option value="instant">{NOTIFICATIONS_FREQUENCY_INSTANT}</option>
          <option value="daily">{NOTIFICATIONS_FREQUENCY_DAILY}</option>
          <option value="weekly">{NOTIFICATIONS_FREQUENCY_WEEKLY}</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex h-10 w-fit cursor-pointer items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        {pending ? NOTIFICATIONS_SAVE_PENDING : NOTIFICATIONS_SAVE}
      </button>
    </form>
  );
}
