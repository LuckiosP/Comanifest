import Link from "next/link";

import { CreateManifestationForm } from "../../components/CreateManifestationForm";
import { SiteHeader } from "../../components/SiteHeader";
import { MANIFEST_CTA } from "@/lib/manifestations/intention-copy";
import { probeManifestationsTable } from "@/lib/manifestations/queries";

export default async function NewManifestationPage() {
  const { hint: supabaseHint } = await probeManifestationsTable();

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            {MANIFEST_CTA}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-300">
            Name what you want to manifest — a hopeful outcome others can hold
            with you. Keep it kind, inclusive, and free of harm — see{" "}
            <Link
              href="/guidelines"
              className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
            >
              community guidelines
            </Link>
            .
          </p>
        </div>

        {supabaseHint ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            {supabaseHint}
          </p>
        ) : null}

        <CreateManifestationForm />

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
