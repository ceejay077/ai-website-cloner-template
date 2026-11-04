export const ENQUIRY_EMAIL = "showlankatours@gmail.com";
/** Everyone the mailto fallback addresses. Netlify Forms notifications are set in the Netlify UI. */
const ENQUIRY_RECIPIENTS = [ENQUIRY_EMAIL, "naveenchamara@gmail.com"];

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

/** Netlify Forms (production): emails the enquiry and keeps it in the Netlify dashboard. */
async function postNetlifyForm(enquiry: Enquiry) {
  const fields: Record<string, string> = { "form-name": "enquiry", subject: `Tour enquiry from ${enquiry.name}` };
  for (const [k, v] of Object.entries(enquiry)) fields[k] = v ?? "";
  // POST to the static skeleton: "/" would hit the Next.js server, not form processing.
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields).toString(),
  });
  return res.ok;
}

/** /api/enquiry: saves it for the admin panel (/admin/enquiries) where a database is available. */
async function postApi(enquiry: Enquiry) {
  const res = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiry),
  });
  return res.ok;
}

/**
 * Sends the enquiry to Netlify Forms and /api/enquiry; if neither accepts it,
 * opens the visitor's mail app with the enquiry instead.
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
