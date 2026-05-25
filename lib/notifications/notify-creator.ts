import type { SupabaseClient } from "@supabase/supabase-js";

import { createServiceSupabaseClient } from "./config";
import { buildInstantHoldEmailHtml, sendTransactionalEmail } from "./email";

type CreatorHoldPlan = {
  creator_id: string;
  creator_email: string | null;
  hold_updates_frequency: string;
  manifestation_title: string;
  join_count: number;
};

async function fetchCreatorHoldPlan(
  supabase: SupabaseClient,
  manifestationId: string,
): Promise<{ plan: CreatorHoldPlan | null; error: string | null }> {
  const { data, error } = await supabase.rpc("get_creator_hold_notification_plan", {
    p_manifestation_id: manifestationId,
  });

  if (error) {
    return { plan: null, error: error.message };
  }

  const plan = (data?.[0] as CreatorHoldPlan | undefined) ?? null;
  return { plan, error: null };
}

export async function notifyCreatorOnNewHold(
  manifestationId: string,
  sessionSupabase: SupabaseClient | null,
): Promise<void> {
  const serviceSupabase = createServiceSupabaseClient();
  const clients = [serviceSupabase, sessionSupabase].filter(
    (client): client is SupabaseClient => client != null,
  );

  if (clients.length === 0) {
    console.error("[hold-notify] no supabase client available");
    return;
  }

  let plan: CreatorHoldPlan | null = null;
  let lastError: string | null = null;

  for (const client of clients) {
    const result = await fetchCreatorHoldPlan(client, manifestationId);
    if (result.plan) {
      plan = result.plan;
      break;
    }
    lastError = result.error;
  }

  if (!plan) {
    console.error("[hold-notify] could not load creator plan:", lastError ?? "no rows");
    return;
  }

  const email = plan.creator_email?.trim();
  if (!email) {
    console.error("[hold-notify] creator has no email on file");
    return;
  }

  if (plan.hold_updates_frequency === "off") {
    console.error(
      "[hold-notify] creator preference is off:",
      plan.creator_id ?? "unknown creator",
    );
    return;
  }

  if (plan.hold_updates_frequency === "instant") {
    const result = await sendTransactionalEmail({
      to: email,
      subject: `Someone is holding “${plan.manifestation_title}”`,
      html: buildInstantHoldEmailHtml({
        title: plan.manifestation_title,
        joinCount: plan.join_count,
        manifestationId,
      }),
    });

    if (!result.ok) {
      console.error("[hold-notify] resend failed:", result.error ?? "unknown error");
    }
    return;
  }

  if (
    plan.hold_updates_frequency === "daily" ||
    plan.hold_updates_frequency === "weekly"
  ) {
    const queueClient = serviceSupabase ?? sessionSupabase;
    if (!queueClient) {
      console.error("[hold-notify] no client available to queue digest event");
      return;
    }

    const { error } = await queueClient.rpc("queue_hold_notification_event", {
      p_creator_id: plan.creator_id,
      p_manifestation_id: manifestationId,
      p_manifestation_title: plan.manifestation_title,
      p_join_count: plan.join_count,
      p_digest_frequency: plan.hold_updates_frequency,
    });

    if (error) {
      console.error("[hold-notify] queue failed:", error.message);
    }
  }
}
