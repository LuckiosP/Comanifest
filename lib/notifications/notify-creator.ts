import { createServiceSupabaseClient } from "./config";
import { buildInstantHoldEmailHtml, sendTransactionalEmail } from "./email";
import type { HoldUpdatesFrequency } from "./preferences";

export async function notifyCreatorOnNewHold(manifestationId: string): Promise<void> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return;
  }

  const { data: manifestation, error: manifestationError } = await supabase
    .from("manifestations")
    .select("user_id, title, join_count")
    .eq("id", manifestationId)
    .maybeSingle();

  if (manifestationError || !manifestation) {
    return;
  }

  const { data: preference } = await supabase
    .from("notification_preferences")
    .select("hold_updates_frequency")
    .eq("user_id", manifestation.user_id)
    .maybeSingle();

  const frequency = (preference?.hold_updates_frequency ?? "off") as HoldUpdatesFrequency;
  if (frequency === "off") {
    return;
  }

  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
    manifestation.user_id,
  );

  const email = userData.user?.email?.trim();
  if (userError || !email) {
    return;
  }

  if (frequency === "instant") {
    await sendTransactionalEmail({
      to: email,
      subject: `Someone is holding “${manifestation.title}”`,
      html: buildInstantHoldEmailHtml({
        title: manifestation.title,
        joinCount: manifestation.join_count,
        manifestationId,
      }),
    });
    return;
  }

  if (frequency === "daily" || frequency === "weekly") {
    await supabase.from("hold_notification_events").insert({
      creator_id: manifestation.user_id,
      manifestation_id: manifestationId,
      manifestation_title: manifestation.title,
      join_count: manifestation.join_count,
      digest_frequency: frequency,
    });
  }
}
