import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

/** Next <Link> for cloned routes, a plain anchor for files and external sites. */
export function SiteLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const internal = href.startsWith("/") && !href.startsWith("/sites/");
  if (internal) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}

/** Upload path → public URL of the locally mirrored file. */
export const upload = (path: string) => `/sites/showlanka/uploads/${path}`;
