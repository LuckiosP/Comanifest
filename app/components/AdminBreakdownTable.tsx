import type { AdminBreakdownRow } from "@/lib/admin/types";

type AdminBreakdownTableProps = {
  title: string;
  rows: AdminBreakdownRow[];
  emptyLabel?: string;
};

export function AdminBreakdownTable({
  title,
  rows,
  emptyLabel = "No data yet",
}: AdminBreakdownTableProps) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-white/80 p-5 shadow-sm dark:border-stone-700/90 dark:bg-stone-800/50">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          {title}
        </h2>
        {total > 0 ? (
          <span className="text-xs tabular-nums text-stone-500 dark:text-stone-400">
            {total} total
          </span>
        ) : null}
      </div>

      {rows.length === 0 || total === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-400">{emptyLabel}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[16rem] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 dark:border-stone-600 dark:text-stone-400">
                <th className="pb-2 pr-4 font-medium">Label</th>
                <th className="pb-2 text-right font-medium">Count</th>
                <th className="pb-2 pl-4 text-right font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-stone-100 last:border-0 dark:border-stone-700/80"
                >
                  <td className="py-2 pr-4 text-stone-800 dark:text-stone-100">
                    {row.label}
                  </td>
                  <td className="py-2 text-right tabular-nums text-stone-900 dark:text-stone-50">
                    {row.count}
                  </td>
                  <td className="py-2 pl-4 text-right tabular-nums text-stone-600 dark:text-stone-300">
                    {total > 0 ? `${Math.round((row.count / total) * 100)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
