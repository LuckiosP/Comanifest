"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ManifestationCard, FeedSortLinks } from "@/app/components/ManifestationCard";
import {
  MANIFEST_CTA,
  searchManifestCtaLabel,
  SEARCH_CLEAR,
  SEARCH_HINT,
  SEARCH_NO_RESULTS,
  SEARCH_PLACEHOLDER,
} from "@/lib/manifestations/intention-copy";
import { isManifestationOpenForHolds } from "@/lib/manifestations/lifecycle";
import {
  normalizeSearchQuery,
  rankManifestationsBySearch,
} from "@/lib/manifestations/search";
import type { ManifestationSort } from "@/lib/manifestations/queries";
import type { ManifestationListRow } from "@/lib/types/manifestation";

const inputClass =
  "w-full rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type ManifestationFeedWithSearchProps = {
  rows: ManifestationListRow[];
  sort: ManifestationSort;
  source: "live" | "sample";
  initialQuery?: string;
};

function sortRows(rows: ManifestationListRow[], sort: ManifestationSort) {
  const copy = [...rows];
  if (sort === "joined") {
    return copy.sort(
      (a, b) =>
        b.join_count - a.join_count ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
  return copy.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function ManifestationFeedWithSearch({
  rows,
  sort,
  source,
  initialQuery = "",
}: ManifestationFeedWithSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const syncUrl = useCallback(
    (value: string) => {
      const normalized = normalizeSearchQuery(value);
      const params = new URLSearchParams();
      if (sort !== "newest") {
        params.set("sort", sort);
      }
      if (normalized) {
        params.set("q", normalized);
      }
      const qs = params.toString();
      router.replace(qs ? `/manifestations?${qs}` : "/manifestations", {
        scroll: false,
      });
    },
    [router, sort],
  );

  const filteredRows = useMemo(() => {
    const normalized = normalizeSearchQuery(query);
    if (!normalized) {
      return sortRows(rows, sort);
    }
    const ranked = rankManifestationsBySearch(rows, normalized);
    if (sort === "joined") {
      return [...ranked].sort(
        (a, b) =>
          b.join_count - a.join_count ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    return ranked;
  }, [query, rows, sort]);

  const topSuggestions = useMemo(() => {
    const normalized = normalizeSearchQuery(query);
    if (!normalized) {
      return [];
    }
    return rankManifestationsBySearch(rows, normalized).slice(0, 4);
  }, [query, rows]);

  const isSearching = normalizeSearchQuery(query).length > 0;

  return (
    <>
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
          <FeedSortLinks current={sort} searchQuery={normalizeSearchQuery(query)} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="sr-only">
            {SEARCH_PLACEHOLDER}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              syncUrl(value);
            }}
            placeholder={SEARCH_PLACEHOLDER}
            maxLength={100}
            autoComplete="off"
            className={inputClass}
          />
          <p className="text-xs text-stone-500 dark:text-stone-400">{SEARCH_HINT}</p>
          {isSearching ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                syncUrl("");
              }}
              className="w-fit cursor-pointer text-sm font-medium text-stone-600 underline-offset-2 hover:underline dark:text-stone-400"
            >
              {SEARCH_CLEAR}
            </button>
          ) : null}
        </div>

        {isSearching && topSuggestions.length > 0 ? (
          <div className="rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 dark:border-violet-900/40 dark:bg-violet-950/20">
            <p className="text-xs font-medium uppercase tracking-wide text-violet-800 dark:text-violet-200">
              Suggestions while you type
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {topSuggestions.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/manifestations/${item.id}`}
                    className="text-sm text-violet-900 underline-offset-2 hover:underline dark:text-violet-100"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-8 text-center dark:border-stone-600 dark:bg-stone-800/40">
          <p className="text-stone-700 dark:text-stone-200">
            {isSearching
              ? SEARCH_NO_RESULTS
              : "No manifestations yet — yours can be the first."}
          </p>
          {isSearching ? (
            <div className="mt-5 flex flex-col items-center gap-3">
              <Link
                href={`/manifestations/new?q=${encodeURIComponent(
                  normalizeSearchQuery(query),
                )}`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {searchManifestCtaLabel(query)}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  syncUrl("");
                }}
                className="inline-flex cursor-pointer text-sm font-medium text-stone-600 underline-offset-2 hover:underline dark:text-stone-400"
              >
                {SEARCH_CLEAR}
              </button>
            </div>
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
          {filteredRows.map((m) => (
            <li key={m.id}>
              <ManifestationCard
                manifestation={m}
                joinsEnabled={
                  source === "live" && isManifestationOpenForHolds(m)
                }
                withdrawEnabled={source === "live"}
                showShare={
                  source === "live" &&
                  (m.viewer_is_creator || m.viewer_has_joined)
                }
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
