"use server";

import { isEmailSignedInUser } from "@/lib/auth/session-kind";
import {
  HOLD_UPDATES_FREQUENCIES,
  type HoldUpdatesFrequency,
  upsertHoldUpdatesFrequency,
} from "@/lib/notifications/preferences";
import { getHoldUpdatesPreferenceState } from "@/lib/notifications/preference-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

export type NotificationPreferencesState = {
  error?: string;
  success?: string;
  frequency?: HoldUpdatesFrequency;
};

function parseHoldUpdatesFrequency(input: unknown): HoldUpdatesFrequency | null {
  const value =
    input instanceof FormData
      ? String(input.get("hold_updates_frequency") ?? "").trim()
      : String(input ?? "").trim();

  return HOLD_UPDATES_FREQUENCIES.includes(value as HoldUpdatesFrequency)
    ? (value as HoldUpdatesFrequency)
    : null;
}

export async function loadNotificationPreferences(): Promise<{
  frequency?: HoldUpdatesFrequency;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    return { error: "Sign in to view email preferences." };
  }

  if (!isEmailSignedInUser(user)) {
    return { error: "Email preferences require signing in with email." };
  }

  const preferenceState = await getHoldUpdatesPreferenceState(supabase, user.id);
  return { frequency: preferenceState.frequency };
}

export async function saveNotificationPreferences(
  _prev: NotificationPreferencesState | undefined,
  input: unknown,
): Promise<NotificationPreferencesState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const frequency = parseHoldUpdatesFrequency(input);
  if (!frequency) {
    return { error: "Choose a valid email frequency." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    return { error: "Sign in to save email preferences." };
  }

  if (!isEmailSignedInUser(user)) {
    return {
      error: "Hold email updates require signing in with email, not guest mode.",
    };
  }

  const result = await upsertHoldUpdatesFrequency(
    supabase,
    user.id,
    frequency,
  );

  if (!result.ok) {
    const tableMissing =
      result.error?.includes("notification_preferences") &&
      (result.error.includes("does not exist") ||
        result.error.includes("schema cache"));
    return {
      error: tableMissing
        ? "Run docs/supabase/migrations/notifications.sql in Supabase first."
        : result.error ?? "Could not save preferences.",
    };
  }

  return {
    success: "Email preferences saved.",
    frequency,
  };
}
