import { createHash } from "node:crypto";
import { getPool, isDbConfigured } from "@/lib/db";

/**
 * Privacy model
 * -------------
 * No raw IP address is ever stored. A visitor is identified by
 *
 *     sha256(UTC date + server salt + ip + user agent)
 *
 * truncated to 16 hex chars. The date is part of the input, so the same person
 * hashes to a different id tomorrow: within a day we can count unique visitors,
 * across days nobody can be followed. The salt means the hash cannot be
 * reversed by trying every IPv4 address.
 *
 * No cookie is involved, so this needs no consent banner under PDPA or GDPR.
 */

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  const pool = getPool();
  if (!pool) return;
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS pageview (
           id          BIGSERIAL   PRIMARY KEY,
           seen_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
           path        TEXT        NOT NULL,
           locale      TEXT,
           referrer    TEXT,
           country     TEXT,
           device      TEXT,
           visitor     TEXT        NOT NULL
         );
         CREATE INDEX IF NOT EXISTS pageview_seen_at_idx ON pageview (seen_at DESC);
         CREATE INDEX IF NOT EXISTS pageview_visitor_idx ON pageview (visitor);`,
      )
      .then(() => undefined)
      .catch((err) => {
        // Clear the cache so the next request retries rather than being stuck
        // behind a migration that failed once.
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

export function visitorHash(ip: string, userAgent: string) {
  const salt = process.env.ANALYTICS_SALT ?? "borwonpak-dev-salt";
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${day}|${salt}|${ip}|${userAgent}`)
    .digest("hex")
    .slice(0, 16);
}

/** Coarse device class — enough to answer "is anyone reading this on a phone". */
export function deviceClass(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/mobi|android|iphone|ipod/.test(ua)) return "mobile";
  return "desktop";
}

/**
 * Keep only the host of the referrer. A full URL can carry a search query or a
 * session token in the path, which is exactly the kind of thing we do not want
 * sitting in the database.
 */
export function referrerHost(referrer: string | null, selfHost: string) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (!host || host === selfHost.replace(/^www\./, "")) return null;
    return host.slice(0, 120);
  } catch {
    return null;
  }
}

export type PageviewInput = {
  path: string;
  locale: string | null;
  referrer: string | null;
  country: string | null;
  device: string;
  visitor: string;
};

export async function recordPageview(input: PageviewInput) {
  const pool = getPool();
  if (!pool) return;
  await ensureSchema();
  await pool.query(
    `INSERT INTO pageview (path, locale, referrer, country, device, visitor)
          VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      input.path.slice(0, 300),
      input.locale?.slice(0, 8) ?? null,
      input.referrer,
      input.country?.slice(0, 8) ?? null,
      input.device,
      input.visitor,
    ],
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard queries                                                   */
/* ------------------------------------------------------------------ */

export type Totals = { views: number; visitors: number; days: number };
export type Daily = { day: string; views: number; visitors: number };
export type Breakdown = { label: string; views: number };

export type Stats = {
  totals: Totals;
  daily: Daily[];
  pages: Breakdown[];
  referrers: Breakdown[];
  countries: Breakdown[];
  devices: Breakdown[];
  locales: Breakdown[];
};

const EMPTY: Stats = {
  totals: { views: 0, visitors: 0, days: 0 },
  daily: [],
  pages: [],
  referrers: [],
  countries: [],
  devices: [],
  locales: [],
};

export async function getStats(days = 30): Promise<Stats | null> {
  if (!isDbConfigured()) return null;
  const pool = getPool();
  if (!pool) return null;
  await ensureSchema();

  const since = `now() - ($1::int * interval '1 day')`;

  async function breakdown(column: string): Promise<Breakdown[]> {
    const { rows } = await pool!.query<{ label: string; views: string }>(
      `SELECT COALESCE(${column}, '—') AS label, count(*)::text AS views
         FROM pageview
        WHERE seen_at > ${since}
     GROUP BY 1
     ORDER BY count(*) DESC
        LIMIT 12`,
      [days],
    );
    return rows.map((r) => ({ label: r.label, views: Number(r.views) }));
  }

  const [totalsRes, dailyRes, pages, referrers, countries, devices, locales] =
    await Promise.all([
      pool.query<{ views: string; visitors: string; days: string }>(
        `SELECT count(*)::text                   AS views,
                count(DISTINCT visitor)::text    AS visitors,
                count(DISTINCT date(seen_at))::text AS days
           FROM pageview
          WHERE seen_at > ${since}`,
        [days],
      ),
      pool.query<{ day: string; views: string; visitors: string }>(
        `SELECT to_char(date(seen_at), 'YYYY-MM-DD') AS day,
                count(*)::text                        AS views,
                count(DISTINCT visitor)::text         AS visitors
           FROM pageview
          WHERE seen_at > ${since}
       GROUP BY 1
       ORDER BY 1`,
        [days],
      ),
      breakdown("path"),
      breakdown("referrer"),
      breakdown("country"),
      breakdown("device"),
      breakdown("locale"),
    ]);

  const t = totalsRes.rows[0];

  return {
    totals: {
      views: Number(t?.views ?? 0),
      visitors: Number(t?.visitors ?? 0),
      days: Number(t?.days ?? 0),
    },
    daily: dailyRes.rows.map((r) => ({
      day: r.day,
      views: Number(r.views),
      visitors: Number(r.visitors),
    })),
    pages,
    referrers,
    countries,
    devices,
    locales,
  };
}

export { EMPTY as EMPTY_STATS };
