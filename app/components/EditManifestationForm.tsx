"use client";

import { useActionState } from "react";

import {
  updateManifestation,
  type UpdateManifestationState,
} from "@/app/actions/manifestations";
import {
  MANIFEST_ENDS_LABEL,
  MANIFEST_EDIT_SUBMIT,
  MANIFEST_EDIT_SUBMIT_PENDING,
} from "@/lib/manifestations/intention-copy";
import {
  isoToDateInputValue,
  localTodayDateInputValue,
} from "@/lib/manifestations/dates";
import {
  MANIFESTATION_CATEGORY_LABELS,
  type Manifestation,
  type ManifestationCategory,
} from "@/lib/types/manifestation";

const initialState: UpdateManifestationState = {};

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-violet-500 dark:focus:ring-violet-900";

type EditManifestationFormProps = {
  manifestation: Manifestation;
};

export function EditManifestationForm({
  manifestation,
}: EditManifestationFormProps) {
  const [state, formAction, pending] = useActionState(
    updateManifestation,
    initialState,
  );

  const categories = Object.keys(
    MANIFESTATION_CATEGORY_LABELS,
  ) as ManifestationCategory[];
  const minEndDate = localTodayDateInputValue();
  const endsAtDefault = isoToDateInputValue(manifestation.ends_at);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="manifestation_id" value={manifestation.id} />

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
        >
          {state.error}
        </p>
      ) : null}

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        Desired outcome (short title)
        <input
          name="title"
          required
          minLength={3}
          maxLength={200}
          defaultValue={manifestation.title}
          disabled={pending}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        Intention behind it
        <textarea
          name="intention"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          defaultValue={manifestation.intention}
          disabled={pending}
          className={`${inputClass} resize-y min-h-[120px]`}
        />
      </label>

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        Category
        <select
          name="category"
          required
          defaultValue={manifestation.category}
          disabled={pending}
          className={inputClass}
        >
          {categories.map((key) => (
            <option key={key} value={key}>
              {MANIFESTATION_CATEGORY_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm font-medium text-stone-700 dark:text-stone-200">
        {MANIFEST_ENDS_LABEL}
        <input
          type="date"
          name="ends_at"
          required
          min={minEndDate}
          defaultValue={endsAtDefault}
          disabled={pending}
          className={inputClass}
        />
        <span className="mt-1 text-xs font-normal text-stone-500 dark:text-stone-400">
          When this manifestation closes. End date must be today or later.
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-violet-600 px-8 text-base font-medium text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-500 dark:hover:bg-violet-400"
      >
        {pending ? MANIFEST_EDIT_SUBMIT_PENDING : MANIFEST_EDIT_SUBMIT}
      </button>
    </form>
  );
}
