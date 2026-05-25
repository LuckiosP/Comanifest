import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200/60 bg-white/50 px-4 py-6 text-center text-sm text-stone-500 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-400">
      <p>Comanifest — experiment generously, care for each other.</p>
      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link
          href="/privacy"
          className="font-medium text-stone-600 underline-offset-2 hover:text-violet-700 hover:underline dark:text-stone-300 dark:hover:text-violet-300"
        >
          Privacy policy
        </Link>
        <span aria-hidden="true">·</span>
        <Link
          href="/guidelines"
          className="font-medium text-stone-600 underline-offset-2 hover:text-violet-700 hover:underline dark:text-stone-300 dark:hover:text-violet-300"
        >
          Community guidelines
        </Link>
      </p>
    </footer>
  );
}
