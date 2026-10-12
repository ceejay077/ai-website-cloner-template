"use client";

import { useEffect, useState } from "react";

/** Mirrors the theme: `.animated` is added 300ms after `window` load. */
export function useLoadAnimation() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(() => setAnimated(true), 300);
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  return animated;
}
