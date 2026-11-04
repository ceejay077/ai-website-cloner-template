import type { ReactNode } from "react";
import Script from "next/script";
import { SiteShell } from "@/components/sites/showlanka/site-shell";

const GA_MEASUREMENT_ID = "G-SYV7GXBQ62";
const GOOGLE_ADS_ID = "AW-16666466013";

export default function ShowlankaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
      <SiteShell>{children}</SiteShell>
    </>
  );
}
