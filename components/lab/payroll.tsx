"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * A simplified stand-in for the kind of payroll rules IQ Tutor encodes.
 * The rates here are illustrative round numbers, not any real institute's,
 * but the shape of the problem — tiers, overrides, and a rule that must win
 * over the others — is exactly the shape of the real thing.
 */
const BASE_INDIVIDUAL = 300;
const GROUP_TIERS = [
  { upTo: 2, perHour: 350 },
  { upTo: 4, perHour: 450 },
  { upTo: 8, perHour: 550 },
];
const MAKEUP_FLAT = 250;
const SUBSTITUTE_BONUS = 50;

type Trace = { rule: string; effect: string };

function calculate(input: {
  kind: "individual" | "group";
  students: number;
  hours: number;
  isMakeup: boolean;
  isSubstitute: boolean;
  attended: boolean;
  locale: Locale;
}) {
  const th = input.locale === "th";
  const trace: Trace[] = [];
  let total = 0;

  if (!input.attended) {
    trace.push({
      rule: th
        ? "ไม่มีนักเรียนเข้าเรียนเลย"
        : "Nobody attended the session",
      effect: th
        ? "ไม่จ่ายค่าสอน — นี่คือกฎที่ชนะทุกกฎอื่น"
        : "No pay. This rule beats every other rule.",
    });
    return { total: 0, trace };
  }

  if (input.isMakeup && input.kind === "individual") {
    total = MAKEUP_FLAT;
    trace.push({
      rule: th ? "คาบชดเชยแบบตัวต่อตัว" : "One-on-one makeup class",
      effect: th
        ? `จ่ายแบบเหมา ${MAKEUP_FLAT} บาท ไม่คิดตามชั่วโมง`
        : `Flat ${MAKEUP_FLAT} — not hourly`,
    });
  } else if (input.kind === "individual") {
    total = BASE_INDIVIDUAL * input.hours;
    trace.push({
      rule: th ? "คาบตัวต่อตัวปกติ" : "Standard one-on-one session",
      effect: `${BASE_INDIVIDUAL} × ${input.hours}h = ${BASE_INDIVIDUAL * input.hours}`,
    });
  } else {
    const tier =
      GROUP_TIERS.find((t) => input.students <= t.upTo) ??
      GROUP_TIERS[GROUP_TIERS.length - 1];
    total = tier.perHour * input.hours;
    trace.push({
      rule: th
        ? `คาบกลุ่ม ${input.students} คน → ขั้นไม่เกิน ${tier.upTo} คน`
        : `Group of ${input.students} → tier "up to ${tier.upTo}"`,
      effect: `${tier.perHour} × ${input.hours}h = ${tier.perHour * input.hours}`,
    });
    trace.push({
      rule: th
        ? "ขั้นค่าสอนคิดจากจำนวนคนที่มาเรียนจริง"
        : "The tier uses who actually attended",
      effect: th
        ? "ไม่ใช่จำนวนคนที่ลงทะเบียนไว้ — ตรงนี้เคยเป็นบั๊กที่จ่ายเกิน"
        : "Not who enrolled — this exact distinction was once an overpay bug",
    });
  }

  if (input.isSubstitute) {
    total += SUBSTITUTE_BONUS;
    trace.push({
      rule: th ? "สอนแทนครูคนอื่น" : "Covering for another tutor",
      effect: th
        ? `บวกเพิ่ม ${SUBSTITUTE_BONUS} บาท`
        : `+${SUBSTITUTE_BONUS}`,
    });
  }

  if (input.isMakeup && input.kind === "group") {
    trace.push({
      rule: th ? "คาบชดเชยแบบกลุ่ม" : "Group makeup class",
      effect: th
        ? "ใช้อัตราเดียวกับคาบกลุ่มปกติ ไม่มีเหมาจ่าย"
        : "Paid at the normal group rate — no flat fee",
    });
  }

  return { total, trace };
}

export function PayrollCalculator({ locale }: { locale: Locale }) {
  const th = locale === "th";
  const [kind, setKind] = useState<"individual" | "group">("group");
  const [students, setStudents] = useState(3);
  const [hours, setHours] = useState(1.5);
  const [isMakeup, setMakeup] = useState(false);
  const [isSubstitute, setSubstitute] = useState(false);
  const [attended, setAttended] = useState(true);

  const result = useMemo(
    () =>
      calculate({
        kind,
        students: kind === "individual" ? 1 : students,
        hours,
        isMakeup,
        isSubstitute,
        attended,
        locale,
      }),
    [kind, students, hours, isMakeup, isSubstitute, attended, locale],
  );

  return (
    <div className="rounded-lg border border-line bg-card p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-4">
          <Field label={th ? "ประเภทคาบ" : "Session type"}>
            <div className="flex gap-1.5">
              {(["individual", "group"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`rounded border px-3 py-1.5 text-xs transition ${
                    kind === k
                      ? "border-marigold text-marigold"
                      : "border-line text-muted hover:border-marigold"
                  }`}
                >
                  {k === "individual"
                    ? th
                      ? "ตัวต่อตัว"
                      : "One-on-one"
                    : th
                      ? "กลุ่ม"
                      : "Group"}
                </button>
              ))}
            </div>
          </Field>

          {kind === "group" && (
            <Field label={`${th ? "นักเรียนที่มาเรียน" : "Students attended"}: ${students}`}>
              <input
                type="range"
                min={1}
                max={8}
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full accent-[var(--marigold)]"
              />
            </Field>
          )}

          <Field label={`${th ? "ชั่วโมง" : "Hours"}: ${hours}`}>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-[var(--marigold)]"
            />
          </Field>

          <Toggle
            checked={isMakeup}
            onChange={setMakeup}
            label={th ? "เป็นคาบเรียนชดเชย" : "This is a makeup class"}
          />
          <Toggle
            checked={isSubstitute}
            onChange={setSubstitute}
            label={th ? "สอนแทนครูคนอื่น" : "Covering for another tutor"}
          />
          <Toggle
            checked={attended}
            onChange={setAttended}
            label={th ? "มีนักเรียนมาเรียนจริง" : "Someone actually attended"}
          />
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-teal">
            {th ? "ค่าสอนที่คำนวณได้" : "Calculated pay"}
          </p>
          <p className="mt-1 font-mono text-4xl font-semibold text-marigold tabular-nums">
            ฿{result.total.toLocaleString()}
          </p>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-teal">
            {th ? "กฎที่ถูกใช้" : "Rules applied"}
          </p>
          <ol className="mt-2 space-y-2.5">
            {result.trace.map((step, i) => (
              <li key={i} className="text-sm">
                <p className="font-medium">{step.rule}</p>
                <p className="font-mono text-xs text-muted">{step.effect}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        {th
          ? "ตัวเลขข้างบนเป็นตัวอย่างสมมติเพื่อสาธิต ไม่ใช่อัตราจริงของสถาบันใด สิ่งที่อยากให้เห็นคือรูปร่างของปัญหา: มีขั้นค่าสอน มีกฎที่เขียนทับกฎอื่น และมีเงื่อนไขหนึ่งที่ต้องชนะทุกอย่างเสมอ"
          : "These numbers are illustrative, not any real institute's rates. What matters is the shape of the problem: tiers, rules that override other rules, and one condition that must always win."}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[var(--marigold)]"
      />
      <span className="text-muted">{label}</span>
    </label>
  );
}
