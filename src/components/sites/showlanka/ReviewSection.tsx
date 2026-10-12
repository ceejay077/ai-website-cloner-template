import { TOURRADAR_WIDGET_URL } from "./data";
import { GoogleReviewsWidget } from "./GoogleReviewsWidget";
import { TripAdvisorBadge } from "./TripAdvisorBadge";
import { VideoReview } from "./VideoReview";

function TourRadarWidget() {
  return (
    <div id="tr">
      <div id="head-tr">
        <a href="https://www.tourradar.com/" target="_blank" title="TourRadar" rel="noopener">
          <div id="logo-tr" />
        </a>
        <a href="https://www.tourradar.com/review#7578-134495" target="_blank" id="change_a" rel="noopener">
          <div id="write_review-tr">
            <span>Leave a review</span>
          </div>
        </a>
      </div>
      <div id="operator-tr" />
      <iframe src={TOURRADAR_WIDGET_URL} width={240} height={280} title="TourRadar Reviews" loading="lazy" />
    </div>
  );
}

export function ReviewSection() {
  return (
    <section className="review-section" id="review-section">
      <div className="sl-container-fluid">
        <p className="uppercase-subtitle border-after">Traveler Tales</p>
        <h2 className="section-title">Inspiring Stories from Around the Globe</h2>
        <div className="sl-row">
          <div className="sl-col-lg-3 sl-col-12 video-review-wrapper">
            <h4>Visual Chronicles: Narratives of Adventure in Motion</h4>
            <VideoReview />
          </div>
          <div className="sl-col-lg-9 sl-col-12">
            <div className="sl-row">
              <div className="sl-col-12 sl-col-lg-4 review-content">
                <article className="sl-flex-1 review-content sl-h-100">
                  <div className="text-content sl-flex-fill">
                    <TourRadarWidget />
                  </div>
                </article>
              </div>
              <div className="sl-col-12 sl-col-lg-4 review-content">
                <article className="sl-flex-1 review-content sl-h-100">
                  <div className="text-content sl-flex-fill">
                    <GoogleReviewsWidget />
                  </div>
                </article>
              </div>
              <div className="sl-col-12 sl-col-lg-4 review-content">
                <article className="sl-flex-1 review-content sl-h-100">
                  <div className="text-content sl-flex-fill">
                    <TripAdvisorBadge />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
