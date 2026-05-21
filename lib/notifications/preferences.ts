import type { SupabaseClient } from "@supabase/supabase-js";

export type HoldUpdatesFrequency = "off" | "instant" | "daily" | "weekly";

export const HOLD_UPDATES_FREQUENCIES: HoldUpdatesFrequency[] = [
  "off",
  "instant",
  "daily",
  "weekly",
];

export async function getHoldUpdatesFrequency(
  supabase: SupabaseClient,
  userId: string,
): Promise<HoldUpdatesFrequency> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("hold_updates_frequency")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data?.hold_updates_frequency) {
    return "off";
  }

  const value = data.hold_updates_frequency as HoldUpdatesFrequency;
  return HOLD_UPDATES_FREQUENCIES.includes(value) ? value : "off";
}

export async function upsertHoldUpdatesFrequency(
  supabase: SupabaseClient,
  userId: string,
  frequency: HoldUpdatesFrequency,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("notification_preferences").upsert(
    {
      user_id: userId,
      hold_updates_frequency: frequency,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
