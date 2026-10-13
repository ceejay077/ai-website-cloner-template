import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/components/admin/format";
import { STATUS_LABELS, StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/server/auth";
import { countEnquiriesByStatus, ENQUIRY_STATUSES, listEnquiries, type EnquiryStatus } from "@/lib/server/store";

export const metadata: Metadata = { title: "Enquiries" };

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function EnquiriesPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const status = (ENQUIRY_STATUSES as readonly string[]).includes(params.status ?? "") ? (params.status as EnquiryStatus) : undefined;
  const query = (params.q ?? "").trim().slice(0, 100);
  const enquiries = listEnquiries({ status, query });
  const counts = countEnquiriesByStatus();
  const openCount = counts.new + counts.read + counts.replied;

  const href = (next: EnquiryStatus | undefined) => {
    const sp = new URLSearchParams();
    if (next) sp.set("status", next);
    if (query) sp.set("q", query);
    const qs = sp.toString();
    return `/admin/enquiries${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Enquiries</h1>
          <p>Tour enquiries sent through the website contact form.</p>
        </div>
      </div>

      <div className="adm-filters">
        <nav className="adm-seg" aria-label="Filter by status">
          <Link href={href(undefined)} aria-current={!status ? "true" : undefined}>
            Open <span className="num">({openCount})</span>
          </Link>
          {ENQUIRY_STATUSES.map((s) => (
            <Link key={s} href={href(s)} aria-current={status === s ? "true" : undefined}>
              {STATUS_LABELS[s]} <span className="num">({counts[s]})</span>
            </Link>
          ))}
        </nav>
        <form action="/admin/enquiries" style={{ display: "flex", gap: 8, flex: "1 1 240px" }}>
          {status && <input type="hidden" name="status" value={status} />}
          <input
            className="adm-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name, email, country, message"
            aria-label="Search enquiries"
            style={{ flex: 1 }}
          />
          <button className="adm-btn" type="submit">
            Search
          </button>
        </form>
      </div>

      <section className="adm-card">
        {enquiries.length === 0 ? (
          <p className="adm-empty" style={{ padding: 16 }}>
            {query || status ? "No enquiries match this filter." : "No enquiries yet."}
          </p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Travel dates</th>
                  <th>Group</th>
                  <th>Message</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id} className={e.status === "new" ? "is-new" : undefined}>
                    <td className="adm-sub num" style={{ whiteSpace: "nowrap" }}>
                      {formatDate(e.createdAt)}
                    </td>
                    <td>
                      <Link className="adm-rowlink" href={`/admin/enquiries/${e.id}`}>
                        {e.name}
                      </Link>
                      <div className="adm-sub">{e.email}</div>
                    </td>
                    <td>{e.country || "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{[e.arrival, e.departure].filter(Boolean).join(" → ") || "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{e.adults ? `${e.adults} adults` : "—"}</td>
                    <td>
                      <div className="adm-clip">{e.message || "—"}</div>
                    </td>
                    <td>
                      {e.source || "—"}
                      {e.referrer && <div className="adm-sub">{e.referrer}</div>}
                    </td>
                    <td>
                      <StatusBadge status={e.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
