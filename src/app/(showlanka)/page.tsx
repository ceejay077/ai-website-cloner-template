import type { Metadata } from "next";
import { ShowlankaHome } from "@/components/sites/showlanka/showlanka-home";

export const metadata: Metadata = {
  title:
    "Plan Your Sri Lanka Holiday With Local Tour Experts — Private Sri Lanka Tours, Custom Itineraries, Wildlife Safaris, Cultural Adventures & Beach Escapes for Every Traveler | Show Lanka Tours",
  description:
    "Show Lanka Tours: Top Tour Operators Sri Lanka. Experience customized tour packages, private guides, and exceptional service. Embark on a Sri Lankan adventure with us.",
  icons: { icon: "/sites/showlanka/images/favicon.ico" },
};

export default function Home() {
  return <ShowlankaHome />;
}
