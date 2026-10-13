"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TourCategory, TourMeta } from "@/lib/wp";
import { dayRanges } from "./config";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Filterable tour list, mirroring the theme's filters.js: a category from the
 * URL query is applied once on load, and tours without travel months match
 * every month.
 */
export function TourListing({
  tours,
  categories,
  initialCategory = "",
}: {
  tours: TourMeta[];
  categories: TourCategory[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [days, setDays] = useState("");
  const [month, setMonth] = useState("");

  const visible = useMemo(() => {
    const range = dayRanges.find((r) => `${r.min}-${r.max}` === days);
    return tours.filter(
      (t) =>
        (!category || t.categories.includes(category)) &&
        (!range || (t.days >= range.min && t.days <= range.max)) &&
        (!month || t.months.length === 0 || t.months.includes(Number(month))),
    );
  }, [tours, category, days, month]);

  return (
    <section className="sl-tours">
      <div className="sl-tours__filters">
        <div className="sl-tours__filter">
          <select className="sl-tours__select" aria-label="Filter by tour category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All tour categories</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sl-tours__filter">
          <select className="sl-tours__select" aria-label="Filter by number of days" value={days} onChange={(e) => setDays(e.target.value)}>
            <option value="">All Days</option>
            {dayRanges.map((r) => (
              <option key={r.label} value={`${r.min}-${r.max}`}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sl-tours__filter">
          <select className="sl-tours__select" aria-label="Filter by month" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">All year</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sl-tours__grid">
        {visible.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="sl-tours__empty">
          <p>No packages match your selected filters. Please try different options.</p>
        </div>
      )}
    </section>
  );
}

export function TourCard({ tour }: { tour: TourMeta }) {
  return (
    <article className="sl-tour">
      <div className="sl-tour__img" role="img" aria-label={tour.title} style={{ backgroundImage: `url("${tour.image}")` }}>
        <div className="sl-tour__meta">
          <div>
            <span>Duration</span>
            <span className="sl-tour__value">{tour.duration}</span>
          </div>
          <div>
            <span>Price per pax</span>
            <span className="sl-tour__value">{tour.price}</span>
          </div>
        </div>
      </div>
      <div className="sl-tour__text">
        <h3>{tour.title}</h3>
        <p>{tour.excerpt}</p>
        <Link href={`/${tour.slug}`} className="sl-tour__btn">
          Read More<span className="sr-only"> about {tour.title}</span>
        </Link>
      </div>
    </article>
  );
}
