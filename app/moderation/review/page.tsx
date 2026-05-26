import Link from "next/link";

import { SiteHeader } from "@/app/components/SiteHeader";
import {
  MODERATION_REVIEW_APPROVED_BODY,
  MODERATION_REVIEW_APPROVED_TITLE,
  MODERATION_REVIEW_DECLINED_BODY,
  MODERATION_REVIEW_DECLINED_TITLE,
  MODERATION_REVIEW_ERROR_TITLE,
} from "@/lib/manifestations/intention-copy";

type Props = {
  searchParams: Promise<{
    approved?: string;
    declined?: string;
    title?: string;
    error?: string;
  }>;
};

export default async function ModerationReviewResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const title = params.title?.trim();

  let heading = MODERATION_REVIEW_ERROR_TITLE;
  let body = params.error?.trim() || "This review link could not be completed.";
  let tone: "success" | "neutral" | "error" = "error";

  if (params.approved === "1") {
    heading = MODERATION_REVIEW_APPROVED_TITLE;
    body = title
      ? `${MODERATION_REVIEW_APPROVED_BODY} (“${title}”)`
      : MODERATION_REVIEW_APPROVED_BODY;
    tone = "success";
  } else if (params.declined === "1") {
    heading = MODERATION_REVIEW_DECLINED_TITLE;
    body = title
      ? `${MODERATION_REVIEW_DECLINED_BODY} (“${title}”)`
      : MODERATION_REVIEW_DECLINED_BODY;
    tone = "neutral";
  }

  const bannerClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100"
      : tone === "neutral"
        ? "border-stone-200 bg-stone-50 text-stone-800 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
        : "border-red-200 bg-red-50 text-red-950 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100";

  return (
    <div className="flex min-h-full flex-col design-page-shell">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
          {heading}
        </h1>
        <p className={`rounded-xl border px-3 py-2 text-sm leading-relaxed ${bannerClass}`}>
          {body}
        </p>
        <Link
          href="/manifestations"
          className="w-fit text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
        >
          ← Back to feed
        </Link>
      </main>
    </div>
  );
}
