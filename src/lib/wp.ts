// Headless WordPress client for showlanka.com.
// All page/post content is read live from the site's REST API so the
// WordPress dashboard stays the single source of truth for content.

export const WP_ORIGIN = "https://www.showlanka.com";
const API = `${WP_ORIGIN}/wp-json/wp/v2`;
const REVALIDATE_SECONDS = 3600;

export interface WpRendered {
  rendered: string;
}

export interface WpMedia {
  source_url: string;
  alt_text: string;
  media_details?: { sizes?: Record<string, { source_url: string }> };
}

export interface WpEntry {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  categories?: number[];
  featured_media: number;
  _embedded?: { "wp:featuredmedia"?: WpMedia[] };
}

export interface WpCategory {
  id: number;
  slug: string;
  name: string;
  count: number;
}

async function wpFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`WordPress API ${res.status} for ${path}`);
  return (await res.json()) as T;
}

export async function getPage(slug: string): Promise<WpEntry | null> {
  const pages = await wpFetch<WpEntry[]>(
    `/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`,
  );
  return pages[0] ?? null;
}

export async function getPost(slug: string): Promise<WpEntry | null> {
  const posts = await wpFetch<WpEntry[]>(
    `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`,
  );
  return posts[0] ?? null;
}

export async function getCategories(): Promise<WpCategory[]> {
  return wpFetch<WpCategory[]>("/categories?per_page=100");
}

/** Posts in a category (by category slug), newest first like the theme. */
export async function getPostsByCategory(
  slug: string,
  order: "asc" | "desc" = "desc",
): Promise<WpEntry[]> {
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return [];
  return wpFetch<WpEntry[]>(
    `/posts?categories=${cat.id}&per_page=100&order=${order}&_embed=wp:featuredmedia`,
  );
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await wpFetch<Pick<WpEntry, "slug">[]>(
    "/posts?per_page=100&_fields=slug",
  );
  return posts.map((p) => p.slug);
}

export function featuredImage(entry: WpEntry, size?: string): WpMedia | null {
  const media = entry._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return null;
  const sized = size ? media.media_details?.sizes?.[size]?.source_url : undefined;
  return { ...media, source_url: sized ?? media.source_url };
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&#038;": "&",
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8211;": "–",
  "&#8212;": "—",
  "&hellip;": "…",
  "&nbsp;": " ",
  "&quot;": '"',
  "&#039;": "'",
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&[#a-z0-9]+;/gi, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)));
}

export function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/** Prepare CMS HTML for rendering: drop scripts, fix lazy media, localise links. */
export function prepareHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\sdata-src="([^"]+)"/g, ' src="$1"')
    .replace(/\ssrc="data:image\/svg\+xml[^"]*"/g, "")
    .replace(/<a class="read-more"[^>]*>[\s\S]*?<\/a>/g, "")
    .replace(
      new RegExp(`href="${WP_ORIGIN}/(?!wp-content/)([^"]*)"`, "g"),
      'href="/$1"',
    );
}

// --- Tour listing metadata -------------------------------------------------
// Duration, price and travel months live in theme custom fields that the
// REST API does not expose, so they are read from the live listing page.

export interface TourMeta {
  slug: string;
  title: string;
  image: string;
  days: number;
  duration: string;
  price: string;
  months: number[];
  categories: string[];
  excerpt: string;
}

export async function getTourListing(): Promise<TourMeta[]> {
  const res = await fetch(`${WP_ORIGIN}/sri-lanka-tours/`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const blocks = html.split('class="col-lg-6 col-12 package-list-container ').slice(1);
  return blocks.map((block) => {
    const classes = block.slice(0, block.indexOf('"')).split(/\s+/);
    const daysClass = classes.find((c) => c.startsWith("days-"));
    const months = JSON.parse(block.match(/data-attr-months="([^"]*)"/)?.[1] ?? "[]") as number[];
    const values = [...block.matchAll(/<span class="value">([^<]*)<\/span>/g)].map((m) => m[1]);
    const href = block.match(/<a href="([^"]+)" class="btn common-btn"/)?.[1] ?? "";
    return {
      slug: href.replace(WP_ORIGIN, "").replace(/^\/|\/$/g, ""),
      title: decodeEntities(block.match(/<h3>([\s\S]*?)<\/h3>/)?.[1].trim() ?? ""),
      image: decodeEntities(block.match(/data-bg-image="url\(([^)]*)\)"/)?.[1] ?? "").replace(/'/g, ""),
      days: daysClass ? Number(daysClass.slice(5)) : 0,
      duration: values[0] ?? "",
      price: values[1] ?? "",
      months,
      categories: classes.filter((c) => c && !c.startsWith("days-")),
      excerpt: stripTags((block.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "").replace(/<a[\s\S]*<\/a>/, "")),
    };
  });
}
