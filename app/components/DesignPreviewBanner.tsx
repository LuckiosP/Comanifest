import Link from "next/link";

import type { DesignTheme } from "@/lib/design-themes";

type DesignPreviewBannerProps = {
  theme: DesignTheme;
};

export function DesignPreviewBanner({ theme }: DesignPreviewBannerProps) {
  return (
    <div
      role="status"
      className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/80 dark:text-amber-100"
    >
      <strong>Design preview:</strong> {theme.label} ·{" "}
      <Link
        href="/design-preview"
        className="font-medium underline-offset-2 hover:underline"
      >
        switch palette
      </Link>{" "}
      · localhost only · production unchanged
    </div>
  );
}
