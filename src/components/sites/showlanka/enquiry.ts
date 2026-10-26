export const ENQUIRY_EMAIL = "showlankatours@gmail.com";

export type Enquiry = {
  name: string;
  email: string;
  telephone?: string;
  country?: string;
  arrival?: string;
  departure?: string;
  adults?: string;
  children?: string;
  hotel?: string;
  message?: string;
  page: string;
  /** Honeypot */
  website?: string;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Saves the enquiry for the admin panel (/admin/enquiries) via /api/enquiry;
 * if that fails, opens the visitor's mail app with the enquiry instead.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<"sent" | "mailto"> {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
    });
    if (res.ok) return "sent";
  } catch {}

  const lines = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Telephone: ${enquiry.telephone ?? ""}`,
    `Country: ${enquiry.country ?? ""}`,
    `Arrival date: ${enquiry.arrival ?? ""}`,
    `Departure date: ${enquiry.departure ?? ""}`,
    `Adults: ${enquiry.adults ?? ""}`,
    `Children: ${enquiry.children ?? ""}`,
    `Hotel category: ${enquiry.hotel ?? ""}`,
    "",
    enquiry.message ?? "",
  ];
  window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(
    `Tour enquiry from ${enquiry.name}`,
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
  return "mailto";
}
