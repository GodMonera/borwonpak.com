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
    kicker: "ปาล์ม · เชียงใหม่",
    tagline: "ผมสร้างระบบที่มีคนใช้จริงทุกวัน",
    intro:
      "ผมชื่อปาล์มครับ อยู่เชียงใหม่ เรียนจบวิศวกรรมคอมพิวเตอร์ที่ มช. สิ่งที่ผมชอบที่สุดคือตอนที่กฎมันยุ่ง — ใครได้ค่าสอนเท่าไร คาบไหนนับว่าเรียนไปแล้ว ลาได้ถึงเมื่อไร เรื่องพวกนี้ไม่มีใครเขียนไว้ที่ไหน ต้องนั่งถามทีละเคสแล้วแปลงให้เป็นโค้ดที่ตรวจสอบได้",
    ctaWork: "ดูผลงาน",
    ctaAsk: "มีอะไรอยากรู้ ถาม AI ได้",
    featured: "งานที่ผมภูมิใจ",
    featuredSub: "ของพวกนี้รันอยู่จริง มีคนใช้อยู่ตอนนี้",
    latestPosts: "เพิ่งเขียนไว้",
    latestPostsSub: "ส่วนใหญ่เป็นเรื่องที่เคยพลาด แล้วไม่อยากพลาดซ้ำ",
    beyondCode: "ไม่ได้มีแค่โค้ด",
    beyondCodeSub: "ส่วนที่เรซูเม่ไม่เคยบอก",
    nowTitle: "ตอนนี้ทำอะไรอยู่",
  },
  work: {
    title: "ผลงาน",
    sub: "ทุกตัวผมออกแบบ เขียน และดูแลเอง เรียงจากที่ภูมิใจที่สุดลงมา",
  },
  blog: {
    title: "บันทึก",
    sub: "เขียนไว้กันลืม ว่าตอนนั้นคิดอะไรอยู่ถึงเลือกทำแบบนั้น",
    empty: "ยังไม่มีบันทึกในภาษานี้",
  },
  lab: {
    title: "แล็บ",
    sub: "ของเล่นที่กดเล่นได้จริงตรงนี้เลย ไม่ใช่ภาพหน้าจอ",
  },
  music: {
    title: "ดนตรี",
    sub: "สิ่งที่ทำตอนลุกจากโต๊ะคอม",
    note: "ยังไม่ได้อัปโหลดไฟล์เสียงจริง — วางไฟล์ .mp3 ไว้ใน public/audio/ แล้วแก้รายชื่อใน content/site.ts",
  },
  gallery: {
    title: "ภาพ",
    sub: "รูปที่เก็บไว้ระหว่างทาง",
    note: "ยังไม่ได้ใส่รูปจริง — วางไฟล์ไว้ใน public/img/gallery/ แล้วแก้รายการใน content/site.ts",
  },
  gaming: {
    title: "เกม",
    sub: "เล่นมาตั้งแต่มัธยม และได้อะไรกลับมามากกว่าที่คิด",
  },
  now: {
    title: "ตอนนี้",
    sub: "หน้านี้บอกว่าตอนนี้ผมสนใจอะไร ไม่ใช่ลิสต์ทุกอย่างที่เคยทำ",
  },
  uses: {
    title: "อุปกรณ์และเครื่องมือ",
    sub: "ของที่หยิบใช้ทุกวันจริง ๆ ไม่ใช่ของที่อยากอวด",
  },
  cv: {
    title: "เรซูเม่",
    sub: "ฉบับย่อ อ่านจบใน 2 นาที — กด Print ถ้าอยากได้ PDF",
    print: "พิมพ์ / บันทึก PDF",
  },
  guestbook: {
    title: "สมุดเยี่ยม",
    sub: "แวะมาทักได้นะครับ จะชม จะด่า จะชวนทำงานก็ยินดี",
    namePlaceholder: "ชื่อของคุณ",
    messagePlaceholder: "เขียนอะไรก็ได้…",
    submit: "ลงชื่อ",
    submitting: "กำลังส่ง…",
    thanks: "ขอบคุณที่แวะมาครับ",
    empty: "ยังไม่มีใครเขียนเลยครับ เป็นคนแรกไหม",
    offline:
      "สมุดเยี่ยมยังไม่ได้ต่อฐานข้อมูล — ตั้งค่า DATABASE_URL แล้วจะใช้งานได้ทันที",
    tooLong: "ข้อความยาวเกินไป (จำกัด 500 ตัวอักษร)",
    required: "กรุณากรอกทั้งชื่อและข้อความ",
  },
  ask: {
    title: "ถามเกี่ยวกับผม",
    sub: "ขี้เกียจอ่านทั้งเว็บก็ถามตรงนี้ได้ มันอ่านมาให้หมดแล้ว",
    placeholder: "ถามอะไรก็ได้เกี่ยวกับผม…",
    disclaimer:
      "มันอ่านแค่สิ่งที่อยู่บนเว็บนี้ และตอบผิดได้นะครับ ถ้าอยากได้คำตอบที่ชัวร์ อีเมลหาผมตรง ๆ ดีกว่า",
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
    kicker: "Palm · Chiang Mai",
    tagline: "I build systems people use every day",
    intro:
      "I'm Palm. I studied computer engineering in Chiang Mai and never left. The part I like most is the messy part — who gets paid what, which class counts as taught, how late you can still cancel. None of that is written down anywhere. You sit with someone, go through it case by case, and turn it into rules a computer can check.",
    ctaWork: "See my work",
    ctaAsk: "Curious? Ask the AI",
    featured: "Work I'm proud of",
    featuredSub: "These are live right now, with people using them",
    latestPosts: "Written recently",
    latestPostsSub: "Mostly things I got wrong once and would rather not repeat",
    beyondCode: "Not just code",
    beyondCodeSub: "The part a résumé never gets to",
    nowTitle: "What I'm doing now",
  },
  work: {
    title: "Work",
    sub: "I designed, wrote and still run every one of these. Proudest first.",
  },
  blog: {
    title: "Writing",
    sub: "Notes to my future self about what I was thinking at the time",
    empty: "No posts in this language yet.",
  },
  lab: {
    title: "Lab",
    sub: "Things you can actually press, right here. Not screenshots.",
  },
  music: {
    title: "Music",
    sub: "What I do when I get up from the desk",
    note: "No real audio uploaded yet — drop .mp3 files into public/audio/ and edit the list in content/site.ts",
  },
  gallery: {
    title: "Gallery",
    sub: "Pictures I kept along the way",
    note: "No real images yet — drop files into public/img/gallery/ and edit the list in content/site.ts",
  },
  gaming: {
    title: "Gaming",
    sub: "Been playing since high school, and got more out of it than I expected",
  },
  now: {
    title: "Now",
    sub: "What I'm into right now, not a list of everything I've ever done",
  },
  uses: {
    title: "Uses",
    sub: "What I actually reach for, not what looks good in a list",
  },
  cv: {
    title: "Résumé",
    sub: "Short version, two minutes to read. Print it if you want the PDF.",
    print: "Print / save as PDF",
  },
  guestbook: {
    title: "Guestbook",
    sub: "Say hello. Praise, complaints and job offers all welcome.",
    namePlaceholder: "Your name",
    messagePlaceholder: "Write anything…",
    submit: "Sign",
    submitting: "Sending…",
    thanks: "Thanks for stopping by.",
    empty: "Nobody has signed yet. Fancy being first?",
    offline:
      "The guestbook isn't connected to a database yet — set DATABASE_URL and it works.",
    tooLong: "Message is too long (500 characters max).",
    required: "Please fill in both name and message.",
  },
  ask: {
    title: "Ask about me",
    sub: "Too much to read? Ask here instead — it has been through the whole site.",
    placeholder: "Ask me anything…",
    disclaimer:
      "It only knows what is on this site, and it can be wrong. Email me if you need a definite answer.",
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
