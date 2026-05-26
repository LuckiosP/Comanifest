import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { DesignPreviewBanner } from "./components/DesignPreviewBanner";
import "./globals.css";
import {
  DESIGN_THEME_COOKIE,
  getDesignTheme,
  isDesignPreviewEnabled,
} from "@/lib/design-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comanifest — collective intention",
  description:
    "Gather with others to hold intention and good energy toward hopeful outcomes — playful, inclusive, and built for uplift.",
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
      </body>
    </html>
  );
}
