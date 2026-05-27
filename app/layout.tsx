import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";

import { DesignPreviewBanner } from "./components/DesignPreviewBanner";
import "./globals.css";
import {
  DESIGN_THEME_COOKIE,
  getDesignTheme,
  isDesignPreviewEnabled,
} from "@/lib/design-themes";
import { getPublicSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  title: {
    default: "Comanifest — collective intention",
    template: "%s — Comanifest",
  },
  description:
    "Comanifest is a communal space for manifesting hopeful outcomes together — playful, inclusive, and built for uplift, not petitions or promises.",
  openGraph: {
    type: "website",
    siteName: "Comanifest",
    title: "Comanifest — collective intention",
    description:
      "Name a hopeful outcome, find others already holding something similar, or start your own gathering.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Comanifest — collective intention",
    description:
      "A lightly magical place to hold collective intention toward hopeful outcomes.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const previewEnabled = isDesignPreviewEnabled();
  const cookieStore = await cookies();
  const activeTheme = previewEnabled
    ? getDesignTheme(cookieStore.get(DESIGN_THEME_COOKIE)?.value)
    : null;

  return (
    <html
      lang="en"
      data-design-theme={activeTheme?.id}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-stone-50 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
        {activeTheme ? <DesignPreviewBanner theme={activeTheme} /> : null}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
