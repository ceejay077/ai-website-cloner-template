import { prepareHtml } from "@/lib/wp";

/** Renders HTML authored in the site's own WordPress editor. */
export function WpHtml({ html, className = "sl-prose" }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: prepareHtml(html) }} />;
}
