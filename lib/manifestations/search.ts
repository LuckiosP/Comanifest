import { MANIFESTATION_CATEGORY_LABELS } from "@/lib/types/manifestation";
import type { Manifestation } from "@/lib/types/manifestation";

export const SEARCH_MIN_LENGTH = 1;
export const SEARCH_MAX_LENGTH = 100;

/** Optional vibe expansions — maps a felt word to related language in intentions. */
const VIBE_HINTS: Record<string, string[]> = {
  sunshine: ["sun", "sunny", "warm", "warmth", "bright", "light", "sky", "day", "weather"],
  sun: ["sun", "sunny", "sunshine", "warm", "bright", "day", "weather"],
  sunny: ["sun", "sunny", "sunshine", "warm", "bright", "weather"],
  rain: ["rain", "storm", "weather", "dry", "wet", "cloud"],
  peace: ["peace", "calm", "quiet", "ease", "harmony", "global", "still"],
  calm: ["calm", "wellbeing", "breathe", "ease", "rest", "quiet", "gentle"],
  wedding: ["wedding", "celebration", "gathering", "marry", "love", "together"],
  love: ["love", "kindness", "heart", "together", "care"],
  win: ["win", "victory", "team", "sports", "play", "energy"],
  exam: ["exam", "study", "school", "calm", "focus", "wellbeing"],
  sleep: ["sleep", "rest", "wellbeing", "calm", "night"],
};

export function normalizeSearchQuery(raw: string | undefined | null): string {
  return String(raw ?? "").trim().slice(0, SEARCH_MAX_LENGTH);
}

export function tokenizeSearch(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2);
}

/** Expand a query with vibe-related words (not exact-match only). */
export function expandSearchTerms(term: string): string[] {
  const normalized = term.toLowerCase().trim();
  if (!normalized) {
    return [];
  }

  const terms = new Set<string>([normalized, ...tokenizeSearch(normalized)]);

  for (const [anchor, hints] of Object.entries(VIBE_HINTS)) {
    const anchorHit =
      normalized.includes(anchor) ||
      tokenizeSearch(normalized).some(
        (token) => anchor.includes(token) || token.includes(anchor),
      );
    if (anchorHit) {
      terms.add(anchor);
      for (const hint of hints) {
        terms.add(hint);
      }
    }
  }

  return [...terms];
}

function haystackForRow(
  row: Pick<Manifestation, "title" | "intention" | "category">,
): string {
  const label = MANIFESTATION_CATEGORY_LABELS[row.category] ?? row.category;
  return `${row.title} ${row.intention} ${row.category} ${label}`.toLowerCase();
}

/** Higher = stronger match. Zero = no match. */
export function scoreManifestationSearch(
  row: Pick<Manifestation, "title" | "intention" | "category">,
  term: string,
): number {
  const normalized = normalizeSearchQuery(term);
  if (!normalized) {
    return 0;
  }

  const title = row.title.toLowerCase();
  const intention = row.intention.toLowerCase();
  const label = (
    MANIFESTATION_CATEGORY_LABELS[row.category] ?? row.category
  ).toLowerCase();
  const haystack = haystackForRow(row);
  let score = 0;

  if (title.includes(normalized)) {
    score += 80;
  }
  if (intention.includes(normalized)) {
    score += 50;
  }
  if (haystack.includes(normalized)) {
    score += 20;
  }

  for (const token of expandSearchTerms(normalized)) {
    if (title.includes(token)) {
      score += 24;
    }
    if (intention.includes(token)) {
      score += 14;
    }
    if (label.includes(token) || row.category.includes(token)) {
      score += 8;
    }
    if (token.length >= 4 && haystack.includes(token)) {
      score += 6;
    }
  }

  return score;
}

export function matchesManifestationSearch(
  row: Pick<Manifestation, "title" | "intention" | "category">,
  term: string,
): boolean {
  return scoreManifestationSearch(row, term) > 0;
}

export function rankManifestationsBySearch<T extends Manifestation>(
  rows: T[],
  term: string,
): T[] {
  const normalized = normalizeSearchQuery(term);
  if (!normalized) {
    return rows;
  }

  return [...rows]
    .map((row) => ({ row, score: scoreManifestationSearch(row, normalized) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ row }) => row);
}

/** Escape `%`, `_`, and `\` for use inside PostgREST `ilike` patterns. */
export function escapeIlike(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export function categoryKeysMatchingSearch(term: string): string[] {
  const lower = term.toLowerCase();
  return (
    Object.entries(MANIFESTATION_CATEGORY_LABELS) as Array<
      [keyof typeof MANIFESTATION_CATEGORY_LABELS, string]
    >
  )
    .filter(
      ([key, label]) =>
        key.includes(lower) || label.toLowerCase().includes(lower),
    )
    .map(([key]) => key);
}

/** Server-side broad fetch filter (used for similar-on-create, not strict exact match). */
export function buildManifestationSearchOrFilter(term: string): string {
  const terms = expandSearchTerms(term);
  const parts = new Set<string>();

  for (const piece of terms) {
    const pattern = `%${escapeIlike(piece)}%`;
    parts.add(`title.ilike.${pattern}`);
    parts.add(`intention.ilike.${pattern}`);
    parts.add(`category.ilike.${pattern}`);
  }

  for (const key of categoryKeysMatchingSearch(term)) {
    parts.add(`category.eq.${key}`);
  }

  return [...parts].join(",");
}
