import Link from "next/link";

import { ManifestationFeedWithSearch } from "../components/ManifestationFeedWithSearch";
import { SiteHeader } from "../components/SiteHeader";
import { normalizeSearchQuery } from "@/lib/manifestations/search";
import {
  listManifestations,
  type ManifestationSort,
} from "@/lib/manifestations/queries";

export default async function ManifestationsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const { sort, q } = await searchParams;
  const sortKey: ManifestationSort =
    sort === "joined" ? "joined" : "newest";
  const searchQuery = normalizeSearchQuery(q);
  const { rows, hint, source } = await listManifestations(sortKey);

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader searchQuery={searchQuery} hideSearch />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        {hint ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            {hint}
          </p>
        ) : null}

        <ManifestationFeedWithSearch
          rows={rows}
          sort={sortKey}
          source={source}
          initialQuery={searchQuery}
        />

        <Link
          href="/"
          className="w-fit text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
        >
          ← Back home
        </Link>
      </main>
    </div>
  );
}
