import { redirect } from "next/navigation";
import { destroySession, hasSession } from "@/lib/admin-auth";
import { getStats, type Breakdown } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

async function signOut() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  if (!(await hasSession())) redirect("/admin/login");

  const { d } = await searchParams;
  const parsed = Number(d);
  const days = RANGES.includes(parsed as (typeof RANGES)[number]) ? parsed : 30;

  const stats = await getStats(days);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="hud text-marigold">borwonpak.com</p>
          <h1 className="mt-2 font-display text-2xl font-semibold">
            สถิติผู้เข้าชม
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <a
              key={r}
              href={`/admin?d=${r}`}
              className={`hud border px-3 py-1.5 transition ${
                r === days
                  ? "border-marigold text-marigold"
                  : "border-line text-muted hover:border-marigold hover:text-marigold"
              }`}
            >
              {r} วัน
            </a>
          ))}
          <form action={signOut}>
            <button
              type="submit"
              className="hud border border-line px-3 py-1.5 text-muted transition hover:border-marigold hover:text-marigold"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>
      </header>

      {stats === null ? (
        <p className="mt-10 border border-dashed border-line p-5 text-sm leading-relaxed text-muted">
          ยังไม่ได้ตั้งค่า <code className="text-ink">DATABASE_URL</code> —
          ตั้งใน Vercel → Settings → Environment Variables แล้ว redeploy
          แล้วตารางจะถูกสร้างเองตอนมีคนเข้าเว็บครั้งแรก
        </p>
      ) : stats.totals.views === 0 ? (
        <p className="mt-10 border border-dashed border-line p-5 text-sm leading-relaxed text-muted">
          ยังไม่มีข้อมูลในช่วง {days} วันที่ผ่านมา
          ถ้าเพิ่งตั้งค่าเสร็จ ลองเปิด borwonpak.com สักหน้าแล้วกลับมาดูใหม่
          (หน้าที่เปิดจาก localhost จะไม่ถูกนับ)
        </p>
      ) : (
        <>
          <section className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
            <Stat label="เปิดดูทั้งหมด" value={stats.totals.views} />
            <Stat label="ผู้ชม (นับแยกรายวัน)" value={stats.totals.visitors} />
            <Stat label="วันที่มีคนเข้า" value={stats.totals.days} />
          </section>

          <Chart daily={stats.daily} />

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <Table title="หน้าที่เปิดมากสุด" rows={stats.pages} />
            <Table title="มาจากที่ไหน" rows={stats.referrers} />
            <Table title="ประเทศ" rows={stats.countries} />
            <Table title="อุปกรณ์" rows={stats.devices} />
            <Table title="ภาษา" rows={stats.locales} />
          </div>
        </>
      )}

      <footer className="mt-16 border-t border-line pt-5">
        <p className="text-xs leading-relaxed text-muted">
          ไม่เก็บ IP ดิบและไม่ใช้ cookie ติดตาม — ผู้ชมถูกระบุด้วย hash
          ที่ผสมวันที่ จึงนับยอดผู้ชมรายวันได้ แต่ตามรอยข้ามวันไม่ได้
          และระบบเคารพสัญญาณ Do Not Track ของเบราว์เซอร์
        </p>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-panel p-5">
      <p className="hud text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-marigold">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function Chart({
  daily,
}: {
  daily: { day: string; views: number; visitors: number }[];
}) {
  if (daily.length === 0) return null;
  const peak = Math.max(...daily.map((d) => d.views), 1);

  return (
    <section className="mt-10">
      <h2 className="hud border-b border-line pb-2 text-ink">รายวัน</h2>
      <div className="mt-4 flex h-40 items-end justify-start gap-1 overflow-x-auto">
        {daily.map((d) => (
          <div
            key={d.day}
            // h-full matters: the bar's percentage height resolves against
            // this column, and a column of auto height makes it compute to 0.
            // Capped so a single day reads as one bar, not a wall of colour.
            className="group relative flex h-full min-w-[8px] max-w-[34px] flex-1 flex-col justify-end"
            title={`${d.day} · ${d.views} ครั้ง · ${d.visitors} คน`}
          >
            <div
              className="bg-marigold/30 transition group-hover:bg-marigold"
              style={{ height: `${(d.views / peak) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        <span className="hud text-muted">{daily[0]?.day}</span>
        <span className="hud text-muted">{daily[daily.length - 1]?.day}</span>
      </div>
    </section>
  );
}

function Table({ title, rows }: { title: string; rows: Breakdown[] }) {
  const peak = Math.max(...rows.map((r) => r.views), 1);
  return (
    <section>
      <h2 className="hud border-b border-line pb-2 text-ink">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">—</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.label} className="relative">
              {/* The bar is a background layer so long labels stay readable. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-teal/15"
                style={{ width: `${(r.views / peak) * 100}%` }}
              />
              <span className="relative flex items-baseline justify-between gap-3 px-2 py-1.5 text-sm">
                <span className="truncate">{r.label}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
                  {r.views.toLocaleString()}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
