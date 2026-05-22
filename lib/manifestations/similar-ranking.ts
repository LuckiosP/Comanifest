import {
  normalizeSearchQuery,
  rankManifestationsBySearch,
  SEARCH_MIN_LENGTH,
} from "@/lib/manifestations/search";
import type { Manifestation } from "@/lib/types/manifestation";

export const SIMILAR_MAX_RESULTS = 5;

/** Same combined query shape used for feed search — title, intention, as you type. */
export function buildCreateFormSearchQuery(
  title: string,
  intention: string,
): string {
  return normalizeSearchQuery(`${title.trim()} ${intention.trim()}`.trim());
}

export function rankSimilarManifestations<T extends Manifestation>(
  rows: T[],
  title: string,
  intention: string,
): T[] {
  const query = buildCreateFormSearchQuery(title, intention);
  if (query.length < SEARCH_MIN_LENGTH) {
    return [];
  }

  return rankManifestationsBySearch(rows, query).slice(0, SIMILAR_MAX_RESULTS);
}

export function shouldShowSimilarSuggestions(
  title: string,
  intention: string,
): boolean {
  return buildCreateFormSearchQuery(title, intention).length >= SEARCH_MIN_LENGTH;
}
