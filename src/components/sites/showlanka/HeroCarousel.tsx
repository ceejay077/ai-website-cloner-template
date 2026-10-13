"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contact, hero } from "./config";
import { TripadvisorWidget } from "./TripadvisorWidget";

const SLIDE_MS = 5000;
const WORD_MS = 5000;

export function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => setSlide((s) => (s + 1) % hero.slides.length), SLIDE_MS);
    const wordTimer = setInterval(() => setWord((w) => (w + 1) % hero.words.length), WORD_MS);
    return () => {
      clearInterval(slideTimer);
      clearInterval(wordTimer);
    };
  }, []);

  const prevWord = (word - 1 + hero.words.length) % hero.words.length;

  return (
    <div className="sl-hero-wrap">
      <section className="sl-hero">
        {hero.slides.map((src, i) => (
          <div key={src} className={`sl-hero__slide${i === slide ? " is-active" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" fetchPriority={i === 0 ? "high" : "low"} />
          </div>
        ))}
        <div className="sl-hero__tagline">
          <h1 className="sl-hero__title">
            <span style={{ whiteSpace: "nowrap" }}>{hero.prefix}</span>
            <span className="sl-hero__rotating" aria-live="polite">
              {hero.words.map((w, i) => (
                <span
                  key={w}
                  className={`sl-hero__word${i === word ? " is-active" : i === prevWord ? " is-prev" : ""}`}
                  aria-hidden={i !== word}
                >
                  {w}
                </span>
              ))}
            </span>
          </h1>
          <p className="sl-hero__subtitle">{hero.subtitle}</p>
          <Link className="sl-btn" href="/contact">
            Send an Inquiry
          </Link>
        </div>
        <div className="sl-hero__tourradar">
          <iframe src={contact.tourradarWidget} title="TourRadar Reviews" loading="lazy" scrolling="no" />
        </div>
      </section>
      <div className="sl-badges">
        <div className="sl-badge sl-badge--tripadvisor">
          <TripadvisorWidget uniq={786} />
        </div>
        <a className="sl-badge" href={contact.googleReviews} target="_blank" rel="noopener">
          <svg viewBox="0 0 48 48" width={24} height={24} aria-hidden>
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span>
              <strong>{hero.googleRating.score}</strong> <span className="sl-badge__stars">★★★★★</span>
            </span>
            <span className="sl-badge__count">{hero.googleRating.count} Google Reviews</span>
          </span>
        </a>
      </div>
    </div>
  );
}
