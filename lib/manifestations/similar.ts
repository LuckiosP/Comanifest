import { listManifestations } from "@/lib/manifestations/queries";
import { rankSimilarManifestations } from "@/lib/manifestations/similar-ranking";
import type { ManifestationListRow } from "@/lib/types/manifestation";

export async function findSimilarManifestations(
  title: string,
  intention: string,
): Promise<ManifestationListRow[]> {
  const { rows, source } = await listManifestations("newest");
  if (source !== "live" || rows.length === 0) {
    return [];
  }

  return rankSimilarManifestations(rows, title, intention);
}
