import { contentImages, decodeEntities, featuredImage, getPostVideo, prepareHtml, type WpEntry } from "@/lib/wp";
import { NewsContent } from "./NewsContent";
import { PostHero } from "./PostHero";

/**
 * News article, as the theme's single-post template renders it: a cycling
 * image hero with no text over it, the title, the CMS body and, for video
 * posts, the YouTube player.
 */
export async function NewsPost({ post }: { post: WpEntry }) {
  const video = await getPostVideo(post.slug);
  const title = decodeEntities(post.title.rendered);
  const featured = featuredImage(post)?.source_url;
  const heroImages = [...(featured ? [featured] : []), ...contentImages(post.content.rendered)];

  return (
    <article className="sl-post sl-newspost">
      <PostHero images={heroImages} alt={title} />
      <div className="sl-tours-container">
        <div className="sl-post__body">
          <h1 className="sl-post__title">{title}</h1>
          <NewsContent html={prepareHtml(post.content.rendered)} />
          {video && (
            <div id="video-player" className="sl-newspost__video">
              <iframe
                src={video}
                title={title}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
