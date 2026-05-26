import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DesignPreviewBanner } from "./components/DesignPreviewBanner";
import { DesignPreviewMarker } from "./components/DesignPreviewMarker";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-stone-50 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
        <DesignPreviewMarker label="Warm dawn" />
        <DesignPreviewBanner label="Warm dawn" branch="design/warm-dawn" />
        {children}
      </body>
    </html>
  );
}
