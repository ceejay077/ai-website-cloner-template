import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BonanzaPopup } from "@/components/sites/showlanka/bonanza";
import { NewsDetail } from "@/components/sites/showlanka/news-detail";
import { PackageCard, tourIntro } from "@/components/sites/showlanka/subpage-parts";
import { TourDetail } from "@/components/sites/showlanka/tour-detail";
import { getNewsItem, getTour, getTours } from "@/lib/server/content";

type Params = { params: Promise<{ slug: string }> };

// Tours and news posts are read per request so ones published in the admin appear at once.

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (tour) {
    return {
      title: `${tour.title} in Sri Lanka: Explore the Route, Discover the Highlights and Plan Your Holiday With Local Travel Support | Show Lanka Tours`,
      description: tourIntro(tour),
    };
  }
  const item = await getNewsItem(slug);
  if (item) {
    return {
      title: `Sri Lanka Travel News: ${item.title}. Find Destination Updates, Holiday Ideas and Local Insights for Planning Your Island Trip | Show Lanka Tours`,
      description: item.summary[0],
    };
  }
  return {};
}

export default async function SlugPage({ params }: Params) {
  const { slug } = await params;

  const tour = await getTour(slug);
  if (tour) {
    // The source lists every private tour (in listing order) as "similar", including this one.
    const similar = (await getTours()).filter((t) => t.categories.includes("private"));
    return (
      <>
        <TourDetail tour={tour} />
        <section className="packages-list similar-post-container">
          <div className="container-fluid">
            <p className="uppercase-subtitle border-after">Are you interested our above package?</p>
            <h2 className="section-title">Similar Tour Packages</h2>
            <div className="packages-content-container">
              <div className="row">
                {similar.map((t) => (
                  <PackageCard key={t.slug} tour={t} />
                ))}
              </div>
            </div>
          </div>
        </section>
        <BonanzaPopup />
      </>
    );
  }

  const item = await getNewsItem(slug);
  if (item) return <NewsDetail item={item} />;

  notFound();
}
