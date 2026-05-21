"use server";

import { findSimilarManifestations } from "@/lib/manifestations/similar";
import type { ManifestationListRow } from "@/lib/types/manifestation";

export async function fetchSimilarManifestations(
  title: string,
  intention: string,
): Promise<{ rows: ManifestationListRow[]; error?: string }> {
  try {
    const rows = await findSimilarManifestations(title, intention);
    return { rows };
  } catch {
    return { rows: [], error: "Could not look for similar manifestations." };
  }
}
