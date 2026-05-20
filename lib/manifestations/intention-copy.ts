/** Shared user-facing copy — manifest (create), hold with others (participate). */

/** Short label for the header nav button. */
export const MANIFEST_NAV = "Manifest";

/** Links and page titles when starting a new manifestation. */
export const MANIFEST_CTA = "Start a manifestation";

/** Primary submit label on the new-manifestation form. */
export const MANIFEST_SUBMIT = "Manifest this";

export const MANIFEST_SUBMIT_PENDING = "Manifesting…";

/** Hold-side copy when participating in someone else's manifestation. */
export const HOLD_BADGE = "You're holding this manifestation";
export const HOLD_CTA = "Hold this manifestation";
export const HOLD_CTA_EXPAND = "Hold with intention";
export const HOLD_SUBMIT_PENDING = "Holding…";

export function holdingCountLabel(count: number): string {
  if (count === 1) {
    return "1 person holding this manifestation";
  }
  return `${count} people holding this manifestation`;
}
