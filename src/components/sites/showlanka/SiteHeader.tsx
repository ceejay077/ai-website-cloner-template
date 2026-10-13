"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { assets, primaryNav } from "./config";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // The theme's animated menu icon plays forward to open and backward to close.
  const toggle = () => {
    const video = videoRef.current;
    const next = !open;
    setOpen(next);
    if (!video) return;
    if (next) {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <header className={`sl-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="sl-header__inner">
        <Link href="/" rel="home" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assets.logo} alt="Show Lanka tours" className="sl-header__logo" width={558} height={379} />
        </Link>
        <button
          type="button"
          className="sl-header__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="sl-primary-nav"
          onClick={toggle}
        >
          <video ref={videoRef} muted playsInline preload="auto">
            <source src={assets.menuIcon} type="video/webm" />
          </video>
        </button>
        <nav id="sl-primary-nav" className={`sl-nav${open ? " is-open" : ""}`} aria-label="Primary">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
