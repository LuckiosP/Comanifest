type AdminStatCardProps = {
  label: string;
  value: number | string;
  hint?: string;
};

export function AdminStatCard({ label, value, hint }: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200/90 bg-white/80 p-4 shadow-sm dark:border-stone-700/90 dark:bg-stone-800/50">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-900 dark:text-stone-50">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
