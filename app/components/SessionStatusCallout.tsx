import Link from "next/link";

import {
  ACCOUNT_EMAIL_SESSION_HINT,
  ACCOUNT_GUEST_BODY,
  ACCOUNT_GUEST_HEADING,
  ACCOUNT_SIGNED_IN_AS,
} from "@/lib/manifestations/intention-copy";

type SessionStatusCalloutProps = {
  variant: "guest" | "email";
  email?: string;
  signInHref?: string;
  /** When false, omits the sign-in link (e.g. already on the sign-in page). */
  showSignInLink?: boolean;
};

export function SessionStatusCallout({
  variant,
  email,
  signInHref = "/sign-in?next=/account",
  showSignInLink = true,
}: SessionStatusCalloutProps) {
  if (variant === "email" && email) {
    return (
      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/25 dark:text-emerald-100">
        <p>
          {ACCOUNT_SIGNED_IN_AS}{" "}
          <span className="font-medium">{email}</span>
        </p>
        <p className="mt-1 text-emerald-900/90 dark:text-emerald-200/90">
          {ACCOUNT_EMAIL_SESSION_HINT}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-violet-200/80 bg-violet-50/70 px-4 py-3 text-sm text-violet-950 dark:border-violet-900/50 dark:bg-violet-950/25 dark:text-violet-100">
      <p className="font-medium">{ACCOUNT_GUEST_HEADING}</p>
      <p className="mt-1 leading-relaxed">{ACCOUNT_GUEST_BODY}</p>
      {showSignInLink ? (
        <p className="mt-2">
          <Link
            href={signInHref}
            className="font-medium underline-offset-2 hover:underline"
          >
            Sign in with email →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
