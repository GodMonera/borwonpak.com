import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import {
  deviceClass,
  recordPageview,
  referrerHost,
  visitorHash,
} from "@/lib/analytics";
import { site } from "@/content/site";
import { getSkin } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Per-instance flood brake. Analytics is fire-and-forget, so a caller that
 * floods this endpoint should be dropped silently rather than told about it.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 2000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  // Always answer 204: a tracking endpoint should never leak whether storage
  // exists, and the page must not care either way.
  const ok = new NextResponse(null, { status: 204 });

  if (!isDbConfigured()) return ok;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent") ?? "";

  if (rateLimited(ip)) return ok;

  // Honour the browser's Do Not Track signal even though it is advisory.
  if (req.headers.get("dnt") === "1") return ok;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return ok;
  }

  const { path, locale, referrer } = (body ?? {}) as {
    path?: unknown;
    locale?: unknown;
    referrer?: unknown;
  };

  if (typeof path !== "string" || !path.startsWith("/")) return ok;

  try {
    await recordPageview({
      path,
      locale: typeof locale === "string" ? locale : null,
      referrer: referrerHost(
        typeof referrer === "string" && referrer ? referrer : null,
        site.domain,
      ),
      country: req.headers.get("x-vercel-ip-country"),
      device: deviceClass(userAgent),
      visitor: visitorHash(ip, userAgent),
      // Read server-side rather than trusting the beacon: the client could
      // report any string, and the answer is a cached database read anyway.
      skin: await getSkin(),
    });
  } catch (err) {
    // A failed insert must never surface to the visitor.
    console.error("[collect] insert failed", err);
  }

  return ok;
}
