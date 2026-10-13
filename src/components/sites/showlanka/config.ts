// Theme-level settings that WordPress stores in theme files rather than the
// REST API (menus, contact block, hero). Edit here to change the shell.

import { WP_ORIGIN } from "@/lib/wp";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our team & Guides", href: "/meet-your-travel-gurus" },
  { label: "Tours", href: "/sri-lanka-tours" },
  { label: "Travel News", href: "/news-offers" },
  { label: "Contact", href: "/contact" },
];

export const footerNavs: { label: string; links: NavLink[] }[] = [
  {
    label: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/about" },
      { label: "Inspirational customer talks", href: "/real-traveler-stories" },
      { label: "Help desk", href: "/about#our-team" },
      { label: "Guides", href: "/meet-your-travel-gurus#our-guides" },
      { label: "Ground flow support", href: "/meet-your-travel-gurus#ground-support" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Travel News", href: "/news-offers" },
      { label: "Terms and conditions", href: "/terms-and-conditions" },
      {
        label: "Entrance fee",
        href: `${WP_ORIGIN}/wp-content/uploads/2024/07/Entrance-fee-2024-2.pdf`,
        external: true,
      },
      { label: "B2B Business", href: "/about#b2b-business" },
      {
        label: "Sri Lankan visa",
        href: "https://www.immigration.gov.lk/pages_e.php?id=61",
        external: true,
      },
      {
        label: "Travel insurance",
        href: "https://www.travelinsurance.com/travel-insurance-quotes/?utm_source=papcpc&a_aid=638566e896202&a_bid=a755b3fe&data1=usn_bestoverall&data2=blank",
        external: true,
      },
    ],
  },
  {
    label: "Tour categories",
    links: [
      { label: "Summer tours", href: "/sri-lanka-tours?summer" },
      { label: "Winter tours", href: "/sri-lanka-tours?winter" },
      { label: "Group wise tours", href: "/sri-lanka-tours?group" },
      { label: "Day tours", href: "/sri-lanka-tours?day" },
      { label: "Safari tours", href: "/sri-lanka-tours?safari" },
      { label: "Ramayana Yatra", href: "/ramayana-yatra" },
      { label: "All year adventures", href: "/sri-lanka-tours?year" },
      { label: "Family adventure", href: "/sri-lanka-tours?family" },
    ],
  },
];

export const contact = {
  address: ["No. 21 - 6/1,", "Nelu Gardens,", "Yatiyana, Minuwangda,", "Sri Lanka."],
  phones: ["0094 779 144664", "0094 112281729"],
  email: "showlankatours@gmail.com",
  whatsapp: "94779144664",
  mapEmbed:
    "https://www.google.com/maps?q=Show+Lanka+Tours+Minuwangoda&output=embed",
  googleReviews: "https://www.google.com/maps?cid=3563717595747314560",
  tripadvisor:
    "https://www.tripadvisor.com/Attraction_Review-g11999643-d13421293-Reviews-Show_Lanka_Tours-Minuwangoda_Western_Province.html",
  tourradar: "https://www.tourradar.com/o/showlanka-tours",
  tourradarWidget:
    "https://www.tourradar.com/iframes/reviews_widget_to/237/0/134495/0/0/0/316/409cd1/1?q",
};

/** TripAdvisor "ratings only" badge script; `uniq` must match the container id. */
export const tripadvisorWidgetSrc = (uniq: number) =>
  `https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=${uniq}&locationId=13421293&lang=en_US&border=true&display_version=2`;

export const social = {
  facebook: "https://web.facebook.com/showlankatouroperators/",
  youtube: "https://www.youtube.com/@showlanka",
};

const ICONS = `${WP_ORIGIN}/wp-content/themes/webslankatheme/images/icons`;

export const partners = [
  { href: "https://www.tourradar.com/o/showlanka-tours", src: `${ICONS}/tourradar.webp`, alt: "tour radar" },
  { href: contact.tripadvisor, src: `${ICONS}/tripadvisor.png`, alt: "trip advisor" },
  { href: "https://olami.org/", src: `${ICONS}/olami.png`, alt: "olami" },
  { href: "https://srilankacaranddriverhire.com/business-directory/show-lanka-tours/", src: `${ICONS}/driver.png`, alt: "sri lanka drivers" },
  { href: "https://www.edeltrips.com/reiseberichte/sri-lanka/", src: `${ICONS}/edeltrips.webp`, alt: "edel trips" },
  { href: "https://www.touristlink.com/user/showlanka-tours.html", src: `${ICONS}/touristlink.png`, alt: "tourist link" },
  { href: "https://www.thrillophilia.com/", src: `${ICONS}/thrillophilia.png`, alt: "thrillophilia" },
];

/** Homepage values the theme stores in custom fields the REST API omits. */
export const home = {
  specialTourHref: "/sri-lanka-express",
  videoReview: {
    title: "Happy customer",
    image: `${WP_ORIGIN}/wp-content/uploads/2024/08/review-pic-640x360.png`,
    url: "https://www.youtube.com/watch?v=Szkym8CIPes&list=PLglAFGJWHrBducvofQ0pYZ9lj8-SpQA2D",
    embed: "https://www.youtube.com/embed/Szkym8CIPes?list=PLglAFGJWHrBducvofQ0pYZ9lj8-SpQA2D&autoplay=1",
  },
};

export const assets = {
  logo: `${WP_ORIGIN}/wp-content/themes/webslankatheme/images/logo.png`,
  menuIcon: `${WP_ORIGIN}/wp-content/themes/webslankatheme/animations/menu-icon.webm`,
  tourradarIcon: `${WP_ORIGIN}/wp-content/themes/webslankatheme/images/icons/tourradar.webp`,
};

export const hero = {
  slides: [
    `${WP_ORIGIN}/wp-content/uploads/2024/12/sigiriya-world-heritage.jpg`,
    `${WP_ORIGIN}/wp-content/uploads/2024/05/stilt-fishing-sri-lanka-1.jpg`,
    `${WP_ORIGIN}/wp-content/uploads/2024/05/surfing-srilanka-1.jpg`,
  ],
  prefix: "Sri Lanka Tours:",
  words: [
    "Your Path to Paradise",
    "Golden Beaches & Coastlines",
    "Ancient Wonders & Heritage",
    "Wild Safaris & Rainforests",
    "Rich Cultural Journeys",
  ],
  subtitle:
    "Custom Sri Lanka holiday packages with expert local guides — beaches, wildlife, culture & adventure in one unforgettable trip.",
  googleRating: { score: "4.7", count: 37 },
};

/** Homepage "Tour Packages" tiles: mainpacks post slug → listing filter key. */
export const tourFilters = [
  { key: "year", label: "All Year" },
  { key: "family", label: "Family" },
  { key: "group", label: "Group wise tours" },
  { key: "summer", label: "Hot summer" },
  { key: "popular", label: "Most popular" },
  { key: "private", label: "Private tours" },
  { key: "safari", label: "Safari" },
  { key: "transfers", label: "Transfers" },
  { key: "winter", label: "Winter" },
  { key: "day", label: "Day tours" },
];

export const dayRanges: { label: string; min: number; max: number }[] = [
  { label: "From 1 to 3 days", min: 1, max: 3 },
  { label: "From 4 to 7 days", min: 4, max: 7 },
  { label: "From 8 to 10 days", min: 8, max: 10 },
  { label: "From 11 to 15 days", min: 11, max: 15 },
  { label: "From 16 to 27 days", min: 16, max: 27 },
];

/**
 * Sub-page headings the theme templates hard-code rather than storing in
 * WordPress: banner title/subtitle and the bordered intro title.
 */
export const pageHeadings: Record<string, { title?: string; subtitle?: string; intro?: string }> = {
  about: {
    title: "About Show Lanka Tours – Sri Lanka’s Trusted Local Tour Operator",
    subtitle: "Personalized Sri Lanka Holidays Crafted by Local Travel Experts",
    intro: "Discover Sri Lanka Tours & Travel Experiences",
  },
  contact: {
    title: "Contact Show Lanka Tours – Plan Your Sri Lanka Trip",
    subtitle: "Get a Custom Quote or Speak With Our Local Travel Team Today",
    intro: "Plan Your Sri Lanka Adventure",
  },
  "meet-your-travel-gurus": {
    title: "Meet Your Sri Lanka Travel Experts – Guides & Drivers",
    subtitle: "Experienced, English-Speaking Local Guides Dedicated to Every Journey",
    intro: "Meet Your Sri Lanka Travel Experts",
  },
  "news-offers": {
    title: "Sri Lanka Travel News, Tips & Offers",
    subtitle: "Stay Updated on the Latest Sri Lanka Travel Stories & Deals",
    intro: "Sri Lanka Travel News & Updates",
  },
  "sri-lanka-tours": {
    title: "Sri Lanka Tour Packages – Custom Holidays for Every Traveler",
    subtitle: "Group Tours, Private Trips & Tailor-Made Itineraries Across Sri Lanka",
    intro: "Custom Sri Lanka Tour Packages",
  },
  "real-traveler-stories": { intro: "Sri Lanka Travel Stories & Real Experiences" },
};

/** About-page section headings (eyebrow + title), as set in the theme template. */
export const aboutSections = {
  story: { title: "Our Story" },
  vision: { eyebrow: "Expanding Horizons with Unique Adventures", title: "Our Vision for the Future" },
  team: {
    eyebrow: "Meet the Faces Behind the Magic",
    title: "The Team That Drives Us",
    // Hard-coded in the live theme template, not stored in WordPress.
    intro:
      "Show Lanka Tour Coordinators will contact you as soon as possible after receiving your request regarding your Sri Lanka tour. We are committed to providing excellent service and welcome any problems or suggestions. For urgent notifications, contact us via WhatsApp at +94 77 914 4664. We aim to offer an unforgettable Sri Lanka tour experience.",
  },
  guides: { eyebrow: "Bringing the Best of Sri Lanka to Life", title: "Your Trusted Tour Guides" },
  b2b: { eyebrow: "Building Lasting Partnerships for Success", title: "B2B Business" },
};
