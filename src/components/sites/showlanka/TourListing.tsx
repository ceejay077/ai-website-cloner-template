"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TourMeta } from "@/lib/wp";
import { dayRanges, tourFilters } from "./config";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function TourListing({ tours, initialCategory = "" }: { tours: TourMeta[]; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [days, setDays] = useState("");
  const [month, setMonth] = useState("");


  const visible = useMemo(() => {
    const range = dayRanges.find((r) => `${r.min}-${r.max}` === days);
    return tours.filter(
      (t) =>
        (!category || t.categories.includes(category)) &&
        (!range || (t.days >= range.min && t.days <= range.max)) &&
        (!month || t.months.includes(Number(month))),
    );
  }, [tours, category, days, month]);

  const update = (key: string) => {
    setCategory(key);
    window.history.replaceState(null, "", key ? `?${key}` : window.location.pathname);
  };

  return (
    <section className="sl-container" style={{ padding: "32px 12px" }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 320px))", margin: "0 0 24px" }}>
        <select className="sl-select" aria-label="Filter by tour category" value={category} onChange={(e) => update(e.target.value)}>
          <option value="">All tour categories</option>
          {tourFilters.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
        <select className="sl-select" aria-label="Filter by number of days" value={days} onChange={(e) => setDays(e.target.value)}>
          <option value="">All Days</option>
          {dayRanges.map((r) => (
            <option key={r.label} value={`${r.min}-${r.max}`}>
              {r.label}
            </option>
          ))}
        </select>
        <select className="sl-select" aria-label="Filter by month" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All year</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p style={{ padding: 24, color: "var(--sl-amber)", border: "1px solid", borderRadius: 16 }}>
          No tour packages match these filters. Try another category, duration or month, or{" "}
          <Link href="/contact">ask us for a custom tour</Link>.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))" }}>
          {visible.map((tour) => (
            <TourRow key={tour.slug} tour={tour} />
          ))}
        </div>
      )}
    </section>
  );
}

export function TourRow({ tour }: { tour: TourMeta }) {
  return (
    <article className="sl-listing">
      <div className="sl-listing__img" role="img" aria-label={tour.title} style={{ backgroundImage: `url("${tour.image}")` }}>
        <div className="sl-listing__meta">
          <div>
            <span>Duration</span>
            <span className="v">{tour.duration}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span>Price per pax</span>
            <span className="v">{tour.price}</span>
          </div>
        </div>
      </div>
      <div className="sl-listing__text">
        <h3>{tour.title}</h3>
        <p>{tour.excerpt}</p>
        <Link href={`/${tour.slug}`} className="sl-btn">
          Read More<span className="sr-only"> about {tour.title}</span>
        </Link>
      </div>
    </article>
  );
}
