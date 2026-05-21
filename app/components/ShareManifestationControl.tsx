"use client";

import { useCallback, useState } from "react";

import {
  blueskyShareUrl,
  buildShareText,
  copyManifestationLink,
  facebookShareUrl,
  SHARE_PLATFORM_LABELS,
} from "@/lib/manifestations/share-client";
import {
  SHARE_COPY_LINK,
  SHARE_COPY_SUCCESS,
  SHARE_NATIVE,
} from "@/lib/manifestations/intention-copy";

type ShareManifestationControlProps = {
  manifestationId: string;
  title: string;
  compact?: boolean;
};

export function ShareManifestationControl({
  manifestationId,
  title,
  compact = false,
}: ShareManifestationControlProps) {
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3500);
  }, []);

  const onCopyLink = useCallback(async () => {
    const result = await copyManifestationLink(manifestationId);
    showMessage(result.ok ? result.message : result.message);
  }, [manifestationId, showMessage]);

  const onNativeShare = useCallback(async () => {
    if (!navigator.share) {
      await onCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: "Comanifest",
        text: buildShareText(title),
        url: `${window.location.origin}/manifestations/${manifestationId}`,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      await onCopyLink();
    }
  }, [manifestationId, onCopyLink, title]);

  const buttonClass = compact
    ? "rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:border-violet-300 hover:text-violet-800 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-violet-700 dark:hover:text-violet-200"
    : "rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:border-violet-300 hover:text-violet-800 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-violet-700 dark:hover:text-violet-200";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          {SHARE_PLATFORM_LABELS.label}
        </span>
        <a
          href={facebookShareUrl(manifestationId)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {SHARE_PLATFORM_LABELS.facebook}
        </a>
        <a
          href={blueskyShareUrl(manifestationId, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {SHARE_PLATFORM_LABELS.bluesky}
        </a>
        <button type="button" onClick={() => void onNativeShare()} className={buttonClass}>
          {typeof navigator !== "undefined" && "share" in navigator
            ? SHARE_NATIVE
            : SHARE_PLATFORM_LABELS.instagram}
        </button>
        <button type="button" onClick={() => void onCopyLink()} className={buttonClass}>
          {SHARE_COPY_LINK}
        </button>
      </div>
      {message ? (
        <p className="text-xs text-violet-800 dark:text-violet-200" role="status">
          {message === SHARE_COPY_SUCCESS ? message : message}
        </p>
      ) : null}
    </div>
  );
}
