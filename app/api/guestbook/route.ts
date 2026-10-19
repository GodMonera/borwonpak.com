import { NextResponse } from "next/server";
import { addEntry, isDbConfigured, listEntries } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NAME_MAX = 60;
const MESSAGE_MAX = 500;

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 3;

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Checking and recording are separate on purpose.
 *
 * Counting every request that arrives means a visitor who submits the form
 * with an empty field twice has burned two thirds of their quota before
 * posting anything, and is locked out for ten minutes over two typos. Only
 * a message that actually reached the database should cost them a slot.
 */
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length >= MAX_PER_WINDOW;
}

function recordPost(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
}

/** Strip control characters (newlines kept) and collapse runaway blank lines. */
function clean(value: string, max: number) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ configured: false, entries: [] });
  }
  try {
    const entries = await listEntries();
    return NextResponse.json({ configured: true, entries });
  } catch (err) {
    console.error("[guestbook] list failed", err);
    return NextResponse.json(
      { configured: true, entries: [], error: "unavailable" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const {
    name: rawName,
    message: rawMessage,
    website,
  } = (body ?? {}) as {
    name?: unknown;
    message?: unknown;
    website?: unknown;
  };

  // Honeypot: a real person never fills in a field that is hidden from them.
  // Answered as if it worked, and charged for the attempt — unlike a typo,
  // this one really is something worth slowing down.
  if (typeof website === "string" && website.length > 0) {
    recordPost(ip);
    return NextResponse.json({ ok: true, entry: null });
  }

  if (typeof rawName !== "string" || typeof rawMessage !== "string") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const name = clean(rawName, NAME_MAX);
  const message = clean(rawMessage, MESSAGE_MAX);

  if (!name || !message) {
    return NextResponse.json({ error: "required" }, { status: 400 });
  }

  try {
    const entry = await addEntry(name, message);
    recordPost(ip);
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    console.error("[guestbook] insert failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }
}
