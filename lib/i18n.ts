export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "th";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Swap the locale segment of a path: /th/work -> /en/work */
export function switchLocalePath(pathname: string, next: Locale) {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = next;
    return parts.join("/") || "/";
  }
  return `/${next}${pathname}`;
}

type Dict = {
  nav: Record<
    | "work"
    | "blog"
    | "lab"
    | "music"
    | "gallery"
    | "gaming"
    | "now"
    | "uses"
    | "guestbook"
    | "cv"
    | "ask",
    string
  >;
  common: Record<
    | "readMore"
    | "backTo"
    | "allWork"
    | "allPosts"
    | "stack"
    | "role"
    | "year"
    | "status"
    | "highlights"
    | "sourceCode"
    | "liveSite"
    | "private"
    | "loading"
    | "send"
    | "error"
    | "minRead"
    | "updated"
    | "toggleTheme"
    | "skipToContent",
    string
  >;
  home: Record<
    | "kicker"
    | "tagline"
    | "intro"
    | "ctaWork"
    | "ctaAsk"
    | "featured"
    | "featuredSub"
    | "latestPosts"
    | "latestPostsSub"
    | "beyondCode"
    | "beyondCodeSub"
    | "nowTitle",
    string
  >;
  work: { title: string; sub: string };
  blog: { title: string; sub: string; empty: string };
  lab: { title: string; sub: string };
  music: { title: string; sub: string; note: string };
  gallery: { title: string; sub: string; note: string };
  gaming: { title: string; sub: string };
  now: { title: string; sub: string };
  uses: { title: string; sub: string };
  cv: { title: string; sub: string; print: string };
  guestbook: Record<
    | "title"
    | "sub"
    | "namePlaceholder"
    | "messagePlaceholder"
    | "submit"
    | "submitting"
    | "thanks"
    | "empty"
    | "offline"
    | "tooLong"
    | "required",
    string
  >;
  ask: Record<
    | "title"
    | "sub"
    | "placeholder"
    | "disclaimer"
    | "offline"
    | "suggestions"
    | "clear"
    | "stop"
    | "thinking",
    string
  > & { starters: string[] };
  footer: { built: string; rights: string };
};

const th: Dict = {
  nav: {
    work: "ผลงาน",
    blog: "บันทึก",
    lab: "แล็บ",
    music: "ดนตรี",
    gallery: "ภาพ",
    gaming: "เกม",
    now: "ตอนนี้",
    uses: "อุปกรณ์",
    guestbook: "สมุดเยี่ยม",
    cv: "เรซูเม่",
    ask: "ถามเกี่ยวกับผม",
  },
  common: {
    readMore: "อ่านต่อ",
    backTo: "กลับไป",
    allWork: "ดูผลงานทั้งหมด",
    allPosts: "อ่านบันทึกทั้งหมด",
    stack: "เทคโนโลยี",
    role: "บทบาท",
    year: "ปี",
    status: "สถานะ",
    highlights: "สิ่งที่น่าสนใจ",
    sourceCode: "ซอร์สโค้ด",
    liveSite: "เว็บจริง",
    private: "โปรเจกต์ส่วนตัว (repo ไม่เปิดสาธารณะ)",
    loading: "กำลังโหลด…",
    send: "ส่ง",
    error: "เกิดข้อผิดพลาด ลองใหม่อีกครั้งครับ",
    minRead: "นาที",
    updated: "อัปเดตล่าสุด",
    toggleTheme: "สลับธีมสว่าง/มืด",
    skipToContent: "ข้ามไปยังเนื้อหา",
  },
  home: {
    kicker: "วิศวกรคอมพิวเตอร์ · เชียงใหม่",
    tagline: "ผมสร้างระบบที่มีคนใช้งานจริง",
    intro:
      "บวรภัค ดวงจันทร์ (ปาล์ม) — จบวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเชียงใหม่ เกียรตินิยมอันดับหนึ่ง ทำงานฝั่ง full-stack ตั้งแต่ออกแบบ business logic ไปจนถึง deploy บน production ที่มีผู้ใช้ เงิน และความผิดพลาดที่ย้อนกลับไม่ได้",
    ctaWork: "ดูผลงาน",
    ctaAsk: "ถาม AI เกี่ยวกับผม",
    featured: "ผลงานที่เลือกมา",
    featuredSub: "ระบบที่รันอยู่จริง ไม่ใช่โปรเจกต์ส่งอาจารย์",
    latestPosts: "บันทึกล่าสุด",
    latestPostsSub: "สิ่งที่เจอระหว่างทาง และเหตุผลเบื้องหลังการตัดสินใจ",
    beyondCode: "นอกจากโค้ด",
    beyondCodeSub: "สิ่งที่ทำให้ผมเป็นผมมากกว่าแค่ resume",
    nowTitle: "ตอนนี้กำลังทำอะไรอยู่",
  },
  work: {
    title: "ผลงาน",
    sub: "ระบบที่ผมออกแบบ เขียน และดูแลเอง — เรียงจากที่ภูมิใจที่สุด",
  },
  blog: {
    title: "บันทึก",
    sub: "บันทึกการทำงาน บทเรียน และเหตุผลเบื้องหลังสิ่งที่เลือกทำ",
    empty: "ยังไม่มีบันทึกในภาษานี้",
  },
  lab: {
    title: "แล็บ",
    sub: "ของเล่นเล็ก ๆ ที่เล่นได้จริงบนหน้านี้ — ไม่ใช่ภาพหน้าจอ",
  },
  music: {
    title: "ดนตรี",
    sub: "Fingerstyle guitar และขลุ่ย — สิ่งที่ทำตอนไม่ได้อยู่หน้าจอ",
    note: "ยังไม่ได้อัปโหลดไฟล์เสียงจริง — วางไฟล์ .mp3 ไว้ใน public/audio/ แล้วแก้รายชื่อใน content/site.ts",
  },
  gallery: {
    title: "ภาพ",
    sub: "รูปถ่ายและงานออกแบบที่เก็บไว้ระหว่างทาง",
    note: "ยังไม่ได้ใส่รูปจริง — วางไฟล์ไว้ใน public/img/gallery/ แล้วแก้รายการใน content/site.ts",
  },
  gaming: {
    title: "เกม",
    sub: "MOBA และ FPS — เกมสอนเรื่อง timing กับการอ่านสถานการณ์ได้ดีกว่าที่คิด",
  },
  now: {
    title: "ตอนนี้",
    sub: "หน้านี้บอกว่าผมโฟกัสอะไรอยู่ ณ ตอนนี้ ไม่ใช่สรุปทุกอย่างที่เคยทำ",
  },
  uses: {
    title: "อุปกรณ์และเครื่องมือ",
    sub: "ของที่ใช้ทำงานทุกวัน",
  },
  cv: {
    title: "เรซูเม่",
    sub: "ฉบับย่อ — กด Print เพื่อบันทึกเป็น PDF",
    print: "พิมพ์ / บันทึก PDF",
  },
  guestbook: {
    title: "สมุดเยี่ยม",
    sub: "ฝากข้อความไว้ได้เลยครับ จะทักทาย ติชม หรือชวนทำงานก็ได้",
    namePlaceholder: "ชื่อของคุณ",
    messagePlaceholder: "เขียนอะไรก็ได้…",
    submit: "ลงชื่อ",
    submitting: "กำลังส่ง…",
    thanks: "ขอบคุณที่แวะมาครับ",
    empty: "ยังไม่มีใครเขียนเลย เป็นคนแรกไหมครับ",
    offline:
      "สมุดเยี่ยมยังไม่ได้ต่อฐานข้อมูล — ตั้งค่า DATABASE_URL แล้วจะใช้งานได้ทันที",
    tooLong: "ข้อความยาวเกินไป (จำกัด 500 ตัวอักษร)",
    required: "กรุณากรอกทั้งชื่อและข้อความ",
  },
  ask: {
    title: "ถามเกี่ยวกับผม",
    sub: "แชทบอทที่รู้จักประวัติ ผลงาน และวิธีทำงานของผม ตอบจากข้อมูลบนเว็บนี้เท่านั้น",
    placeholder: "ถามอะไรก็ได้เกี่ยวกับผม…",
    disclaimer:
      "นี่คือ AI ที่อ่านเนื้อหาบนเว็บนี้ อาจตอบผิดได้ ถ้าต้องการคำตอบที่แน่นอนทักผมโดยตรงได้เลยครับ",
    offline:
      "แชทยังไม่เปิดใช้งาน — ต้องตั้งค่า ANTHROPIC_API_KEY ก่อน",
    suggestions: "ลองถามว่า",
    clear: "เริ่มใหม่",
    stop: "หยุด",
    thinking: "กำลังคิด…",
    starters: [
      "IQ Tutor คือโปรเจกต์อะไร แล้วยากตรงไหน",
      "มีประสบการณ์กับ LINE LIFF แค่ไหน",
      "ถนัด backend หรือ frontend มากกว่ากัน",
      "เคยทำงานกับ Docker และ deploy เองไหม",
    ],
  },
  footer: {
    built: "สร้างด้วย Next.js · โค้ดเปิดให้ดูได้",
    rights: "บวรภัค ดวงจันทร์",
  },
};

const en: Dict = {
  nav: {
    work: "Work",
    blog: "Writing",
    lab: "Lab",
    music: "Music",
    gallery: "Gallery",
    gaming: "Gaming",
    now: "Now",
    uses: "Uses",
    guestbook: "Guestbook",
    cv: "Résumé",
    ask: "Ask about me",
  },
  common: {
    readMore: "Read more",
    backTo: "Back to",
    allWork: "See all work",
    allPosts: "Read all posts",
    stack: "Stack",
    role: "Role",
    year: "Year",
    status: "Status",
    highlights: "Highlights",
    sourceCode: "Source",
    liveSite: "Live site",
    private: "Private project (repository not public)",
    loading: "Loading…",
    send: "Send",
    error: "Something went wrong. Please try again.",
    minRead: "min read",
    updated: "Last updated",
    toggleTheme: "Toggle light/dark theme",
    skipToContent: "Skip to content",
  },
  home: {
    kicker: "Computer engineer · Chiang Mai, Thailand",
    tagline: "I build systems that real people depend on",
    intro:
      "Borwonpak Duangjun (Palm) — B.Eng. Computer Engineering, Chiang Mai University, First Class Honours. I work across the stack, from designing the business rules to running them in production where there are real users, real money, and mistakes you cannot undo.",
    ctaWork: "See my work",
    ctaAsk: "Ask AI about me",
    featured: "Selected work",
    featuredSub: "Systems running in production — not coursework",
    latestPosts: "Recent writing",
    latestPostsSub: "What I ran into, and why I chose what I chose",
    beyondCode: "Beyond the code",
    beyondCodeSub: "The parts a résumé leaves out",
    nowTitle: "What I'm doing now",
  },
  work: {
    title: "Work",
    sub: "Systems I designed, built and maintain — ordered by what I'm proudest of",
  },
  blog: {
    title: "Writing",
    sub: "Build logs, lessons, and the reasoning behind decisions",
    empty: "No posts in this language yet.",
  },
  lab: {
    title: "Lab",
    sub: "Small things you can actually play with right here — not screenshots",
  },
  music: {
    title: "Music",
    sub: "Fingerstyle guitar and Thai flute — what I do away from a screen",
    note: "No real audio uploaded yet — drop .mp3 files into public/audio/ and edit the list in content/site.ts",
  },
  gallery: {
    title: "Gallery",
    sub: "Photos and design work collected along the way",
    note: "No real images yet — drop files into public/img/gallery/ and edit the list in content/site.ts",
  },
  gaming: {
    title: "Gaming",
    sub: "MOBA and FPS — better teachers of timing and reading a situation than they get credit for",
  },
  now: {
    title: "Now",
    sub: "What I'm focused on at the moment — not a summary of everything I've done",
  },
  uses: {
    title: "Uses",
    sub: "The gear and tools behind the daily work",
  },
  cv: {
    title: "Résumé",
    sub: "Short version — hit print to save as PDF",
    print: "Print / save as PDF",
  },
  guestbook: {
    title: "Guestbook",
    sub: "Leave a note — a hello, a critique, or a project you want built",
    namePlaceholder: "Your name",
    messagePlaceholder: "Write anything…",
    submit: "Sign",
    submitting: "Sending…",
    thanks: "Thanks for stopping by.",
    empty: "Nobody has signed yet. Want to be first?",
    offline:
      "The guestbook isn't connected to a database yet — set DATABASE_URL and it works.",
    tooLong: "Message is too long (500 characters max).",
    required: "Please fill in both name and message.",
  },
  ask: {
    title: "Ask about me",
    sub: "A chatbot that knows my background, projects and how I work. It answers only from what's on this site.",
    placeholder: "Ask me anything…",
    disclaimer:
      "This is an AI reading the content of this site. It can be wrong — message me directly if you need a definite answer.",
    offline: "Chat isn't enabled — set ANTHROPIC_API_KEY first.",
    suggestions: "Try asking",
    clear: "Start over",
    stop: "Stop",
    thinking: "Thinking…",
    starters: [
      "What is IQ Tutor and what was hard about it?",
      "How much LINE LIFF experience do you have?",
      "Are you stronger on backend or frontend?",
      "Have you deployed and operated things with Docker yourself?",
    ],
  },
  footer: {
    built: "Built with Next.js · source is public",
    rights: "Borwonpak Duangjun",
  },
};

const dictionaries: Record<Locale, Dict> = { th, en };

export function t(locale: Locale): Dict {
  return dictionaries[locale];
}

/** Pick the right side of a bilingual string pair. */
export type I18nText = { th: string; en: string };
export function pick(text: I18nText, locale: Locale): string {
  return text[locale];
}
