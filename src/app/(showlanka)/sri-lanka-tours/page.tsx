import type { Metadata } from "next";
import { Suspense } from "react";
import { BonanzaPopup } from "@/components/sites/showlanka/bonanza";
import { toursPage } from "@/components/sites/showlanka/content/pages";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";
import { ToursList } from "@/components/sites/showlanka/tours-list";

export const metadata: Metadata = { title: toursPage.seoTitle, description: toursPage.description };

export default function ToursPage() {
  return (
    <>
      <SubPageHero hero={toursPage.hero} />
      <section className="flex package-content">
        <div className="container">
          <h2 className="sub-page-title border-after">{toursPage.heading}</h2>
          <p>{toursPage.intro}</p>
        </div>
      </section>
      <Suspense>
        <ToursList />
      </Suspense>
      <BonanzaPopup />
    </>
  );
}
