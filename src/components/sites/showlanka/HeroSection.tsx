import { GOOGLE_MAPS_URL, SOURCE_ORIGIN, TOURRADAR_WIDGET_URL } from "./data";
import { GoogleIcon } from "./GoogleIcon";
import { HeroRotatingWords } from "./HeroRotatingWords";
import { HeroSlides } from "./HeroSlides";
import { TripAdvisorBadge } from "./TripAdvisorBadge";

export function HeroSection() {
  return (
    <div className="hero-section-wrapper">
      <section className="sl-flex carousel-content">
        <div className="sl-flex sl-flex-col inner-carousel-container">
          <div className="post-wrapper">
            <HeroSlides />
          </div>
          <div className="hero-black-overlay" />
          <div className="sl-flex sl-flex-col overlay-tagline">
            <h1 className="hero-title">
              <span className="hero-prefix">Sri Lanka Tours:</span>
              <HeroRotatingWords />
            </h1>
            <p className="hero-subtitle">
              Custom Sri Lanka holiday packages with expert local guides — beaches, wildlife, culture &amp; adventure
              in one unforgettable trip.
            </p>
            <a className="sl-btn common-btn" href={`${SOURCE_ORIGIN}/contact/`}>
              Send an Inquiry
            </a>
          </div>
          <div className="hero-tourradar-widget">
            <iframe
              className="hero-tourradar-widget__frame"
              src={TOURRADAR_WIDGET_URL}
              width={240}
              height={280}
              title="TourRadar Reviews"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <div className="hero-review-badges">
        <div className="hero-tripadvisor-widget">
          <TripAdvisorBadge />
        </div>
        <a className="hero-google-widget" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener">
          <GoogleIcon className="hero-google-widget__icon" />
          <span className="hero-google-widget__text">
            <span className="hero-google-widget__rating">
              <strong>4.7</strong> <span className="hero-google-widget__stars">★★★★★</span>
            </span>
            <span className="hero-google-widget__count">37 Google Reviews</span>
          </span>
        </a>
      </div>
    </div>
  );
}
