import Link from "next/link";

import { DeclineReviewForm } from "@/app/components/DeclineReviewForm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { MODERATION_DECLINE_HEADING } from "@/lib/manifestations/intention-copy";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ModerationDeclinePage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            {MODERATION_DECLINE_HEADING}
          </h1>
        </div>

        {!token?.trim() ? (
          <p className="text-sm text-stone-600 dark:text-stone-300">
            This decline link is missing its token. Use the link from the review
            email.
          </p>
        ) : (
          <DeclineReviewForm token={token.trim()} />
        )}

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
