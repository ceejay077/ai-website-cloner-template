/** Time zone the admin panel reports in (Sri Lanka unless ADMIN_TIMEZONE says otherwise). */
export const ADMIN_TIMEZONE = process.env.ADMIN_TIMEZONE || "Asia/Colombo";

/** Offset of ADMIN_TIMEZONE from UTC in Date#getTimezoneOffset form (minutes, west positive). */
export function adminTzOffset(at = new Date()): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ADMIN_TIMEZONE,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
      .formatToParts(at)
      .map((p) => [p.type, Number(p.value)]),
  );
  const local = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  return Math.round((at.getTime() - at.getUTCSeconds() * 1000 - at.getUTCMilliseconds() - local) / 60_000);
}

export function formatDate(ms: number, withYear = false): string {
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ADMIN_TIMEZONE,
  });
}
