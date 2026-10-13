import type { Metadata } from "next";
import { PagePreloader } from "@/components/sites/showlanka/PagePreloader";
import { SiteFooter } from "@/components/sites/showlanka/SiteFooter";
import { SiteHeader } from "@/components/sites/showlanka/SiteHeader";
import "./globals.css";
import "@/components/sites/showlanka/showlanka.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.showlanka.com"),
  title: {
    default: "Tour Operators Sri Lanka - Show Lanka Tours | Best Tour Packages",
    template: "%s | Show Lanka Tours",
  },
  description: "Custom Sri Lanka holiday packages with expert local guides.",
  icons: { icon: "https://www.showlanka.com/wp-content/themes/webslankatheme/images/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // PagePreloader's pre-paint script tags <html>, so React must accept that difference.
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className="sl-body flex min-h-full flex-col" suppressHydrationWarning>
        <PagePreloader />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
