// Enquiry notification email, sent through Resend's HTTP API.
// Without RESEND_API_KEY the enquiry is still saved; only the email is skipped.

import type { Enquiry } from "./store";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendEnquiryEmail(enquiry: Enquiry, adminUrl: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_EMAIL_TO;
  const from = process.env.ENQUIRY_EMAIL_FROM;
  if (!apiKey || !to || !from) {
    console.warn("Enquiry email skipped: set RESEND_API_KEY, ENQUIRY_EMAIL_TO and ENQUIRY_EMAIL_FROM.");
    return false;
  }

  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Telephone", enquiry.telephone],
    ["Country", enquiry.country],
    ["Arrival date", enquiry.arrival],
    ["Departure date", enquiry.departure],
    ["Adults", enquiry.adults],
    ["Children", enquiry.children],
    ["Hotel category", enquiry.hotel],
    ["Traffic source", [enquiry.source, enquiry.referrer].filter(Boolean).join(" · ")],
  ];
  const filled = rows.filter(([, v]) => v);
  const text = [...filled.map(([k, v]) => `${k}: ${v}`), "", enquiry.message, "", `View in admin: ${adminUrl}`].join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font:14px Arial,sans-serif">${filled
    .map(([k, v]) => `<tr><td style="color:#666">${escape(k)}</td><td><strong>${escape(v)}</strong></td></tr>`)
    .join("")}</table><p style="font:14px Arial,sans-serif;white-space:pre-wrap">${escape(enquiry.message)}</p><p style="font:14px Arial,sans-serif"><a href="${escape(adminUrl)}">View in admin</a></p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: enquiry.email,
        subject: `Tour inquiry from ${enquiry.name}`,
        text,
        html,
      }),
    });
    if (!res.ok) console.error(`Enquiry email failed: ${res.status} ${await res.text()}`);
    return res.ok;
  } catch (error) {
    console.error("Enquiry email failed:", error);
    return false;
  }
}
