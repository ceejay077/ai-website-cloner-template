import Image from "next/image";

import { ASSET_BASE, TRIPADVISOR_URL } from "./data";

/** Rebuild of TripAdvisor's "cdsratingsonlynarrow" widget as rendered on the source. */
export function TripAdvisorBadge() {
  return (
    <div className="ta-badge">
      <div className="ta-badge__inner">
        <div className="ta-badge__name">
          <a href={TRIPADVISOR_URL} target="_blank" rel="noopener">
            Show Lanka Tours
          </a>
        </div>
        <div className="ta-badge__rating">
          <span className="ta-badge__bubbles" role="img" aria-label="4.9 of 5 bubbles">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} />
            ))}
          </span>
          <span className="ta-badge__count">65 reviews</span>
        </div>
        <div className="ta-badge__logo">
          <a href={TRIPADVISOR_URL} target="_blank" rel="noopener">
            <Image src={`${ASSET_BASE}/images/tripadvisor-lockup.svg`} alt="TripAdvisor" width={115} height={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
