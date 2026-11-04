export const ENQUIRY_EMAIL = "showlankatours@gmail.com";
/** Everyone who gets each enquiry: the Resend team email and the mailto fallback. */
export const ENQUIRY_RECIPIENTS = [ENQUIRY_EMAIL, "naveenchamara@gmail.com"];
const NETLIFY_FORM_NAME = "showlanka-enquiry";

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
const PENDING_PURCHASE_CONVERSION_KEY = "showlanka:pending-purchase-conversion";

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, string>) => void;
  }
}

export function firePendingPurchaseConversion() {
  if (typeof window.gtag !== "function") return;

  try {
    if (window.sessionStorage.getItem(PENDING_PURCHASE_CONVERSION_KEY) !== "1") return;
    window.sessionStorage.removeItem(PENDING_PURCHASE_CONVERSION_KEY);
  } catch (error) {
    console.error("[analytics] Unable to read the pending purchase conversion:", error);
    return;
  }

  window.gtag("event", "conversion", {
    send_to: "AW-16666466013/Mk4wCOG47pkdEN2tmIs-",
    transaction_id: "",
  });
}

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

async function postNetlifyForm(enquiry: Enquiry) {
  const body = new URLSearchParams({ "form-name": NETLIFY_FORM_NAME });
  for (const [key, value] of Object.entries(enquiry)) {
    if (value !== undefined) body.set(key, value);
  }

  const response = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  return response.ok;
}

/**
 * Sends the enquiry to /api/enquiry; if it isn't accepted, opens the visitor's
 * mail app with the enquiry instead.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<"sent" | "mailto"> {
  const results = await Promise.allSettled([postNetlifyForm(enquiry), postApi(enquiry)]);
  if (results.some((r) => r.status === "fulfilled" && r.value)) {
    window.gtag?.("event", "ads_conversion_Form_1");
    try {
      window.sessionStorage.setItem(PENDING_PURCHASE_CONVERSION_KEY, "1");
    } catch (error) {
      console.error("[analytics] Unable to mark the pending purchase conversion:", error);
    }
    return "sent";
  }

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
