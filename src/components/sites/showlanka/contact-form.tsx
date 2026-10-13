"use client";

import { useState, type FormEvent } from "react";
import { contactPage } from "./content/pages";
import { DatePicker } from "./date-picker";

const EMAIL = "showlankatours@gmail.com";

type Errors = Partial<Record<"name" | "email" | "departure", string>>;

/**
 * Contact Form 7 layout from /contact. There is no WordPress backend in the clone, so a
 * valid submission opens the visitor's mail app with the enquiry addressed to Show Lanka.
 */
export function ContactForm() {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "invalid" | "sent">("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Errors = {};
    if (!get("your-name")) next.name = "Please fill out this field.";
    if (!get("your-email")) next.email = "Please fill out this field.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("your-email"))) next.email = "Please enter an email address.";
    // theme.js: the departure date must be after the arrival date
    if (arrival && departure && new Date(departure) <= new Date(arrival)) {
      next.departure = "Departure date must be after the arrival date.";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("invalid");
      return;
    }
    const lines = [
      `Name: ${get("your-name")}`,
      `Email: ${get("your-email")}`,
      `Telephone: ${get("tel")}`,
      `Country: ${get("country")}`,
      `Arrival date: ${arrival}`,
      `Departure date: ${departure}`,
      `Adults: ${get("adults")}`,
      `Children 0-6: ${get("children-0-6")}  6-12: ${get("children-6-12")}  12+: ${get("children-12")}`,
      `Hotel category: ${get("hotel")}`,
      "",
      get("your-message"),
    ];
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `Tour enquiry from ${get("your-name")}`,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setStatus("sent");
  };

  const field = (label: string, name: string, type = "text", error?: string) => (
    <p>
      <span className="label">{label}</span>
      <input type={type} name={name} aria-invalid={!!error} aria-required={label.endsWith("*")} />
      {error && <span className="field-error">{error}</span>}
    </p>
  );

  return (
    <form className="wpcf7-form" aria-label="Contact form" noValidate onSubmit={onSubmit}>
      {field("name*", "your-name", "text", errors.name)}
      {field("email*", "your-email", "email", errors.email)}
      {field("telephone", "tel", "tel")}
      {field("country", "country")}
      <p className="position-r">
        <span className="label">Arrival Date</span>
        <DatePicker value={arrival} onChange={setArrival} name="arrival" aria-label="Arrival Date" />
      </p>
      <p className="position-r">
        <span className="label">Departure Date</span>
        <DatePicker value={departure} onChange={setDeparture} name="departure" aria-label="Departure Date" />
        {errors.departure && <span className="field-error">{errors.departure}</span>}
      </p>
      {field("Adults", "adults")}
      <div className="children-wrapper">
        <p>
          <span className="label">Children</span>
          <span className="childAgeWrap">
            <span>0 - 6 Years</span>
            <input type="text" name="children-0-6" aria-label="Children 0 - 6 Years" />
            <span>6 - 12 Years</span>
            <input type="text" name="children-6-12" aria-label="Children 6 - 12 Years" />
            <span>12+ Years</span>
            <input type="text" name="children-12" aria-label="Children 12+ Years" />
          </span>
        </p>
      </div>
      <p>
        <span className="label">Hotel category</span>
        <select name="hotel" aria-label="Hotel category">
          {contactPage.hotelCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </p>
      <p>
        <span className="label">Message </span>
        <textarea name="your-message" rows={10} maxLength={2000} aria-label="Message" />
      </p>
      <p>
        <input className="wpcf7-submit" type="submit" value="Submit" />
      </p>
      <p className="required">* Required fields</p>
      {status && (
        <div className={`wpcf7-response-output${status === "invalid" ? " is-error" : ""}`} role="status" aria-live="polite">
          {status === "invalid"
            ? "One or more fields have an error. Please check and try again."
            : `Your email app should now open with this enquiry addressed to ${EMAIL}.`}
        </div>
      )}
    </form>
  );
}
