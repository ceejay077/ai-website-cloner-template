"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { GoogleReviewSummary } from "./googleReviewData";

const AUTOPLAY_MS = 6000;
const TI = "https://cdn.trustindex.io/assets/platform/Google";

export function GoogleReviews({ reviews, score, count }: GoogleReviewSummary) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || expanded) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % reviews.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, expanded, reviews.length]);

  const go = (step: number) => {
    setExpanded(false);
    setIndex((i) => (i + step + reviews.length) % reviews.length);
  };

  const review = reviews[index];
  if (!review) return null;

  return (
    <div className="sl-greviews" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="sl-greviews__header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sl-greviews__avatar" src={review.avatar} alt={`${review.name} profile picture`} width={40} height={40} />
        <div className="sl-greviews__who">
          <div className="sl-greviews__name">{review.name}</div>
          <div className="sl-greviews__date">{review.ago}</div>
        </div>
        <div className="sl-greviews__controls">
          <button type="button" aria-label="Previous review" onClick={() => go(-1)}>
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button type="button" aria-label="Next review" onClick={() => go(1)}>
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>
      <div className="sl-greviews__card">
        <div className="sl-greviews__stars">
          {Array.from({ length: 5 }, (_, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={`${TI}/star/${i < review.stars ? "f" : "e"}.svg`} alt={`Google star ${i + 1}`} width={17} height={17} />
          ))}
          <svg className="sl-greviews__verified" viewBox="0 0 24 24" width={17} height={17} aria-label="Verified">
            <path fill="#4285f4" d="m12 1 2.6 2 3.3-.3.9 3.2 2.9 1.6-1 3.1 1 3.1-2.9 1.6-.9 3.2-3.3-.3L12 23l-2.6-2-3.3.3-.9-3.2-2.9-1.6 1-3.1-1-3.1 2.9-1.6.9-3.2 3.3.3z" />
            <path fill="none" stroke="#fff" strokeWidth={2.2} d="m7.5 12 3 3 6-6" />
          </svg>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sl-greviews__platform" src={`${TI}/icon.svg`} alt="Google" width={20} height={20} />
        <p className={`sl-greviews__text${expanded ? " is-expanded" : ""}`}>{review.text}</p>
        <button type="button" className="sl-greviews__more" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Hide" : "Read more"}
        </button>
      </div>
      <div className="sl-greviews__footer">
        <strong>Google</strong> rating score: <strong>{score}</strong> of 5,
        <br />
        based on <strong>{count}</strong>
      </div>
    </div>
  );
}
