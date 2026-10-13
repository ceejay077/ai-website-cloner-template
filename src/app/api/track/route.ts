import { NextResponse, type NextRequest } from "next/server";
import { clientIp, isSameOrigin, newId, rateLimiter, SESSION_COOKIE, SESSION_TTL_S, VISITOR_COOKIE, VISITOR_TTL_S } from "@/lib/server/request";
import { recordPageview } from "@/lib/server/store";
import { browserOf, classifySource, countryOf, deviceOf, isBot, referrerHost } from "@/lib/server/traffic";

const allow = rateLimiter(120, 60_000);
const text = (value: unknown, max = 300) => (typeof value === "string" ? value.slice(0, max) : "");

/** Records one page view sent by the site's analytics beacon. */
export async function POST(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!isSameOrigin(request) || isBot(ua) || !allow(clientIp(request))) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const path = text(body.path);
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }

  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value || newId();
  const existingSession = request.cookies.get(SESSION_COOKIE)?.value;
  const sessionId = existingSession || newId();
  const isEntry = !existingSession;

  // Source is only meaningful for the first page of a visit; later pages are internal clicks.
  const host = isEntry ? referrerHost(text(body.referrer, 2000)) : "";
  const ownHost = (request.headers.get("host") ?? "").split(":")[0];
  const utmSource = isEntry ? text(body.utmSource, 100) : "";
  const utmMedium = isEntry ? text(body.utmMedium, 100) : "";
  const utmCampaign = isEntry ? text(body.utmCampaign, 100) : "";

  try {
    recordPageview({
      visitorId,
      sessionId,
      path,
      referrerHost: host === ownHost.replace(/^www\./, "") ? "" : host,
      source: isEntry ? classifySource({ host, ownHost, utmSource, utmMedium }) : "Direct",
      utmSource,
      utmMedium,
      utmCampaign,
      country: countryOf(request.headers),
      device: deviceOf(ua, Number(body.screenWidth) || 0),
      browser: browserOf(ua),
      isEntry,
    });
  } catch (error) {
    console.error("Failed to record page view:", error);
  }

  const response = new NextResponse(null, { status: 204 });
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(VISITOR_COOKIE, visitorId, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: VISITOR_TTL_S });
  response.cookies.set(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: SESSION_TTL_S });
  return response;
}
