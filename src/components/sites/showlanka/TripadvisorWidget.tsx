"use client";

import { useEffect } from "react";
import { contact, tripadvisorWidgetSrc } from "./config";

/** TripAdvisor's ratings badge. Its script swaps the fallback logo for the live badge. */
export function TripadvisorWidget({ uniq }: { uniq: number }) {
  useEffect(() => {
    // Deferred so a Strict Mode mount/unmount cycle never starts a script; once
    // started, the script removes itself, so cleanup must not detach it.
    const timer = setTimeout(() => {
      const script: HTMLScriptElement & { loadtrk?: boolean } = document.createElement("script");
      script.async = true;
      script.src = tripadvisorWidgetSrc(uniq);
      script.setAttribute("data-loadtrk", "");
      // Mirrors the embed's inline onload="this.loadtrk=true".
      script.onload = () => {
        script.loadtrk = true;
      };
      document.body.appendChild(script);
    });
    return () => clearTimeout(timer);
  }, [uniq]);

  return (
    <div id={`TA_cdsratingsonlynarrow${uniq}`} className="TA_cdsratingsonlynarrow">
      <ul className="TA_links">
        <li>
          <a target="_blank" href={contact.tripadvisor} rel="noopener">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg"
              alt="TripAdvisor"
            />
          </a>
        </li>
      </ul>
    </div>
  );
}
