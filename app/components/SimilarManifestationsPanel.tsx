"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchSimilarManifestations } from "@/app/actions/similar-manifestations";
import {
  holdingCountLabel,
  SIMILAR_MANIFESTATIONS_HEADING,
  SIMILAR_MANIFESTATIONS_HINT,
  SIMILAR_MANIFESTATIONS_HOLD_LINK,
  SIMILAR_MANIFESTATIONS_LOADING,
} from "@/lib/manifestations/intention-copy";
import type { ManifestationListRow } from "@/lib/types/manifestation";

type SimilarManifestationsPanelProps = {
  title: string;
  intention: string;
};

export function SimilarManifestationsPanel({
  title,
  intention,
}: SimilarManifestationsPanelProps) {
  const [rows, setRows] = useState<ManifestationListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const combined = `${title.trim()} ${intention.trim()}`.trim();
    if (combined.length < 8) {
      setRows([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = window.setTimeout(() => {
      void (async () => {
        const result = await fetchSimilarManifestations(title, intention);
        if (cancelled) return;
        setLoading(false);
        if (result.error) {
          setError(result.error);
          setRows([]);
          return;
        }
        setRows(result.rows);
      })();
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [title, intention]);

  if (!loading && rows.length === 0 && !error) {
    return null;
  }

  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-violet-200/80 bg-violet-50/60 p-4 dark:border-violet-900/50 dark:bg-violet-950/25"
    >
      <h2 className="text-sm font-semibold text-violet-950 dark:text-violet-100">
        {SIMILAR_MANIFESTATIONS_HEADING}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-violet-900/80 dark:text-violet-200/80">
        {SIMILAR_MANIFESTATIONS_HINT}
      </p>

      {loading ? (
        <p className="mt-3 text-sm text-violet-800/80 dark:text-violet-200/80">
          {SIMILAR_MANIFESTATIONS_LOADING}
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-amber-900 dark:text-amber-200">{error}</p>
      ) : null}

      {!loading && rows.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-xl border border-violet-200/70 bg-white/80 px-3 py-2.5 dark:border-violet-900/40 dark:bg-stone-900/40"
            >
              <p className="text-sm font-medium text-stone-900 dark:text-stone-50">
                {row.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                {row.intention}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {holdingCountLabel(row.join_count)}
                </span>
                <Link
                  href={`/manifestations/${row.id}`}
                  className="text-xs font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
                >
                  {SIMILAR_MANIFESTATIONS_HOLD_LINK}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
