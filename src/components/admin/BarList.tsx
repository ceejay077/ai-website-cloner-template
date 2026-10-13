import type { Breakdown } from "@/lib/server/store";

/** Ranked breakdown with a bar sized by visitors, plus visitor and page-view counts. */
export function BarList({
  title,
  items,
  label = "Name",
  note,
  format = (value) => value,
}: {
  title: string;
  items: Breakdown[];
  label?: string;
  note?: string;
  format?: (label: string) => string;
}) {
  const max = Math.max(...items.map((i) => i.visitors), 1);
  return (
    <section className="adm-card">
      <div className="adm-card__head">
        <h2>{title}</h2>
        {note && <span>{note}</span>}
      </div>
      <div className="adm-card__body">
        {items.length === 0 ? (
          <p className="adm-empty">No data for this period yet.</p>
        ) : (
          <ul className="adm-bars">
            <li className="adm-bars__head" aria-hidden>
              <span>{label}</span>
              <span>Visitors</span>
              <span>Views</span>
            </li>
            {items.map((item) => (
              <li key={item.label}>
                <span className="adm-bars__label">
                  <span className="adm-bars__fill" style={{ width: `${Math.max(2, (item.visitors / max) * 100)}%` }} />
                  <span className="adm-bars__text" title={format(item.label)}>
                    {format(item.label)}
                  </span>
                </span>
                <span className="num">{item.visitors.toLocaleString()}</span>
                <span className="num">{item.pageviews.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
