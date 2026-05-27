import type { Metadata } from "next";

import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About Comanifest",
  description:
    "Comanifest is a communal experiment in collective intention — a lightly magical space to hold hopeful outcomes together.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <section className="space-y-3">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            About Comanifest
          </h1>
          <p className="text-stone-700 dark:text-stone-200">
            Comanifest is an online gathering place for collective intention —
            where people manifest hopeful outcomes and hold them together with
            care, curiosity, and imagination.
          </p>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            It is built for shared focus, community participation, and gentle
            experimentation — not petitions, promises, or rigid doctrine. The
            platform is owned and stewarded by Promoderation Ltd and remains a
            playful, communal experiment in what happens when many people hold
            the same bright possibility.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

