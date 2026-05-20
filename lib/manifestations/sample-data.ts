import type { Manifestation } from "@/lib/types/manifestation";

/** Shown when Supabase is not configured or the table is unreachable. */
export const SAMPLE_MANIFESTATIONS: Manifestation[] = [
  {
    id: "sample-1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: "Sunshine for a weekend wedding",
    intention:
      "Everyone celebrating can feel warmth and ease, outdoors or in — a bright, gentle day.",
    category: "weather",
    timeframe: "This Saturday",
    join_count: 48,
  },
  {
    id: "sample-2",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    title: "Collective calm during exam week",
    intention:
      "Students and teachers breathe a little easier, support each other, and sleep well.",
    category: "wellbeing",
    timeframe: "Next two weeks",
    join_count: 112,
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
  },
];
