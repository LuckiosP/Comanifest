"use client";

import { useCallback, useState } from "react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkIcon,
  ShareIcon,
} from "@/app/components/SharePlatformIcons";
import {
  copyManifestationLink,
  facebookShareUrl,
  instagramShareUrl,
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
    showMessage(result.message);
  }, [manifestationId, showMessage, title]);

  const buttonClass = compact
    ? "inline-flex cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white p-1.5 text-stone-700 transition hover:border-violet-300 hover:text-violet-800 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-violet-700 dark:hover:text-violet-200"
    : "inline-flex cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white p-2 text-stone-700 transition hover:border-violet-300 hover:text-violet-800 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-violet-700 dark:hover:text-violet-200";
  const iconClass = compact ? "size-4 shrink-0" : "size-5 shrink-0";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center text-stone-500 dark:text-stone-400">
          <ShareIcon className="size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">{SHARE_PLATFORM_LABELS.label}</span>
        </span>
        <a
          href={facebookShareUrl(manifestationId)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label={`${SHARE_PLATFORM_LABELS.label} on ${SHARE_PLATFORM_LABELS.facebook}`}
          title={SHARE_PLATFORM_LABELS.facebook}
        >
          <FacebookIcon className={`${iconClass} text-[#1877F2]`} />
        </a>
        <a
          href={instagramShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          aria-label={`${SHARE_PLATFORM_LABELS.label} on ${SHARE_PLATFORM_LABELS.instagram}`}
          title={SHARE_PLATFORM_LABELS.instagram}
          onClick={() => void onInstagramShare()}
        >
          <InstagramIcon className={iconClass} />
        </a>
        <button
          type="button"
          onClick={() => void onCopyLink()}
          className={buttonClass}
          aria-label={`${SHARE_PLATFORM_LABELS.label} ${SHARE_PLATFORM_LABELS.link}`}
          title={SHARE_PLATFORM_LABELS.link}
        >
          <LinkIcon className={iconClass} />
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
