import type { Manifestation } from "@/lib/types/manifestation";

export function isManifestationOpenForHolds(
  manifestation: Pick<Manifestation, "status" | "ends_at">,
): boolean {
  return (
    manifestation.status === "active" &&
    new Date(manifestation.ends_at).getTime() >= Date.now()
  );
}

export function isManifestationEditable(
  manifestation: Pick<Manifestation, "status">,
): boolean {
  return manifestation.status === "active";
}

/** Creator-only: hide from the public feed; holders may still view and withdraw. */
export function isManifestationArchivable(
  manifestation: Pick<Manifestation, "status">,
): boolean {
  return manifestation.status === "active";
}

/** Creator-only: soft-delete when no one else is holding (join_count is 1 = creator only). */
export function isManifestationDeletable(manifestation: Pick<Manifestation, "status" | "join_count">): boolean {
  return manifestation.status !== "deleted" && manifestation.join_count <= 1;
}

export function hasOtherHolders(joinCount: number): boolean {
  return joinCount > 1;
}

export function canViewArchivedManifestation(options: {
  status: Manifestation["status"];
  viewerIsCreator: boolean;
  viewerHasJoined: boolean;
}): boolean {
  if (options.status !== "archived") {
    return true;
  }
  return options.viewerIsCreator || options.viewerHasJoined;
}
