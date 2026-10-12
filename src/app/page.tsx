import { HeroSection } from "@/components/sites/showlanka/HeroSection";
import { IntroSection } from "@/components/sites/showlanka/IntroSection";
import { PackagesSection } from "@/components/sites/showlanka/PackagesSection";
import { ReviewSection } from "@/components/sites/showlanka/ReviewSection";
import { SiteFooter } from "@/components/sites/showlanka/SiteFooter";
import { SiteHeader } from "@/components/sites/showlanka/SiteHeader";
import { SpecialTourSection } from "@/components/sites/showlanka/SpecialTourSection";
import { WhySection } from "@/components/sites/showlanka/WhySection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="site-main">
        <HeroSection />
        <IntroSection />
        <PackagesSection />
        <WhySection />
        <SpecialTourSection />
        <ReviewSection />
      </main>
      <SiteFooter />
    </>
  );
}
