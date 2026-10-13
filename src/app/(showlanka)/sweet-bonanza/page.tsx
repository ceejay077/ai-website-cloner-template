import type { Metadata } from "next";
import { BonanzaCarousel } from "@/components/sites/showlanka/bonanza";
import { bonanzaPage } from "@/components/sites/showlanka/content/pages";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";

export const metadata: Metadata = { title: bonanzaPage.seoTitle, description: bonanzaPage.description };

export default function SweetBonanzaPage() {
  return (
    <>
      <SubPageHero hero={bonanzaPage.hero} />
      <section className="flex package-content">
        <h1 className="sub-page-title border-after">{bonanzaPage.heading}</h1>
        <p>{bonanzaPage.intro}</p>
      </section>
      <section className="bonanza-list">
        <BonanzaCarousel />
      </section>
    </>
  );
}
