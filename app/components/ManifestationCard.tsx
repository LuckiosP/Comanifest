import Link from "next/link";

import { JoinManifestationControl } from "@/app/components/JoinManifestationControl";
import { holdingCountLabel } from "@/lib/manifestations/intention-copy";
import {
  MANIFESTATION_CATEGORY_LABELS,
  type ManifestationListRow,
} from "@/lib/types/manifestation";

type ManifestationCardProps = {
  manifestation: ManifestationListRow;
  joinsEnabled: boolean;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ManifestationCard({
  manifestation,
  joinsEnabled,
}: ManifestationCardProps) {
  const label =
    MANIFESTATION_CATEGORY_LABELS[manifestation.category] ??
    manifestation.category;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-stone-700/90 dark:bg-stone-800/50">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
          {label}
        </span>
        <span>{formatDate(manifestation.created_at)}</span>
        {manifestation.timeframe ? (
          <span className="text-stone-400 dark:text-stone-500">
            · {manifestation.timeframe}
          </span>
        ) : null}
      </div>
      <h2 className="text-lg font-semibold leading-snug text-stone-900 dark:text-stone-50">
        <Link
          href={`/manifestations/${manifestation.id}`}
          className="text-inherit transition-colors hover:text-violet-700 dark:hover:text-violet-300"
        >
          {manifestation.title}
        </Link>
      </h2>
      <p className="line-clamp-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        {manifestation.intention}
      </p>
      <div className="flex flex-col gap-3 border-t border-stone-100 pt-3 dark:border-stone-700/80">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {holdingCountLabel(manifestation.join_count)}
          </p>
          <div className="flex min-w-0 flex-1 justify-end sm:max-w-[58%]">
            <JoinManifestationControl
              manifestationId={manifestation.id}
              joinsEnabled={joinsEnabled}
              viewerHasJoined={manifestation.viewer_has_joined}
              viewerIsCreator={manifestation.viewer_is_creator}
              variant="card"
            />
          </div>
        </div>
      </div>
      {manifestation.id.startsWith("sample-") ? (
        <p className="text-xs text-amber-700/90 dark:text-amber-300/90">
          Example card — not stored in your database.
        </p>
      ) : null}
    </article>
  );
}

export function FeedSortLinks({ current }: { current: "newest" | "joined" }) {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors";
  const active =
    "bg-violet-600 text-white dark:bg-violet-500 dark:text-white";
  const idle =
    "text-stone-600 hover:bg-violet-100 hover:text-violet-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-stone-500 dark:text-stone-400">Sort:</span>
      <Link
        href="/manifestations"
        className={`${base} ${current === "newest" ? active : idle}`}
      >
        Newest
      </Link>
      <Link
        href="/manifestations?sort=joined"
        className={`${base} ${current === "joined" ? active : idle}`}
      >
        Widest circle
      </Link>
    </div>
  );
}
