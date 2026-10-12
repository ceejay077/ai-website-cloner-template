"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { heroWords } from "./data";

const ROTATE_INTERVAL = 5000;

/**
 * Matches the inline source script: every 5s it activates `current`, marks the
 * previous word, then advances. The first tick re-activates word 0, so the first
 * visible change happens after 10s.
 */
export function HeroRotatingWords() {
  const [state, setState] = useState({ active: 0, prev: -1 });

  useEffect(() => {
    let current = 0;
    const timer = window.setInterval(() => {
      setState({ active: current, prev: (current - 1 + heroWords.length) % heroWords.length });
      current = (current + 1) % heroWords.length;
    }, ROTATE_INTERVAL);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="hero-rotating" aria-live="polite">
      {heroWords.map((word, index) => (
        <span
          key={word}
          className={cn("hero-word", index === state.active && "is-active", index === state.prev && "is-prev")}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
