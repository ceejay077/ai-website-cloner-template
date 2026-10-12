"use client";

import { useState } from "react";

import { ASSET_BASE, YOUTUBE_REVIEW_URL } from "./data";

const videoId = new URL(YOUTUBE_REVIEW_URL).searchParams.get("v");

/** Thumbnail that swaps itself for an autoplaying YouTube embed, as the theme script does. */
export function VideoReview() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="video-container">
      <div className="video-inner-wrapper">
        <div
          className="bg-image"
          role="img"
          aria-label="Happy customer"
          style={{ backgroundImage: `url('${ASSET_BASE}/images/review-pic.png')` }}
        />
        {playing && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            width="100%"
            height={315}
            title="Happy customer"
          />
        ) : (
          <a
            href={YOUTUBE_REVIEW_URL}
            className="video-thumbnail"
            aria-label="Watch video: Happy customer"
            onClick={(event) => {
              if (!videoId) return;
              event.preventDefault();
              setPlaying(true);
            }}
          >
            <div className="play-wrapper">
              <i className="fa-solid fa-play" aria-hidden="true" />
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
