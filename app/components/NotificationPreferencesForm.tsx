"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  loadNotificationPreferences,
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

const selectClass =
  "mt-1 w-full max-w-md rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

// Survives Next.js remounting this form after a server action refresh.
let sessionFrequency: HoldUpdatesFrequency | null = null;

function rememberFrequency(frequency: HoldUpdatesFrequency) {
  sessionFrequency = frequency;
}

type NotificationPreferencesFormProps = {
  disabled?: boolean;
};

export function NotificationPreferencesForm({
  disabled = false,
}: NotificationPreferencesFormProps) {
  const [selected, setSelected] = useState<HoldUpdatesFrequency | null>(
    sessionFrequency,
  );
  const [loading, setLoading] = useState(sessionFrequency === null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [state, setState] = useState<NotificationPreferencesState>({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (sessionFrequency !== null) {
      setSelected(sessionFrequency);
      setLoading(false);
      return;
    }

    let cancelled = false;

    void loadNotificationPreferences().then((result) => {
      if (cancelled) {
        return;
      }

      if (result.error) {
        setLoadError(result.error);
        setLoading(false);
        return;
      }

      const frequency = result.frequency ?? "off";
      rememberFrequency(frequency);
      setSelected(frequency);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) {
      return;
    }

    const saved = selected;
    rememberFrequency(saved);
    setPending(true);

    try {
      const result = await saveNotificationPreferences(undefined, saved);
      setState(result);

      if (result.success) {
        const confirmed = result.frequency ?? saved;
        rememberFrequency(confirmed);
        setSelected(confirmed);
      }
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-stone-600 dark:text-stone-300">
        Loading email preferences…
      </p>
    );
  }

  if (loadError || !selected) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
      >
        {loadError ?? "Could not load email preferences."}
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
          {NOTIFICATIONS_SAVE_SUCCESS}
        </p>
      ) : null}

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        {NOTIFICATIONS_FREQUENCY_LABEL}
        <select
          value={selected}
          onChange={(event) => {
            const next = event.target.value as HoldUpdatesFrequency;
            rememberFrequency(next);
            setSelected(next);
          }}
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
