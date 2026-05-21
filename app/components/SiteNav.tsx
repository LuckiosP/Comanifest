"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ManifestationHeaderSearch } from "@/app/components/ManifestationHeaderSearch";
import { MANIFEST_NAV } from "@/lib/manifestations/intention-copy";

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

  return (
    <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
      {!hideSearch ? (
        <div className="hidden min-w-0 md:flex">
          <ManifestationHeaderSearch defaultQuery={searchQuery} />
        </div>
      ) : null}
      <Link href="/guidelines" className={navLinkClass(isGuidelinesActive(pathname))}>
        Guidelines
      </Link>
      <Link
        href="/manifestations"
        className={navLinkClass(isManifestationsActive(pathname))}
      >
        Manifestations
      </Link>
      <AuthNav />
    </nav>
  );
}
