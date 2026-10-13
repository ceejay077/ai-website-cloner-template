import Link from "next/link";
import { pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";
import { decodeEntities, featuredImage, getPostsByCategory, stripTags } from "@/lib/wp";

export const generateMetadata = () => pageMetadata("news-offers");

export default async function NewsPage() {
  const news = await getPostsByCategory("news", "desc");
  return (
    <SubPage slug="news-offers">
      <section className="sl-container" style={{ display: "grid", gap: 16, padding: "0 12px 48px" }}>
        {news.map((post) => {
          const image = featuredImage(post, "medium_large");
          const title = decodeEntities(post.title.rendered);
          return (
            <article key={post.id} className="sl-listing" style={{ boxShadow: "none" }}>
              <div className="sl-listing__img">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.source_url} alt={image.alt_text || title} loading="lazy" />
                )}
              </div>
              <div className="sl-listing__text">
                <h3>{title}</h3>
                <p>
                  {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p>{stripTags(post.excerpt.rendered).replace(/\s*Read More$/, "")}</p>
                <Link href={`/${post.slug}`} className="sl-btn">
                  Read More<span className="sr-only"> about {title}</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </SubPage>
  );
}
