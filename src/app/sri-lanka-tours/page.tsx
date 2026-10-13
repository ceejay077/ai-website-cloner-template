import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageHeadings } from "@/components/sites/showlanka/config";
import { CouponPopup } from "@/components/sites/showlanka/CouponPopup";
import { PageBanner } from "@/components/sites/showlanka/PageBanner";
import { TourListing } from "@/components/sites/showlanka/TourListing";
import { WpHtml } from "@/components/sites/showlanka/WpHtml";
import { getGalleryImages, getPage, getTourListing, WP_ORIGIN } from "@/lib/wp";

// SEO title/description set in the live site's SEO plugin, which the REST API omits.
const TITLE = "Explore Sri Lanka with Show Lanka Tours - Sri Lanka tour operators | Show Lanka tours";
const DESCRIPTION =
  "Discover Sri Lanka's top destinations with Show Lanka Tours. Custom tour packages featuring cultural, adventure, and wildlife experiences. Book your unforgettable journey today.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/sri-lanka-tours/" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: "/sri-lanka-tours/" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// The theme pre-selects a category from the raw query string, e.g. /sri-lanka-tours?summer
export default async function ToursPage({ searchParams }: Props) {
  const [page, { tours, categories }, coupons, query] = await Promise.all([
    getPage("sri-lanka-tours"),
    getTourListing(),
    getGalleryImages("bonanza"),
    searchParams,
  ]);
  if (!page) notFound();
  const [key, value] = Object.entries(query)[0] ?? [""];
  const initialCategory = value ? `${key}=${value}` : key;
  const headings = pageHeadings["sri-lanka-tours"];

  return (
    <>
      <PageBanner entry={page} title={headings.title} subtitle={headings.subtitle} className="sl-banner--natural" />
      <section className="sl-tours-intro">
        <div className="sl-tours-container">
          <h2 className="sl-subpage-title">{headings.intro}</h2>
          <WpHtml html={page.content.rendered} className="sl-tours-intro__body" />
        </div>
      </section>
      <TourListing tours={tours} categories={categories} initialCategory={initialCategory} />
      <CouponPopup images={coupons} moreHref={`${WP_ORIGIN}/sweet-bonanza/`} />
    </>
  );
}
