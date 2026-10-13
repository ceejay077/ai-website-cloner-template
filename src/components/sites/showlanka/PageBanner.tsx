import { decodeEntities, featuredImage, stripTags, type WpEntry } from "@/lib/wp";

/**
 * Sub-page hero: the page's featured image with a title and subtitle overlaid.
 * Defaults to the WordPress title and excerpt; theme headings can override them.
 */
export function PageBanner({
  entry,
  showText = true,
  title,
  subtitle,
  className,
}: {
  entry: WpEntry;
  showText?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const image = featuredImage(entry);
  const heading = title ?? decodeEntities(entry.title.rendered);
  const sub = subtitle ?? stripTags(entry.excerpt.rendered).replace(/\s*Read More$/, "");
  return (
    <section className={className ? `sl-banner ${className}` : "sl-banner"}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.source_url} alt={image.alt_text || ""} fetchPriority="high" />
      )}
      {showText && (
        <div className="sl-banner__text">
          <h1>{heading}</h1>
          {sub && <h2>{sub}</h2>}
        </div>
      )}
    </section>
  );
}
