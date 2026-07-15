import { buildOgCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/og-card";

export const runtime = "nodejs";
export const alt = "Comanifest — collective intention, together";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return buildOgCard({
    title: "Turn a quiet hope into a gathering",
    subtitle: "Name a hopeful outcome and invite others to hold it with you.",
  });
}
