import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { decodeEntities, featuredImage, getPage, getPostsByCategory, stripTags, type WpEntry } from "@/lib/wp";
import { pageHeadings } from "./config";
import { PageBanner } from "./PageBanner";
import { WpHtml } from "./WpHtml";

export async function pageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: decodeEntities(page.title.rendered),
    description: stripTags(page.excerpt.rendered).slice(0, 160),
    alternates: { canonical: `/${slug}/` },
  };
}

/** Standard theme sub-page: banner, bordered title, CMS body, extra sections. */
export async function SubPage({ slug, children, id }: { slug: string; children?: ReactNode; id?: string }) {
  const page = await getPage(slug);
  if (!page) notFound();
  const headings = pageHeadings[slug] ?? {};
  return (
    <>
      <PageBanner entry={page} title={headings.title} subtitle={headings.subtitle} />
      <section id={id} className="sl-container" style={{ padding: "32px 12px 0" }}>
        <h2 className="sl-subpage-title">{headings.intro ?? decodeEntities(page.title.rendered)}</h2>
        <WpHtml html={page.content.rendered} />
      </section>
      {children}
    </>
  );
}

/** A titled grid of posts from one category, each with image, title and body. */
export async function CategorySection({
  category,
  title,
  id,
  columns = 3,
  grayscale = false,
}: {
  category: string;
  title: string;
  id?: string;
  columns?: number;
  grayscale?: boolean;
}) {
  const posts = await getPostsByCategory(category);
  if (posts.length === 0) return null;
  return (
    <section id={id} style={{ padding: "16px 0 48px", scrollMarginTop: "5rem" }}>
      <div className="sl-container">
        <h2 className="sl-section-title" style={{ textAlign: "center" }}>
          {title}
        </h2>
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.floor(1100 / columns) - 24}px), 1fr))`,
          }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} grayscale={grayscale} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PostCard({ post, grayscale }: { post: WpEntry; grayscale?: boolean }) {
  const image = featuredImage(post, "medium_large");
  return (
    <article>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.source_url}
          alt={image.alt_text || decodeEntities(post.title.rendered)}
          loading="lazy"
          style={{ width: "100%", height: 280, objectFit: "cover", filter: grayscale ? "grayscale(1)" : undefined }}
        />
      )}
      <h3 style={{ color: "var(--sl-heading)", fontSize: "1.1rem", margin: "16px 0 8px" }}>
        {decodeEntities(post.title.rendered)}
      </h3>
      <WpHtml html={post.content.rendered} />
    </article>
  );
}
