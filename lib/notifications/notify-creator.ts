import { createServerSupabaseClient } from "@/lib/supabase/server";

import { buildInstantHoldEmailHtml, sendTransactionalEmail } from "./email";

type CreatorHoldPlan = {
  creator_id: string;
  creator_email: string | null;
  hold_updates_frequency: string;
  manifestation_title: string;
  join_count: number;
};

export async function notifyCreatorOnNewHold(manifestationId: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  const { data, error } = await supabase.rpc("get_creator_hold_notification_plan", {
    p_manifestation_id: manifestationId,
  });

  if (error || !data?.length) {
    return;
  }

  const plan = data[0] as CreatorHoldPlan;
  const email = plan.creator_email?.trim();
  if (!email || plan.hold_updates_frequency === "off") {
    return;
  }

  if (plan.hold_updates_frequency === "instant") {
    await sendTransactionalEmail({
      to: email,
      subject: `Someone is holding “${plan.manifestation_title}”`,
      html: buildInstantHoldEmailHtml({
        title: plan.manifestation_title,
        joinCount: plan.join_count,
        manifestationId,
      }),
    });
    return;
  }

  if (
    plan.hold_updates_frequency === "daily" ||
    plan.hold_updates_frequency === "weekly"
  ) {
    await supabase.rpc("queue_hold_notification_event", {
      p_creator_id: plan.creator_id,
      p_manifestation_id: manifestationId,
      p_manifestation_title: plan.manifestation_title,
      p_join_count: plan.join_count,
      p_digest_frequency: plan.hold_updates_frequency,
    });
  }
}
