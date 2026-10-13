"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { home } from "./config";

/** Homepage video testimonial: thumbnail that swaps to the YouTube player on click. */
export function VideoReview() {
  const [playing, setPlaying] = useState(false);
  const { title, image, url, embed } = home.videoReview;

  return (
    <div className="sl-video">
      <h4>Visual Chronicles: Narratives of Adventure in Motion</h4>
      <div className="sl-video__frame">
        {playing ? (
          <iframe src={embed} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <>
            <div className="sl-video__bg" role="img" aria-label={title} style={{ backgroundImage: `url('${image}')` }} />
            <a
              href={url}
              className="sl-video__thumb"
              aria-label={`Watch video: ${title}`}
              onClick={(e) => {
                e.preventDefault();
                setPlaying(true);
              }}
            >
              <span className="sl-video__play">
                <Play size={24} fill="#fff" color="#fff" aria-hidden />
              </span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
