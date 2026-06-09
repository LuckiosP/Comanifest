"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  holdingCountLabel,
  HOME_MANIFEST_PLACEHOLDER,
  HOME_MANIFEST_SUBMIT,
  HOME_SIMILAR_HEADING,
  HOME_START_OWN,
  HOME_START_OWN_HINT,
  HOME_TAGLINE,
  SIMILAR_MANIFESTATIONS_HOLD_LINK,
} from "@/lib/manifestations/intention-copy";
import {
  rankSimilarManifestations,
  shouldShowSimilarSuggestions,
} from "@/lib/manifestations/similar-ranking";
import type { ManifestationListRow } from "@/lib/types/manifestation";

type HomeManifestHubProps = {
  candidates: ManifestationListRow[];
  similarSource: "live" | "sample";
};

export function HomeManifestHub({
  candidates,
  similarSource,
}: HomeManifestHubProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const showSuggestions =
    similarSource === "live" && shouldShowSimilarSuggestions(query, query);

  const matches = useMemo(
    () => rankSimilarManifestations(candidates, query, query),
    [candidates, query],
  );

  const createHref =
    query.trim().length > 0
      ? `/manifestations/new?q=${encodeURIComponent(query.trim())}`
      : "/manifestations/new";

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
      <p className="text-sm text-stone-500 dark:text-stone-400">{HOME_TAGLINE}</p>

      <form
        className="flex w-full flex-col items-center gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          router.push(createHref);
        }}
      >
        <label className="sr-only" htmlFor="home-manifest-query">
          {HOME_MANIFEST_PLACEHOLDER}
        </label>
        <input
          id="home-manifest-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={HOME_MANIFEST_PLACEHOLDER}
          maxLength={100}
          autoComplete="off"
          autoFocus
          className="min-h-12 w-full rounded-full border border-stone-200 bg-white px-5 py-3 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-violet-500 dark:focus:ring-violet-900"
        />
        <button
          type="submit"
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-violet-600 px-8 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md dark:bg-violet-500 dark:hover:bg-violet-400"
        >
          {HOME_MANIFEST_SUBMIT}
        </button>
      </form>

      {showSuggestions ? (
        <div className="w-full">
          {matches.length > 0 ? (
            <section aria-live="polite" className="w-full">
              <h2 className="text-center text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {HOME_SIMILAR_HEADING}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {matches.map((row) => (
                  <li key={row.id}>
                    <Link
                      href={`/manifestations/${row.id}`}
                      className="block rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 transition hover:border-violet-300 hover:bg-white dark:border-stone-700 dark:bg-stone-900/50 dark:hover:border-violet-600"
                    >
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
                        {row.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                        {row.intention}
                      </p>
                      <p className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <span>{holdingCountLabel(row.join_count)}</span>
                        <span className="font-medium text-violet-700 dark:text-violet-300">
                          {SIMILAR_MANIFESTATIONS_HOLD_LINK}
                        </span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-4 text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {HOME_START_OWN_HINT}
            </p>
            <Link
              href={createHref}
              className="mt-2 inline-flex text-sm font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
            >
              {HOME_START_OWN} →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
