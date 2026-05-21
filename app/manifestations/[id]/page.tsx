import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JoinManifestationControl } from "../../components/JoinManifestationControl";
import { SiteHeader } from "../../components/SiteHeader";
import {
  holdingCountLabel,
  MANIFEST_ENDS_LABEL,
} from "@/lib/manifestations/intention-copy";
import { formatManifestationDate } from "@/lib/manifestations/dates";
import { getManifestationById } from "@/lib/manifestations/queries";
import { isManifestationOpenForHolds } from "@/lib/manifestations/lifecycle";
import { MANIFESTATION_CATEGORY_LABELS } from "@/lib/types/manifestation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getManifestationById(id);
  if (!result) {
    return { title: "Manifestation — Comanifest" };
  }
  const description =
    result.row.intention.length > 160
      ? `${result.row.intention.slice(0, 157)}…`
      : result.row.intention;
  return {
    title: `${result.row.title} — Comanifest`,
    description,
  };
}

export default async function ManifestationDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getManifestationById(id);
  if (!result) {
    notFound();
  }

  const { row, hint, viewer_has_joined, viewer_is_creator, source } = result;
  const label =
    MANIFESTATION_CATEGORY_LABELS[row.category] ?? row.category;

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/manifestations"
          className="w-fit text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
        >
          ← All manifestations
        </Link>

        {hint ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            {hint}
          </p>
        ) : null}

        <article className="flex flex-col gap-4 rounded-2xl border border-stone-200/90 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-stone-700/90 dark:bg-stone-800/50 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
              {label}
            </span>
            <span>{formatManifestationDate(row.created_at)}</span>
            <span className="text-stone-400 dark:text-stone-500">
              · {MANIFEST_ENDS_LABEL.toLowerCase()}{" "}
              {formatManifestationDate(row.ends_at)}
            </span>
          </div>

          <h1 className="text-2xl font-semibold leading-snug text-stone-900 dark:text-stone-50 sm:text-3xl">
            {row.title}
          </h1>

          <p className="text-base leading-relaxed text-stone-700 dark:text-stone-200">
            {row.intention}
          </p>

          <div className="flex flex-col gap-4 border-t border-stone-100 pt-4 dark:border-stone-700/80">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {holdingCountLabel(row.join_count)}
            </p>
            <JoinManifestationControl
              manifestationId={row.id}
              joinsEnabled={
                source === "live" && isManifestationOpenForHolds(row)
              }
              viewerHasJoined={viewer_has_joined}
              viewerIsCreator={viewer_is_creator}
              variant="detail"
            />
          </div>        </article>

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
