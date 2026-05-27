import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { MANIFEST_CTA } from "@/lib/manifestations/intention-copy";

export const metadata: Metadata = {
  title: "Community guidelines — Comanifest",
  description:
    "Principles that keep Comanifest safe, inclusive, and grounded in collective uplift.",
  alternates: {
    canonical: "/guidelines",
  },
};

export default function GuidelinesPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Community guidelines
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-300">
            Comanifest is a shared space for focus and good energy. These
            principles keep it safe and welcoming for everyone.
          </p>
        </div>

        <ul className="flex flex-col gap-6 text-stone-700 dark:text-stone-200">
          <li className="rounded-2xl border border-stone-200/90 bg-white/70 p-5 dark:border-stone-700/80 dark:bg-stone-800/40">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">
              Do no harm
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Outcomes should not encourage injury, harassment, or danger to
              people, animals, or the environment.
            </p>
          </li>
          <li className="rounded-2xl border border-stone-200/90 bg-white/70 p-5 dark:border-stone-700/80 dark:bg-stone-800/40">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">
              Inclusivity
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Everyone is invited to participate with respect. Avoid intentions
              that exclude or demean groups of people.
            </p>
          </li>
          <li className="rounded-2xl border border-stone-200/90 bg-white/70 p-5 dark:border-stone-700/80 dark:bg-stone-800/40">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">
              No targeting individuals
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Focus on outcomes and collective care, not on pressuring,
              punishing, or surveilling specific private individuals.
            </p>
          </li>
          <li className="rounded-2xl border border-stone-200/90 bg-white/70 p-5 dark:border-stone-700/80 dark:bg-stone-800/40">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">
              No negative or punitive intentions
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Comanifest is for uplift and possibility — not for curses,
              &quot;justice&quot; fantasies that involve harm, or wishing ill on
              others.
            </p>
          </li>
          <li className="rounded-2xl border border-stone-200/90 bg-white/70 p-5 dark:border-stone-700/80 dark:bg-stone-800/40">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">
              No political manipulation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              This is not a covert campaigning or lobbying tool. Keep
              manifestations in the spirit of collective care, play, and hope —
              not coordinated deception or manipulation.
            </p>
          </li>
          <li className="rounded-2xl border border-stone-200/90 bg-white/70 p-5 dark:border-stone-700/80 dark:bg-stone-800/40">
            <h2 className="font-semibold text-stone-900 dark:text-stone-50">
              For good, for fun, for collective uplift
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              Experiment generously. Nothing here guarantees an outcome — it
              is about shared focus, connection, and positive energy.
            </p>
          </li>
        </ul>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/manifestations/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
          >
            {MANIFEST_CTA}
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-6 text-sm font-medium text-stone-800 transition hover:border-violet-300 dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-100"
          >
            ← Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
