"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

type Copy = {
  namePlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  thanks: string;
  empty: string;
  offline: string;
  tooLong: string;
  required: string;
  error: string;
  loading: string;
};

const MESSAGE_MAX = 500;

export function Guestbook({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Copy;
}) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setConfigured(Boolean(data.configured));
        setEntries(Array.isArray(data.entries) ? data.entries : []);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !message.trim()) {
      setError(copy.required);
      return;
    }
    if (message.length > MESSAGE_MAX) {
      setError(copy.tooLong);
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "required" ? copy.required : copy.error);
        setState("idle");
        return;
      }
      if (data.entry) setEntries((prev) => [data.entry, ...(prev ?? [])]);
      setName("");
      setMessage("");
      setState("done");
    } catch {
      setError(copy.error);
      setState("idle");
    }
  }

  const formatter = new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    dateStyle: "medium",
  });

  if (!configured) {
    return (
      <p className="max-w-xl border border-dashed border-line p-5 text-sm text-muted">
        {copy.offline}
      </p>
    );
  }

  return (
    <div className="max-w-2xl">
      {state === "done" ? (
        <p className="border border-marigold bg-panel p-5 text-sm">
          {copy.thanks}
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder={copy.namePlaceholder}
            aria-label={copy.namePlaceholder}
            className="w-full border border-line bg-panel px-3.5 py-2.5 text-sm outline-none focus:border-marigold"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MESSAGE_MAX}
            rows={4}
            placeholder={copy.messagePlaceholder}
            aria-label={copy.messagePlaceholder}
            className="w-full resize-y border border-line bg-panel px-3.5 py-2.5 text-sm outline-none focus:border-marigold"
          />

          {/* Honeypot — hidden from people, irresistible to bots. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] size-0 opacity-0"
          />

          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs text-muted">
              {message.length}/{MESSAGE_MAX}
            </span>
            <button
              type="submit"
              disabled={state === "sending"}
              className="bg-marigold px-5 py-2 text-sm font-semibold text-[#0e1116] transition hover:opacity-90 disabled:opacity-50"
            >
              {state === "sending" ? copy.submitting : copy.submit}
            </button>
          </div>

          {error && <p className="text-sm text-marigold">{error}</p>}
        </form>
      )}

      <ul className="mt-12 space-y-6">
        {entries === null && (
          <li className="text-sm text-muted">{copy.loading}</li>
        )}
        {entries?.length === 0 && (
          <li className="text-sm text-muted">{copy.empty}</li>
        )}
        {entries?.map((entry) => (
          <li key={entry.id} className="border-l-2 border-line pl-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {entry.message}
            </p>
            <p className="mt-1.5 hud text-muted">
              {entry.name} · {formatter.format(new Date(entry.created_at))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
