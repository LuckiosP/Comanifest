import type { Manifestation } from "@/lib/types/manifestation";

const SAMPLE_END_OFFSET_DAYS = 30;

function sampleEndsAt(daysFromNow: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  d.setUTCHours(23, 59, 59, 999);
  return d.toISOString();
}

/** Shown when Supabase is not configured or the table is unreachable. */
export const SAMPLE_MANIFESTATIONS: Manifestation[] = [
  {
    id: "sample-1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: "Sunshine for a weekend wedding",
    intention:
      "Everyone celebrating can feel warmth and ease, outdoors or in — a bright, gentle day.",
    category: "weather",
    timeframe: null,
    join_count: 48,
    ends_at: sampleEndsAt(SAMPLE_END_OFFSET_DAYS),
    status: "active",
    creator_reflection: null,
    creator_reflection_success: null,
    reflected_at: null,
    moderation_flagged_reason: null,
    moderation_reviewed_at: null,
    moderation_reviewed_by: null,
    moderation_decline_feedback: null,
  },
  {
    id: "sample-2",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    title: "Collective calm during exam week",
    intention:
      "Students and teachers breathe a little easier, support each other, and sleep well.",
    category: "wellbeing",
    timeframe: null,
    join_count: 112,
    ends_at: sampleEndsAt(SAMPLE_END_OFFSET_DAYS + 7),
    status: "active",
    creator_reflection: null,
    creator_reflection_success: null,
    reflected_at: null,
    moderation_flagged_reason: null,
    moderation_reviewed_at: null,
    moderation_reviewed_by: null,
    moderation_decline_feedback: null,
  },
  {
    id: "sample-3",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    title: "Good energy for the hometown team",
    intention:
      "Playful hope, fair play, and joy for everyone watching — win or learn.",
    category: "sports",
    timeframe: null,
    join_count: 23,
    ends_at: sampleEndsAt(SAMPLE_END_OFFSET_DAYS),
    status: "active",
    creator_reflection: null,
    creator_reflection_success: null,
    reflected_at: null,
    moderation_flagged_reason: null,
    moderation_reviewed_at: null,
    moderation_reviewed_by: null,
    moderation_decline_feedback: null,
  },
];
