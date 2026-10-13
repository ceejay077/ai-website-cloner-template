// Turns a raw hit (referrer, UTM tags, user agent) into the dimensions the
// admin dashboard reports on.

export const SOURCES = ["Direct", "Organic search", "Social", "Referral", "Email", "Paid", "Campaign"] as const;
export type Source = (typeof SOURCES)[number];

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|naver|seznam|qwant|startpage|brave)\./;
const SOCIAL =
  /(^|\.)(facebook|fb|instagram|t\.co|twitter|x|linkedin|lnkd|pinterest|reddit|tiktok|youtube|youtu|whatsapp|wa|messenger|vk|quora|tripadvisor)\./;
const EMAIL = /(^|\.)(mail\.google|outlook\.live|mail\.yahoo|mail\.)/;

export function referrerHost(referrer: string): string {
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function classifySource({
  host,
  ownHost,
  utmSource,
  utmMedium,
}: {
  host: string;
  ownHost: string;
  utmSource: string;
  utmMedium: string;
}): Source {
  const medium = utmMedium.toLowerCase();
  if (medium) {
    if (/^(cpc|ppc|paid|paidsearch|display|cpm)/.test(medium)) return "Paid";
    if (/e-?mail|newsletter/.test(medium)) return "Email";
    if (/social/.test(medium)) return "Social";
    if (/organic/.test(medium)) return "Organic search";
    return "Campaign";
  }
  if (utmSource) return "Campaign";
  if (!host || host === ownHost.replace(/^www\./, "")) return "Direct";
  const dotted = `${host}.`;
  if (EMAIL.test(dotted)) return "Email";
  if (SEARCH.test(dotted)) return "Organic search";
  if (SOCIAL.test(dotted)) return "Social";
  return "Referral";
}

const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pingdom|uptime|curl|wget|python|axios|node-fetch|go-http/i;

export function isBot(ua: string): boolean {
  return !ua || BOT.test(ua);
}

export function deviceOf(ua: string, screenWidth: number): string {
  if (/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "Tablet";
  if (/Mobi|iPhone|Android/i.test(ua)) return "Mobile";
  if (screenWidth > 0 && screenWidth < 768) return "Mobile";
  return "Desktop";
}

export function browserOf(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\/|CriOS/.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
}

/** Country from the CDN header in front of the app, if there is one. */
export function countryOf(headers: Headers): string {
  const code = (headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry") ?? "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === "XX") return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
