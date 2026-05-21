import {
  SHARE_BLUESKY,
  SHARE_COPY_SUCCESS,
  SHARE_FACEBOOK,
  SHARE_INSTAGRAM,
  SHARE_LABEL,
} from "@/lib/manifestations/intention-copy";
import { manifestationPublicUrl } from "@/lib/site-url";

export function buildShareText(title: string): string {
  return `I'm holding this manifestation on Comanifest: ${title}`;
}

export function facebookShareUrl(manifestationId: string): string {
  const url = manifestationPublicUrl(manifestationId);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function blueskyShareUrl(manifestationId: string, title: string): string {
  const url = manifestationPublicUrl(manifestationId);
  const text = buildShareText(title);
  return `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
}

export async function copyManifestationLink(
  manifestationId: string,
): Promise<{ ok: boolean; message: string }> {
  const url = manifestationPublicUrl(manifestationId);
  try {
    await navigator.clipboard.writeText(url);
    return { ok: true, message: SHARE_COPY_SUCCESS };
  } catch {
    return { ok: false, message: "Could not copy the link." };
  }
}

export const SHARE_PLATFORM_LABELS = {
  facebook: SHARE_FACEBOOK,
  bluesky: SHARE_BLUESKY,
  instagram: SHARE_INSTAGRAM,
  label: SHARE_LABEL,
} as const;
