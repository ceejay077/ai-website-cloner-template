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
| `/news-offers/` | `src/app/news-offers` | page + news (newest first) |
| `/sri-lanka-tours/?<key>` | `src/app/sri-lanka-tours` | page + listing; category/days/month filters |
| `/contact/`, `/faqs/`, `/terms-and-conditions/` | matching folders | page |
| `/<post-slug>/` (tours, news, ramayana-yatra, sri-lanka-express…) | `src/app/[slug]` | post |

Not rebuilt: `/sweet-bonanza/` (casino-style page linked from the footer — looks like injected spam; check the WordPress install).
Contact form opens the visitor's email app (CF7 needs a reCAPTCHA token tied to showlanka.com).
