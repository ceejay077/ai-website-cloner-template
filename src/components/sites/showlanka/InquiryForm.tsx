"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { contact } from "./config";
import { DatePicker } from "./DatePicker";

const HOTEL_CATEGORIES = ["5 Stars", "4 Stars", "2/3 Stars", "Comfort", "High Budget"];
const CHILD_AGES = [
  { name: "children-0-6", label: "0 - 6 Years" },
  { name: "children-6-12", label: "6 - 12 Years" },
  { name: "children-12", label: "12+ Years" },
];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email", string>>;
type Status = { kind: "invalid" | "sent" | "failed"; message: ReactNode } | null;

/**
 * The site's Contact Form 7 tour inquiry form (same fields, labels and
 * validation messages). Enquiries are saved by /api/enquiries for the admin
 * panel, which also emails the company inbox.
 */
export function InquiryForm() {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    const next: Errors = {};
    if (!field("name")) next.name = "Please fill out this field.";
    if (!field("email")) next.email = "Please fill out this field.";
    else if (!EMAIL.test(field("email"))) next.email = "Please enter an email address.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus({ kind: "invalid", message: "One or more fields have an error. Please check and try again." });
      return;
    }

    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: field("name"),
          email: field("email"),
          telephone: field("telephone"),
          country: field("country"),
          arrival,
          departure,
          adults: field("adults"),
          children: CHILD_AGES.map((age) => `${age.label}: ${field(age.name) || "0"}`).join(", "),
          hotel: field("hotel"),
          message: field("message"),
          website: field("website"),
          page: window.location.pathname,
        }),
      });
      const result = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(result.error ?? "");
      form.reset();
      setArrival("");
      setDeparture("");
      setStatus({ kind: "sent", message: "Thank you for your message. It has been sent." });
    } catch (error) {
      setStatus({
        kind: "failed",
        message: (
          <>
            {(error instanceof Error && error.message) || "There was an error trying to send your message."} You can also email us at{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </>
        ),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="sl-cf7" aria-label="Contact form" noValidate onSubmit={onSubmit}>
      {/* Spam trap: hidden from people, often filled in by bots. */}
      <div className="sl-cf7__trap" aria-hidden>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Field label="name*" error={errors.name}>
        <input type="text" name="name" maxLength={400} autoComplete="name" aria-required="true" aria-invalid={Boolean(errors.name)} />
      </Field>
      <Field label="email*" error={errors.email}>
        <input type="email" name="email" maxLength={400} autoComplete="email" aria-required="true" aria-invalid={Boolean(errors.email)} />
      </Field>
      <Field label="telephone">
        <input type="tel" name="telephone" maxLength={400} autoComplete="tel" />
      </Field>
      <Field label="country">
        <input type="text" name="country" maxLength={400} autoComplete="country-name" />
      </Field>
      <Field label="Arrival Date">
        <DatePicker value={arrival} onChange={setArrival} name="arrival" label="Arrival Date" placeholder="" className="sl-cf7__date" icon={false} />
      </Field>
      <Field label="Departure Date">
        <DatePicker value={departure} onChange={setDeparture} name="departure" label="Departure Date" placeholder="" className="sl-cf7__date" icon={false} />
      </Field>
      <Field label="Adults">
        <input type="text" name="adults" maxLength={400} />
      </Field>
      <div className="sl-cf7__children">
        <div className="sl-cf7__row">
          <span className="sl-cf7__label">Children</span>
          <span className="sl-cf7__ages">
            {CHILD_AGES.map((age) => (
              <label key={age.name}>
                <span>{age.label}</span>
                <span className="sl-cf7__wrap">
                  <input type="text" name={age.name} maxLength={400} />
                </span>
              </label>
            ))}
          </span>
        </div>
      </div>
      <Field label="Hotel category">
        <select name="hotel" defaultValue={HOTEL_CATEGORIES[0]}>
          {HOTEL_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Message ">
        <textarea name="message" cols={40} rows={10} maxLength={2000} />
      </Field>
      <div className="sl-cf7__row">
        <input className="sl-cf7__submit" type="submit" value="Submit" disabled={sending} />
        <span className={`sl-cf7__spinner${sending ? " is-active" : ""}`} aria-hidden />
      </div>
      <p className="sl-cf7__required">* Required fields</p>
      {status && (
        <div className={`sl-cf7__output is-${status.kind}`} role="status" aria-live="polite">
          {status.message}
        </div>
      )}
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="sl-cf7__row">
      <label className="sl-cf7__field">
        <span className="sl-cf7__label">{label}</span>
        <span className="sl-cf7__wrap">
          {children}
          {error && <span className="sl-cf7__tip">{error}</span>}
        </span>
      </label>
    </div>
  );
}
