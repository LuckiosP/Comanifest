"use client";

import { useCallback, useState } from "react";

import {
  copyManifestationLink,
  facebookShareUrl,
  SHARE_PLATFORM_LABELS,
  shareManifestationToInstagram,
} from "@/lib/manifestations/share-client";

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
    showMessage(result.message);
  }, [manifestationId, showMessage]);

  const onInstagramShare = useCallback(async () => {
    const result = await shareManifestationToInstagram(manifestationId, title);
    if (result.message) {
      showMessage(result.message);
    }
  }, [manifestationId, showMessage, title]);

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
        <button
          type="button"
          onClick={() => void onInstagramShare()}
          className={buttonClass}
        >
          {SHARE_PLATFORM_LABELS.instagram}
        </button>
        <button type="button" onClick={() => void onCopyLink()} className={buttonClass}>
          {SHARE_PLATFORM_LABELS.link}
        </button>
      </div>
      {message ? (
        <p className="text-xs text-violet-800 dark:text-violet-200" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
