import type { SupabaseClient } from "@supabase/supabase-js";

import { formatAuthError } from "@/lib/auth/format-auth-error";

import { isEmailSignedInUser, isGuestSession } from "./session-kind";

export function isEmailAlreadyRegisteredMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("already") ||
    lower.includes("registered") ||
    lower.includes("exists") ||
    lower.includes("taken")
  );
}

export type SignInEmailMode = "link-guest" | "magic-link" | "existing-account";

export type SendSignInEmailResult =
  | { ok: true; mode: SignInEmailMode }
  | { ok: false; message: string };

export async function sendSignInEmail(
  supabase: SupabaseClient,
  email: string,
  redirectTo: string,
): Promise<SendSignInEmailResult> {
  const trimmed = email.trim();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isEmailSignedInUser(user)) {
    return { ok: false, message: "You are already signed in with email." };
  }

  if (isGuestSession(user)) {
    const { error: linkError } = await supabase.auth.updateUser(
      { email: trimmed },
      { emailRedirectTo: redirectTo },
    );

    if (!linkError) {
      return { ok: true, mode: "link-guest" };
    }

    if (isEmailAlreadyRegisteredMessage(formatAuthError(linkError))) {
      await supabase.auth.signOut();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        return { ok: false, message: formatAuthError(otpError) };
      }

      return { ok: true, mode: "existing-account" };
    }

    return { ok: false, message: formatAuthError(linkError) };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { ok: false, message: formatAuthError(error) };
  }

  return { ok: true, mode: "magic-link" };
}

export function signInEmailSuccessMessage(mode: SignInEmailMode): string {
  switch (mode) {
    case "link-guest":
      return "Check your inbox for a confirmation link. Open it in this same browser so guest manifestations on this device stay on your account.";
    case "existing-account":
      return "That email already has an account — we sent a fresh sign-in link. Open it in this browser. You do not need to sign out manually.";
    case "magic-link":
      return "Check your inbox for a sign-in link. If nothing arrives in a minute, look in spam, or confirm Email auth is enabled in your Supabase project.";
  }
}
