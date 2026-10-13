import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { removeEnquiry, updateEnquiryStatus } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { formatDate } from "@/components/admin/format";
import { STATUS_LABELS, StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/server/auth";
import { ENQUIRY_STATUSES, getEnquiry, setEnquiryStatus } from "@/lib/server/store";

export const metadata: Metadata = { title: "Enquiry" };

type Props = { params: Promise<{ id: string }> };

export default async function EnquiryPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const enquiry = getEnquiry(Number(id));
  if (!enquiry) notFound();

  // Opening a new enquiry marks it as read.
  if (enquiry.status === "new") {
    setEnquiryStatus(enquiry.id, "read");
    enquiry.status = "read";
  }

  const phone = enquiry.telephone.replace(/[^\d+]/g, "");
  const whatsapp = phone.replace(/^\+/, "").replace(/^00/, "");
  const reply = `mailto:${enquiry.email}?subject=${encodeURIComponent("Re: Your Sri Lanka tour enquiry")}`;
  const details: [string, string][] = [
    ["Email", enquiry.email],
    ["Telephone", enquiry.telephone],
    ["Country", enquiry.country],
    ["Arrival date", enquiry.arrival],
    ["Departure date", enquiry.departure],
    ["Adults", enquiry.adults],
    ["Children", enquiry.children],
    ["Hotel category", enquiry.hotel],
  ];

  return (
    <>
      <p style={{ margin: "0 0 12px" }}>
        <Link href="/admin/enquiries" className="adm-btn adm-btn--ghost" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} aria-hidden /> All enquiries
        </Link>
      </p>
      <div className="adm-page-head">
        <div>
          <h1>{enquiry.name}</h1>
          <p>
            Received {formatDate(enquiry.createdAt, true)} · <StatusBadge status={enquiry.status} />
          </p>
        </div>
        <div className="adm-actions">
          <a className="adm-btn adm-btn--primary" href={reply}>
            <Mail size={16} aria-hidden /> Reply by email
          </a>
          {phone && (
            <a className="adm-btn" href={`tel:${phone}`}>
              <Phone size={16} aria-hidden /> Call
            </a>
          )}
          {whatsapp.length >= 8 && (
            <a className="adm-btn" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener">
              <MessageCircle size={16} aria-hidden /> WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="adm-detail">
        <div className="adm-grid">
          <section className="adm-card">
            <div className="adm-card__head">
              <h2>Message</h2>
            </div>
            <div className="adm-card__body">
              <p className="adm-message">{enquiry.message || "No message."}</p>
            </div>
          </section>
          <section className="adm-card">
            <div className="adm-card__head">
              <h2>Trip details</h2>
            </div>
            <div className="adm-card__body">
              <dl className="adm-dl">
                {details.map(([label, value]) => (
                  <div key={label} style={{ display: "contents" }}>
                    <dt>{label}</dt>
                    <dd>{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        <div className="adm-grid" style={{ alignContent: "start" }}>
          <section className="adm-card">
            <div className="adm-card__head">
              <h2>Status</h2>
            </div>
            <div className="adm-card__body adm-actions">
              {ENQUIRY_STATUSES.filter((s) => s !== enquiry.status).map((s) => (
                <form key={s} action={updateEnquiryStatus.bind(null, enquiry.id, s)}>
                  <button className="adm-btn" type="submit">
                    Mark {STATUS_LABELS[s].toLowerCase()}
                  </button>
                </form>
              ))}
            </div>
          </section>
          <section className="adm-card">
            <div className="adm-card__head">
              <h2>How they found the site</h2>
            </div>
            <div className="adm-card__body">
              <dl className="adm-dl">
                <dt>Source</dt>
                <dd>{enquiry.source || "Unknown"}</dd>
                <dt>Referrer</dt>
                <dd>{enquiry.referrer || "—"}</dd>
                <dt>First page</dt>
                <dd>{enquiry.landingPage || "—"}</dd>
                <dt>Sent from</dt>
                <dd>{enquiry.page || "—"}</dd>
                <dt>Email alert</dt>
                <dd>{enquiry.emailSent ? "Sent" : "Not sent"}</dd>
              </dl>
            </div>
          </section>
          <form action={removeEnquiry.bind(null, enquiry.id)}>
            <ConfirmButton className="adm-btn adm-btn--danger" message={`Delete the enquiry from ${enquiry.name}? This cannot be undone.`}>
              Delete enquiry
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
