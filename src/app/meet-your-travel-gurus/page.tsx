import { AboutGuides, AboutTeam } from "@/components/sites/showlanka/AboutSections";
import { pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";

export const generateMetadata = () => pageMetadata("meet-your-travel-gurus");

export default function TeamPage() {
  return (
    <SubPage slug="meet-your-travel-gurus" id="ground-support">
      <AboutGuides />
      <AboutTeam id="team" />
    </SubPage>
  );
}
