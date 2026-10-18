import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildKnowledgeBase, systemPrompt } from "@/lib/knowledge";
import { isLocale } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-opus-5";
const MAX_MESSAGES = 20;
const MAX_CHARS = 1500;

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * The knowledge base is derived from files on disk, so it is identical for the
 * life of the process. Building it once keeps the cached prefix byte-stable,
 * which is what makes prompt caching actually hit.
 */
let knowledgeBase: string | null = null;
function getKnowledgeBase() {
  knowledgeBase ??= buildKnowledgeBase();
  return knowledgeBase;
}

/**
 * Per-instance rate limit. A serverless deployment runs several instances, so
 * this is a brake rather than a wall — enough to stop one browser tab from
 * burning the API budget.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const messages: ChatMessage[] = [];
  for (const raw of input.slice(-MAX_MESSAGES)) {
    if (typeof raw !== "object" || raw === null) return null;
    const { role, content } = raw as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || !content.trim()) return null;
    messages.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  // The API requires the conversation to start and end with a user turn.
  if (messages[0].role !== "user") return null;
  if (messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { messages: rawMessages, locale: rawLocale } = (body ?? {}) as {
    messages?: unknown;
    locale?: unknown;
  };

  const messages = parseMessages(rawMessages);
  if (!messages) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const locale =
    typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "th";

  const client = new Anthropic();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const run = client.messages.stream({
          model: MODEL,
          max_tokens: 1500,
          // Thinking is on by default on Opus 5. Low effort keeps the site
          // responsive; these are short factual answers, not hard reasoning.
          output_config: { effort: "low" },
          system: [
            { type: "text", text: systemPrompt(locale) },
            {
              type: "text",
              text: `# Reference material\n\n${getKnowledgeBase()}`,
              // Stable across every request — the whole point of the breakpoint.
              cache_control: { type: "ephemeral" },
            },
          ],
          messages,
        });

        for await (const event of run) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await run.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              locale === "th"
                ? "\n\n(ขออภัยครับ ผมตอบคำถามนี้ไม่ได้ — ทักหาปาล์มโดยตรงทางอีเมลได้เลยครับ)"
                : "\n\n(Sorry — I can't answer that one. Email Palm directly and he'll reply.)",
            ),
          );
        }
      } catch (err) {
        console.error("[chat] stream failed", err);
        controller.enqueue(
          encoder.encode(
            locale === "th"
              ? "\n\n(เกิดข้อผิดพลาดระหว่างตอบ ลองใหม่อีกครั้งครับ)"
              : "\n\n(Something went wrong while answering. Please try again.)",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET() {
  return NextResponse.json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY) });
}
