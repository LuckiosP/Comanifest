import { buildOgCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/og-card";
import { holdingCountLabel } from "@/lib/manifestations/intention-copy";
import { getManifestationById } from "@/lib/manifestations/queries";
import { MANIFESTATION_CATEGORY_LABELS } from "@/lib/types/manifestation";

export const runtime = "nodejs";
export const alt = "A manifestation on Comanifest";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getManifestationById(id);

  if (!result) {
    return buildOgCard({
      eyebrow: "Comanifest",
      title: "Collective intention, together",
      subtitle: "Name a hopeful outcome and invite others to hold it with you.",
    });
  }

  const { row } = result;
  return buildOgCard({
    eyebrow: MANIFESTATION_CATEGORY_LABELS[row.category] ?? "Manifestation",
    title: row.title,
    subtitle: holdingCountLabel(row.join_count),
  });
}
