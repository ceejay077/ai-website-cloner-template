import { pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";

export const generateMetadata = () => pageMetadata("faqs");

export default function FaqsPage() {
  return <SubPage slug="faqs" />;
}
