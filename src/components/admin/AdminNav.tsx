"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Inbox, LayoutDashboard } from "lucide-react";

export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  const isEnquiries = pathname.startsWith("/admin/enquiries");
  return (
    <nav className="adm-nav" aria-label="Admin">
      <Link href="/admin" aria-current={!isEnquiries ? "page" : undefined}>
        <LayoutDashboard size={17} aria-hidden /> Dashboard
      </Link>
      <Link href="/admin/enquiries" aria-current={isEnquiries ? "page" : undefined}>
        <Inbox size={17} aria-hidden /> Enquiries
        {newCount > 0 && (
          <span className="adm-count" aria-label={`${newCount} new`}>
            {newCount}
          </span>
        )}
      </Link>
      <a href="/" target="_blank" rel="noopener">
        <ExternalLink size={17} aria-hidden /> View website
      </a>
    </nav>
  );
}
