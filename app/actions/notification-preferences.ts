"use server";

import { revalidatePath } from "next/cache";

import {
  HOLD_UPDATES_FREQUENCIES,
  type HoldUpdatesFrequency,
  upsertHoldUpdatesFrequency,
} from "@/lib/notifications/preferences";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

export type NotificationPreferencesState = {
  error?: string;
  success?: string;
};

export async function saveNotificationPreferences(
  _prev: NotificationPreferencesState | undefined,
  formData: FormData,
): Promise<NotificationPreferencesState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const frequency = String(formData.get("hold_updates_frequency") ?? "").trim();
  if (!HOLD_UPDATES_FREQUENCIES.includes(frequency as HoldUpdatesFrequency)) {
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

  if (user.is_anonymous || !user.email) {
    return {
      error: "Hold email updates require signing in with email, not guest mode.",
    };
  }

  const result = await upsertHoldUpdatesFrequency(
    supabase,
    user.id,
    frequency as HoldUpdatesFrequency,
  );

  if (!result.ok) {
    return { error: result.error ?? "Could not save preferences." };
  }

  revalidatePath("/account");
  return { success: "Email preferences saved." };
}
