import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, hasSession } from "@/lib/admin-auth";
import { getStats, type Breakdown } from "@/lib/analytics";
import { getSkin, setSkin, SKIN_TAG } from "@/lib/settings";
import { isSkin, skinMeta, skins, type Skin } from "@/lib/skins";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

async function signOut() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

async function chooseSkin(formData: FormData) {
  "use server";
  // The session check has to be repeated here. A server action is a POST
  // endpoint of its own — reaching it does not require having rendered the
  // page that contains the form.
  if (!(await hasSession())) redirect("/admin/login");

  const next = formData.get("skin");
  if (!isSkin(next)) return;

  await setSkin(next);
  // The setting is read through a cache tagged SKIN_TAG, so expiring the tag
  // is what makes the switch visible. updateTag rather than revalidateTag:
  // inside a server action it expires immediately and gives this very render
  // the value we just wrote, instead of a stale read with a background
  // refresh. revalidatePath then drops the cached HTML of the public pages,
  // which had the old skin baked into their markup.
  updateTag(SKIN_TAG);
  revalidatePath("/", "layout");
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

  const [stats, skin] = await Promise.all([getStats(days), getSkin()]);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="hud text-brass">borwonpak.com</p>
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
                  ? "border-brass text-brass"
                  : "border-line text-muted hover:border-brass hover:text-brass"
              }`}
            >
              {r} วัน
            </a>
          ))}
          <form action={signOut}>
            <button
              type="submit"
              className="hud border border-line px-3 py-1.5 text-muted transition hover:border-brass hover:text-brass"
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
            <Table title="ดีไซน์ที่เห็น" rows={stats.skins} />
          </div>
        </>
      )}

      <SkinPicker current={skin} configured={stats !== null} />

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

/**
 * Theme switcher for the public site. One form per skin rather than a select
 * plus a save button — there are three of them, and a single click that takes
 * effect immediately is less to get wrong than a two-step form.
 */
function SkinPicker({
  current,
  configured,
}: {
  current: Skin;
  configured: boolean;
}) {
  return (
    <section className="mt-16 border-t border-line pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">ดีไซน์ของเว็บหลัก</h2>
        <a
          href={site.url}
          target="_blank"
          rel="noreferrer noopener"
          className="hud text-muted transition hover:text-brass"
        >
          เปิดดูเว็บจริง ↗
        </a>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        เลือกแล้วมีผลทันที โครงหน้าเหมือนเดิมทุกอัน เปลี่ยนแค่สี ฮีโร่
        และหัวข้อแต่ละส่วน — ส่วนสว่าง/มืด ผู้เข้าชมยังสลับได้เองเหมือนเดิม
      </p>

      {!configured && (
        <p className="mt-4 border border-dashed border-line p-4 text-sm leading-relaxed text-muted">
          ยังไม่ได้ตั้ง <code className="text-ink">DATABASE_URL</code> —
          ตอนนี้เว็บจะใช้ดีไซน์เริ่มต้นไปก่อน และกดเลือกที่นี่จะยังไม่บันทึก
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {skins.map((option) => {
          const meta = skinMeta[option];
          const live = option === current;
          const [ground, ink, accent] = meta.swatch;

          return (
            <form key={option} action={chooseSkin}>
              <input type="hidden" name="skin" value={option} />
              <button
                type="submit"
                disabled={live || !configured}
                aria-current={live ? "true" : undefined}
                className={`flex w-full flex-col text-left transition ${
                  live
                    ? "border-2 border-brass"
                    : "border border-line enabled:hover:border-brass disabled:opacity-50"
                }`}
              >
                {/* A miniature of the skin, drawn from its own palette: ground,
                    a wordmark bar in ink, a rule and dots in the accent. */}
                <span
                  aria-hidden
                  className="flex h-24 w-full flex-col justify-end gap-1.5 p-3"
                  style={{ background: ground }}
                >
                  <span
                    className="block h-3 w-3/4 rounded-sm"
                    style={{ background: ink }}
                  />
                  <span className="block h-1 w-full" style={{ background: accent }} />
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="block h-1.5 w-1.5 rounded-full"
                        style={{ background: accent }}
                      />
                    ))}
                  </span>
                </span>

                <span className="flex w-full flex-col gap-1 p-3">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-sm font-semibold">
                      {meta.name.th}
                    </span>
                    <span className="hud text-brass">
                      {live ? "ใช้อยู่" : "เลือก"}
                    </span>
                  </span>
                  <span className="text-xs leading-relaxed text-muted">
                    {meta.note.th}
                  </span>
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-panel p-5">
      <p className="hud text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-brass">
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
              className="bg-brass/30 transition group-hover:bg-brass"
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
                className="absolute inset-y-0 left-0 bg-abalone/15"
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
