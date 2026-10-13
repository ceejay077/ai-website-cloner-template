// SQLite connection for enquiries and visit logs (Node's built-in driver, so
// there is no native dependency to install). Only `store.ts` should import this:
// swapping storage engines, e.g. to Postgres on Vercel, means rewriting that file.

import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  arrival TEXT NOT NULL DEFAULT '',
  departure TEXT NOT NULL DEFAULT '',
  adults TEXT NOT NULL DEFAULT '',
  children TEXT NOT NULL DEFAULT '',
  hotel TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL DEFAULT '',
  visitor_id TEXT,
  source TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  landing_page TEXT NOT NULL DEFAULT '',
  email_sent INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS enquiries_created ON enquiries (created_at);

CREATE TABLE IF NOT EXISTS pageviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer_host TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL,
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  device TEXT NOT NULL DEFAULT '',
  browser TEXT NOT NULL DEFAULT '',
  is_entry INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS pageviews_created ON pageviews (created_at);
CREATE INDEX IF NOT EXISTS pageviews_visitor ON pageviews (visitor_id, created_at);
`;

// One connection per server process, kept across dev hot reloads.
const globalForDb = globalThis as typeof globalThis & { slDb?: DatabaseSync };

export function db(): DatabaseSync {
  if (!globalForDb.slDb) {
    mkdirSync(DATA_DIR, { recursive: true });
    const conn = new DatabaseSync(path.join(DATA_DIR, "showlanka.db"));
    conn.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
    conn.exec(SCHEMA);
    globalForDb.slDb = conn;
  }
  return globalForDb.slDb;
}
