"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { SEARCH_PLACEHOLDER } from "@/lib/manifestations/intention-copy";
import { normalizeSearchQuery } from "@/lib/manifestations/search";

const inputClass =
  "w-full min-w-0 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type ManifestationHeaderSearchProps = {
  defaultQuery?: string;
};

export function ManifestationHeaderSearch({
  defaultQuery = "",
}: ManifestationHeaderSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState(defaultQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function goToFeed(value: string) {
    const normalized = normalizeSearchQuery(value);
    router.push(
      normalized
        ? `/manifestations?q=${encodeURIComponent(normalized)}`
        : "/manifestations",
    );
  }

  return (
    <form
      className="flex min-w-0 flex-1 items-center sm:max-w-[14rem]"
      onSubmit={(event) => {
        event.preventDefault();
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        goToFeed(query);
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {SEARCH_PLACEHOLDER}
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
          }
          debounceRef.current = setTimeout(() => goToFeed(value), 250);
        }}
        placeholder={SEARCH_PLACEHOLDER}
        maxLength={100}
        autoComplete="off"
        className={inputClass}
      />
    </form>
  );
}
