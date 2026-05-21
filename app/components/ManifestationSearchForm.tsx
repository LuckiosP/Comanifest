import Link from "next/link";

import {
  SEARCH_CLEAR,
  SEARCH_PLACEHOLDER,
  SEARCH_SUBMIT,
} from "@/lib/manifestations/intention-copy";

type ManifestationSearchFormProps = {
  defaultQuery?: string;
  sort?: "newest" | "joined";
  compact?: boolean;
};

const inputClass =
  "w-full rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-violet-500 dark:focus:ring-violet-900";

export function ManifestationSearchForm({
  defaultQuery = "",
  sort,
  compact = false,
}: ManifestationSearchFormProps) {
  return (
    <form
      action="/manifestations"
      method="get"
      className={
        compact
          ? "flex min-w-0 flex-1 items-center gap-1 sm:max-w-[14rem]"
          : "flex w-full flex-col gap-2 sm:flex-row sm:items-center"
      }
    >
      {sort && sort !== "newest" ? (
        <input type="hidden" name="sort" value={sort} />
      ) : null}
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder={SEARCH_PLACEHOLDER}
        maxLength={100}
        aria-label={SEARCH_PLACEHOLDER}
        className={inputClass}
      />
      <button
        type="submit"
        className={
          compact
            ? "shrink-0 rounded-full px-3 py-2 text-xs font-medium text-violet-800 transition hover:bg-violet-100 dark:text-violet-200 dark:hover:bg-stone-800"
            : "inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
        }
      >
        {SEARCH_SUBMIT}
      </button>
      {defaultQuery && !compact ? (
        <Link
          href={
            sort && sort !== "newest"
              ? `/manifestations?sort=${sort}`
              : "/manifestations"
          }
          className="text-center text-sm font-medium text-stone-600 underline-offset-2 hover:underline dark:text-stone-400"
        >
          {SEARCH_CLEAR}
        </Link>
      ) : null}
    </form>
  );
}
