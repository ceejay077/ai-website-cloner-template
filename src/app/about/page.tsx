import { AboutB2B, AboutStory, AboutTeam, AboutVision } from "@/components/sites/showlanka/AboutSections";
import { pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";

export const generateMetadata = () => pageMetadata("about");

export default function AboutPage() {
  return (
    <SubPage slug="about">
      <AboutStory />
      <AboutVision />
      <AboutTeam />
      <AboutB2B />
    </SubPage>
  );
}
