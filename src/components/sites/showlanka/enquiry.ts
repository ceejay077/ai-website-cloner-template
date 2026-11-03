export const ENQUIRY_EMAIL = "showlankatours@gmail.com";
/** Everyone who gets each enquiry: the Resend team email and the mailto fallback. */
export const ENQUIRY_RECIPIENTS = [ENQUIRY_EMAIL, "naveenchamara@gmail.com"];

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
 * /api/enquiry: emails the team and the visitor via Resend, and saves it for the
 * admin panel (/admin/enquiries) where a database is available.
 */
async function postApi(enquiry: Enquiry) {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Sends the enquiry to /api/enquiry; if it isn't accepted, opens the visitor's
 * mail app with the enquiry instead.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<"sent" | "mailto"> {
  if (await postApi(enquiry)) return "sent";

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
  window.location.href = `mailto:${ENQUIRY_RECIPIENTS.join(",")}?subject=${encodeURIComponent(
    `Tour enquiry from ${enquiry.name}`,
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
  return "mailto";
}
