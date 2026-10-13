"use client";

import { useEffect, useState } from "react";

const CYCLE_MS = 4000;

/**
 * Single-post hero (tours and news): the featured image, then each gallery image, swapped every 4s.
 * (The live theme clones lazy-load placeholders here, so it often shows a
 * blank frame; this cycles the real images it intends to show.)
 */
export function PostHero({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % images.length), CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;
  return (
    <div className="sl-post__hero">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${src}-${i}`}
          src={src}
          alt={i === 0 ? alt : ""}
          className={i === active ? "is-active" : undefined}
          fetchPriority={i === 0 ? "high" : "low"}
          decoding="async"
        />
      ))}
    </div>
  );
}
