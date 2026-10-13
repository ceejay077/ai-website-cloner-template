import { Handshake, Mountain, Smile, type LucideIcon } from "lucide-react";
import { decodeEntities, featuredImage, getPostsByCategory, type WpEntry } from "@/lib/wp";
import { aboutSections } from "./config";
import { WpHtml } from "./WpHtml";

// Theme icon per vision post (Font Awesome in the original), matched by slug order.
const VISION_ICONS: { icon: LucideIcon; color: string }[] = [
  { icon: Handshake, color: "#047ad9" },
  { icon: Mountain, color: "#2e8b57" },
  { icon: Smile, color: "#fbbd00" },
];

function SectionHeading({ eyebrow, title, align = "center" }: { eyebrow?: string; title: string; align?: "center" | "left" }) {
  return (
    <div style={{ textAlign: align }}>
      {eyebrow && <p className="sl-eyebrow sl-border-after" style={{ margin: "0 0 16px" }}>{eyebrow}</p>}
      <h2 className="sl-section-title">{title}</h2>
    </div>
  );
}

function bgImage(entry: WpEntry): string | undefined {
  const src = featuredImage(entry, "medium_large")?.source_url;
  return src ? `url("${src}")` : undefined;
}

/** "Our Story": grayscale image (1/3) beside the story text (2/3). */
export async function AboutStory() {
  const posts = await getPostsByCategory("about-story");
  if (posts.length === 0) return null;
  return (
    <section className="sl-about-story">
      <div className="sl-container">
        <SectionHeading title={aboutSections.story.title} align="left" />
        {posts.map((post) => (
          <article key={post.id} className="sl-about-story__row">
            <div className="sl-about-story__img" role="img" aria-label={decodeEntities(post.title.rendered)} style={{ backgroundImage: bgImage(post) }} />
            <div className="sl-about-story__text">
              <h3>{decodeEntities(post.title.rendered)}</h3>
              <WpHtml html={post.content.rendered} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** "Our Vision for the Future": three bordered cards with a large icon. */
export async function AboutVision() {
  const posts = await getPostsByCategory("about-vision");
  if (posts.length === 0) return null;
  return (
    <section className="sl-about-vision">
      <div className="sl-container">
        <SectionHeading {...aboutSections.vision} />
        <div className="sl-bordered sl-bordered--3">
          {posts.map((post, i) => {
            const { icon: Icon, color } = VISION_ICONS[i % VISION_ICONS.length];
            return (
              <article key={post.id} className="sl-bordered__card">
                <h3>{decodeEntities(post.title.rendered)}</h3>
                <Icon className="sl-bordered__icon" size={88} color={color} aria-hidden />
                <WpHtml html={post.content.rendered} className="" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** "The Team That Drives Us": four bordered cards with a portrait. */
export async function AboutTeam({ id = "our-team" }: { id?: string }) {
  const posts = await getPostsByCategory("about-team");
  if (posts.length === 0) return null;
  return (
    <section id={id} className="sl-about-team">
      <div className="sl-container">
        <SectionHeading eyebrow={aboutSections.team.eyebrow} title={aboutSections.team.title} />
        {aboutSections.team.intro && <p className="sl-about-team__intro">{aboutSections.team.intro}</p>}
        <div className="sl-bordered sl-bordered--4">
          {posts.map((post) => (
            <article key={post.id} className="sl-bordered__card">
              <div className="sl-bordered__portrait" role="img" aria-label={decodeEntities(post.title.rendered)} style={{ backgroundImage: bgImage(post) }} />
              <div className="sl-bordered__text">
                <h3>{decodeEntities(post.title.rendered)}</h3>
                <WpHtml html={post.content.rendered} className="" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "B2B Business": full-width text block. */
export async function AboutB2B() {
  const posts = await getPostsByCategory("b2b-business");
  if (posts.length === 0) return null;
  return (
    <section id="b2b-business" className="sl-about-b2b">
      <div className="sl-container">
        <SectionHeading {...aboutSections.b2b} align="left" />
        {posts.map((post) => (
          <WpHtml key={post.id} html={post.content.rendered} />
        ))}
      </div>
    </section>
  );
}

/** "Your Trusted Tour Guides": theme-authored intro, then bordered guide cards. */
export async function AboutGuides({ id = "our-guides" }: { id?: string }) {
  const posts = await getPostsByCategory("about-guides", "desc");
  return (
    <section id={id} className="sl-about-guides">
      <div className="sl-container">
        <SectionHeading {...aboutSections.guides} align="left" />
        <p>
          At Show Lanka tours, we take immense pride in providing you with guides who are not only well-disciplined but also
          bring over 20 years of rich experience in the tourism sector. Our guides have extensive knowledge of all the sites
          and attractions in Sri Lanka, ensuring that you receive the most insightful and enriching experience during your
          travels.
        </p>
        <h4>Why Our Guides Stand Out:</h4>
        <ol>
          <li>
            <strong>Vast Experience and Expertise</strong>: With over two decades in the field, our guides possess
            unparalleled expertise and deep insights into the cultural, historical, and natural wonders of Sri Lanka. They
            have mastered the art of quickly understanding the unique needs and preferences of each client, ensuring a
            tailored and fulfilling journey.
          </li>
          <li>
            <strong>Excellent Communication Skills</strong>: Proficient in English, our guides communicate effectively,
            making sure you are always well-informed and comfortable. They provide comprehensive explanations and fascinating
            stories about each tourist spot, enhancing your understanding and appreciation of Sri Lanka’s heritage.
          </li>
          <li>
            <strong>Personalized Itineraries</strong>: Our guides prioritize your needs and preferences when planning daily
            travel destinations. They meticulously arrange your itinerary to suit the occasion, whether it’s a leisurely
            exploration of ancient temples or an adventurous hike through lush landscapes.
          </li>
          <li>
            <strong>Dedicated and Friendly Service</strong>: More than just guides, they serve as your close companions
            throughout the tour. Always ready to assist, they offer their services with warmth and friendliness, ensuring you
            feel supported and valued at every step of your journey. From addressing minor concerns to making spontaneous
            adjustments, they are committed to your satisfaction and comfort.
          </li>
          <li>
            <strong>Proactive Problem Solvers</strong>: Should any unforeseen issues arise, our guides are quick to provide
            solutions, leveraging their extensive experience and resourcefulness. Their proactive approach ensures that any
            potential disruptions are managed smoothly and efficiently.
          </li>
        </ol>
        <p>
          By entrusting your holiday to our seasoned guides, you can relax and immerse yourself in the beauty and culture of
          Sri Lanka, confident that you are in capable and caring hands. We are dedicated to making your travel dreams come
          true, offering an exceptional level of service that transforms your holiday into a cherished memory.
        </p>
        <div className="sl-bordered sl-bordered--3">
          {posts.map((post) => (
            <article key={post.id} className="sl-bordered__card sl-guide">
              <div className="sl-guide__img" role="img" aria-label={decodeEntities(post.title.rendered)} style={{ backgroundImage: bgImage(post) }} />
              <div className="sl-guide__text">
                <h3>{decodeEntities(post.title.rendered)}</h3>
                <WpHtml html={post.content.rendered} className="" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
