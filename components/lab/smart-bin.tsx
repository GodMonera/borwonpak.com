"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * A browser stand-in for the ESP32 bin: an ultrasonic sensor above the lid, a
 * second one inside measuring how full it is, a servo, and status LEDs.
 * The thresholds and the close delay are the ones that mattered on the
 * physical build — a bare distance check made the lid flap constantly.
 */
const OPEN_CM = 15;
const CLOSE_DELAY_MS = 1800;
const BIN_DEPTH_CM = 60;
const FULL_PERCENT = 80;

type LogLine = { id: number; t: number; text: string };

export function SmartBin({ locale }: { locale: Locale }) {
  const th = locale === "th";
  const [distance, setDistance] = useState(45);
  const [contentCm, setContentCm] = useState(18);
  const [lidOpen, setLidOpen] = useState(false);
  const [log, setLog] = useState<LogLine[]>([]);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uptime = useRef(0);
  const lineId = useRef(0);

  // A dangling timer after unmount would call setState on a dead component.
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  function push(text: string) {
    uptime.current += Math.round(40 + Math.random() * 60);
    lineId.current += 1;
    const line = { id: lineId.current, t: uptime.current, text };
    setLog((prev) => [line, ...prev].slice(0, 7));
  }

  const fillPercent = Math.round((contentCm / BIN_DEPTH_CM) * 100);
  const full = fillPercent >= FULL_PERCENT;

  /**
   * Lid logic lives in the slider handler, not an effect: moving the slider is
   * the event, and the servo is the thing being driven by it.
   */
  function onDistance(next: number) {
    setDistance(next);

    if (next <= OPEN_CM) {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      if (!lidOpen) {
        setLidOpen(true);
        push(`servo.write(95)  // lid OPEN @ ${next}cm`);
      }
      return;
    }

    if (lidOpen && !closeTimer.current) {
      closeTimer.current = setTimeout(() => {
        closeTimer.current = null;
        setLidOpen(false);
        push(`servo.write(5)   // lid CLOSED after ${CLOSE_DELAY_MS}ms`);
      }, CLOSE_DELAY_MS);
    }
  }

  function onContent(next: number) {
    setContentCm(next);
    const nextPercent = Math.round((next / BIN_DEPTH_CM) * 100);
    // Log only on the crossing, not on every pixel of drag.
    if (nextPercent >= FULL_PERCENT && !full) {
      push(`mqtt.publish("bin/full", ${nextPercent})`);
    } else if (nextPercent < FULL_PERCENT && full) {
      push(`mqtt.publish("bin/ok", ${nextPercent})`);
    }
  }

  return (
    <div className="border border-line bg-panel p-5">
      <div className="grid gap-6 sm:grid-cols-[1fr_1.1fr]">
        <div className="flex items-end justify-center">
          <svg
            viewBox="0 0 160 200"
            role="img"
            aria-label={
              th
                ? `ถังขยะ ฝา${lidOpen ? "เปิด" : "ปิด"} ระดับขยะ ${fillPercent}%`
                : `Bin, lid ${lidOpen ? "open" : "closed"}, ${fillPercent}% full`
            }
            className="w-full max-w-[190px]"
          >
            {/* Lid, hinged on the left */}
            <g
              style={{
                transformOrigin: "26px 56px",
                transform: `rotate(${lidOpen ? -62 : 0}deg)`,
                transition: "transform 420ms cubic-bezier(.34,1.3,.64,1)",
              }}
            >
              <rect
                x={22}
                y={44}
                width={116}
                height={13}
                rx={4}
                fill="var(--brass)"
              />
            </g>

            {/* Body */}
            <path
              d="M30 62 L130 62 L120 186 L40 186 Z"
              fill="none"
              stroke="var(--muted)"
              strokeWidth={2.5}
            />

            {/* Contents */}
            <rect
              x={42}
              y={186 - (contentCm / BIN_DEPTH_CM) * 118}
              width={76}
              height={(contentCm / BIN_DEPTH_CM) * 118}
              fill={full ? "var(--brass)" : "var(--abalone)"}
              opacity={0.35}
            />

            {/* Hand, moving toward the sensor as distance shrinks */}
            <circle
              cx={80}
              cy={Math.max(6, 40 - (OPEN_CM / Math.max(distance, 1)) * 26)}
              r={6}
              fill="var(--abalone)"
              opacity={distance <= OPEN_CM ? 1 : 0.35}
            />
          </svg>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 flex justify-between hud text-muted">
              <span>{th ? "ระยะมือจากเซนเซอร์" : "Hand distance"}</span>
              <span className="text-ink">{distance} cm</span>
            </span>
            <input
              type="range"
              min={2}
              max={80}
              value={distance}
              onChange={(e) => onDistance(Number(e.target.value))}
              className="w-full accent-[var(--brass)]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex justify-between hud text-muted">
              <span>{th ? "ขยะในถัง" : "Rubbish in the bin"}</span>
              <span className="text-ink">
                {contentCm} cm · {fillPercent}%
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={BIN_DEPTH_CM}
              value={contentCm}
              onChange={(e) => onContent(Number(e.target.value))}
              className="w-full accent-[var(--brass)]"
            />
          </label>

          <div className="flex flex-wrap gap-2 hud">
            <Led on={lidOpen} label={th ? "ฝาเปิด" : "LID"} />
            <Led on={full} label={th ? "ถังเต็ม" : "FULL"} />
            <Led on label="WIFI" />
          </div>

          <pre className="h-[132px] overflow-hidden border border-line bg-paper p-3 hud leading-relaxed text-muted">
            {log.length === 0
              ? th
                ? "// เลื่อนแถบด้านบนเพื่อดู serial output"
                : "// move a slider to see serial output"
              : log
                  .map(
                    (line) =>
                      `[${String(line.t).padStart(6, "0")}] ${line.text}`,
                  )
                  .join("\n")}
          </pre>
        </div>
      </div>

      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        {th
          ? `ฝาเปิดเมื่อระยะ ≤ ${OPEN_CM} ซม. และหน่วง ${CLOSE_DELAY_MS} มิลลิวินาทีก่อนปิด — เวอร์ชันแรกไม่มีหน่วง ผลคือฝากระพือตลอดเวลาเพราะค่าที่เซนเซอร์อ่านได้แกว่งอยู่รอบ ๆ เส้นแบ่งพอดี`
          : `The lid opens at ≤ ${OPEN_CM}cm and waits ${CLOSE_DELAY_MS}ms before closing. The first version had no delay, so the lid flapped continuously whenever a reading hovered right at the threshold.`}
      </p>
    </div>
  );
}

function Led({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 uppercase tracking-wider ${on ? "border-brass text-brass" : "border-line text-muted"
      }`}
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${on ? "bg-brass" : "bg-line"}`}
      />
      {label}
    </span>
  );
}
