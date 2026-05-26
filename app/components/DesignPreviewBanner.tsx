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
      className="border-b-4 border-amber-500 bg-amber-400 px-4 py-3 text-center text-sm font-medium text-amber-950"
    >
      <p>
        <strong>Design preview — {label}</strong> ({branch})
      </p>
      <p className="mt-1 text-xs font-normal">
        Use <strong>http://localhost:3000</strong> after{" "}
        <code className="rounded bg-amber-950/10 px-1">npm run dev</code> on
        this branch.{" "}
        <strong>www.comanifest.org stays on the current live look.</strong>
      </p>
    </div>
  );
}
