// Admin sign-in for the single account configured in env vars. The password is
// stored only as a scrypt hash (ADMIN_PASSWORD_HASH, made by scripts/hash-admin-password.mjs).

import { scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_MS, verifySessionToken } from "./session";

/** Hash format: scrypt:<salt base64url>:<key base64url> (no "$", which .env files expand). */
function passwordMatches(password: string, stored: string): boolean {
  const [scheme, salt, key] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !key) return false;
  const expected = Buffer.from(key, "base64url");
  const actual = scryptSync(password, Buffer.from(salt, "base64url"), expected.length);
  return timingSafeEqual(expected, actual);
}

export function checkCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !hash) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set.");
  // Always run the hash so a wrong email takes as long as a wrong password.
  const passwordOk = passwordMatches(password, hash);
  return passwordOk && email.trim().toLowerCase() === adminEmail;
}

export async function startSession(email: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(email.trim().toLowerCase()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** For admin pages and actions: the signed-in admin's email, or a redirect to login. */
export async function requireAdmin(): Promise<string> {
  const email = verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!email) redirect("/admin/login");
  return email;
}

// Failed sign-ins per client, to slow down password guessing.
const failures = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export function isLockedOut(client: string): boolean {
  const entry = failures.get(client);
  if (!entry) return false;
  if (Date.now() - entry.first > WINDOW_MS) {
    failures.delete(client);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function noteFailure(client: string): void {
  const entry = failures.get(client);
  if (!entry || Date.now() - entry.first > WINDOW_MS) failures.set(client, { count: 1, first: Date.now() });
  else entry.count += 1;
}

export function clearFailures(client: string): void {
  failures.delete(client);
}
