/** Allow only same-site relative paths after magic-link sign-in. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || typeof next !== "string") {
    return "/";
  }
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/";
  }
  return trimmed;
}
