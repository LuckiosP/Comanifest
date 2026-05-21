import type { Manifestation } from "@/lib/types/manifestation";

export function isManifestationOpenForHolds(
  manifestation: Pick<Manifestation, "status" | "ends_at">,
): boolean {
  return (
    manifestation.status === "active" &&
    new Date(manifestation.ends_at).getTime() >= Date.now()
  );
}
