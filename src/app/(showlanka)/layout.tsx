import type { ReactNode } from "react";
import { SiteShell } from "@/components/sites/showlanka/site-shell";

export default function ShowlankaLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
