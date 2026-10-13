"use client";

import { useEffect, useRef } from "react";

/**
 * News body authored in WordPress. Like WordPress's file block script, PDF
 * previews are revealed only where the browser can display PDFs inline.
 */
export function NewsContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canPreview = navigator.pdfViewerEnabled;
    ref.current?.querySelectorAll<HTMLObjectElement>(".wp-block-file__embed").forEach((embed) => {
      embed.hidden = !canPreview;
    });
  }, []);

  return <div ref={ref} className="sl-newspost__content" dangerouslySetInnerHTML={{ __html: html }} />;
}
