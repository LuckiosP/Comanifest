import { rankManifestationsBySearch } from "@/lib/manifestations/search";
import { listManifestations } from "@/lib/manifestations/queries";
import type { ManifestationListRow } from "@/lib/types/manifestation";

const MIN_COMBINED_LENGTH = 8;
const MAX_RESULTS = 5;

export async function findSimilarManifestations(
  title: string,
  intention: string,
): Promise<ManifestationListRow[]> {
  const combined = `${title.trim()} ${intention.trim()}`.trim();
  if (combined.length < MIN_COMBINED_LENGTH) {
    return [];
  }

  const { rows, source } = await listManifestations("newest");
  if (source !== "live" || rows.length === 0) {
    return [];
  }

  return rankManifestationsBySearch(rows, combined).slice(0, MAX_RESULTS);
}
