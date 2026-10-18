"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Sends one beacon per page view. No cookie, no local storage, no identifier
 * held on the device — the server derives a per-day hash and that is all.
 */
export function AnalyticsBeacon({ locale }: { locale: string }) {
  const pathname = usePathname();
  // The first render and a same-path re-render must not double-count.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    // Never count the author working on their own machine.
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return;
    }

    const dnt =
      navigator.doNotTrack === "1" ||
      (window as { doNotTrack?: string }).doNotTrack === "1";
    if (dnt) return;

    const payload = JSON.stringify({
      path: pathname,
      locale,
      referrer: document.referrer || null,
    });

    // sendBeacon survives the page being closed mid-flight; fetch is the
    // fallback for browsers that do not have it.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/collect",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      void fetch("/api/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Analytics must never break the page.
      });
    }
  }, [pathname, locale]);

  return null;
}
