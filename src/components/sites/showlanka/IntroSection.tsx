"use client";

import { cn } from "@/lib/utils";

import { introParagraphs } from "./data";
import { useLoadAnimation } from "./useLoadAnimation";

export function IntroSection() {
  const loaded = useLoadAnimation();

  return (
    <section className="sl-flex home-content">
      <div className="sl-container">
        <div className="sl-row">
          <div className={cn("sl-col-12 home-text-content on-load-animate", loaded && "animated")}>
            <article className="sl-flex-1 home-container sl-h-100">
              <div className="text-content sl-flex-fill">
                <div className="title-wrapper">
                  <p className="uppercase-subtitle">Explore Sri Lanka</p>
                  <h2>Discover Unmatched Sri Lanka Tours with Show Lanka Tours</h2>
                </div>
                {introParagraphs.map((text) => (
                  <p key={text.slice(0, 24)}>{text}</p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
