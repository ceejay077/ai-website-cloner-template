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

export interface TourCategory {
  key: string;
  label: string;
}

/** The listing's category dropdown, built by the theme from tour subcategories. */
export interface TourListingData {
  tours: TourMeta[];
  categories: TourCategory[];
}

export async function getTourListing(): Promise<TourListingData> {
  const res = await fetch(`${WP_ORIGIN}/sri-lanka-tours/`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return { tours: [], categories: [] };
  const html = await res.text();
  const select = html.match(/<select id="subcategory-filter"[\s\S]*?<\/select>/)?.[0] ?? "";
  const categories = [...select.matchAll(/<option value="([^"]+)">([^<]*)<\/option>/g)].map((m) => ({
    key: m[1],
    label: decodeEntities(m[2].trim()),
  }));
  return { tours: parseTourCards(html), categories };
}

// Tour cards as the theme renders them on the listing and in "Similar Tour Packages".
function parseTourCards(html: string): TourMeta[] {
  const blocks = html.split('class="col-lg-6 col-12 package-list-container').slice(1);
  return blocks.map((block) => {
    const classes = block.slice(0, block.indexOf('"')).trim().split(/\s+/);
    const daysClass = classes.find((c) => c.startsWith("days-"));
    const months = JSON.parse(block.match(/data-attr-months="([^"]*)"/)?.[1] ?? "[]") as number[];
    const values = [...block.matchAll(/<span class="value">([^<]*)<\/span>/g)].map((m) => m[1]);
    const href = block.match(/<a href="([^"]+)" class="btn common-btn"/)?.[1] ?? "";
    return {
      slug: href.replace(WP_ORIGIN, "").replace(/^\/|\/$/g, ""),
      title: decodeEntities(block.match(/<h3>([\s\S]*?)<\/h3>/)?.[1].trim() ?? ""),
      image: decodeEntities(block.match(/data-bg-image="url\(([^)]*)\)"/)?.[1] ?? "").replace(/'/g, ""),
      days: daysClass ? Number(daysClass.slice(5)) : Number.parseInt(values[0] ?? "", 10) || 0,
      duration: values[0] ?? "",
      price: values[1] ?? "",
      months,
      categories: classes.filter((c) => c && !c.startsWith("days-")),
      excerpt: stripTags((block.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "").replace(/<a[\s\S]*<\/a>/, "")),
    };
  });
}

/** Image URLs from the first post's gallery in a category (e.g. the coupon popup). */
export async function getGalleryImages(category: string): Promise<string[]> {
  const [post] = await getPostsByCategory(category);
  if (!post) return [];
  // The lazy-load plugin may swap `src` for a placeholder and keep the real URL in data-src.
  return [...post.content.rendered.matchAll(/<img[^>]*>/g)]
    .map(([tag]) => (tag.match(/\sdata-src="([^"]+)"/) ?? tag.match(/\ssrc="([^"]+)"/))?.[1] ?? "")
    .filter((src) => src && !src.startsWith("data:"));
}

// --- Tour detail page ------------------------------------------------------
// The single-tour template adds theme fields (tour code, per-pax pricing,
// discount, route coordinates, similar tours) that the REST API omits, so
// they are read from the live post page.

export interface TourPrice {
  old: string;
  current: string;
  save: string;
  /** Raw per-person amount the price calculator multiplies. */
  amount: number;
}

export interface TourDetail {
  code: string;
  duration: string;
  /** Prices for 1, 2 and 3 travellers, in that order. */
  prices: TourPrice[];
  discount: string;
  /** Ordered route stops; the theme draws a closed loop through them. */
  locations: { name: string; position: [number, number] }[];
  similar: TourMeta[];
}

/** Category slug the theme files every tour package under. */
export const TOUR_CATEGORY = "packages";

export async function isTourPost(post: WpEntry): Promise<boolean> {
  const cats = await getCategories();
  const tourCat = cats.find((c) => c.slug === TOUR_CATEGORY);
  return Boolean(tourCat && post.categories?.includes(tourCat.id));
}

const clean = (text: string) => decodeEntities(text.replace(/\s+/g, " ").trim());

export async function getTourDetail(slug: string): Promise<TourDetail | null> {
  const res = await fetch(`${WP_ORIGIN}/${encodeURIComponent(slug)}/`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const details = html.slice(html.indexOf('class="flex flex-col tour-details-container"'), html.indexOf('class="detail-inner"'));
  if (!details) return null;

  const amounts = html.match(/data-attr-initVal="([^"]*)"\s*data-attr-2pax="([^"]*)"\s*data-attr-3pax="([^"]*)"/)?.slice(1) ?? [];
  const prices = [1, 2, 3].map((pax, i) => {
    const display = details.match(
      new RegExp(`price-display ${pax}pax[^"]*">\\s*<span class="old-price">([^<]*)</span>\\s*<span>([^<]*)</span>`),
    );
    return {
      old: clean(display?.[1] ?? ""),
      current: clean(display?.[2] ?? ""),
      save: clean(details.match(new RegExp(`<span class="save ${pax}pax[^"]*">([^<]*)</span>`))?.[1] ?? "0"),
      amount: Number.parseFloat(amounts[i] ?? "0") || 0,
    };
  });

  const mapJson = html.match(/mapData = (\{[\s\S]*?\});/)?.[1];
  const raw = mapJson ? (JSON.parse(mapJson) as { locations?: Record<string, [number, number]> }).locations : undefined;
  const locations = Object.entries(raw ?? {}).map(([key, position]) => {
    const name = key.replace(/_/g, " ");
    return { name: name.charAt(0).toUpperCase() + name.slice(1), position };
  });

  const similarStart = html.indexOf('class="packages-list similar-post-container"');
  const similarEnd = html.indexOf("</section>", similarStart);

  return {
    code: clean(html.match(/<span>Tour code: ([^<]*)<\/span>/)?.[1] ?? ""),
    duration: clean(details.match(/<span class="label">Duration<\/span>\s*<span class="value">([^<]*)<\/span>/)?.[1] ?? ""),
    prices,
    discount: clean(details.match(/discount-rate[\s\S]*?<span class="value">([^<]*)<\/span>/)?.[1] ?? ""),
    locations,
    similar: similarStart < 0 ? [] : parseTourCards(html.slice(similarStart, similarEnd)),
  };
}

/** Image URLs from a post's own galleries (the tour hero cycles through these). */
export function contentImages(html: string): string[] {
  return [...html.matchAll(/<figure class="wp-block-image[\s\S]*?<img[^>]*>/g)]
    .map(([tag]) => (tag.match(/\sdata-src="([^"]+)"/) ?? tag.match(/\ssrc="([^"]+)"/))?.[1] ?? "")
    .filter((src) => src && !src.startsWith("data:"));
}

// --- News ------------------------------------------------------------------
// The news list and each article's video come from theme fields the REST API
// omits, so they are read from the live pages like the tour data above.

export interface NewsItem {
  slug: string;
  title: string;
  /** Empty for video posts the theme lists without a thumbnail. */
  image: string;
  date: string;
  hasVideo: boolean;
}

export const NEWS_CATEGORY = "news";

export async function isNewsPost(post: WpEntry): Promise<boolean> {
  const cats = await getCategories();
  const news = cats.find((c) => c.slug === NEWS_CATEGORY);
  return Boolean(news && post.categories?.includes(news.id));
}

export async function getNewsListing(): Promise<NewsItem[]> {
  const res = await fetch(`${WP_ORIGIN}/news-offers/`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return [];
  const html = await res.text();
  return html
    .split('class="col-lg-6 col-12 news-list-container"')
    .slice(1)
    .map((block) => {
      const href = block.match(/<h3>\s*<a href="([^"]+)"/)?.[1] ?? "";
      const image = block.match(/data-bg-image="url\(([^)]*)\)"/)?.[1] ?? block.match(/style="background-image: url\(([^)]*)\);"/)?.[1] ?? "";
      return {
        slug: href.replace(WP_ORIGIN, "").replace(/^\/|\/$/g, ""),
        title: clean(block.match(/<h3>\s*<a [^>]*>([\s\S]*?)<\/a>/)?.[1] ?? ""),
        image: decodeEntities(image).replace(/'/g, ""),
        date: clean(block.match(/<p class="published-date">([\s\S]*?)<\/p>/)?.[1] ?? ""),
        hasVideo: block.includes("video-thumbnail-news"),
      };
    })
    .filter((item) => item.slug);
}

/** YouTube embed URL from the theme's video field on a post page, if any. */
export async function getPostVideo(slug: string): Promise<string | null> {
  const res = await fetch(`${WP_ORIGIN}/${encodeURIComponent(slug)}/`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return null;
  const html = await res.text();
  const iframe = html.match(/<div id="video-player"[^>]*>\s*<iframe([^>]*)>/)?.[1] ?? "";
  return iframe.match(/\sdata-src="([^"]+)"/)?.[1] ?? iframe.match(/\ssrc="(https:[^"]+)"/)?.[1] ?? null;
}
