import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Local routes use next/link; out-of-scope pages keep pointing at the source site. */
export function SiteLink({ href, ...props }: SiteLinkProps) {
  if (href.startsWith("/")) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}
