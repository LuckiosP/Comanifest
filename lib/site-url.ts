/** Public site URL for share links, OG tags, and emails. */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export function manifestationPublicUrl(manifestationId: string): string {
  return `${getPublicSiteUrl()}/manifestations/${manifestationId}`;
}
