import Link from "next/link";

import { ApproveReviewForm } from "@/app/components/ApproveReviewForm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { MODERATION_APPROVE_HEADING } from "@/lib/manifestations/intention-copy";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ModerationApprovePage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-full flex-col design-page-shell">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            {MODERATION_APPROVE_HEADING}
          </h1>
        </div>

        {!token?.trim() ? (
          <p className="text-sm text-stone-600 dark:text-stone-300">
            This approve link is missing its token. Use the link from the review
            email.
          </p>
        ) : (
          <ApproveReviewForm token={token.trim()} />
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
