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

/** Feed search (phase 4). */
export const SEARCH_PLACEHOLDER = "Search by vibe, title, or intention…";
export const SEARCH_HINT =
  "Results update as you type — we match the feeling and related words, not just exact phrases.";
export const SEARCH_CLEAR = "Clear search";
export const SEARCH_NO_RESULTS =
  "Nothing quite matches that vibe yet — try a feeling or a few related words.";

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

/** Creator closure & reflection (phase 6). */
export const MANIFEST_CLOSE_CTA = "Close manifestation";
export const MANIFEST_CLOSE_EARLY_CTA = "Close early";
export const MANIFEST_CLOSE_PENDING = "Closing…";
export const MANIFEST_CLOSE_CONFIRM =
  "I understand this closes the manifestation for new holds and shares a short reflection with people already holding.";
export const MANIFEST_CLOSE_SUCCESS =
  "This manifestation is closed. Thank you for reflecting with the circle.";
export const MANIFEST_CLOSE_PAST_END_PROMPT =
  "The hold-until date has passed. When you are ready, close with a gentle reflection — only you evaluate success.";
export const MANIFEST_CLOSE_EARLY_HINT =
  "You can close before the hold-until date if the intention feels complete — add a short reflection for people holding with you.";
export const MANIFEST_CLOSE_REFLECTION_LABEL =
  "Your reflection (shared with holders)";
export const MANIFEST_CLOSE_REFLECTION_PLACEHOLDER =
  "How did it feel? What did you notice — in the world or in yourself? No need for a verdict.";
export const MANIFEST_CLOSE_SUCCESS_LABEL = "How did it land for you?";
export const MANIFEST_CLOSE_SUCCESS_YES = "It landed well";
export const MANIFEST_CLOSE_SUCCESS_UNSURE = "Still unfolding / mixed";
export const MANIFEST_CLOSE_SUCCESS_NO = "Not as hoped";
export const MANIFEST_CLOSED_BANNER = "Closed — this manifestation no longer accepts new holds.";
export const MANIFEST_CREATOR_REFLECTION_HEADING = "Creator reflection";
export const MANIFEST_CREATOR_REFLECTION_SUCCESS_YES =
  "The creator felt this manifestation landed well.";
export const MANIFEST_CREATOR_REFLECTION_SUCCESS_NO =
  "The creator felt this did not land as hoped.";
export const MANIFEST_CREATOR_REFLECTION_SUCCESS_UNSURE =
  "The creator felt this is still unfolding or mixed.";

/** Similar manifestations on create (phase 5). */
export const SIMILAR_MANIFESTATIONS_HEADING =
  "Something similar may already be live";
export const SIMILAR_MANIFESTATIONS_HINT =
  "Updates as you type — same vibe matching as search. Consider holding an existing manifestation instead of starting a duplicate.";
export const SIMILAR_MANIFESTATIONS_NO_RESULTS =
  "Nothing quite matches yet — keep typing, or manifest your own if none of these fit.";
export const SIMILAR_MANIFESTATIONS_HOLD_LINK = "Hold this one instead →";

/** Share (phase 8). */
export const SHARE_LABEL = "Share";
export const SHARE_FACEBOOK = "Facebook";
export const SHARE_INSTAGRAM = "Instagram";
export const SHARE_LINK = "Link";
export const SHARE_COPY_SUCCESS = "Link copied — paste it wherever you like.";
export const SHARE_INSTAGRAM_COPY_SUCCESS =
  "Link copied — paste it in Instagram.";

/** Creator hold email updates (phase 9). */
export const NOTIFICATIONS_HEADING = "Hold updates by email";
export const NOTIFICATIONS_HINT =
  "When someone holds a manifestation you started, we can email you — never their private commitment notes.";
export const NOTIFICATIONS_ANONYMOUS_HINT =
  "Guest sessions cannot save email preferences — sign in with email first.";
export const NOTIFICATIONS_SAVE = "Save email preferences";
export const NOTIFICATIONS_SAVE_PENDING = "Saving…";
export const NOTIFICATIONS_SAVE_SUCCESS = "Email preferences saved.";
export const NOTIFICATIONS_FREQUENCY_LABEL = "When someone holds my manifestation";
export const NOTIFICATIONS_FREQUENCY_OFF = "Off";
export const NOTIFICATIONS_FREQUENCY_INSTANT = "Instant";
export const NOTIFICATIONS_FREQUENCY_DAILY = "Daily digest";
export const NOTIFICATIONS_FREQUENCY_WEEKLY = "Weekly digest";
export const NOTIFICATIONS_NOT_CONFIGURED =
  "Your preference is saved. Automated hold emails will send once email delivery is configured on the server (Resend).";
export const NOTIFICATIONS_MIGRATION_HINT =
  "Run docs/supabase-notifications-migration.sql in Supabase to enable saving hold email preferences.";
/** Header badge when the session is anonymous (not email-signed-in). */
export const AUTH_GUEST_BADGE = "Guest";
export const AUTH_GUEST_NAV_TITLE =
  "Browsing as guest — sign in with email to use your account across devices.";
export const AUTH_SIGN_OUT = "Sign out";

export const ACCOUNT_SIGNED_IN_AS = "Signed in as";
export const ACCOUNT_EMAIL_SESSION_HINT =
  "Your manifestations are tied to this email account across browsers and devices.";
export const ACCOUNT_GUEST_HEADING =
  "Browsing as guest — not signed in with email";
export const ACCOUNT_GUEST_BODY =
  "Manifestations you create or hold here belong to this browser session only. To see work from another device or an earlier email sign-in, use the same email below — the header should then show your address and Sign out.";
export const ACCOUNT_GUEST_EMPTY_HINT =
  "Don't see manifestations you expect? You may be on a new guest session. Sign in with the email you used before — not the same as having your email saved in the browser.";
export const SIGN_IN_GUEST_CONTEXT =
  "Enter your email and we'll send one link. If this browser has guest manifestations, we keep them when we can; if you already have an account with that email, we'll sign you into it automatically — no manual sign-out needed.";
export const SIGN_IN_ALREADY_SIGNED_IN =
  "You are already signed in with email.";
