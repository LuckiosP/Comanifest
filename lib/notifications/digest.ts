import { buildDigestHoldEmailHtml, sendTransactionalEmail } from "./email";
import { createServiceSupabaseClient } from "./config";

type PendingEvent = {
  id: string;
  creator_id: string;
  manifestation_id: string;
  manifestation_title: string;
  join_count: number;
  digest_frequency: "daily" | "weekly";
};

export async function sendHoldDigestEmails(
  frequency: "daily" | "weekly",
): Promise<{ sent: number; skipped: number }> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { sent: 0, skipped: 0 };
  }

  const { data: events, error } = await supabase
    .from("hold_notification_events")
    .select(
      "id, creator_id, manifestation_id, manifestation_title, join_count, digest_frequency",
    )
    .is("sent_at", null)
    .eq("digest_frequency", frequency)
    .order("created_at", { ascending: true });

  if (error || !events?.length) {
    return { sent: 0, skipped: 0 };
  }

  const grouped = new Map<string, PendingEvent[]>();
  for (const event of events as PendingEvent[]) {
    const list = grouped.get(event.creator_id) ?? [];
    list.push(event);
    grouped.set(event.creator_id, list);
  }

  let sent = 0;
  let skipped = 0;

  for (const [creatorId, items] of grouped) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(creatorId);

    const email = userData.user?.email?.trim();
    if (userError || !email) {
      skipped += 1;
      continue;
    }

    const uniqueItems = dedupeByManifestation(items);
    const result = await sendTransactionalEmail({
      to: email,
      subject:
        frequency === "daily"
          ? "Your daily Comanifest hold update"
          : "Your weekly Comanifest hold update",
      html: buildDigestHoldEmailHtml({ frequency, items: uniqueItems }),
    });

    if (!result.ok) {
      skipped += 1;
      continue;
    }

    const ids = items.map((item) => item.id);
    await supabase
      .from("hold_notification_events")
      .update({ sent_at: new Date().toISOString() })
      .in("id", ids);

    sent += 1;
  }

  return { sent, skipped };
}

function dedupeByManifestation(items: PendingEvent[]) {
  const byManifestation = new Map<string, PendingEvent>();
  for (const item of items) {
    byManifestation.set(item.manifestation_id, item);
  }
  return [...byManifestation.values()].map((item) => ({
    title: item.manifestation_title,
    joinCount: item.join_count,
    manifestationId: item.manifestation_id,
  }));
}
