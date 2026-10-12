# showlanka.com — homepage brief

Source: https://www.showlanka.com/ (WordPress, custom "webslankatheme", Bootstrap 5.2.3, Owl Carousel 2.3.4, jQuery, Font Awesome kit 6.7.2 Free).

## Route map

| Source | Local | Files |
| --- | --- | --- |
| `https://www.showlanka.com/` | `/` | `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/sites/showlanka/*` |

All other internal links (Contact, Tours, About, tour categories, etc.) are out of scope and point to the source origin.

## Typography (observed rule, not a guess)

Theme declares `font-family: "Montserrat", sans-serif`, but the `@import` for Montserrat never loads, so the browser renders the fallback.
On Windows Chrome: body/headings = Arial, hero title (weight 800) = Arial Black, hero subtitle (`"Montserrat","Segoe UI",sans-serif`) = Segoe UI.
The clone reproduces the same declared stacks without loading Montserrat.

## Page-wide behavior

- Body fades in (0.45s). Same-origin link clicks fade the body out for 320ms before navigating.
- Preloader markup exists but is disabled by inline `display:none !important`; omitted.
- Global `a:hover, a:focus { text-decoration: underline }` comes from the TourRadar widget CSS.

## Sections (desktop 1440 / mobile 390)

1. **Header** — ≥992: fixed, 7rem tall, `linear-gradient(rgba(0,0,0,.6), transparent)`, logo 11rem, menu right (white, 14px uppercase, gap 2.5rem, current item underlined via border-bottom). After `scrollY > 70` gets `.scrolled`: bg `#0057a7`, height 4rem, logo 6rem + `hue-rotate(-6deg) invert(1)` (1s transitions). <992: relative white bar 4rem, logo 5rem, `menu-icon.webm` (54px) toggles a fullscreen white menu that slides from `translateY(-100vh)` (1s); video plays to 2/5 on open, to end on close. Header wrapper slides in from -5rem on load.
2. **Hero** — ≥992: 100vh, 3-image Owl carousel (fade, autoplay 5s, active scale 1.02), radial dark overlays, centered H1 "Sri Lanka Tours:" + rotating phrase (5 phrases, 5s tick; first change at 10s), subtitle, "Send an Inquiry" button. TripAdvisor + Google badges bottom-left (2rem), TourRadar iframe bottom-right (2rem). <992: carousel 65vh, badges flow below hero, TourRadar centered at bottom scaled .55/.68/.85.
3. **Intro** — "Explore Sri Lanka" / H2 / 2 paragraphs, centered, in `.container` (1320 max).
4. **Tour Packages** — 9 cards (`col-lg-4`), 360px image, 8px white border, bottom gradient, uppercase title + "Read More" with side rules. Hover ≥992: image scale 1.05→1, text up 20px.
5. **Why travel** — 3 bordered cards (16px radius), 88px FA icons (heart red, certificate yellow, shield blue).
6. **Tour of the month** — 100vh (60vh mobile) fixed-attachment Lotus Tower background + JS parallax (`(scroll - offsetTop) * 0.6`), white gradient band with text + button.
7. **Traveler Tales** — dotted black video card (YouTube thumbnail → embed on click), TourRadar widget, Google reviews slider (Trustindex, 9 reviews, 6s autoplay, read-more), TripAdvisor badge.
8. **Footer** — dotted grey background, 3 link columns + address/contact, partner logos, social icons, copyright.

## Asset map

| Source URL | Local path |
| --- | --- |
| `/wp-content/themes/webslankatheme/images/logo.png` | `public/sites/showlanka/images/logo.png` |
| `/wp-content/themes/webslankatheme/images/favicon.ico` | `src/app/favicon.ico` (+ copy in `public/sites/showlanka/images/`) |
| `/wp-content/themes/webslankatheme/animations/menu-icon.webm` | `public/sites/showlanka/video/menu-icon.webm` |
| `/wp-content/uploads/2024/12/sigiriya-world-heritage.jpg` | `.../images/hero/sigiriya-world-heritage.jpg` |
| `/wp-content/uploads/2024/05/stilt-fishing-sri-lanka-1.jpg` | `.../images/hero/stilt-fishing-sri-lanka.jpg` |
| `/wp-content/uploads/2024/05/surfing-srilanka-1.jpg` | `.../images/hero/surfing-srilanka.jpg` |
| 9 × `/wp-content/uploads/...-640x360.jpg` | `.../images/packages/{group,year,family,summer,popular,private,winter,safari,day}.jpg` |
| `/wp-content/uploads/2024/05/Lotus_tower-scaled.jpg` | `.../images/lotus-tower.jpg` |
| `/wp-content/uploads/2024/08/review-pic-640x360.png` | `.../images/review-pic.png` |
| `/wp-content/themes/webslankatheme/images/icons/*` | `.../images/icons/*` |
| tripadvisor.com lockup SVG | `.../images/tripadvisor-lockup.svg` |
| cdn.trustindex.io stars / google icon / verified | `.../images/reviews/*.svg` |
| lh3.googleusercontent.com reviewer avatars (80px) | `.../images/reviews/avatar-{1..9}.png` |
| tourradar.com widget logo + write-review icon | `.../images/reviews/tourradar-*.{jpg,png}` |
| ka-f.fontawesome.com v6.7.2 solid/brands woff2 | `.../fonts/fa-{solid-900,brands-400}.woff2` |

## Third-party widgets

- TourRadar reviews: kept as the live iframe (`tourradar.com/iframes/reviews_widget_to/...`), same as source.
- TripAdvisor badge and Trustindex Google slider: rebuilt as React components with the content captured on 2026-10-12 (counts: TripAdvisor 65 reviews; Google 4.7 / 37 reviews).
