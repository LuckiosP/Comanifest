"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useCallback } from "react";

import { getTurnstileSiteKey } from "@/lib/supabase/config";

type TurnstileCaptchaRowProps = {
  /** Increment (e.g. with “Try again”) to remount the widget and get a fresh token. */
  resetKey: number;
  onToken: (token: string) => void;
  onExpire: () => void;
  caption: string;
};

export function TurnstileCaptchaRow({
  resetKey,
  onToken,
  onExpire,
  caption,
}: TurnstileCaptchaRowProps) {
  const siteKey = getTurnstileSiteKey();
  const handleSuccess = useCallback(
    (token: string) => {
      onToken(token);
    },
    [onToken],
  );

  if (!siteKey) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-stone-600 dark:text-stone-400">{caption}</p>
      <Turnstile
        key={resetKey}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onExpire={onExpire}
        options={{ theme: "auto", size: "normal" }}
      />
    </div>
  );
}
