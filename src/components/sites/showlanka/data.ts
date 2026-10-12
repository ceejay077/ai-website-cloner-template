export const SOURCE_ORIGIN = "https://www.showlanka.com";
export const ASSET_BASE = "/sites/showlanka";

export type NavItem = {
  label: string;
  href: string;
  current?: boolean;
  newTab?: boolean;
};

// Source order is reversed visually by `flex-direction: row-reverse` / `column-reverse`.
export const primaryMenu: NavItem[] = [
  { label: "Contact", href: `${SOURCE_ORIGIN}/contact/` },
  { label: "Travel News", href: `${SOURCE_ORIGIN}/news-offers/` },
  { label: "Tours", href: `${SOURCE_ORIGIN}/sri-lanka-tours/` },
  { label: "Our team & Guides", href: `${SOURCE_ORIGIN}/meet-your-travel-gurus/` },
  { label: "About", href: `${SOURCE_ORIGIN}/about/` },
  { label: "Home", href: "/", current: true },
];

export const heroSlides = [
  { src: `${ASSET_BASE}/images/hero/sigiriya-world-heritage.jpg`, alt: "sigiriya-world-heritage" },
  { src: `${ASSET_BASE}/images/hero/stilt-fishing-sri-lanka.jpg`, alt: "stilt-fishing-sri-lanka" },
  { src: `${ASSET_BASE}/images/hero/surfing-srilanka.jpg`, alt: "surfing-srilanka" },
];

export const heroWords = [
  "Your Path to Paradise",
  "Golden Beaches & Coastlines",
  "Ancient Wonders & Heritage",
  "Wild Safaris & Rainforests",
  "Rich Cultural Journeys",
];

export const TOURRADAR_WIDGET_URL =
  "https://www.tourradar.com/iframes/reviews_widget_to/237/0/134495/0/0/0/316/409cd1/1?q";
export const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g11999643-d13421293-Reviews-Show_Lanka_Tours-Minuwangoda_Western_Province.html";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps?cid=3563717595747314560";

export const introParagraphs = [
  "Welcome to Show Lanka Tours, the ultimate choice among tour operators in Sri Lanka. At Show Lanka Tours, we specialize in creating unforgettable Sri Lanka tour packages that are budget-friendly yet offer exceptional service and unparalleled value. As experienced tour guides and operators in Sri Lanka, we provide private guides and drivers at affordable rates, ensuring your journey aligns perfectly with your budget. Many claim to be leading tour operators in Sri Lanka, but our proven track record highlights why we truly stand out among tour operators in Sri Lanka.",
  "Are you ready to embark on your Sri Lankan adventure? Explore our diverse tour options and experience the beauty of Sri Lanka like never before. Partner with us for an enriching and hassle-free travel experience. We look forward to welcoming you to the wonders of Sri Lanka with Show Lanka Tours.",
];

export const tourPackages = [
  { title: "Group wise tours (2)", slug: "group", image: "group.jpg" },
  { title: "All year tours (8)", slug: "year", image: "year.jpg" },
  { title: "Family tours (2)", slug: "family", image: "family.jpg" },
  { title: "Hot summer tours (13)", slug: "summer", image: "summer.jpg" },
  { title: "Most popular tours (17)", slug: "popular", image: "popular.jpg" },
  { title: "Private tours (21)", slug: "private", image: "private.jpg" },
  { title: "Winter tours (18)", slug: "winter", image: "winter.jpg" },
  { title: "Safari tours", slug: "safari", image: "safari.jpg" },
  { title: "Day tours", slug: "day", image: "day.jpg" },
].map((pkg) => ({
  ...pkg,
  href: `${SOURCE_ORIGIN}/sri-lanka-tours/?${pkg.slug}`,
  image: `${ASSET_BASE}/images/packages/${pkg.image}`,
}));

export const whyItems = [
  {
    title: "Excellent Customer Service",
    icon: "fa-heart red-icon",
    text: "Heartfelt hospitality is our promise. Discover Sri Lanka with warmth and care, supported by our attentive and friendly team.",
  },
  {
    title: "Best Rate Guaranteed",
    icon: "fa-certificate yellow-icon",
    text: "Unlock extraordinary experiences at unbeatable rates with our exceptional services. Explore Sri Lanka with confidence, knowing you’re getting the best value for your adventure!",
  },
  {
    title: "Your Trusted Local Guide",
    icon: "fa-shield",
    // The source post contains an empty quote block before the icon.
    emptyQuote: true,
    text: "Discover hidden gems and immerse yourself in authentic experiences led by passionate locals. Let us tailor your journey for an unforgettable adventure in Sri Lanka!",
  },
];

export const YOUTUBE_REVIEW_URL =
  "https://www.youtube.com/watch?v=Szkym8CIPes&list=PLglAFGJWHrBducvofQ0pYZ9lj8-SpQA2D";

export type GoogleReview = {
  name: string;
  /** Unix seconds, from Trustindex `data-time`. */
  time: number;
  rating: number;
  text: string;
};

export const googleReviews: GoogleReview[] = [
  {
    name: "Ayondip Dam",
    time: 1676592000,
    rating: 5,
    text: "Our Showlanka tour has been nothing but brilliant and we have enjoyed every location, every trek and every waterfall visited! Our tour guide and driver Manju was really lovely and very knowledgable and always tried to ensure we were having a great time. Thank you Showlanka for making our honeymoon so memorable and accommodating all our needs!",
  },
  {
    name: "siro23",
    time: 1578700800,
    rating: 5,
    text: "We booked a 12 day tour in Sri Lanka with Show Lanka Tours. We are very satisfied! Everything went smoothly. The program was good structured and was well distributed during our stay. The driver (Mr. Manjula) was a really likable guy, always gentle, helpful and very knowledgeable with regards to all the location that we visited. Actually for us he was not just a driver, but also a tourguide and friend. We recommend him 100%!",
  },
  {
    name: "Haridas pangayil",
    time: 1573084800,
    rating: 3,
    text: "Good Place",
  },
  {
    name: "Vishnu Harikumar",
    time: 1554768000,
    rating: 5,
    text: "Mr. Janaka and his team provide the best service Definitely Recommend. Reasonable rates and Best services. The Guide provided also was best. Mr. Gayan.",
  },
  {
    name: "RM",
    time: 1535068800,
    rating: 5,
    text: "We have just returned from a three-week trip in Sri Lanka and Showlanka Tours contributed heavily to this great experience. We were amazed how smoothly everything went. We recommend booking with Showlanka Tours because of the great service they provide: flexible itinerary during the trip (we changed our schedule and the hotels because of bad weather three times at zero costs), cleanliness of the car and the hotels they booked for us, great English skills of the driver, safety while driving (which can be quite tricky given the way some people drive there-or rather we are just not used to it), friendliness, positive mindset and love for their own country... At this point, we also would like to thank Mr Suranga, who was our driver, for literally everything.",
  },
  {
    name: "amna mirza",
    time: 1531440000,
    rating: 5,
    text: "One great trip with showlanka. Everything was well taken care. Our driver Mr. Suranga was very decent and well mannered person. I went with friends for a time out and sure we did not have to worry about any thing. Everything was so well managed by them.",
  },
  {
    name: "Johannes Sim",
    time: 1527292800,
    rating: 5,
    text: "We can recommend showlanka! Everything went smoothly. Especially our guide Manjula was fantastic! He is such a good driver and even through the heavy rain he kept calm and drove safely. He is well informed and we got new inputs. I was really touched and surprised that he remembered my birthday and came with flowers in the morning! So nice!! We highly recommend Showlanka and Manjula!",
  },
  {
    name: "Jennifer Weber",
    time: 1527033600,
    rating: 5,
    text: "Based on the good reviews on the internet, we decided to travel with SHOW LANKA TOURS. We requested the car service only, as we had planned an individual route. To get straight to the point: We are 100% satisfied with our decision for SHOW LANKA TOURS and especially with our driver Suranga. There is nothing to complain about. The following points are particularly worth to mention: Travel planning and preparation ⦁\tFriendly and personal contact ⦁\tQuick response on Emails ⦁\tCompetent and helpful ⦁\tProfessional, non-binding and extremely flexible trip planning ⦁\tNo hidden costs (all costs [tolls, parking fees etc.] were included in the package) Service ⦁\tPayment at the airport (in cash) or in advance (bank transfer) ⦁\tPersonal and warm welcome on arrival at the airport ⦁\tLocal mobile phone for 24h communication with the driver provided free of charge ⦁\tJust in case, umbrella, scarf (for the temples) etc. were available in the vehicle free of charge Driver (Suranga) ⦁\tVery friendly and always in a good temper ⦁\tExtremely helpful ⦁\tVery good English ⦁\tSolution-oriented in case of problems ⦁\tVery flexible ⦁\tSympathetic ⦁\tAlways strives for the well-being of the guests ⦁\tCommunicative, but never intrusive ⦁\tPredictive and comfortable style of driving ⦁\tAlways on time and reliable Tranfers / vehicle ⦁ Transfer from and to Colombo airport ⦁ Large and comfortable vehicle, fully air conditioned ⦁ Vehicle was cleaned on a daily base - very clean and well maintained condition We had a great holiday and will definitely go back to Sri Lanka, of course with SHOW LANKA TOURS and hopefully with Suranga as our driver :)",
  },
  {
    name: "SyMa 1907",
    time: 1526428800,
    rating: 5,
    text: "We spent 15 wonderful days in Sri Lanka together with our driver Suranga from Showlanka Tours.  Our trip: Galle-Tangalle-Tissa-Haputale-Nuwara Eliya-Kandy-Sigirya-Anuradhapura-Negombo. It was our first trip with a private chauffeur and it was a good experience. In other destinations we prefer to drive on our own, but in Sri Lanka it is really advisable to have a local driver. With Suranga we always felt safe, independent how crazy the other drivers were.  He was always on time (even on short notice), well prepared concerning our itinerary and also helpful in arranging additional tours (like Yala Safari or Village Tour). In this regard we never had the feeling that he brought us to places just for getting commissions. Suranga had a good English knowledge and we were happy to have many interesting chats with him about religion, local life etc. He was always polite and cautious and provide a good balance between taking care of us and giving sufficient leeway. The booking of the tour with Mr. Janaka, owner of Showlanka Tours, was very easy. We planned our tour on our own, sent our itinerary to Showlanka Tours and asked for an offer and comments and/or recommendations. Mr. Janaka was very prompt in his replies, answered our questions and made a professional and well-priced offer. We booked all hotels on our own which was accepted without any problems. We appreciate that Mr. Janaka managed also the booking of train tickets in 3rd class from Nuwara Eliya to Kandy. Another plus was that Showlanka Tours provided a mobile for us so that we could easily communicate which Suranga during the tour. As not optimal we perceived that we had to pay the whole amount for the tour in cash by arriving at the airport. Knowing the company only by internet reviews (even when these all are positive), it causes a bit of an uncertain feeling… We would have preferred to pay 50% on arrival and 50% at the end or a least in the half term of the trip, but this suggestion was not accepted. Nevertheless, we were very satisfied with Showlanka Tours and with the communication with Mr. Janaka for the organisation in advance. A special thanks goes to Suranga who contributed a lot to make our holidays great!",
  },
];

export const footerMenus: { label: string; items: NavItem[] }[] = [
  {
    label: "Company",
    items: [
      { label: "Home", href: "/", current: true },
      { label: "About us", href: `${SOURCE_ORIGIN}/about/` },
      { label: "Inspirational customer talks", href: `${SOURCE_ORIGIN}/real-traveler-stories/` },
      { label: "Help desk", href: `${SOURCE_ORIGIN}/about/#our-team` },
      { label: "Guides", href: `${SOURCE_ORIGIN}/meet-your-travel-gurus/#our-guides` },
      { label: "Ground flow support", href: `${SOURCE_ORIGIN}/meet-your-travel-gurus/#ground-support` },
      { label: "Sweet Bonanza", href: `${SOURCE_ORIGIN}/sweet-bonanza/` },
      { label: "Contact us", href: `${SOURCE_ORIGIN}/contact/` },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "FAQs", href: `${SOURCE_ORIGIN}/faqs/` },
      { label: "Travel News", href: `${SOURCE_ORIGIN}/news-offers/` },
      { label: "Terms and conditions", href: `${SOURCE_ORIGIN}/terms-and-conditions/` },
      {
        label: "Entrance fee",
        href: `${SOURCE_ORIGIN}/wp-content/uploads/2024/07/Entrance-fee-2024-2.pdf`,
        newTab: true,
      },
      { label: "B2B Business", href: `${SOURCE_ORIGIN}/about/#b2b-business` },
      { label: "Sri Lankan visa", href: "https://www.immigration.gov.lk/pages_e.php?id=61" },
      {
        label: "Travel insurance",
        href: "https://www.travelinsurance.com/travel-insurance-quotes/?utm_source=papcpc&a_aid=638566e896202&a_bid=a755b3fe&data1=usn_bestoverall&data2=blank",
      },
    ],
  },
  {
    label: "Tour categories",
    items: [
      { label: "Summer tours", href: `${SOURCE_ORIGIN}/sri-lanka-tours/?summer` },
      { label: "Winter tours", href: `${SOURCE_ORIGIN}/sri-lanka-tours/?winter` },
      { label: "Group wise tours", href: `${SOURCE_ORIGIN}/sri-lanka-tours/?group` },
      { label: "Day tours", href: `${SOURCE_ORIGIN}/sri-lanka-tours/?day` },
      { label: "Safari tours", href: `${SOURCE_ORIGIN}/sri-lanka-tours/?safari` },
      { label: "Ramayana Yatra", href: `${SOURCE_ORIGIN}/ramayana-yatra/` },
      { label: "All year adventures", href: `${SOURCE_ORIGIN}/sri-lanka-tours/?year` },
      { label: "Family adventure", href: `${SOURCE_ORIGIN}/sri-lanka-tours/?family` },
    ],
  },
];

export const partnerLogos = [
  { href: "https://www.tourradar.com/o/showlanka-tours", src: "tourradar.webp", alt: "tour radar", width: 308, height: 120 },
  { href: TRIPADVISOR_URL, src: "tripadvisor.png", alt: "trip advisor", width: 488, height: 103 },
  { href: "https://olami.org/", src: "olami.png", alt: "olami", width: 3840, height: 2160 },
  {
    href: "https://srilankacaranddriverhire.com/business-directory/show-lanka-tours/",
    src: "driver.png",
    alt: "sri lanka drivers",
    width: 225,
    height: 225,
  },
  { href: "https://www.edeltrips.com/reiseberichte/sri-lanka/", src: "edeltrips.webp", alt: "edel trips", width: 480, height: 480 },
  { href: "https://www.touristlink.com/user/showlanka-tours.html", src: "touristlink.png", alt: "tourist link", width: 256, height: 85 },
  { href: "https://www.thrillophilia.com/", src: "thrillophilia.png", alt: "thrillophilia", width: 1100, height: 275 },
].map((logo) => ({ ...logo, src: `${ASSET_BASE}/images/icons/${logo.src}` }));
