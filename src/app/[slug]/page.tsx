import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsPost } from "@/components/sites/showlanka/NewsPost";
import { PageBanner } from "@/components/sites/showlanka/PageBanner";
import { TourPost } from "@/components/sites/showlanka/TourPost";
import { WpHtml } from "@/components/sites/showlanka/WpHtml";
import { decodeEntities, getAllPostSlugs, getPost, isNewsPost, isTourPost, stripTags } from "@/lib/wp";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = decodeEntities(post.title.rendered);
  const description = stripTags(post.excerpt.rendered).replace(/\s*Read More$/, "").slice(0, 160);
  if ((await isTourPost(post)) || (await isNewsPost(post))) {
    // Tour and news pages use the SEO plugin's "{title} - {site name}" pattern and the whole excerpt.
    return {
      title: { absolute: `${title} - Sri Lanka tour operators | Show Lanka tours` },
      description: stripTags(post.excerpt.rendered).replace(/\s*Read More$/, "").replace(/…$/, ""),
      alternates: { canonical: `/${slug}/` },
      openGraph: { type: "article" },
    };
  }
  return { title, description, alternates: { canonical: `/${slug}/` } };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  if (await isTourPost(post)) return <TourPost post={post} />;
  if (await isNewsPost(post)) return <NewsPost post={post} />;
  return (
    <>
      <PageBanner entry={post} />
      <article className="sl-container" style={{ padding: "32px 12px 48px", maxWidth: 960 }}>
        <h2 className="sl-subpage-title">{decodeEntities(post.title.rendered)}</h2>
        <WpHtml html={post.content.rendered} />
        <p style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 32 }}>
          <Link className="sl-btn" href="/contact">Send an Inquiry</Link>
          <Link className="sl-btn" href="/sri-lanka-tours">All tours</Link>
        </p>
      </article>
    </>
  );
}
