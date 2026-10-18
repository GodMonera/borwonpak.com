import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "bwp_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function signingKey() {
  // Derived from the password so there is only one secret to set. Changing the
  // password therefore also invalidates every existing session, which is the
  // behaviour you want from a password change.
  return createHash("sha256")
    .update(`${process.env.ADMIN_PASSWORD ?? ""}|session`)
    .digest();
}

function sign(value: string) {
  return createHmac("sha256", signingKey()).update(value).digest("hex");
}

/** Constant-time compare that tolerates differing lengths. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Hash both sides first so the comparison length never leaks the real length.
  const h = (v: string) => createHash("sha256").update(v).digest("hex");
  return safeEqual(h(candidate), h(expected));
}

export async function createSession() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const token = `${expires}.${sign(String(expires))}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function hasSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;

  const [expires, mac] = token.split(".");
  if (!expires || !mac) return false;
  if (!safeEqual(mac, sign(expires))) return false;
  return Number(expires) > Date.now();
}

/* ------------------------------------------------------------------ */
/* Lockout                                                             */
/* ------------------------------------------------------------------ */

const attempts = new Map<string, number[]>();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 10;

/** True when this address has burned its attempts and must wait it out. */
export function isLockedOut(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(ip, recent);
  return recent.length >= MAX_ATTEMPTS;
}

export function recordFailure(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
}

export function clearFailures(ip: string) {
  attempts.delete(ip);
}
