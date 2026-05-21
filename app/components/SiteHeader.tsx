import Link from "next/link";

import { SiteManifestButton, SiteNav } from "@/app/components/SiteNav";

type SiteHeaderProps = {
  searchQuery?: string;
  hideSearch?: boolean;
};

export function SiteHeader({
  searchQuery = "",
  hideSearch = false,
}: SiteHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-3 border-b border-stone-200/80 bg-white/70 px-4 py-4 backdrop-blur-sm dark:border-stone-700/80 dark:bg-stone-900/70 sm:px-8">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-violet-800 dark:text-violet-200"
          >
            Comanifest
          </Link>
          <SiteManifestButton />
        </div>
        <SiteNav searchQuery={searchQuery} hideSearch={hideSearch} />
      </div>
    </header>
  );
}
