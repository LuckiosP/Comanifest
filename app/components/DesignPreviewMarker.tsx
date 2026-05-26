"use client";

import { useEffect } from "react";

/** Sets document title prefix on design branches so the browser tab shows the active preview. */
export function DesignPreviewMarker({ label }: { label: string }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `[Design: ${label}] ${previous}`;
    return () => {
      document.title = previous;
    };
  }, [label]);

  return null;
}
