# showlanka.com — page brief

Source: https://www.showlanka.com/ (WordPress, theme `webslankatheme`, Bootstrap 5.2 grid + theme `styles.css` + `home.css`).
Local route: `/` → `src/app/page.tsx`, components in `src/components/sites/showlanka/`, assets in `public/sites/showlanka/` (see `asset-map.tsv`).
Reference screenshots: `docs/design-references/showlanka/`.

## Rules observed

- **Fonts:** CSS declares `"Montserrat", sans-serif`, but the Google Fonts `@import` sits mid-file in the WP Fastest Cache bundle and is ignored, so visitors without a local Montserrat see the system sans-serif (Arial on Windows). The hero tagline stack is `"Montserrat", "Segoe UI", sans-serif` → Segoe UI. The clone keeps the same stacks and does not load a webfont.
- Body text `#676767` 16/24. Section titles `#196ebb` 26px/24px 400, letter-spacing .6px. Uppercase subtitles 16/24 500, letter-spacing 1.7px, `::after` 60px line `#196ebb` at ≥992px.
- Breakpoint that changes layout: 992px (Bootstrap `lg`). Containers: Bootstrap max-widths, but `max-width: 100%` below 992px.

## Sections (desktop 1440×900 y-offsets)

1. **Header** — fixed at ≥992px, 7rem with top-down black gradient; adds `.scrolled` past 70px scrollY → `#0057a7`, 4rem, logo 6rem + `hue-rotate(-6deg) invert(1)`; 1s transitions. Below 992px: static white 4rem header, 5rem logo, menu-icon **video** (webm) toggles a full-screen white menu sliding down (translateY(-100vh) → 0, 1s). Video plays to 2/5 duration on open, to end on close.
2. **Hero** (0–900, 100vh) — 3 images crossfade (owl, fade 1s, 5s autoplay, active scale 1.02). Owl's `z-index:1` paints over the theme's dark overlays, so they are not visible. Tagline: rotating word every 5s (opacity + translateY 22px, .7s). "Send an Inquiry" button. Bottom-left: TripAdvisor badge (zoom 1.2) + Google 4.7 badge; bottom-right: TourRadar reviews iframe 240×280. Mobile: hero 65vh, badges flow below hero, TourRadar centered & scaled (.55/.68/.85).
3. **Intro** (900–1210) — "Explore Sri Lanka", h2 32px, two paragraphs, centered.
4. **Tour Packages** (1226–2442) — 9 cards, 3 per row ≥992px, 360px tall bg image, 8px white border, bottom gradient; hover (≥992px): image scale 1.05→1, text up 20px, .5s.
5. **Why travel** (2458–2954) — 3 bordered cards (radius 16, `#c8c8c8`) with 88px FA icons (heart red `#C62828`, certificate yellow `#fbbd00`, shield blue `#047ad9`).
6. **Tour of the month** (2970–3870) — 100vh bg (60vh mobile), `background-attachment: fixed` + JS parallax `translateY((scrollY - top) * 0.6)`; white center gradient over text.
7. **Reviews** (3886–4409) — dotted black video card (click → YouTube embed autoplay), TourRadar widget, Trustindex Google reviews slider (9 reviews, next/prev, 6s autoplay, "Read more"/"Hide"), TripAdvisor badge.
8. **Footer** (4425–5020) — dotted `#494b4e` bg, 3 link columns + address, partner logos (90px), Facebook/YouTube, ©.

Also: first-visit preloader (sessionStorage `slPreloaderShown`, random compass/plane/globe icon), 0.45s body fade-in, header/intro slide-in on load.

## Out of scope

All other routes (About, Tours, Contact, …) keep pointing at https://www.showlanka.com/. Third-party TourRadar reviews are embedded via their live iframe; Trustindex and TripAdvisor widgets are rebuilt statically from the rendered markup.
