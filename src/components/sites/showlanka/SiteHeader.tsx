"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { ASSET_BASE, primaryMenu } from "./data";
import { SiteLink } from "./SiteLink";
import { useLoadAnimation } from "./useLoadAnimation";

const SCROLL_THRESHOLD = 70;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const loaded = useLoadAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // The source plays the first 2/5 of the icon animation to open the menu,
  // then the remainder to close it and rewinds.
  const toggleMenu = () => {
    const video = videoRef.current;
    const opening = !menuOpen;
    setMenuOpen(opening);
    if (!video) return;

    const onTimeUpdate = () => {
      const stopAt = opening ? (video.duration / 5) * 2 : video.duration;
      if (video.currentTime >= stopAt) {
        video.pause();
        if (!opening) video.currentTime = 0;
        video.removeEventListener("timeupdate", onTimeUpdate);
      }
    };
    const onEnded = () => {
      video.currentTime = 0;
      video.removeEventListener("ended", onEnded);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    if (!opening) video.addEventListener("ended", onEnded);
    void video.play().catch(() => undefined);
  };

  return (
    <header id="masthead" className={cn("site-header", scrolled && "scrolled")}>
      <div className="sl-container-fluid">
        <div className={cn("header-wrapper on-load-animate-header sl-flex", loaded && "animated")}>
          <SiteLink href="/" rel="home">
            <Image
              src={`${ASSET_BASE}/images/logo.png`}
              alt="Show Lanka tours"
              width={558}
              height={379}
              preload
            />
          </SiteLink>
          <div className="sl-flex right-section">
            <div className="menu-icon-wrapper">
              <video
                ref={videoRef}
                className="menu-video"
                preload="auto"
                playsInline
                muted
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleMenu();
                  }
                }}
              >
                <source src={`${ASSET_BASE}/video/menu-icon.webm`} type="video/webm" />
              </video>
            </div>
            <nav className={cn("main-menu-wrapper menu sl-flex", menuOpen && "animated")} aria-label="Primary">
              <ul id="mobile-menu" className="nav-menu">
                {primaryMenu.map((item) => (
                  <li key={item.label} className={cn("menu-item", item.current && "current-menu-item")}>
                    <SiteLink href={item.href} aria-current={item.current ? "page" : undefined}>
                      {item.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
