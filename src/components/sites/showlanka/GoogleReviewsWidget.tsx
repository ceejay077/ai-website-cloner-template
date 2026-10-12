"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { ASSET_BASE, type GoogleReview, googleReviews } from "./data";

const AUTOPLAY_TIMEOUT = 6000;
const DRAG_THRESHOLD = 40;
const NOW = Date.now();

/** Trustindex `data-time-locale`: "%d %s ago|today|day|days|week|weeks|month|months|year|years". */
function timeAgo(unixSeconds: number) {
  const days = Math.floor((NOW - unixSeconds * 1000) / 86_400_000);
  const units: [number, string, string][] = [
    [365, "year", "years"],
    [30, "month", "months"],
    [7, "week", "weeks"],
    [1, "day", "days"],
  ];
  for (const [size, one, many] of units) {
    const count = Math.floor(days / size);
    if (count >= 1) return `${count} ${count === 1 ? one : many} ago`;
  }
  return "today";
}

function ReviewItem({ review, index, onExpand }: { review: GoogleReview; index: number; onExpand: () => void }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (!element.classList.contains("is-open")) setOverflowing(element.scrollHeight > element.clientHeight + 1);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ti-review-item">
      <div className="ti-review-header">
        <div className="ti-profile-img">
          <Image
            src={`${ASSET_BASE}/images/reviews/avatar-${index + 1}.png`}
            alt={`${review.name} profile picture`}
            width={40}
            height={40}
            loading="eager"
          />
        </div>
        <div className="ti-profile-details">
          <div className="ti-name">{review.name}</div>
          <div className="ti-date" suppressHydrationWarning>
            {timeAgo(review.time)}
          </div>
        </div>
      </div>
      <div className="ti-review-content">
        <span className="ti-stars">
          {Array.from({ length: 5 }, (_, star) => (
            <Image
              key={star}
              className="ti-star"
              src={`${ASSET_BASE}/images/reviews/${star < review.rating ? "star-full" : "star-empty"}.svg`}
              alt={`Google star ${star + 1}`}
              width={17}
              height={17}
            />
          ))}
          <span
            className="ti-verified-review"
            title="Trustindex verifies that the original source of the review is Google."
          />
        </span>
        <div ref={textRef} className={cn("ti-review-text", open && "is-open")}>
          {review.text}
        </div>
        <span className="ti-read-more">
          {overflowing || open ? (
            <button
              type="button"
              onClick={() => {
                setOpen((value) => !value);
                onExpand();
              }}
            >
              {open ? "Hide" : "Read more"}
            </button>
          ) : null}
        </span>
        <div className="ti-platform-icon" title="Posted on Google">
          <Image src={`${ASSET_BASE}/images/reviews/google-icon.svg`} alt="Google" width={20} height={20} />
        </div>
      </div>
    </div>
  );
}

export function GoogleReviewsWidget() {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const count = googleReviews.length;
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), AUTOPLAY_TIMEOUT);
    return () => window.clearInterval(timer);
  }, [autoplay, count]);

  const step = (delta: number) => {
    setAutoplay(false);
    setIndex((value) => (value + delta + count) % count);
  };

  return (
    <div className="ti-widget">
      <div className="ti-widget-container">
        <div className="ti-reviews-container">
          <div className="ti-controls">
            <button type="button" className="ti-next" aria-label="Next review" onClick={() => step(1)} />
            <button type="button" className="ti-prev" aria-label="Previous review" onClick={() => step(-1)} />
          </div>
          <div
            className="ti-reviews-container-wrapper"
            onPointerDown={(event) => {
              dragStart.current = event.clientX;
            }}
            onPointerUp={(event) => {
              if (dragStart.current === null) return;
              const delta = event.clientX - dragStart.current;
              dragStart.current = null;
              if (Math.abs(delta) > DRAG_THRESHOLD) step(delta < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              dragStart.current = null;
            }}
          >
            <div className="ti-reviews-track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {googleReviews.map((review, reviewIndex) => (
                <ReviewItem
                  key={review.name}
                  review={review}
                  index={reviewIndex}
                  onExpand={() => setAutoplay(false)}
                />
              ))}
            </div>
          </div>
          <div className="ti-controls-line">
            <div className="dot" style={{ left: `${(index / (count - 1)) * (150 - 25)}px` }} />
          </div>
        </div>
        <div className="ti-footer">
          <span className="nowrap">
            <strong>Google</strong> rating score:{" "}
          </span>
          <span className="nowrap">
            <strong>4.7</strong> of 5,{" "}
          </span>
          <br />
          <span className="nowrap">
            based on <strong>37 reviews</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
