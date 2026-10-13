"use client";

import { Compass, Earth, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import { assets } from "./config";

const SESSION_KEY = "slPreloaderShown";
const FADE_MS = 400;
// Upper bound so a slow third-party embed can never leave the overlay up.
const MAX_WAIT_MS = 5000;

// Runs before first paint: skips the overlay for visitors who already saw it this
// session, and picks one of the theme's three animations at random.
const bootScript = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${SESSION_KEY}"))d.classList.add("sl-preloaded")}catch(e){}d.dataset.slPreloader=["compass","plane","globe"][Math.floor(Math.random()*3)]})()`;

/** Full-screen loader shown once per browser session until the page has loaded. */
export function PagePreloader() {
  const [state, setState] = useState<"visible" | "hiding" | "gone">("visible");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      clearTimeout(fallback);
      setState("hiding");
      timer = setTimeout(() => setState("gone"), FADE_MS);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    };
    const fallback = setTimeout(hide, MAX_WAIT_MS);
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });
    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(fallback);
      clearTimeout(timer);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <div className={`sl-preloader${state === "hiding" ? " is-hiding" : ""}`} aria-hidden>
        <div className="sl-preloader__inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assets.logo} alt="" className="sl-preloader__logo" />
          <Compass className="sl-preloader__icon sl-preloader__compass" size={48} />
          <div className="sl-preloader__icon sl-preloader__track">
            <Plane size={28} fill="currentColor" />
          </div>
          <div className="sl-preloader__icon sl-preloader__globe">
            <Earth size={52} />
            <span className="sl-preloader__orbit">
              <Plane size={16} fill="currentColor" />
            </span>
          </div>
          <p className="sl-preloader__text">Preparing your Sri Lankan adventure…</p>
        </div>
      </div>
    </>
  );
}
