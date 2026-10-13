import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageHeadings } from "@/components/sites/showlanka/config";
import { PageBanner } from "@/components/sites/showlanka/PageBanner";
import { getNewsListing, getPage, type NewsItem } from "@/lib/wp";

// SEO title/description set in the live site's SEO plugin, which the REST API omits.
const TITLE = "Budget tour operators - Latest Sri Lanka Tourism News";
const DESCRIPTION =
  "Stay updated with the latest news and updates on Sri Lanka tourism. Discover new travel trends, government policies, and industry insights with Show Lanka Tours.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/news-offers/" },
};

export default async function NewsPage() {
  const [page, news] = await Promise.all([getPage("news-offers"), getNewsListing()]);
  if (!page) notFound();
  const headings = pageHeadings["news-offers"];

  return (
    <>
      <PageBanner entry={page} title={headings.title} subtitle={headings.subtitle} className="sl-banner--natural" />
      <section className="sl-tours-intro">
        <div className="sl-tours-container">
          <h2 className="sl-subpage-title">{headings.intro}</h2>
        </div>
      </section>
      <section className="sl-news">
        <div className="sl-tours-container">
          <div className="sl-news__grid">
            {news.map((item) => (
              <NewsRow key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <article className="sl-news__item">
      <div
        className="sl-news__img"
        role="img"
        aria-label={item.title}
        style={item.image ? { backgroundImage: `url("${item.image}")` } : undefined}
      >
        {item.hasVideo && (
          <Link href={`/${item.slug}#video-player`} className="sl-news__play" aria-label={`Watch video: ${item.title}`}>
            <span>
              <svg viewBox="0 0 384 512" aria-hidden>
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
              </svg>
            </span>
          </Link>
        )}
      </div>
      <div className="sl-news__text">
        <h3>
          <Link href={`/${item.slug}`}>{item.title}</Link>
        </h3>
        <p>{item.date}</p>
      </div>
    </article>
  );
}
