"use client";

type DesignPreviewBannerProps = {
  label: string;
  branch: string;
};

/** Shown only on design/* branches — not production. */
export function DesignPreviewBanner({ label, branch }: DesignPreviewBannerProps) {
  return (
    <div
      role="status"
      className="border-b border-amber-200/80 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/80 dark:text-amber-100"
    >
      <strong>Design preview:</strong> {label} · branch{" "}
      <code className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-900/50">
        {branch}
      </code>
      · localhost only · production unchanged
    </div>
  );
}
