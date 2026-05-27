import type { Metadata } from "next";

import { ComanifestLogoMark } from "@/app/components/ComanifestLogoMark";
import { HomeManifestHub } from "@/app/components/HomeManifestHub";
import { SiteHeader } from "@/app/components/SiteHeader";
import {
  FEATURE_SUGGESTIONS_EMAIL,
  HOME_DESCRIPTOR,
  HOME_FOOTER_FEEDBACK,
  HOME_FOOTER_GUIDELINES,
  HOME_FOOTER_PRIVACY,
} from "@/lib/manifestations/intention-copy";
import { listManifestations } from "@/lib/manifestations/queries";
import { getPublicSiteUrl } from "@/lib/site-url";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comanifest — collective intention",
  description: HOME_DESCRIPTOR,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Comanifest",
    title: "Comanifest — collective intention",
    description: HOME_DESCRIPTOR,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Comanifest — collective intention",
    description: HOME_DESCRIPTOR,
  },
};

export default async function Home() {
  const { rows, source } = await listManifestations("newest");

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 dark:bg-stone-950">
      <SiteHeader hideSearch />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-8">
        <div className="flex flex-1 flex-col items-center justify-center">
          <Link
            href="/"
            className="mb-10 flex flex-col items-center gap-3 text-center text-stone-900 dark:text-stone-50"
            aria-label="Comanifest home"
          >
            <ComanifestLogoMark size={48} className="size-12 shrink-0" priority />
            <span className="text-2xl font-semibold tracking-tight">Comanifest</span>
          </Link>

          <HomeManifestHub candidates={rows} similarSource={source} />
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          {HOME_DESCRIPTOR}
        </p>

        {/* Structured data for search / AI tools */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Comanifest",
              url: getPublicSiteUrl(),
              description: HOME_DESCRIPTOR,
              potentialAction: {
                "@type": "SearchAction",
                target: `${getPublicSiteUrl()}/manifestations?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </main>

      <footer className="px-4 pb-8 text-center">
        <p className="text-xs text-stone-400 dark:text-stone-500">
          <Link
            href="/privacy"
            className="underline-offset-2 hover:text-stone-600 hover:underline dark:hover:text-stone-300"
          >
            {HOME_FOOTER_PRIVACY}
          </Link>
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          <Link
            href="/guidelines"
            className="underline-offset-2 hover:text-stone-600 hover:underline dark:hover:text-stone-300"
          >
            {HOME_FOOTER_GUIDELINES}
          </Link>
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          <a
            href={`mailto:${FEATURE_SUGGESTIONS_EMAIL}`}
            className="underline-offset-2 hover:text-stone-600 hover:underline dark:hover:text-stone-300"
          >
            {HOME_FOOTER_FEEDBACK}
          </a>
        </p>
      </footer>
    </div>
  );
}
