// Signed admin session token. Kept free of `next/headers` so the proxy can
// verify it too.

import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "sl_admin";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must be set (32+ characters).");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Token format: base64url(email).expiresAtMs.signature */
export function createSessionToken(email: string, now = Date.now()): string {
  const payload = `${Buffer.from(email).toString("base64url")}.${now + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the admin email if the token is authentic and unexpired. */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token || (process.env.ADMIN_SESSION_SECRET ?? "").length < 32) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [user, expires, signature] = parts;
  const expected = Buffer.from(sign(`${user}.${expires}`));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (!(Number(expires) > Date.now())) return null;
  const email = Buffer.from(user, "base64url").toString();
  return email === process.env.ADMIN_EMAIL?.toLowerCase() ? email : null;
}
