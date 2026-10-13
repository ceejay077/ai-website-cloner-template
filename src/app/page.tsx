import Link from "next/link";
import { Badge, Heart, Shield, type LucideIcon } from "lucide-react";
import { home as homeConfig } from "@/components/sites/showlanka/config";
import { GoogleReviews } from "@/components/sites/showlanka/GoogleReviews";
import { parseGoogleReviews } from "@/components/sites/showlanka/googleReviewData";
import { HeroCarousel } from "@/components/sites/showlanka/HeroCarousel";
import { TripadvisorWidget } from "@/components/sites/showlanka/TripadvisorWidget";
import { VideoReview } from "@/components/sites/showlanka/VideoReview";
import { WpHtml } from "@/components/sites/showlanka/WpHtml";
import { decodeEntities, featuredImage, getPage, getPostsByCategory, type WpEntry } from "@/lib/wp";

// mainpacks post slug → tour listing filter key
const PACK_FILTER: Record<string, string> = {
  "group-tours": "group",
  "all-year-tours": "year",
  "family-tours": "family",
  "hot-summer-tours": "summer",
  "most-popular-tours": "popular",
  "private-tours": "private",
  "winter-tours": "winter",
  "safari-tours": "safari",
  "day-tours": "day",
};

// Font Awesome classes used in "whyus" post content → matching Lucide icon.
const WHY_ICONS: [string, LucideIcon][] = [
  ["fa-heart", Heart],
  ["fa-certificate", Badge],
  ["fa-shield", Shield],
];
const WHY_COLORS: Record<string, string> = { "red-icon": "#c62828", "yellow-icon": "#fbbd00", green: "#2e8b57" };

export default async function HomePage() {
  const [home, packs, whyUs, special, reviews] = await Promise.all([
    getPage("welcome-to-sri-lanka"),
    getPostsByCategory("mainpacks"),
    getPostsByCategory("whyus", "desc"),
    getPostsByCategory("specialtour"),
    getPostsByCategory("review", "desc"),
  ]);

  const packOrder = Object.keys(PACK_FILTER);
  const sortedPacks = [...packs].sort((a, b) => packOrder.indexOf(a.slug) - packOrder.indexOf(b.slug));

  return (
    <>
      <HeroCarousel />

      {home && (
        <section className="sl-home-intro">
          <div className="sl-container sl-reveal">
            <p className="sl-eyebrow">Explore Sri Lanka</p>
            <h2>Discover Unmatched Sri Lanka Tours with Show Lanka Tours</h2>
            <WpHtml html={home.content.rendered} />
          </div>
        </section>
      )}

      <section className="sl-packages">
        <p className="sl-eyebrow sl-border-after">Your Gateway to Authentic Sri Lankan Adventures</p>
        <h2 className="sl-section-title">Tour Packages</h2>
        <div className="sl-packages__grid">
          {sortedPacks.map((pack) => (
            <PackTile key={pack.id} pack={pack} filter={PACK_FILTER[pack.slug]} />
          ))}
        </div>
      </section>

      {whyUs.length > 0 && (
        <section className="sl-why">
          <div className="sl-container">
            <p className="sl-eyebrow sl-border-after">Why travel with Show Lanka?</p>
            <h2 className="sl-section-title">Explore Sri Lanka Like a Local</h2>
            <div className="sl-why__grid">
              {whyUs.map((item) => (
                <WhyCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {special.map((tour) => {
        const image = featuredImage(tour);
        return (
          <section key={tour.id} className="sl-special">
            <div
              className="sl-special__bg"
              role="img"
              aria-label={decodeEntities(tour.title.rendered)}
              style={image ? { backgroundImage: `url('${image.source_url}')` } : undefined}
            />
            <div className="sl-special__text">
              <p className="sl-eyebrow sl-border-after">Discover Unforgettable Adventures</p>
              <h2 className="sl-section-title">{decodeEntities(tour.title.rendered)}</h2>
              <WpHtml html={tour.content.rendered} className="" />
              <Link className="sl-btn" href={homeConfig.specialTourHref}>
                Read More<span className="sr-only"> about {decodeEntities(tour.title.rendered)}</span>
              </Link>
            </div>
          </section>
        );
      })}

      <section id="review-section" className="sl-reviews">
        <p className="sl-eyebrow sl-border-after">Traveler Tales</p>
        <h2 className="sl-section-title">Inspiring Stories from Around the Globe</h2>
        <div className="sl-reviews__row">
          <VideoReview />
          <div className="sl-reviews__widgets">
            {reviews.map((review) => (
              <div key={review.id} className="sl-reviews__item">
                <ReviewWidget review={review} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PackTile({ pack, filter }: { pack: WpEntry; filter?: string }) {
  const image = featuredImage(pack, "large");
  const title = decodeEntities(pack.title.rendered);
  return (
    <Link className="sl-pack" href={filter ? `/sri-lanka-tours?${filter}` : "/sri-lanka-tours"}>
      <div className="sl-pack__img">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.source_url} alt={image.alt_text || title} loading="lazy" />
        )}
      </div>
      <div className="sl-pack__text">
        <h3>{title}</h3>
        <span className="sl-pack__more">Read More</span>
      </div>
    </Link>
  );
}

function WhyCard({ item }: { item: WpEntry }) {
  const html = item.content.rendered;
  const iconClass = html.match(/<i class="([^"]*)"/)?.[1] ?? "";
  const Icon = WHY_ICONS.find(([cls]) => iconClass.includes(cls))?.[1] ?? Shield;
  const color = Object.entries(WHY_COLORS).find(([cls]) => iconClass.split(" ").includes(cls))?.[1] ?? "var(--sl-blue)";
  const body = html.replace(/<i [^>]*><\/i>/g, "").replace(/<blockquote[^>]*>\s*<\/blockquote>/g, "");
  return (
    <article className="sl-why__card">
      <h3>{decodeEntities(item.title.rendered)}</h3>
      <Icon className="sl-why__icon" size={88} color={color} fill={color} aria-hidden />
      <WpHtml html={body} className="" />
    </article>
  );
}

function ReviewWidget({ review }: { review: WpEntry }) {
  const html = review.content.rendered;
  if (html.includes("ti-widget")) {
    const google = parseGoogleReviews(html);
    if (google) {
      return <GoogleReviews {...google} />;
    }
  }
  if (html.includes("TA_cdsratingsonlynarrow")) return <TripadvisorWidget uniq={785} />;
  return <WpHtml html={html} className="sl-reviews__embed" />;
}
