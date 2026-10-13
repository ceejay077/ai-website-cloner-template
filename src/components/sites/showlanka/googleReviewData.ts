// Parses the Trustindex Google-reviews widget that WordPress stores as static
// HTML in the "Google Review" post, so the carousel renders without its loader.

import { decodeEntities } from "@/lib/wp";

export interface GoogleReview {
  name: string;
  avatar: string;
  stars: number;
  text: string;
  /** Relative age shown under the name, e.g. "6 years ago". */
  ago: string;
}

export interface GoogleReviewSummary {
  reviews: GoogleReview[];
  score: string;
  count: string;
}

export function parseGoogleReviews(html: string): GoogleReviewSummary | null {
  const now = Date.now();
  const items = html.split('class="ti-review-item').slice(1);
  if (!items.length) return null;
  const reviews = items.map((item) => ({
    name: decodeEntities(item.match(/<div class="ti-name">([\s\S]*?)<\/div>/)?.[1].trim() ?? ""),
    avatar: item.match(/<div class="ti-profile-img">\s*<img[^>]*\ssrc="([^"]+)"/)?.[1] ?? "",
    stars: (item.match(/star\/f\.svg/g) ?? []).length,
    text: decodeEntities(item.match(/<!-- R-CONTENT -->([\s\S]*?)<!-- R-CONTENT -->/)?.[1].trim() ?? ""),
    ago: timeAgo(Number(item.match(/data-time="(\d+)"/)?.[1] ?? 0), now),
  }));
  const footer = html.match(/<div class="ti-footer">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const strong = [...footer.matchAll(/<strong>([^<]*)<\/strong>/g)].map((m) => m[1]);
  return { reviews, score: strong[1] ?? "", count: strong[2] ?? "" };
}

/** Trustindex-style relative age ("6 years ago"). */
function timeAgo(seconds: number, now: number): string {
  const days = Math.floor((now / 1000 - seconds) / 86400);
  const units: [number, string][] = [
    [365, "year"],
    [30, "month"],
    [7, "week"],
    [1, "day"],
  ];
  for (const [size, label] of units) {
    const n = Math.floor(days / size);
    if (n >= 1) return `${n} ${label}${n > 1 ? "s" : ""} ago`;
  }
  return "today";
}
