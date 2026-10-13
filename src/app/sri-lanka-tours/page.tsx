import { pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";
import { tourFilters } from "@/components/sites/showlanka/config";
import { TourListing } from "@/components/sites/showlanka/TourListing";
import { getTourListing } from "@/lib/wp";

export const generateMetadata = () => pageMetadata("sri-lanka-tours");

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// The theme pre-selects a category from a bare query key, e.g. /sri-lanka-tours?summer
export default async function ToursPage({ searchParams }: Props) {
  const [tours, query] = await Promise.all([getTourListing(), searchParams]);
  const initialCategory = tourFilters.find((f) => f.key in query)?.key ?? "";
  return (
    <SubPage slug="sri-lanka-tours">
      <TourListing tours={tours} initialCategory={initialCategory} />
    </SubPage>
  );
}
