import {
  isEndDateOnOrAfterToday,
  parseEndDateInput,
} from "@/lib/manifestations/dates";
import type { ManifestationCategory } from "@/lib/types/manifestation";

export const MANIFESTATION_FORM_CATEGORIES: ManifestationCategory[] = [
  "weather",
  "global",
  "personal",
  "sports",
  "wellbeing",
  "symbolic",
  "other",
];

export type ParsedManifestationFormFields =
  | {
      ok: true;
      title: string;
      intention: string;
      category: ManifestationCategory;
      endsAt: Date;
    }
  | { ok: false; error: string };

export function parseManifestationFormFields(
  formData: FormData,
): ParsedManifestationFormFields {
  const title = String(formData.get("title") ?? "").trim();
  const intention = String(formData.get("intention") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const endsAtInput = String(formData.get("ends_at") ?? "").trim();

  if (title.length < 3 || title.length > 200) {
    return { ok: false, error: "Title should be between 3 and 200 characters." };
  }
  if (intention.length < 10 || intention.length > 2000) {
    return {
      ok: false,
      error: "Intention should be between 10 and 2000 characters.",
    };
  }
  if (!MANIFESTATION_FORM_CATEGORIES.includes(category as ManifestationCategory)) {
    return { ok: false, error: "Pick a valid category." };
  }
  if (!isEndDateOnOrAfterToday(endsAtInput)) {
    return {
      ok: false,
      error:
        "Choose an end date from today onward — when this manifestation closes.",
    };
  }

  const endsAt = parseEndDateInput(endsAtInput);
  if (!endsAt) {
    return { ok: false, error: "End date is not valid." };
  }

  return {
    ok: true,
    title,
    intention,
    category: category as ManifestationCategory,
    endsAt,
  };
}
