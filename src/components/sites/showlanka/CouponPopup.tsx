"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const OPEN_DELAY_MS = 3000;
const SLIDE_MS = 250;
const SWIPE_PX = 40;

/**
 * Tours-page coupon popup (theme "bonanza"): opens after 3s with a shake,
 * unless the visitor clicks the page first; only the close icon dismisses it.
 * The carousel loops one slide at a time, three across (one below 768px).
 */
export function CouponPopup({ images, moreHref }: { images: string[]; moreHref: string }) {
  const [state, setState] = useState<"waiting" | "open" | "closing" | "closed">("waiting");
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const dragStart = useRef<number | null>(null);
  const count = images.length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPerView(window.innerWidth < 768 ? 1 : 3);
      setState((s) => (s === "waiting" ? "open" : s));
    }, OPEN_DELAY_MS);
    // The theme fades the popup out on any click outside it, so an early click cancels it.
    const cancel = () => setState((s) => (s === "waiting" ? "closed" : s));
    document.addEventListener("click", cancel);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", cancel);
    };
  }, []);

  useEffect(() => {
    if (state !== "closing") return;
    const timer = window.setTimeout(() => setState("closed"), 500);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (count === 0) return null;

  // Clones on both sides let the track keep sliding in one direction, then jump back unseen.
  const slides = [...images.slice(-perView), ...images, ...images.slice(0, perView)];
  const position = index + perView;

  const step = (delta: number) => {
    setAnimate(true);
    setIndex((i) => Math.min(Math.max(i + delta, -perView), count));
  };

  const settle = () => {
    if (index >= count || index < 0) {
      setAnimate(false);
      setIndex((i) => (i + count) % count);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) > SWIPE_PX) step(delta < 0 ? 1 : -1);
  };

  return (
    <>
      {state !== "waiting" && state !== "closed" && (
        <div className={`sl-coupons${state === "closing" ? " is-closing" : ""}`}>
          <div className="sl-coupons__popup" role="dialog" aria-label="Our coupons">
            <button type="button" className="sl-coupons__close" aria-label="Close coupons" onClick={() => setState("closing")}>
              <svg viewBox="0 0 512 512" aria-hidden>
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" />
              </svg>
            </button>
            <div className="sl-coupons__carousel">
            <div className="sl-coupons__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (dragStart.current = null)}>
              <div
                className="sl-coupons__track"
                style={{
                  transform: `translateX(${(-position * 100) / perView}%)`,
                  transition: animate ? `transform ${SLIDE_MS}ms ease` : "none",
                }}
                onTransitionEnd={settle}
              >
                {slides.map((src, i) => (
                  <div key={i} className="sl-coupons__item" style={{ flexBasis: `${100 / perView}%` }} aria-hidden={i < position || i >= position + perView}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Our coupons" width={300} height={600} draggable={false} />
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className="sl-coupons__nav" aria-label="Previous" onClick={() => step(-1)}>
              <span aria-hidden>‹</span>
            </button>
            <button type="button" className="sl-coupons__nav sl-coupons__nav--next" aria-label="Next" onClick={() => step(1)}>
              <span aria-hidden>›</span>
            </button>
            </div>
          </div>
        </div>
      )}
      <a href={moreHref} className="sl-coupons__tab">
        Sweet Bonanza
      </a>
    </>
  );
}
