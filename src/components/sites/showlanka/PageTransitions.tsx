"use client";

import { useEffect } from "react";

const PAGE_TRANSITION_DURATION = 320;

/** Fades the page out before following a same-origin link, as the source theme does. */
export function PageTransitions() {
  useEffect(() => {
    const body = document.body;

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) body.classList.remove("page-exit", "page-exit-active");
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a");
      const href = link?.getAttribute("href");
      if (!link || !href) return;
      if (/^(#|mailto:|tel:|javascript:)/.test(href)) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      let destination: URL;
      try {
        destination = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.hash) return;

      event.preventDefault();
      body.classList.add("page-exit");
      void body.offsetHeight;
      body.classList.add("page-exit-active");
      window.setTimeout(() => {
        window.location.href = destination.href;
      }, PAGE_TRANSITION_DURATION);
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
