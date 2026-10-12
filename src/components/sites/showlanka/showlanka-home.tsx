import "./showlanka.css";
import { HeroSection } from "./hero-section";
import { HomeIntro, PackagesSection, WhySection } from "./home-sections";
import { PageTransitions, Preloader } from "./page-effects";
import { ReviewSection } from "./review-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TourOfTheMonth } from "./tour-of-the-month";

export function ShowlankaHome() {
  return (
    <div className="sl">
      <Preloader />
      <PageTransitions />
      <SiteHeader />
      <main id="main" className="site-main">
        <HeroSection />
        <HomeIntro />
        <PackagesSection />
        <WhySection />
        <TourOfTheMonth />
        <ReviewSection />
      </main>
      <SiteFooter />
    </div>
  );
}
