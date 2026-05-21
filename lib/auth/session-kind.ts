import type { User } from "@supabase/supabase-js";

/** Signed in with a confirmed email — not a guest-only session. */
export function isEmailSignedInUser(user: User | null | undefined): boolean {
  if (!user?.email?.trim()) {
    return false;
  }
  if (!user.is_anonymous) {
    return true;
  }
  return Boolean(user.email_confirmed_at);
}

/** Anonymous guest session (manifest/hold without email sign-in). */
export function isGuestSession(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }
  return !isEmailSignedInUser(user);
}

export function accountEmailLabel(user: User | null | undefined): string | null {
  if (!user) {
    return null;
  }
  const email = user.email?.trim();
  if (!email || !isEmailSignedInUser(user)) {
    return null;
  }
  return email;
}
