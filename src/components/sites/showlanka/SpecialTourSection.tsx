"use client";

import { useEffect, useRef } from "react";

import { ASSET_BASE, SOURCE_ORIGIN } from "./data";

const PARALLAX_SPEED = 0.6;

export function SpecialTourSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Source theme: on scroll, translate the (fixed-attachment) background box by
  // (scrollTop - offsetTop) * 0.6 while it is in view. jQuery's offset() includes
  // the current transform, so the measurement does too.
  useEffect(() => {
    const element = bgRef.current;
    if (!element) return;

    const onScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const rect = element.getBoundingClientRect();
      const offsetTop = rect.top + scrollPosition;
      const offsetBottom = offsetTop + element.offsetHeight;
      if (scrollPosition + windowHeight >= offsetTop && scrollPosition <= offsetBottom) {
        element.style.transform = `translateY(${(scrollPosition - offsetTop) * PARALLAX_SPEED}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="special-tour-section">
      <article className="fullpage-container">
        <div
          ref={bgRef}
          className="bg-image-container"
          role="img"
          aria-label="Tour of the month"
          style={{ backgroundImage: `url('${ASSET_BASE}/images/lotus-tower.jpg')` }}
        />
        <div className="sl-flex sl-flex-col text-content">
          <p className="uppercase-subtitle border-after">Discover Unforgettable Adventures</p>
          <h2 className="section-title">Tour of the month</h2>
          <p>
            This month, we invite you to embark on an unforgettable journey with history, culture, and natural beauty
            intertwine to create an experience like no other
          </p>
          <a className="common-btn" href={`${SOURCE_ORIGIN}/sri-lanka-express/`}>
            Read More<span className="sr-only"> about Tour of the month</span>
          </a>
        </div>
      </article>
    </section>
  );
}
