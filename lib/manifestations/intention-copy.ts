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

/** Stepping back from a hold (withdraw). */
export const HOLD_WITHDRAW_CTA = "Withdraw hold";
export const HOLD_WITHDRAW_PENDING = "Withdrawing…";
export const HOLD_WITHDRAW_SUCCESS =
  "You are no longer holding this manifestation.";
export const HOLD_WITHDRAW_CONFIRM =
  "I understand I am stepping back from holding this manifestation.";

export function holdingCountLabel(count: number): string {
  if (count === 1) {
    return "1 person holding this manifestation";
  }
  return `${count} people holding this manifestation`;
}

/** Header nav link to the signed-in account page. */
export const ACCOUNT_NAV = "My account";

/** Label beside the required end date on create + detail views. */
export const MANIFEST_ENDS_LABEL = "Holds until";

/** Edit flow — creator updates an active manifestation. */
export const MANIFEST_EDIT_CTA = "Edit manifestation";
export const MANIFEST_EDIT_SUBMIT = "Save changes";
export const MANIFEST_EDIT_SUBMIT_PENDING = "Saving…";
export const MANIFEST_EDIT_LINK = "Edit";

/** Creator archive / delete lifecycle. */
export const MANIFEST_ARCHIVE_CTA = "Archive";
export const MANIFEST_ARCHIVE_PENDING = "Archiving…";
export const MANIFEST_ARCHIVE_CONFIRM =
  "I understand this removes the manifestation from the public feed. People already holding may still see it until they withdraw.";
export const MANIFEST_ARCHIVE_SUCCESS =
  "This manifestation is archived and no longer appears in the public feed.";
export const MANIFEST_ARCHIVED_BANNER =
  "Archived — this manifestation no longer appears in the public feed.";

export const MANIFEST_DELETE_CTA = "Delete permanently";
export const MANIFEST_DELETE_PENDING = "Deleting…";
export const MANIFEST_DELETE_CONFIRM =
  "I understand this permanently removes this manifestation.";
export const MANIFEST_DELETE_SUCCESS =
  "This manifestation has been deleted.";
export const MANIFEST_DELETE_BLOCKED =
  "Others are still holding this manifestation. Archive it first, or wait until they withdraw, before deleting.";
