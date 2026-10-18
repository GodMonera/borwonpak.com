"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Message = { role: "user" | "assistant"; content: string };

type Copy = {
  placeholder: string;
  disclaimer: string;
  offline: string;
  suggestions: string;
  clear: string;
  stop: string;
  thinking: string;
  starters: string[];
  send: string;
  error: string;
};

export function Chat({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Abandoning the page mid-stream should not leave the request hanging.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || streaming) return;

    const history: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const fallback =
          res.status === 429
            ? locale === "th"
              ? "ถามถี่เกินไปครับ รอสักครู่แล้วลองใหม่"
              : "Too many questions at once — give it a moment and try again."
            : copy.error;
        setMessages((prev) => replaceLast(prev, fallback));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((prev) => replaceLast(prev, text));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => replaceLast(prev, copy.error));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  if (enabled === false) {
    return (
      <p className="max-w-xl rounded-lg border border-dashed border-line p-5 text-sm text-muted">
        {copy.offline}
      </p>
    );
  }

  return (
    <div className="max-w-2xl">
      {messages.length === 0 ? (
        <div className="rounded-lg border border-line bg-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-teal">
            {copy.suggestions}
          </p>
          <ul className="mt-3 space-y-2">
            {copy.starters.map((starter) => (
              <li key={starter}>
                <button
                  type="button"
                  onClick={() => ask(starter)}
                  className="text-left text-sm text-muted transition hover:text-marigold"
                >
                  → {starter}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((m, i) => (
            <div key={i}>
              <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-teal">
                {m.role === "user"
                  ? locale === "th"
                    ? "คุณ"
                    : "You"
                  : locale === "th"
                    ? "ผู้ช่วย"
                    : "Assistant"}
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {m.content ||
                  (streaming && i === messages.length - 1 ? (
                    <span className="text-muted">{copy.thinking}</span>
                  ) : null)}
              </p>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="sticky bottom-4 mt-8 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1500}
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          disabled={enabled === null}
          className="flex-1 rounded-md border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus:border-marigold disabled:opacity-50"
        />
        {streaming ? (
          <button
            type="button"
            onClick={() => abortRef.current?.abort()}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium transition hover:border-marigold hover:text-marigold"
          >
            {copy.stop}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-md bg-marigold px-5 py-2 text-sm font-semibold text-[#0e1116] transition hover:opacity-90 disabled:opacity-40"
          >
            {copy.send}
          </button>
        )}
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-xs leading-relaxed text-muted">
          {copy.disclaimer}
        </p>
        {messages.length > 0 && !streaming && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-xs text-muted underline underline-offset-4 hover:text-marigold"
          >
            {copy.clear}
          </button>
        )}
      </div>
    </div>
  );
}

function replaceLast(messages: Message[], content: string): Message[] {
  const copy = [...messages];
  copy[copy.length - 1] = { role: "assistant", content };
  return copy;
}
