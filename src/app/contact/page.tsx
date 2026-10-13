import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contact, pageHeadings } from "@/components/sites/showlanka/config";
import { InquiryForm } from "@/components/sites/showlanka/InquiryForm";
import { PageBanner } from "@/components/sites/showlanka/PageBanner";
import { getPage } from "@/lib/wp";

// SEO title/description set in the live site's SEO plugin, which the REST API omits.
const TITLE = "Contact Show Lanka Tours - Your Trusted Sri Lanka Tour Operator";
const DESCRIPTION =
  "Get in touch with Show Lanka Tours, your expert tour operator in Sri Lanka. Plan your unforgettable journey with us today!";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/contact/" },
};

// The contact template's own address block and map, which differ from the footer's.
const CONTACT_ADDRESS = ["Show Lanka Tours,", "21, 1/6, Nelu Gardens,", "Yatiyana,", "Minuwangoda 11550"];
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.456283350695!2d79.92425197400065!3d7.188662492816533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2e57b0f2ed167%3A0x3174de459e53eb80!2sShowlanka%20Tours!5e0!3m2!1sen!2slk!4v1721912794397!5m2!1sen!2slk";

export default async function ContactPage() {
  const page = await getPage("contact");
  if (!page) notFound();
  const headings = pageHeadings.contact;

  return (
    <>
      <PageBanner entry={page} title={headings.title} subtitle={headings.subtitle} className="sl-banner--natural" />
      <section className="sl-contact">
        <div className="sl-tours-container">
          <h2 className="sl-subpage-title">{headings.intro}</h2>
          <InquiryForm />
        </div>
      </section>
      <section className="sl-contact-details">
        <div className="sl-tours-container">
          <div className="sl-contact-details__row">
            <div className="sl-contact-details__map">
              <iframe
                src={MAP_EMBED}
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                title="Show Lanka Tours location on Google Maps"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="sl-contact-details__info">
              <p className="sl-contact-details__eyebrow">address</p>
              <p>
                {CONTACT_ADDRESS.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < CONTACT_ADDRESS.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <p className="sl-contact-details__eyebrow">phone</p>
              <p>
                {contact.phones.map((phone, i) => (
                  <span key={phone}>
                    {phone}
                    {i < contact.phones.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <p className="sl-contact-details__eyebrow">email</p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
