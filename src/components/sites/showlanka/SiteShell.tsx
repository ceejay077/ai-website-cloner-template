"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "./Analytics";

/** Public-site chrome (preloader, header, footer, analytics), left off the admin panel. */
export function SiteShell({
  preloader,
  header,
  footer,
  children,
}: {
  preloader: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      {preloader}
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      <Analytics />
    </>
  );
}
