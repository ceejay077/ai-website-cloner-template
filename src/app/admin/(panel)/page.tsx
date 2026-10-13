import type { Metadata } from "next";
import Link from "next/link";
import { BarList } from "@/components/admin/BarList";
import { DailyChart } from "@/components/admin/DailyChart";
import { adminTzOffset, formatDate } from "@/components/admin/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/server/auth";
import { activeVisitors, listEnquiries, trafficReport } from "@/lib/server/store";

export const metadata: Metadata = { title: "Dashboard" };

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "12 months" },
];

type Props = { searchParams: Promise<{ range?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  await requireAdmin();
  const { range } = await searchParams;
  const days = RANGES.find((r) => String(r.days) === range)?.days ?? 30;
  const report = trafficReport(days, adminTzOffset());
  const live = activeVisitors();
  const recent = listEnquiries().slice(0, 6);
  const conversion = report.visitors ? (report.enquiries / report.visitors) * 100 : 0;
  const prevConversion = report.previous.visitors ? (report.previous.enquiries / report.previous.visitors) * 100 : 0;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>
            <span className="adm-live">
              <span className="num">{live}</span>&nbsp;on the site now
            </span>
          </p>
        </div>
        <nav className="adm-seg" aria-label="Date range">
          {RANGES.map((r) => (
            <Link key={r.days} href={`/admin?range=${r.days}`} aria-current={r.days === days ? "true" : undefined}>
              {r.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="adm-tiles">
        <StatTile label="Visitors" value={report.visitors} previous={report.previous.visitors} days={days} />
        <StatTile label="Page views" value={report.pageviews} previous={report.previous.pageviews} days={days} />
        <StatTile label="Visits" value={report.sessions} previous={report.previous.sessions} days={days} />
        <StatTile label="Enquiries" value={report.enquiries} previous={report.previous.enquiries} days={days} />
        <StatTile
          label="Enquiry rate"
          value={conversion}
          previous={prevConversion}
          days={days}
          format={(v) => `${v.toFixed(1)}%`}
        />
      </div>

      <section className="adm-card">
        <div className="adm-card__head">
          <h2>Daily visitors</h2>
          <span>Unique visitors per day · last {days} days</span>
        </div>
        <div className="adm-card__body">
          <DailyChart data={report.daily} />
        </div>
      </section>

      <div className="adm-two">
        <BarList title="Traffic sources" items={report.sources} label="Source" note="By first page of each visit" />
        <BarList title="Referring sites" items={report.referrers} label="Website" />
      </div>
      <div className="adm-two">
        <BarList title="Top pages" items={report.pages} label="Page" format={pageName} />
        <BarList title="Landing pages" items={report.landingPages} label="Page" format={pageName} note="Where visits start" />
      </div>
      <div className="adm-two adm-three">
        <BarList title="Countries" items={report.countries} label="Country" />
        <BarList title="Devices" items={report.devices} label="Device" />
        <BarList title="Browsers" items={report.browsers} label="Browser" />
      </div>
      {report.campaigns.length > 0 && (
        <div className="adm-two">
          <BarList title="Campaigns" items={report.campaigns} label="utm_campaign" />
        </div>
      )}

      <section className="adm-card" style={{ marginTop: 16 }}>
        <div className="adm-card__head">
          <h2>Latest enquiries</h2>
          <Link href="/admin/enquiries">View all</Link>
        </div>
        <div className="adm-card__body">
          {recent.length === 0 ? (
            <p className="adm-empty">No enquiries yet. They appear here when someone submits the contact form.</p>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <tbody>
                  {recent.map((e) => (
                    <tr key={e.id} className={e.status === "new" ? "is-new" : undefined}>
                      <td>
                        <Link className="adm-rowlink" href={`/admin/enquiries/${e.id}`}>
                          {e.name}
                        </Link>
                        <div className="adm-sub">{e.email}</div>
                      </td>
                      <td>
                        <div className="adm-clip">{e.message || "—"}</div>
                      </td>
                      <td>
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="num adm-sub">{formatDate(e.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function StatTile({
  label,
  value,
  previous,
  days,
  format = (v) => compact.format(v),
}: {
  label: string;
  value: number;
  previous: number;
  days: number;
  format?: (v: number) => string;
}) {
  const change = previous > 0 ? ((value - previous) / previous) * 100 : null;
  const direction = change === null || Math.abs(change) < 0.5 ? "" : change > 0 ? " is-up" : " is-down";
  return (
    <div className="adm-card adm-tile">
      <div className="adm-tile__label">{label}</div>
      <div className="adm-tile__value num">{format(value)}</div>
      <div className={`adm-tile__delta${direction}`}>
        {change === null
          ? `No data for previous ${days} days`
          : `${change > 0 ? "▲" : change < 0 ? "▼" : ""} ${Math.abs(change).toFixed(0)}% vs previous ${days} days`}
      </div>
    </div>
  );
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function pageName(path: string): string {
  if (path === "/") return "Home";
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

