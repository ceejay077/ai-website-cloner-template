import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BonanzaPopup } from "@/components/sites/showlanka/bonanza";
import { news } from "@/components/sites/showlanka/content/news";
import { tours } from "@/components/sites/showlanka/content/tours";
import { NewsDetail } from "@/components/sites/showlanka/news-detail";
import { PackageCard, tourIntro } from "@/components/sites/showlanka/subpage-parts";
import { TourDetail } from "@/components/sites/showlanka/tour-detail";

type Params = { params: Promise<{ slug: string }> };

// Only the tours and news posts that exist on the source are valid.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...tours, ...news].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (tour) return { title: `${tour.title} - Sri Lanka tour operators | Show Lanka tours`, description: tourIntro(tour) };
  const item = news.find((n) => n.slug === slug);
  if (item) return { title: `${item.title} - Sri Lanka tour operators | Show Lanka tours`, description: item.summary[0] };
  return {};
}

export default async function SlugPage({ params }: Params) {
  const { slug } = await params;

  const tour = tours.find((t) => t.slug === slug);
  if (tour) {
    // The source lists every private tour (in listing order) as "similar", including this one.
    const similar = tours.filter((t) => t.categories.includes("private"));
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

  const item = news.find((n) => n.slug === slug);
  if (item) return <NewsDetail item={item} />;

  notFound();
}
