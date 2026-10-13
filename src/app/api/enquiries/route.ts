import type { NextRequest } from "next/server";
import { sendEnquiryEmail } from "@/lib/server/email";
import { clientIp, isSameOrigin, rateLimiter, VISITOR_COOKIE } from "@/lib/server/request";
import { createEnquiry, markEnquiryEmailed } from "@/lib/server/store";

const allow = rateLimiter(5, 10 * 60_000);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value: unknown, max = 400) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Saves a tour enquiry from the contact form and emails the company inbox. */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return Response.json({ error: "Forbidden" }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Hidden field humans never fill; pretend success so bots don't retry.
  if (text(body.website)) return Response.json({ ok: true });

  const name = text(body.name);
  const email = text(body.email);
  if (!name || !EMAIL.test(email)) {
    return Response.json({ error: "One or more fields have an error. Please check and try again." }, { status: 422 });
  }
  if (!allow(clientIp(request))) {
    return Response.json({ error: "Too many enquiries from this connection. Please try again later." }, { status: 429 });
  }

  try {
    const enquiry = createEnquiry({
      name,
      email,
      telephone: text(body.telephone),
      country: text(body.country),
      arrival: text(body.arrival, 40),
      departure: text(body.departure, 40),
      adults: text(body.adults, 40),
      children: text(body.children, 200),
      hotel: text(body.hotel, 60),
      message: text(body.message, 2000),
      page: text(body.page, 300),
      visitorId: request.cookies.get(VISITOR_COOKIE)?.value ?? null,
    });
    const adminUrl = new URL(`/admin/enquiries/${enquiry.id}`, process.env.SITE_URL ?? request.nextUrl.origin).toString();
    if (await sendEnquiryEmail(enquiry, adminUrl)) markEnquiryEmailed(enquiry.id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to save enquiry:", error);
    return Response.json({ error: "Your enquiry could not be sent. Please try again or email us." }, { status: 500 });
  }
}
