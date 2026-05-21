"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ACCOUNT_NAV } from "@/lib/manifestations/intention-copy";

const SIGN_IN_LABEL = "Sign in with email";
const SIGN_OUT_LABEL = "Sign out";

function truncateEmail(email: string, max = 22) {
  if (email.length <= max) return email;
  const [local, domain] = email.split("@");
  if (!domain) return `${email.slice(0, max - 1)}…`;
  const keep = Math.max(4, max - domain.length - 2);
  return `${local.slice(0, keep)}…@${domain}`;
}

export function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const signInHref = `/sign-in?next=${encodeURIComponent(pathname || "/")}`;
  const [email, setEmail] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
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
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;
        const u = session?.user;
        setEmail(u?.email ?? null);
        setIsAnonymous(Boolean(u?.is_anonymous));
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

  const base =
    "rounded-full px-3 py-2 text-sm font-medium transition-colors sm:text-sm";
  const linkIdle =
    "text-stone-600 hover:bg-violet-100 hover:text-violet-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50";
  const signInAccent =
    "border border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/50";

  if (email && !isAnonymous) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
        <Link href="/account" className={`${base} ${linkIdle}`}>
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
          className={`${base} text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50`}
        >
          {SIGN_OUT_LABEL}
        </button>
      </div>
    );
  }

  if (isAnonymous) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
        <Link href="/account" className={`${base} ${linkIdle}`}>
          {ACCOUNT_NAV}
        </Link>
        <Link href={signInHref} className={`${base} ${signInAccent}`}>
          {SIGN_IN_LABEL}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
      <Link href={signInHref} className={`${base} ${signInAccent}`}>
        {SIGN_IN_LABEL}
      </Link>
    </div>
  );
}
