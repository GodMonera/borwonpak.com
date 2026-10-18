import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPassword,
  clearFailures,
  createSession,
  hasSession,
  isAdminConfigured,
  isLockedOut,
  recordFailure,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function login(formData: FormData) {
  "use server";

  const ip = await clientIp();
  if (isLockedOut(ip)) redirect("/admin/login?e=locked");

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    recordFailure(ip);
    redirect("/admin/login?e=wrong");
  }

  clearFailures(ip);
  await createSession();
  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  if (await hasSession()) redirect("/admin");

  const { e } = await searchParams;
  const configured = isAdminConfigured();

  const message =
    e === "locked"
      ? "ใส่รหัสผิดหลายครั้งเกินไป รออีก 15 นาทีแล้วลองใหม่"
      : e === "wrong"
        ? "รหัสผ่านไม่ถูกต้อง"
        : null;

  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div className="w-full max-w-sm">
        <p className="hud text-brass">borwonpak.com</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">
          สถิติผู้เข้าชม
        </h1>

        {configured ? (
          <form action={login} className="mt-8 flex flex-col gap-3">
            <label className="hud text-muted" htmlFor="password">
              รหัสผ่าน
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              className="border border-line bg-panel px-3.5 py-2.5 text-sm outline-none focus:border-brass"
            />
            <button
              type="submit"
              className="mt-2 border border-brass bg-brass px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-[#191310] transition hover:bg-transparent hover:text-brass"
            >
              เข้าสู่ระบบ
            </button>
            {message && (
              <p className="mt-2 text-sm text-brass" role="alert">
                {message}
              </p>
            )}
          </form>
        ) : (
          <p className="mt-8 border border-dashed border-line p-5 text-sm leading-relaxed text-muted">
            ยังไม่ได้ตั้งค่า <code className="text-ink">ADMIN_PASSWORD</code> —
            ตั้งใน Vercel → Settings → Environment Variables แล้ว redeploy
          </p>
        )}
      </div>
    </main>
  );
}
