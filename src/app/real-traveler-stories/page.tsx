import { CategorySection, pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";

export const generateMetadata = () => pageMetadata("real-traveler-stories");

export default function StoriesPage() {
  return (
    <SubPage slug="real-traveler-stories">
      <CategorySection category="othervideoreview" title="Inspiring Stories from Around the Globe" id="review-section" />
    </SubPage>
  );
}
