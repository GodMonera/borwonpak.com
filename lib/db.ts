import { Pool } from "pg";

/**
 * Shared Postgres pool for the guestbook and the visitor analytics.
 *
 * If DATABASE_URL is absent the site still builds and every public page works
 * — the features that need storage render a "not configured" notice instead of
 * throwing. That is what lets the site deploy before the database exists.
 */
let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!isDbConfigured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Managed Postgres (Neon, Railway, Supabase) terminates TLS with a cert
      // chain Node doesn't ship. Disable verification unless explicitly opted in.
      ssl:
        process.env.DATABASE_SSL === "off"
          ? undefined
          : { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}

async function ensureSchema() {
  const p = getPool();
  if (!p) return;
  if (!schemaReady) {
    schemaReady = p
      .query(
        `CREATE TABLE IF NOT EXISTS guestbook (
           id         BIGSERIAL PRIMARY KEY,
           name       TEXT        NOT NULL,
           message    TEXT        NOT NULL,
           created_at TIMESTAMPTZ NOT NULL DEFAULT now()
         )`,
      )
      .then(() => undefined)
      .catch((err) => {
        // Let the next call retry rather than caching a failed migration.
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export async function listEntries(limit = 100): Promise<GuestbookEntry[]> {
  const p = getPool();
  if (!p) return [];
  await ensureSchema();
  const { rows } = await p.query<GuestbookEntry>(
    `SELECT id::text, name, message, created_at
       FROM guestbook
   ORDER BY created_at DESC
      LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function addEntry(name: string, message: string) {
  const p = getPool();
  if (!p) throw new Error("DATABASE_URL is not configured");
  await ensureSchema();
  const { rows } = await p.query<GuestbookEntry>(
    `INSERT INTO guestbook (name, message)
          VALUES ($1, $2)
       RETURNING id::text, name, message, created_at`,
    [name, message],
  );
  return rows[0];
}
