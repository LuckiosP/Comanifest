import Link from "next/link";

import { FeedSortLinks, ManifestationCard } from "../components/ManifestationCard";
import { ManifestationSearchForm } from "../components/ManifestationSearchForm";
import { SiteHeader } from "../components/SiteHeader";
import {
  MANIFEST_CTA,
  SEARCH_NO_RESULTS,
} from "@/lib/manifestations/intention-copy";
import { isManifestationOpenForHolds } from "@/lib/manifestations/lifecycle";
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
  const { rows, hint, source, searchQuery } = await listManifestations(
    sortKey,
    q,
  );
  const isSearching = searchQuery.length > 0;

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader searchQuery={searchQuery} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
                Manifestations
              </h1>
              <p className="mt-1 text-stone-600 dark:text-stone-300">
                Browse what the community is holding together right now.
              </p>
            </div>
            <FeedSortLinks current={sortKey} searchQuery={searchQuery} />
          </div>
          <ManifestationSearchForm defaultQuery={searchQuery} sort={sortKey} />
        </div>

        {hint ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            {hint}
          </p>
        ) : null}

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center dark:border-stone-600 dark:bg-stone-800/40">
            <p className="text-stone-700 dark:text-stone-200">
              {isSearching ? SEARCH_NO_RESULTS : "No manifestations yet — yours can be the first."}
            </p>
            {isSearching ? (
              <Link
                href="/manifestations"
                className="mt-4 inline-flex text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
              >
                Clear search →
              </Link>
            ) : (
              <Link
                href="/manifestations/new"
                className="mt-4 inline-flex text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
              >
                {MANIFEST_CTA} →
              </Link>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {rows.map((m) => (
              <li key={m.id}>
                <ManifestationCard
                  manifestation={m}
                  joinsEnabled={
                    source === "live" && isManifestationOpenForHolds(m)
                  }
                  withdrawEnabled={source === "live"}
                />
              </li>
            ))}
          </ul>
        )}

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
