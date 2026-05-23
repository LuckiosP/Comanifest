import Link from "next/link";
import type { ReactNode } from "react";

import { CreatorManifestationActions } from "@/app/components/CreatorManifestationActions";
import { CreatorReflectionPanel } from "@/app/components/CreatorReflectionPanel";
import { JoinManifestationControl } from "@/app/components/JoinManifestationControl";
import { ShareManifestationControl } from "@/app/components/ShareManifestationControl";
import {
  holdingCountLabel,
  MANIFEST_ENDS_LABEL,
  SHARE_LABEL,
} from "@/lib/manifestations/intention-copy";
import { formatManifestationDate } from "@/lib/manifestations/dates";
import { isManifestationClosable } from "@/lib/manifestations/lifecycle";
import {
  MANIFESTATION_CATEGORY_LABELS,
  MANIFESTATION_STATUS_LABELS,
  type ManifestationListRow,
} from "@/lib/types/manifestation";

type ManifestationCardProps = {
  manifestation: ManifestationListRow;
  joinsEnabled: boolean;
  withdrawEnabled?: boolean;
  showStatus?: boolean;
  showEditLink?: boolean;
  showCreatorActions?: boolean;
  showShare?: boolean;
};

function CardSection({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-stone-100 pt-3 dark:border-stone-700/80">
      {label ? (
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export function ManifestationCard({
  manifestation,
  joinsEnabled,
  withdrawEnabled = joinsEnabled,
  showStatus = false,
  showEditLink = false,
  showCreatorActions = false,
  showShare = false,
}: ManifestationCardProps) {
  const label =
    MANIFESTATION_CATEGORY_LABELS[manifestation.category] ??
    manifestation.category;
  const isSample = manifestation.id.startsWith("sample-");
  const showManage =
    showCreatorActions && manifestation.viewer_is_creator && !isSample;
  const showShareSection = showShare && !isSample;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-stone-700/90 dark:bg-stone-800/50">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
          {label}
        </span>
        <span>{formatManifestationDate(manifestation.created_at)}</span>
        <span className="text-stone-400 dark:text-stone-500">
          · {MANIFEST_ENDS_LABEL.toLowerCase()}{" "}
          {formatManifestationDate(manifestation.ends_at)}
        </span>
        {showStatus && manifestation.status !== "active" ? (
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-stone-700 dark:bg-stone-700/60 dark:text-stone-200">
            {MANIFESTATION_STATUS_LABELS[manifestation.status]}
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
      <CreatorReflectionPanel manifestation={manifestation} />

      <CardSection>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {holdingCountLabel(manifestation.join_count)}
        </p>
        <JoinManifestationControl
          manifestationId={manifestation.id}
          joinsEnabled={joinsEnabled}
          withdrawEnabled={withdrawEnabled}
          viewerHasJoined={manifestation.viewer_has_joined}
          viewerIsCreator={manifestation.viewer_is_creator}
          variant="card"
        />
      </CardSection>

      {showShareSection ? (
        <CardSection label={SHARE_LABEL}>
          <ShareManifestationControl
            manifestationId={manifestation.id}
            title={manifestation.title}
            compact
          />
        </CardSection>
      ) : null}

      {showManage ? (
        <CreatorManifestationActions
          manifestationId={manifestation.id}
          status={manifestation.status}
          joinCount={manifestation.join_count}
          endsAt={manifestation.ends_at}
          showEditLink={showEditLink}
          showClose={isManifestationClosable(manifestation)}
        />
      ) : null}

      {isSample ? (
        <p className="text-xs text-amber-700/90 dark:text-amber-300/90">
          Example card — not stored in your database.
        </p>
      ) : null}
    </article>
  );
}

export function FeedSortLinks({
  current,
  searchQuery,
}: {
  current: "newest" | "joined";
  searchQuery?: string;
}) {
  const base =
    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors";
  const active =
    "bg-violet-600 text-white dark:bg-violet-500 dark:text-white";
  const idle =
    "text-stone-600 hover:bg-violet-100 hover:text-violet-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50";

  const q = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
  const qOnly = searchQuery
    ? `?q=${encodeURIComponent(searchQuery)}`
    : "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-stone-500 dark:text-stone-400">Sort:</span>
      <Link
        href={`/manifestations${qOnly}`}
        className={`${base} ${current === "newest" ? active : idle}`}
      >
        Newest
      </Link>
      <Link
        href={`/manifestations?sort=joined${q}`}
        className={`${base} ${current === "joined" ? active : idle}`}
      >
        Widest circle
      </Link>
    </div>
  );
}
