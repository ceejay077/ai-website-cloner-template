"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Sends one anonymous page-view beacon per route change to /api/track. */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const body = JSON.stringify({
      path: pathname,
      // document.referrer only describes how the visitor arrived, so send it once.
      referrer: first.current ? document.referrer : "",
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      screenWidth: window.screen.width,
    });
    first.current = false;
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track", blob)) {
      void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(
        () => undefined,
      );
    }
  }, [pathname]);

  return null;
}
