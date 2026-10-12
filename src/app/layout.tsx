import type { Metadata } from "next";

import { PageTransitions } from "@/components/sites/showlanka/PageTransitions";

import "./globals.css";
import "@/components/sites/showlanka/showlanka.css";

export const metadata: Metadata = {
  title: "Tour Operators Sri Lanka - Show Lanka Tours | Best Tour Packages",
  description:
    "Show Lanka Tours: Top Tour Operators Sri Lanka. Experience customized tour packages, private guides, and exceptional service. Embark on a Sri Lankan adventure with us.",
  openGraph: {
    locale: "en_US",
    siteName: "Sri Lanka tour operators | Show Lanka tours -",
    type: "website",
    title: "Discover Sri Lanka with Top Tour Operators - Show Lanka Tours",
    description:
      "Embark on an unforgettable journey through Sri Lanka with Show Lanka Tours. As leading tour operators, we offer customized packages, private guides, and exceptional service tailored to your travel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Sri Lanka with Top Tour Operators - Show Lanka Tours",
    description:
      "Embark on an unforgettable journey through Sri Lanka with Show Lanka Tours. As leading tour operators, we offer customized packages, private guides, and exceptional service tailored to your travel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" dir="ltr">
      <body className="sl-body">
        <PageTransitions />
        {children}
      </body>
    </html>
  );
}
