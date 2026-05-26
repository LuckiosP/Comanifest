import Link from "next/link";

import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import {
  FEATURE_SUGGESTIONS_BODY,
  FEATURE_SUGGESTIONS_EMAIL,
  FEATURE_SUGGESTIONS_HEADING,
  MANIFEST_CTA,
} from "@/lib/manifestations/intention-copy";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col design-page-shell">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-12 sm:px-8 sm:py-16">
        <section className="flex flex-col gap-6 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-violet-700 dark:text-violet-300">
            Collective intention, together
          </p>
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl sm:leading-tight">
            Manifest what matters — with a community behind you
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-stone-600 dark:text-stone-300 sm:max-w-2xl">
            Comanifest is a space to name a hopeful outcome, invite others to hold
            the manifestation with you, and grow a shared sense of possibility.
            It&apos;s playful, sincere, and built for uplift — not petitions,
            promises, or harm.
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:justify-start">
            <Link
              href="/manifestations"
              className="inline-flex h-12 items-center justify-center rounded-full bg-violet-600 px-8 text-base font-medium text-white shadow-md transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              Browse manifestations
            </Link>
            <Link
              href="/manifestations/new"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-8 text-base font-medium text-stone-800 backdrop-blur transition hover:border-violet-300 hover:bg-white dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-100 dark:hover:border-violet-500"
            >
              {MANIFEST_CTA}
            </Link>
          </div>
        </section>

        <section
          id="guidelines"
          className="rounded-3xl border border-stone-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:border-stone-700/80 dark:bg-stone-800/40 sm:p-8"
        >
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            Ground rules
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            We keep the field clear and kind: do no harm, stay inclusive,
            don&apos;t target individuals, avoid punitive or manipulative
            intentions, and lean toward good, fun, and collective uplift.{" "}
            <Link
              href="/guidelines"
              className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
            >
              Read the full guidelines
            </Link>
            .
          </p>
        </section>

        <section className="rounded-3xl border border-stone-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:border-stone-700/80 dark:bg-stone-800/40 sm:p-8">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            {FEATURE_SUGGESTIONS_HEADING}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {FEATURE_SUGGESTIONS_BODY}{" "}
            <a
              href={`mailto:${FEATURE_SUGGESTIONS_EMAIL}`}
              className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
            >
              {FEATURE_SUGGESTIONS_EMAIL}
            </a>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
