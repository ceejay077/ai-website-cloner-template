# showlanka.com — headless rebuild notes

Content (pages, posts, featured images) is read live from the WordPress REST API
(`src/lib/wp.ts`, revalidated hourly). Tour duration/price/months are not exposed by
the API, so they are parsed from the live `/sri-lanka-tours/` listing.
Theme-only settings (menus, contact block, hero) live in `src/components/sites/showlanka/config.ts`.

| Source | Local | Data |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | page `welcome-to-sri-lanka`, categories mainpacks, whyus, specialtour, review |
| `/about/` | `src/app/about` | page + about-story, about-vision, about-team (`#our-team`), b2b-business (`#b2b-business`) |
| `/meet-your-travel-gurus/` | `src/app/meet-your-travel-gurus` | page (`#ground-support`) + about-guides (`#our-guides`) |
| `/real-traveler-stories/` | `src/app/real-traveler-stories` | page + othervideoreview |
| `/news-offers/` | `src/app/news-offers` | page banner + list parsed from the live page (order, thumbnail, date, video flag) |
| `/sri-lanka-tours/?<key>` | `src/app/sri-lanka-tours` | page + listing (category options parsed from the live `<select>`); bonanza post gallery → coupon popup |
| `/contact/` | `src/app/contact` | page banner + CF7 form rebuilt in `InquiryForm` + the template's own address/map block |
| `/faqs/`, `/terms-and-conditions/` | matching folders | page |
| `/<tour-slug>/` (posts in category `packages`) | `src/app/[slug]` → `TourPost` | post + theme fields scraped from the live page (tour code, 1–3 pax prices, discount, route `mapData`, similar tours) |
| `/<news-slug>/` (posts in category `news`) | `src/app/[slug]` → `NewsPost` | post + YouTube URL scraped from the live page (`#video-player`) |
| `/<post-slug>/` (other posts) | `src/app/[slug]` | post (old generic layout, not yet matched to the theme's single template) |

Not rebuilt: `/sweet-bonanza/` — a coupon-promo page (not spam, despite the slot-game name). The tours page's
side tab links to the live page.

Tours page notes (`/sri-lanka-tours/`, matched to the theme's `filters.js` and `theme.js`):
- Tours with no travel months match every month. Filters never rewrite the URL. An unknown `?key` matches nothing.
- The coupon popup opens 3s after load unless the visitor clicks first. Only the × closes it. It shows 3 slides (1 below 768px) and loops one slide at a time.
- The banner keeps the image's natural aspect ratio, crops from the top, and is capped at 60vh/70vh (`sl-banner--natural`). Other sub-pages still use the cover crop.
Contact form opens the visitor's email app (CF7 needs a reCAPTCHA token tied to showlanka.com).

Tour package pages (`TourPost`, matched to the theme's `theme.js` / `map.js`):
- Hero cycles every 4s: the featured image, then the gallery images. The live theme cycles lazy-load placeholders, so it often shows a blank hero; the clone shows the real images.
- Price box: 1-pax price shown first, and the calculator total starts at the 1-pax amount. The +/- buttons step between 1 and 3 pax and swap the price and saving. The arrival date picker mimics jQuery UI (`mm/dd/yyyy`).
- Download Brochure: html2pdf of the whole article with every tab and day expanded, then reset. The snapshot converts modern CSS colours to rgb (html2canvas 1.x can't parse them) and loads WordPress media through the `/wp-content` rewrite in `next.config.ts` (the WordPress host sends no CORS headers).
- Route map: Leaflet + polylineDecorator, grayscale OSM tiles, closed loop through the stops.
- The Gutena tabs are broken on the live site (the plugin's DOMContentLoaded listener never runs); the clone's tabs work.

News (`/news-offers/` and `NewsPost`):
- The list is two columns of rows: a 120x85 thumbnail (video posts get the red play badge, linking to `#video-player`), the title clamped to 3 lines, and the date.
- Articles use the theme's single-post template: an image-only hero that cycles the featured image and gallery (no text over it), the title, then the CMS body. PDF file blocks preview inline when `navigator.pdfViewerEnabled`, and video posts end with the YouTube player.
- The Tourism Promotion Bureau post has no featured image. The live site renders an empty `<img src=>` there; the clone omits the hero.

Contact (`/contact/`):
- The form has the same fields, labels and validation messages as the site's Contact Form 7 form (name and email required). It sits in a centred grey card from 992px up, with a reserved row for CF7's hidden spinner.
- A valid inquiry still opens the visitor's email app, because CF7 needs a reCAPTCHA token tied to showlanka.com.
- The address and map embed come from the contact template and differ from the footer's address in `config.ts`.
