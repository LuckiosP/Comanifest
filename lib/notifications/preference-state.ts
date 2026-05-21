import type { SupabaseClient } from "@supabase/supabase-js";

import type { HoldUpdatesFrequency } from "./preferences";

export type HoldUpdatesPreferenceResult = {
  frequency: HoldUpdatesFrequency;
  tableMissing: boolean;
};

export async function getHoldUpdatesPreferenceState(
  supabase: SupabaseClient,
  userId: string,
): Promise<HoldUpdatesPreferenceResult> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("hold_updates_frequency")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    const tableMissing =
      error.message.includes("notification_preferences") &&
      (error.message.includes("does not exist") ||
        error.message.includes("schema cache"));
    return { frequency: "off", tableMissing };
  }

  const value = data?.hold_updates_frequency as HoldUpdatesFrequency | undefined;
  const frequency =
    value && ["off", "instant", "daily", "weekly"].includes(value) ? value : "off";

  return { frequency, tableMissing: false };
}
