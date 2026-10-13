"use client";

import { useState, type FormEvent } from "react";
import { contact } from "./config";

/**
 * Tour inquiry form. The WordPress Contact Form 7 endpoint requires a
 * reCAPTCHA token bound to showlanka.com, so this form hands the inquiry to
 * the visitor's email app, addressed to the company inbox.
 */
export function InquiryForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const body = [
      `Name: ${field("name")}`,
      `Email: ${field("email")}`,
      `Phone / WhatsApp: ${field("phone")}`,
      `Country: ${field("country")}`,
      `Arrival date: ${field("arrival")}`,
      `Number of days: ${field("days")}`,
      `Adults: ${field("adults")}`,
      `Children: ${field("children")}`,
      "",
      field("message"),
    ].join("\n");
    const subject = `Tour inquiry from ${field("name")}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="sl-form" onSubmit={onSubmit}>
      <label>
        Your name *
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        Your email *
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Phone / WhatsApp
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label>
        Country
        <input name="country" autoComplete="country-name" />
      </label>
      <label>
        Arrival date *
        <input name="arrival" type="date" required />
      </label>
      <label>
        Number of days
        <input name="days" type="number" min={1} max={60} />
      </label>
      <label>
        Adults
        <input name="adults" type="number" min={1} defaultValue={2} />
      </label>
      <label>
        Children
        <input name="children" type="number" min={0} defaultValue={0} />
      </label>
      <label>
        Your message
        <textarea name="message" />
      </label>
      <button type="submit" className="sl-btn">
        Send
      </button>
      {sent && (
        <p role="status" style={{ margin: 0 }}>
          Your email app should open with the inquiry ready to send. If it doesn&apos;t, email us at{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      )}
    </form>
  );
}
