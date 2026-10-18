import { unstable_cache } from "next/cache";
import { getPool, isDbConfigured } from "@/lib/db";
import { defaultSkin, isSkin, type Skin } from "@/lib/skins";

export const SKIN_TAG = "site-skin";

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  const pool = getPool();
  if (!pool) return;
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS site_setting (
           key   TEXT PRIMARY KEY,
           value TEXT NOT NULL
         )`,
      )
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

async function readSkin(): Promise<Skin> {
  if (!isDbConfigured()) return defaultSkin;
  const pool = getPool();
  if (!pool) return defaultSkin;
  try {
    await ensureSchema();
    const { rows } = await pool.query<{ value: string }>(
      `SELECT value FROM site_setting WHERE key = 'skin'`,
    );
    const value = rows[0]?.value;
    return isSkin(value) ? value : defaultSkin;
  } catch (err) {
    // A database hiccup must never take the public site down — fall back to
    // the default look rather than throwing inside the root layout.
    console.error("[settings] could not read skin", err);
    return defaultSkin;
  }
}

/**
 * Cached so the public pages stay static between changes; the admin calls
 * revalidateTag(SKIN_TAG) on save, which makes the switch take effect at once.
 */
export const getSkin = unstable_cache(readSkin, ["site-skin"], {
  tags: [SKIN_TAG],
});

export async function setSkin(skin: Skin) {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not configured");
  await ensureSchema();
  await pool.query(
    `INSERT INTO site_setting (key, value)
          VALUES ('skin', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [skin],
  );
}
