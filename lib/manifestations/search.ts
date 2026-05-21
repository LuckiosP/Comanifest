import { MANIFESTATION_CATEGORY_LABELS } from "@/lib/types/manifestation";
import type { Manifestation } from "@/lib/types/manifestation";

export const SEARCH_MIN_LENGTH = 1;
export const SEARCH_MAX_LENGTH = 100;

export function normalizeSearchQuery(raw: string | undefined | null): string {
  return String(raw ?? "").trim().slice(0, SEARCH_MAX_LENGTH);
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

export function buildManifestationSearchOrFilter(term: string): string {
  const pattern = `%${escapeIlike(term)}%`;
  const parts = [
    `title.ilike.${pattern}`,
    `intention.ilike.${pattern}`,
    `category.ilike.${pattern}`,
  ];

  for (const key of categoryKeysMatchingSearch(term)) {
    parts.push(`category.eq.${key}`);
  }

  return parts.join(",");
}

export function matchesManifestationSearch(
  row: Pick<Manifestation, "title" | "intention" | "category">,
  term: string,
): boolean {
  const lower = term.toLowerCase();
  const label = MANIFESTATION_CATEGORY_LABELS[row.category] ?? row.category;
  return (
    row.title.toLowerCase().includes(lower) ||
    row.intention.toLowerCase().includes(lower) ||
    row.category.toLowerCase().includes(lower) ||
    label.toLowerCase().includes(lower)
  );
}
