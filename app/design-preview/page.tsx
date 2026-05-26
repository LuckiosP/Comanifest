import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  DESIGN_THEME_COOKIE,
  DESIGN_THEMES,
  getDesignTheme,
  isDesignPreviewEnabled,
} from "@/lib/design-themes";

export default async function DesignPreviewPage() {
  if (!isDesignPreviewEnabled()) {
    notFound();
  }

  const cookieStore = await cookies();
  const activeTheme = getDesignTheme(cookieStore.get(DESIGN_THEME_COOKIE)?.value);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-wide text-violet-700 dark:text-violet-300">
            Local design preview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Try a look and feel
          </h1>
          <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
            Pick a palette below. Colours update instantly across the site — no git
            branch switching, no cache clearing. Production at{" "}
            <strong>www.comanifest.org</strong> stays unchanged.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {DESIGN_THEMES.map((theme) => {
            const isActive = activeTheme?.id === theme.id;

            return (
              <li key={theme.id}>
                <Link
                  href={`/api/design-theme?theme=${theme.id}&redirect=/`}
                  className={`block rounded-2xl border px-5 py-4 transition ${
                    isActive
                      ? "border-violet-500 bg-violet-50 shadow-sm dark:border-violet-400 dark:bg-violet-950/40"
                      : "border-stone-200 bg-white hover:border-violet-300 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-violet-600"
                  }`}
                >
                  <p className="font-semibold text-stone-900 dark:text-stone-50">
                    {theme.label}
                    {isActive ? " (active)" : ""}
                  </p>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                    {theme.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-900/50">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Back to the current live palette
          </p>
          <Link
            href="/api/design-theme?theme=clear&redirect=/design-preview"
            className="inline-flex w-fit rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-violet-300 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          >
            Reset to default
          </Link>
        </div>

        <p className="text-sm text-stone-500 dark:text-stone-400">
          Then browse{" "}
          <Link href="/" className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300">
            home
          </Link>
          ,{" "}
          <Link
            href="/manifestations"
            className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
          >
            manifestations
          </Link>
          , and other pages to compare.
        </p>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900/50">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Logo mark — string art weave, midnight medallion
          </p>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Seventeen nail-stars — threads woven around the ring, clear
            manifestation at the centre. Sketch:{" "}
            <code className="rounded bg-stone-100 px-1 dark:bg-stone-800">.design/logo-reference-sketch.png</code>
            . Brief in{" "}
            <code className="rounded bg-stone-100 px-1 dark:bg-stone-800">.design/logo-prompt.md</code>
            . Header auto-switches; favicon uses the midnight medallion.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                On light background
              </p>
              <div className="flex h-28 items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/comanifest-logo-mark-on-light.svg"
                  alt="Comanifest logo on light background"
                  className="size-20"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                On dark background
              </p>
              <div className="flex h-28 items-center justify-center rounded-xl border border-stone-700 bg-[#1A1B2E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/comanifest-logo-mark-on-dark.svg"
                  alt="Comanifest logo on dark background"
                  className="size-20"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Favicon (midnight medallion)
              </p>
              <div className="flex h-24 items-center justify-center gap-6 rounded-xl border border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/comanifest-logo-mark.svg"
                  alt="Comanifest favicon mark"
                  className="size-12"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/comanifest-logo-mark.svg"
                  alt="Comanifest favicon at small size"
                  className="size-4"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
