import { pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";

export const generateMetadata = () => pageMetadata("terms-and-conditions");

export default function TermsPage() {
  return <SubPage slug="terms-and-conditions" />;
}
