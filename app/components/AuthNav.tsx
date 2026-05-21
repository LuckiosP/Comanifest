"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { accountEmailLabel, isGuestSession } from "@/lib/auth/session-kind";
import { ACCOUNT_NAV } from "@/lib/manifestations/intention-copy";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const SIGN_IN_LABEL = "Sign in with email";
const SIGN_OUT_LABEL = "Sign out";

function truncateEmail(email: string, max = 22) {
  if (email.length <= max) return email;
  const [local, domain] = email.split("@");
  if (!domain) return `${email.slice(0, max - 1)}…`;
  const keep = Math.max(4, max - domain.length - 2);
  return `${local.slice(0, keep)}…@${domain}`;
}

function navLinkClass(active: boolean) {
  const base =
    "rounded-full px-3 py-2 text-sm font-medium transition-colors sm:text-sm";
  return active
    ? `${base} bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100`
    : `${base} text-stone-600 hover:bg-violet-100 hover:text-violet-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50`;
}

function navForUser(
  user: User | null,
  signInHref: string,
  signOut: () => void,
  pathname: string,
) {
  const signInAccent =
    "rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/50 sm:text-sm";
  const signInActive =
    "rounded-full bg-violet-100 px-3 py-2 text-sm font-medium text-violet-900 transition-colors dark:bg-violet-900/50 dark:text-violet-100 sm:text-sm";

  const email = accountEmailLabel(user ?? undefined);
  const accountActive = pathname === "/account" || pathname.startsWith("/account/");
  const signInActiveState = pathname === "/sign-in" || pathname.startsWith("/sign-in/");

  if (email) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
        <Link href="/account" className={navLinkClass(accountActive)}>
          {ACCOUNT_NAV}
        </Link>
        <span
          className="max-w-[10rem] truncate text-xs text-stone-500 dark:text-stone-400 sm:max-w-[12rem] sm:text-sm"
          title={email}
        >
          {truncateEmail(email)}
        </span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50 sm:text-sm"
        >
          {SIGN_OUT_LABEL}
        </button>
      </div>
    );
  }

  if (user && isGuestSession(user)) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
        <Link href="/account" className={navLinkClass(accountActive)}>
          {ACCOUNT_NAV}
        </Link>
        <Link
          href={signInHref}
          className={signInActiveState ? signInActive : signInAccent}
        >
          {SIGN_IN_LABEL}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
      <Link
        href={signInHref}
        className={signInActiveState ? signInActive : signInAccent}
      >
        {SIGN_IN_LABEL}
      </Link>
    </div>
  );
}

export function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const signInHref = `/sign-in?next=${encodeURIComponent(pathname || "/")}`;
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(() => !isSupabaseConfigured());

  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | undefined;

    void (async () => {
      if (!isSupabaseConfigured()) {
        return;
      }

      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        if (!cancelled) setReady(true);
        return;
      }

      const sync = async () => {
        const {
          data: { user: nextUser },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        setUser(nextUser);
        setReady(true);
      };

      await sync();

      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(() => {
        void sync();
      });
      subscription = sub;
    })();

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.refresh();
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!ready) {
    return (
      <span className="rounded-full px-3 py-2 text-xs text-stone-400 dark:text-stone-500">
        …
      </span>
    );
  }

  return navForUser(user, signInHref, signOut, pathname || "");
}
