import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

export const VISITOR_COOKIE = "sl_vid";
export const SESSION_COOKIE = "sl_sid";
export const VISITOR_TTL_S = 365 * 24 * 60 * 60;
export const SESSION_TTL_S = 30 * 60;

export function clientIp(request: NextRequest | Headers): string {
  const headers = request instanceof Headers ? request : request.headers;
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "local";
}

/** Rejects cross-site posts so other sites can't fill the database. */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/** Anonymous random id for counting unique visitors (no personal data). */
export function newId(): string {
  return randomUUID();
}

/** Simple fixed-window limiter per key, held in process memory. */
export function rateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; start: number }>();
  return (key: string): boolean => {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      if (hits.size > 10_000) hits.clear();
      hits.set(key, { count: 1, start: now });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}
