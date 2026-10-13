import { contentImages, decodeEntities, featuredImage, getGalleryImages, getTourDetail, prepareHtml, WP_ORIGIN, type WpEntry } from "@/lib/wp";
import { CouponPopup } from "./CouponPopup";
import { PostHero } from "./PostHero";
import { TourContent } from "./TourContent";
import { TourCard } from "./TourListing";
import { TourPricePanel } from "./TourPricePanel";
import { TourRouteMap } from "./TourRouteMap";

/**
 * Single tour package, as the theme's tour template renders it: cycling hero,
 * title with tour code, price box and calculator, the CMS itinerary tabs, the
 * route map, similar packages and the coupon popup.
 */
export async function TourPost({ post }: { post: WpEntry }) {
  const [detail, coupons] = await Promise.all([getTourDetail(post.slug), getGalleryImages("bonanza")]);
  const title = decodeEntities(post.title.rendered);
  const featured = featuredImage(post)?.source_url;
  const heroImages = [...(featured ? [featured] : []), ...contentImages(post.content.rendered)];

  return (
    <>
      <article className="sl-post sl-tourpost">
        <PostHero images={heroImages} alt={title} />
        <div className="sl-tours-container">
          <div className="sl-post__body">
            <h1 className="sl-post__title">
              {title}
              {detail?.code && <span>Tour code: {detail.code}</span>}
            </h1>
            {detail && (
              <TourPricePanel
                duration={detail.duration}
                prices={detail.prices}
                discount={detail.discount}
                brochureName={detail.code ? `${title} Tour code: ${detail.code}` : title}
              />
            )}
            <TourContent html={prepareHtml(post.content.rendered)} />
            {detail && detail.locations.length > 0 && <TourRouteMap locations={detail.locations} />}
          </div>
        </div>
      </article>

      {detail && detail.similar.length > 0 && (
        <section className="sl-tours sl-tours--similar">
          <p className="sl-similar__eyebrow">Are you interested our above package?</p>
          <h2 className="sl-similar__title">Similar Tour Packages</h2>
          <div className="sl-tours__grid">
            {detail.similar.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </section>
      )}

      <CouponPopup images={coupons} moreHref={`${WP_ORIGIN}/sweet-bonanza/`} />
    </>
  );
}
