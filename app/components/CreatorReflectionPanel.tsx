import {
  MANIFEST_CREATOR_REFLECTION_HEADING,
  MANIFEST_CREATOR_REFLECTION_SUCCESS_NO,
  MANIFEST_CREATOR_REFLECTION_SUCCESS_UNSURE,
  MANIFEST_CREATOR_REFLECTION_SUCCESS_YES,
} from "@/lib/manifestations/intention-copy";
import { hasCreatorReflection } from "@/lib/manifestations/lifecycle";
import type { Manifestation } from "@/lib/types/manifestation";

type CreatorReflectionPanelProps = {
  manifestation: Pick<
    Manifestation,
    | "creator_reflection"
    | "creator_reflection_success"
    | "reflected_at"
  >;
};

function successSummary(success: boolean | null): string {
  if (success === true) {
    return MANIFEST_CREATOR_REFLECTION_SUCCESS_YES;
  }
  if (success === false) {
    return MANIFEST_CREATOR_REFLECTION_SUCCESS_NO;
  }
  return MANIFEST_CREATOR_REFLECTION_SUCCESS_UNSURE;
}

export function CreatorReflectionPanel({
  manifestation,
}: CreatorReflectionPanelProps) {
  if (!hasCreatorReflection(manifestation) || !manifestation.creator_reflection) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 dark:border-stone-700/90 dark:bg-stone-900/40">
      <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">
        {MANIFEST_CREATOR_REFLECTION_HEADING}
      </h2>
      <p className="text-sm italic text-stone-600 dark:text-stone-300">
        {successSummary(manifestation.creator_reflection_success)}
      </p>
      <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200">
        {manifestation.creator_reflection}
      </p>
    </section>
  );
}
