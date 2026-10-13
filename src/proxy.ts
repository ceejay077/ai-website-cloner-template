import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/server/session";

/**
 * Keeps the admin panel out of search engines and sends signed-out visitors to
 * the login page. Admin pages and actions still check the session themselves.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const signedIn = Boolean(verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value));

  let response: NextResponse;
  if (!isLogin && !signedIn) response = NextResponse.redirect(new URL("/admin/login", request.url));
  else if (isLogin && signedIn) response = NextResponse.redirect(new URL("/admin", request.url));
  else response = NextResponse.next();

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
