export const REFLECTION_MIN_LEN = 10;
export const REFLECTION_MAX_LEN = 2000;

export type ReflectionSuccessChoice = "yes" | "no" | "unsure";

export function parseReflectionSuccessChoice(
  raw: string,
): ReflectionSuccessChoice | null {
  if (raw === "yes" || raw === "no" || raw === "unsure") {
    return raw;
  }
  return null;
}

export function reflectionSuccessToDb(
  choice: ReflectionSuccessChoice,
): boolean | null {
  if (choice === "yes") return true;
  if (choice === "no") return false;
  return null;
}
