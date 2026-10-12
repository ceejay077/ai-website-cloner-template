"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { heroSlides } from "./data";

const AUTOPLAY_TIMEOUT = 5000;
const DRAG_THRESHOLD = 40;

/** Owl Carousel config on the source: items 1, loop, autoplay 5s, fadeOut/fadeIn, drag enabled. */
export function HeroSlides() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, AUTOPLAY_TIMEOUT);
    return () => window.clearInterval(timer);
  }, [cycle]);

  const go = useCallback((step: number) => {
    setActive((current) => (current + step + heroSlides.length) % heroSlides.length);
    setCycle((value) => value + 1);
  }, []);

  return (
    <div
      className="hero-slides owl-carousel"
      onPointerDown={(event) => {
        dragStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (dragStart.current === null) return;
        const delta = event.clientX - dragStart.current;
        dragStart.current = null;
        if (Math.abs(delta) > DRAG_THRESHOLD) go(delta < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {
        dragStart.current = null;
      }}
    >
      {heroSlides.map((slide, index) => (
        <div key={slide.src} className={cn("hero-slide", index === active && "active")} aria-hidden={index !== active}>
          <Image src={slide.src} alt={slide.alt} fill sizes="100vw" preload={index === 0} draggable={false} />
        </div>
      ))}
    </div>
  );
}
