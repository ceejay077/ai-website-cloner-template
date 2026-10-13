import { contact } from "@/components/sites/showlanka/config";
import { InquiryForm } from "@/components/sites/showlanka/InquiryForm";
import { pageMetadata, SubPage } from "@/components/sites/showlanka/SubPage";

export const generateMetadata = () => pageMetadata("contact");

export default function ContactPage() {
  return (
    <SubPage slug="contact">
      <section className="sl-container" style={{ padding: "0 12px 32px" }}>
        <InquiryForm />
      </section>
      <section className="sl-container" style={{ padding: "24px 12px 48px", display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))" }}>
        <iframe
          src={contact.mapEmbed}
          title="Show Lanka Tours location"
          loading="lazy"
          style={{ width: "100%", height: 360, border: "1px solid var(--sl-title)" }}
        />
        <div>
          <p className="sl-eyebrow" style={{ color: "var(--sl-blue)", fontWeight: 600 }}>Address</p>
          <p>{contact.address.join(" ")}</p>
          <p className="sl-eyebrow" style={{ color: "var(--sl-blue)", fontWeight: 600 }}>Phone</p>
          {contact.phones.map((phone) => (
            <p key={phone} style={{ margin: "0 0 4px" }}>
              <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
            </p>
          ))}
          <p className="sl-eyebrow" style={{ color: "var(--sl-blue)", fontWeight: 600, marginTop: 16 }}>Email</p>
          <p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>
      </section>
    </SubPage>
  );
}
