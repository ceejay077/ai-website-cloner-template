// Storage for enquiries and page views. Everything the app persists goes through
// these functions, so moving to another database only means rewriting this file.

import { db } from "./db";
import type { Source } from "./traffic";

export const ENQUIRY_STATUSES = ["new", "read", "replied", "archived"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface EnquiryInput {
  name: string;
  email: string;
  telephone: string;
  country: string;
  arrival: string;
  departure: string;
  adults: string;
  children: string;
  hotel: string;
  message: string;
  page: string;
  visitorId: string | null;
}

export interface Enquiry extends Omit<EnquiryInput, "visitorId"> {
  id: number;
  createdAt: number;
  status: EnquiryStatus;
  source: string;
  referrer: string;
  landingPage: string;
  emailSent: boolean;
}

type Row = Record<string, string | number | null>;

function toEnquiry(row: Row): Enquiry {
  return {
    id: Number(row.id),
    createdAt: Number(row.created_at),
    status: row.status as EnquiryStatus,
    name: String(row.name),
    email: String(row.email),
    telephone: String(row.telephone),
    country: String(row.country),
    arrival: String(row.arrival),
    departure: String(row.departure),
    adults: String(row.adults),
    children: String(row.children),
    hotel: String(row.hotel),
    message: String(row.message),
    page: String(row.page),
    source: String(row.source),
    referrer: String(row.referrer),
    landingPage: String(row.landing_page),
    emailSent: Number(row.email_sent) === 1,
  };
}

/** Saves an enquiry, attributing it to the visitor's first recorded visit. */
export function createEnquiry(input: EnquiryInput): Enquiry {
  const first = input.visitorId
    ? (db()
        .prepare("SELECT source, referrer_host, path FROM pageviews WHERE visitor_id = ? ORDER BY created_at LIMIT 1")
        .get(input.visitorId) as Row | undefined)
    : undefined;
  const result = db()
    .prepare(
      `INSERT INTO enquiries (created_at, name, email, telephone, country, arrival, departure, adults, children,
        hotel, message, page, visitor_id, source, referrer, landing_page)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      Date.now(),
      input.name,
      input.email,
      input.telephone,
      input.country,
      input.arrival,
      input.departure,
      input.adults,
      input.children,
      input.hotel,
      input.message,
      input.page,
      input.visitorId,
      String(first?.source ?? ""),
      String(first?.referrer_host ?? ""),
      String(first?.path ?? ""),
    );
  return getEnquiry(Number(result.lastInsertRowid))!;
}

export function markEnquiryEmailed(id: number): void {
  db().prepare("UPDATE enquiries SET email_sent = 1 WHERE id = ?").run(id);
}

export function getEnquiry(id: number): Enquiry | null {
  const row = db().prepare("SELECT * FROM enquiries WHERE id = ?").get(id) as Row | undefined;
  return row ? toEnquiry(row) : null;
}

export function listEnquiries({ status, query }: { status?: EnquiryStatus | "all"; query?: string } = {}): Enquiry[] {
  const where: string[] = [];
  const params: string[] = [];
  if (status && status !== "all") {
    where.push("status = ?");
    params.push(status);
  } else {
    where.push("status != 'archived'");
  }
  if (query) {
    where.push("(name LIKE ? OR email LIKE ? OR country LIKE ? OR message LIKE ?)");
    const like = `%${query}%`;
    params.push(like, like, like, like);
  }
  const rows = db()
    .prepare(`SELECT * FROM enquiries WHERE ${where.join(" AND ")} ORDER BY created_at DESC LIMIT 500`)
    .all(...params) as Row[];
  return rows.map(toEnquiry);
}

export function countEnquiriesByStatus(): Record<EnquiryStatus, number> {
  const counts = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s, 0])) as Record<EnquiryStatus, number>;
  for (const row of db().prepare("SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status").all() as Row[]) {
    counts[row.status as EnquiryStatus] = Number(row.n);
  }
  return counts;
}

export function setEnquiryStatus(id: number, status: EnquiryStatus): void {
  db().prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, id);
}

export function deleteEnquiry(id: number): void {
  db().prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}

// --- Page views -------------------------------------------------------------

export interface PageviewInput {
  visitorId: string;
  sessionId: string;
  path: string;
  referrerHost: string;
  source: Source;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  country: string;
  device: string;
  browser: string;
  isEntry: boolean;
}

export function recordPageview(hit: PageviewInput): void {
  db()
    .prepare(
      `INSERT INTO pageviews (created_at, visitor_id, session_id, path, referrer_host, source, utm_source,
        utm_medium, utm_campaign, country, device, browser, is_entry)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      Date.now(),
      hit.visitorId,
      hit.sessionId,
      hit.path,
      hit.referrerHost,
      hit.source,
      hit.utmSource,
      hit.utmMedium,
      hit.utmCampaign,
      hit.country,
      hit.device,
      hit.browser,
      hit.isEntry ? 1 : 0,
    );
}

export interface Breakdown {
  label: string;
  visitors: number;
  pageviews: number;
}

export interface DailyPoint {
  day: string;
  visitors: number;
  pageviews: number;
  enquiries: number;
}

export interface TrafficReport {
  visitors: number;
  pageviews: number;
  sessions: number;
  enquiries: number;
  previous: { visitors: number; pageviews: number; sessions: number; enquiries: number };
  daily: DailyPoint[];
  sources: Breakdown[];
  referrers: Breakdown[];
  campaigns: Breakdown[];
  pages: Breakdown[];
  landingPages: Breakdown[];
  countries: Breakdown[];
  devices: Breakdown[];
  browsers: Breakdown[];
}

const DAY_MS = 86_400_000;

function totals(from: number, to: number) {
  const pv = db()
    .prepare(
      `SELECT COUNT(*) AS pageviews, COUNT(DISTINCT visitor_id) AS visitors, COUNT(DISTINCT session_id) AS sessions
       FROM pageviews WHERE created_at >= ? AND created_at < ?`,
    )
    .get(from, to) as Row;
  const enq = db().prepare("SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ? AND created_at < ?").get(from, to) as Row;
  return {
    visitors: Number(pv.visitors),
    pageviews: Number(pv.pageviews),
    sessions: Number(pv.sessions),
    enquiries: Number(enq.n),
  };
}

function breakdown(column: string, from: number, to: number, opts: { entryOnly?: boolean; limit?: number } = {}): Breakdown[] {
  const rows = db()
    .prepare(
      `SELECT ${column} AS label, COUNT(DISTINCT visitor_id) AS visitors, COUNT(*) AS pageviews
       FROM pageviews
       WHERE created_at >= ? AND created_at < ? ${opts.entryOnly ? "AND is_entry = 1" : ""} AND ${column} != ''
       GROUP BY ${column} ORDER BY visitors DESC, pageviews DESC LIMIT ?`,
    )
    .all(from, to, opts.limit ?? 10) as Row[];
  return rows.map((r) => ({ label: String(r.label), visitors: Number(r.visitors), pageviews: Number(r.pageviews) }));
}

/**
 * Dashboard figures for the last `days` days (including today), with the
 * preceding period of the same length for comparison. `tzOffsetMinutes` keeps
 * the daily buckets aligned to the admin's local midnight.
 */
export function trafficReport(days: number, tzOffsetMinutes = 0): TrafficReport {
  const offset = tzOffsetMinutes * 60_000;
  const now = Date.now();
  const todayStart = Math.floor((now - offset) / DAY_MS) * DAY_MS + offset;
  const from = todayStart - (days - 1) * DAY_MS;
  const to = now + 1;

  const dailyRows = db()
    .prepare(
      `SELECT CAST((created_at - ?) / ${DAY_MS} AS INTEGER) AS d, COUNT(DISTINCT visitor_id) AS visitors, COUNT(*) AS pageviews
       FROM pageviews WHERE created_at >= ? AND created_at < ? GROUP BY d`,
    )
    .all(from, from, to) as Row[];
  const enquiryRows = db()
    .prepare(
      `SELECT CAST((created_at - ?) / ${DAY_MS} AS INTEGER) AS d, COUNT(*) AS n
       FROM enquiries WHERE created_at >= ? AND created_at < ? GROUP BY d`,
    )
    .all(from, from, to) as Row[];
  const daily: DailyPoint[] = Array.from({ length: days }, (_, i) => {
    const start = new Date(from + i * DAY_MS - offset);
    const pv = dailyRows.find((r) => Number(r.d) === i);
    const enq = enquiryRows.find((r) => Number(r.d) === i);
    return {
      day: start.toISOString().slice(0, 10),
      visitors: Number(pv?.visitors ?? 0),
      pageviews: Number(pv?.pageviews ?? 0),
      enquiries: Number(enq?.n ?? 0),
    };
  });

  return {
    ...totals(from, to),
    previous: totals(from - days * DAY_MS, from),
    daily,
    sources: breakdown("source", from, to, { entryOnly: true }),
    referrers: breakdown("referrer_host", from, to, { entryOnly: true }),
    campaigns: breakdown("utm_campaign", from, to, { entryOnly: true }),
    pages: breakdown("path", from, to),
    landingPages: breakdown("path", from, to, { entryOnly: true }),
    countries: breakdown("country", from, to),
    devices: breakdown("device", from, to),
    browsers: breakdown("browser", from, to),
  };
}

/** Visitors seen in the last few minutes. */
export function activeVisitors(minutes = 5): number {
  const row = db()
    .prepare("SELECT COUNT(DISTINCT visitor_id) AS n FROM pageviews WHERE created_at >= ?")
    .get(Date.now() - minutes * 60_000) as Row;
  return Number(row.n);
}
