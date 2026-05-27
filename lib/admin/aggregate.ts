import type { AdminBreakdownRow } from "@/lib/admin/types";

export function countByKey(
  values: readonly (string | null | undefined)[],
  options?: {
    unknownLabel?: string;
    sort?: "count-desc" | "key-asc";
    limit?: number;
  },
): AdminBreakdownRow[] {
  const unknownLabel = options?.unknownLabel ?? "Unknown";
  const counts = new Map<string, number>();

  for (const value of values) {
    const key = value?.trim() || unknownLabel;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let rows: AdminBreakdownRow[] = [...counts.entries()].map(([key, count]) => ({
    key,
    label: key,
    count,
  }));

  if (options?.sort === "key-asc") {
    rows.sort((a, b) => a.label.localeCompare(b.label));
  } else {
    rows.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }

  if (options?.limit != null) {
    rows = rows.slice(0, options.limit);
  }

  return rows;
}

export function rowsInLastDays(
  createdAtValues: readonly string[],
  days: number,
  now = Date.now(),
): number {
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return createdAtValues.filter((iso) => {
    const t = Date.parse(iso);
    return Number.isFinite(t) && t >= cutoff;
  }).length;
}
