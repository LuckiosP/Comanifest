"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ManifestationHeaderSearch } from "@/app/components/ManifestationHeaderSearch";
import { BROWSE_NAV, MANIFEST_NAV } from "@/lib/manifestations/intention-copy";

import { AuthNav } from "./AuthNav";

type SiteNavProps = {
  searchQuery?: string;
  hideSearch?: boolean;
};

const navLinkBase =
  "rounded-full px-3 py-2 text-sm font-medium transition-colors";

function navLinkClass(active: boolean) {
  return active
    ? `${navLinkBase} bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100`
    : `${navLinkBase} text-stone-600 hover:bg-violet-100 hover:text-violet-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50`;
}

function isGuidelinesActive(pathname: string) {
  return pathname === "/guidelines" || pathname.startsWith("/guidelines/");
}

function isManifestationsActive(pathname: string) {
  if (pathname === "/manifestations") return true;
  if (!pathname.startsWith("/manifestations/")) return false;
  return !pathname.startsWith("/manifestations/new");
}

function isManifestActive(pathname: string) {
  return pathname.startsWith("/manifestations/new");
}

export function SiteManifestButton() {
  const pathname = usePathname() ?? "";
  const active = isManifestActive(pathname);

  return (
    <Link
      href="/manifestations/new"
      className={
        active
          ? "inline-flex items-center rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-2 ring-violet-300 ring-offset-1 transition-colors hover:bg-violet-800 dark:bg-violet-500 dark:ring-violet-600 dark:ring-offset-stone-900 dark:hover:bg-violet-400"
          : "inline-flex items-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
      }
    >
      {MANIFEST_NAV}
    </Link>
  );
}

export function SiteNav({ searchQuery = "", hideSearch = false }: SiteNavProps) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="relative flex items-center gap-1 sm:gap-2">
      {!hideSearch ? (
        <div className="hidden min-w-0 md:flex">
          <ManifestationHeaderSearch defaultQuery={searchQuery} />
        </div>
      ) : null}

      <div className="hidden items-center gap-1 sm:gap-2 md:flex">
        <Link
          href="/guidelines"
          className={navLinkClass(isGuidelinesActive(pathname))}
        >
          Guidelines
        </Link>
        <Link
          href="/manifestations"
          className={navLinkClass(isManifestationsActive(pathname))}
        >
          {BROWSE_NAV}
        </Link>
        <AuthNav />
      </div>

      <div className="flex items-center md:hidden">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-stone-300 bg-white p-2 text-stone-700 shadow-sm transition hover:border-violet-300 hover:text-violet-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-violet-600 dark:hover:text-violet-100"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">
            {mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          </span>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
          >
            {mobileOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl border border-stone-200 bg-white p-2 text-sm shadow-lg ring-1 ring-black/5 dark:border-stone-700 dark:bg-stone-900">
          <Link
            href="/guidelines"
            className={`${navLinkBase} block w-full text-left`}
          >
            Guidelines
          </Link>
          <Link
            href="/manifestations"
            className={`${navLinkBase} block w-full text-left`}
          >
            {BROWSE_NAV}
          </Link>
          <div className="mt-1 border-t border-stone-200 pt-1 dark:border-stone-700">
            <AuthNav />
          </div>
        </div>
      ) : null}
    </nav>
  );
}

