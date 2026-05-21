import Link from "next/link";

import { ManifestationSearchForm } from "@/app/components/ManifestationSearchForm";
import { MANIFEST_NAV } from "@/lib/manifestations/intention-copy";

import { AuthNav } from "./AuthNav";

type SiteHeaderProps = {
  searchQuery?: string;
};

export function SiteHeader({ searchQuery = "" }: SiteHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-3 border-b border-stone-200/80 bg-white/70 px-4 py-4 backdrop-blur-sm dark:border-stone-700/80 dark:bg-stone-900/70 sm:px-8">
      <div className="flex w-full items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-violet-800 dark:text-violet-200"
        >
          Comanifest
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm font-medium text-stone-600 dark:text-stone-300 sm:gap-2">
          <div className="hidden min-w-0 md:flex">
            <ManifestationSearchForm defaultQuery={searchQuery} compact />
          </div>
          <Link
            href="/guidelines"
            className="rounded-full px-3 py-2 transition-colors hover:bg-violet-100 hover:text-violet-900 dark:hover:bg-stone-800 dark:hover:text-stone-50"
          >
            Guidelines
          </Link>
          <Link
            href="/manifestations"
            className="rounded-full px-3 py-2 transition-colors hover:bg-violet-100 hover:text-violet-900 dark:hover:bg-stone-800 dark:hover:text-stone-50"
          >
            Manifestations
          </Link>
          <Link
            href="/manifestations/new"
            className="rounded-full bg-violet-600 px-3 py-2 text-white shadow-sm transition-colors hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
          >
            {MANIFEST_NAV}
          </Link>
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
