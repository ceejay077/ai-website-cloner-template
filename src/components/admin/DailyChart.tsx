"use client";

import { useState } from "react";
import type { DailyPoint } from "@/lib/server/store";

const W = 720;
const H = 220;
const PAD = { top: 12, right: 8, bottom: 26, left: 36 };
const nf = new Intl.NumberFormat("en", { notation: "compact" });

function niceMax(value: number): number {
  if (value <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(value));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * step >= value) return m * step;
  return 10 * step;
}

const dayLabel = (day: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

/** Daily unique visitors as columns; hover or focus a day for its page views and enquiries. */
export function DailyChart({ data }: { data: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.visitors), 0));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / data.length;
  const barW = Math.min(24, Math.max(2, slot - 2));
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const labelEvery = Math.ceil(data.length / 8);
  const point = active === null ? null : data[active];

  return (
    <div className="adm-chart" onPointerLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily visitors">
        <g className="grid">
          {ticks.map((t) => (
            <line key={t} x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
          ))}
        </g>
        <g className="axis">
          {ticks.map((t) => (
            <text key={t} x={PAD.left - 6} y={y(t) + 4} textAnchor="end">
              {nf.format(t)}
            </text>
          ))}
          {data.map((d, i) =>
            i % labelEvery === 0 ? (
              <text key={d.day} x={PAD.left + slot * i + slot / 2} y={H - 8} textAnchor="middle">
                {dayLabel(d.day, { day: "numeric", month: "short" })}
              </text>
            ) : null,
          )}
        </g>
        {data.map((d, i) => {
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const top = y(d.visitors);
          const h = PAD.top + plotH - top;
          const r = Math.min(4, barW / 2, h);
          return (
            <g key={d.day}>
              {h > 0 && (
                <path
                  className={`bar${active !== null && active !== i ? " is-dim" : ""}`}
                  d={`M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + h} Z`}
                />
              )}
              <rect
                className="hit"
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={plotH}
                tabIndex={0}
                aria-label={`${dayLabel(d.day, { weekday: "short", day: "numeric", month: "short" })}: ${d.visitors} visitors, ${d.pageviews} page views, ${d.enquiries} enquiries`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            </g>
          );
        })}
      </svg>
      {point && active !== null && (
        <div
          className="adm-tip"
          style={{
            left: `${((PAD.left + slot * active + slot / 2) / W) * 100}%`,
            top: `${(y(point.visitors) / H) * 100}%`,
          }}
        >
          <div className="adm-tip__date">{dayLabel(point.day, { weekday: "short", day: "numeric", month: "short" })}</div>
          <div>
            <strong className="num">{point.visitors.toLocaleString()}</strong> visitors
          </div>
          <div className="num">{point.pageviews.toLocaleString()} page views</div>
          <div className="num">{point.enquiries.toLocaleString()} enquiries</div>
        </div>
      )}
      <details className="adm-table-toggle">
        <summary>Show as table</summary>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Day</th>
                <th className="num">Visitors</th>
                <th className="num">Page views</th>
                <th className="num">Enquiries</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.day}>
                  <td>{dayLabel(d.day, { weekday: "short", day: "numeric", month: "short" })}</td>
                  <td className="num">{d.visitors}</td>
                  <td className="num">{d.pageviews}</td>
                  <td className="num">{d.enquiries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
