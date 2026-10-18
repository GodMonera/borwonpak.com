import type { I18nText } from "@/lib/i18n";

export const site = {
  domain: "borwonpak.com",
  url: "https://borwonpak.com",
  name: "Borwonpak Duangjun",
  nameTh: "บวรภัค ดวงจันทร์",
  nickname: "Palm",
  nicknameTh: "ปาล์ม",
  email: "borwonpakduangjun@gmail.com",
  phone: "096-815-8028",
  location: { th: "เชียงใหม่ ประเทศไทย", en: "Chiang Mai, Thailand" } as I18nText,
  github: "https://github.com/GodMonera",
  githubHandle: "GodMonera",
  repo: "https://github.com/GodMonera/borwonpak.com",
};

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  title: string;
  tagline: I18nText;
  year: string;
  role: I18nText;
  status: I18nText;
  stack: string[];
  /** Shown on the detail page as paragraphs. */
  body: { th: string[]; en: string[] };
  highlights: { th: string[]; en: string[] };
  featured: boolean;
  links?: { label: I18nText; href: string }[];
  /** true when the repository is private — we say so instead of linking. */
  privateRepo?: boolean;
  accent: "brass" | "abalone";
};

export const projects: Project[] = [
  {
    slug: "iq-tutor",
    title: "IQ Tutor",
    tagline: {
      th: "ระบบหลังบ้านที่รันสถาบันกวดวิชาจริงทั้งสถาบัน ผ่าน LINE",
      en: "The back office that runs an entire real tutoring institute, through LINE",
    },
    year: "2025 – now",
    role: {
      th: "ออกแบบ เขียน และดูแลเองทั้งหมด (solo)",
      en: "Sole designer, developer and operator",
    },
    status: { th: "ใช้งานจริงบน production", en: "Live in production" },
    stack: [
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "React",
      "LINE LIFF",
      "LINE Messaging API",
      "Railway",
      "Vercel",
      "Claude API",
    ],
    body: {
      th: [
        "IQ Tutor คือระบบที่รันสถาบันกวดวิชาแห่งหนึ่งจริง ๆ — มีนักเรียนจริง ติวเตอร์จริง และเงินเดือนที่ต้องจ่ายถูกต้องทุกเดือน ผมเป็นคนเดียวที่ออกแบบ เขียน deploy และดูแลมันทั้งหมด",
        "ระบบแบ่งเป็นสามส่วน: backend เป็น Express + Prisma + PostgreSQL บน Railway, แอดมินแพเนลเป็น React บน Vercel และแอปสำหรับติวเตอร์กับผู้ปกครองเป็น LINE LIFF เพราะคนไทยไม่อยากโหลดแอปใหม่ — ทุกคนมี LINE อยู่แล้ว",
        "ส่วนที่ยากที่สุดไม่ใช่โค้ด แต่เป็น business logic: กฎการจ่ายเงินติวเตอร์ การเช็กชื่อ การเรียนชดเชย (makeup) การสลับติวเตอร์แทน และการตัดคาบเรียน กฎพวกนี้ไม่ได้อยู่ในเอกสารที่ไหน ต้องนั่งคุยกับเจ้าของสถาบันทีละเคสแล้วแปลงเป็นโค้ดที่ตรวจสอบได้",
        "ทุกฟีเจอร์มีเอกสารกำกับ README ของ repo เป็น changelog ที่มีกว่า 95 หัวข้อ แต่ละหัวข้อไม่ได้บอกแค่ว่าฟีเจอร์ทำอะไร แต่บอกว่า ทำไมถึงออกแบบแบบนั้น รวมถึงบั๊กที่เป็นต้นเหตุ ทำให้ปัญหาที่แก้ไปแล้วไม่ย้อนกลับมาอีก",
      ],
      en: [
        "IQ Tutor runs an actual tutoring institute — real students, real tutors, and payroll that has to be correct every single month. I am the only person who designed, wrote, deployed and operates it.",
        "It is three pieces: an Express + Prisma + PostgreSQL backend on Railway, a React admin panel on Vercel, and a LINE LIFF app for tutors and parents — because in Thailand nobody wants to install another app, and everyone already has LINE.",
        "The hard part was never the code. It was the business logic: tutor payroll rules, attendance, makeup classes, substitute tutors, and how a session gets consumed. None of it was written down anywhere. I had to sit with the owner case by case and turn it into rules a computer can verify.",
        "Every feature is documented. The repository README is a changelog with 95+ numbered sections, and each one explains not just what a feature does but why it was designed that way — including the bug that caused it. That is what stops solved problems from coming back.",
      ],
    },
    highlights: {
      th: [
        "ระบบคิดเงินเดือนติวเตอร์และเช็กชื่ออัตโนมัติ พร้อมชุดเทสต์ที่ยิงกับฐานข้อมูลจริงเพื่อกันกฎเรื่องเงินเพี้ยน",
        "Rich menu และ flow ขอลา/เช็กตารางสอน ทำงานจบในแชต LINE ไม่ต้องเปิดแอป",
        "ล็อกเครื่องอัตโนมัติเมื่อใส่รหัสแอดมินผิด 10 ครั้งใน 15 นาที",
        "คู่มือผู้ใช้แบบ GitBook สำหรับแอดมิน ติวเตอร์ และผู้ปกครอง พร้อมภาพหน้าจอทีละขั้น",
        "ผู้ช่วย AI ในแอดมินแพเนลที่ตอบคำถามเกี่ยวกับข้อมูลในระบบได้",
        "CI บน GitHub Actions รันเทสต์ทุกครั้งที่แตะ backend และ auto-deploy ทั้งสามส่วนเมื่อ push เข้า main",
      ],
      en: [
        "Automated tutor payroll and attendance, with a test suite that runs against a real database so money rules cannot silently drift",
        "LINE rich menus and leave-request flows that complete inside the chat — no app to open",
        "Device lockout after 10 wrong admin passwords in 15 minutes",
        "A GitBook handbook for admins, tutors and parents, with step-by-step screenshots",
        "An AI assistant inside the admin panel that answers questions about the system's own data",
        "GitHub Actions CI on every backend change, with auto-deploy of all three apps on push to main",
      ],
    },
    featured: true,
    privateRepo: true,
    accent: "brass",
  },
  {
    slug: "cctv-tracking-scmc",
    title: "CCTV Tracking — SCMC",
    tagline: {
      th: "แผนที่กล้องวงจรปิดทั้งมหาวิทยาลัยเชียงใหม่",
      en: "A live map of every CCTV camera at Chiang Mai University",
    },
    year: "2025",
    role: {
      th: "Full-stack developer (ฝึกงาน/งานจริงให้ SCMC)",
      en: "Full-stack developer for SCMC",
    },
    status: { th: "ส่งมอบแล้ว ใช้งานภายใน", en: "Delivered, in internal use" },
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Docker", "Linux"],
    body: {
      th: [
        "ศูนย์บริหารจัดการเมืองอัจฉริยะ มหาวิทยาลัยเชียงใหม่ (SCMC) ต้องดูแลกล้องวงจรปิด โหนด และสวิตช์กระจายอยู่ทั่วมหาวิทยาลัย ปัญหาคือไม่มีใครรู้ว่ากล้องตัวไหนอยู่ตรงไหน และตัวไหนตายอยู่",
        "ผมทำเว็บที่วางกล้องทุกตัวลงบนแผนที่ กรองตามโซน สถานะ หรือประเภทได้ และสั่ง ping เพื่อเช็กว่ายังออนไลน์อยู่ไหมได้จากหน้าเดียว",
        "Deploy ด้วย Docker image บนเซิร์ฟเวอร์ Linux ของมหาวิทยาลัยเอง พร้อมเอกสารครบตั้งแต่สถาปัตยกรรม การเชื่อม API ไปจนถึง troubleshooting",
      ],
      en: [
        "The Smart City Management Center at Chiang Mai University maintains CCTV cameras, nodes and switches spread across the whole campus. The problem was simple: nobody knew which camera was where, or which ones were dead.",
        "I built a web app that plots every camera on a campus map, lets you filter by zone, status or type, and ping any camera to check it is still online — all from one screen.",
        "Shipped as a Docker image onto the university's own Linux server, with full documentation covering architecture, API integration and troubleshooting.",
      ],
    },
    highlights: {
      th: [
        "แผนที่แบบ interactive พร้อม filter หลายชั้น",
        "Ping เช็กสถานะกล้องแบบ real-time",
        "Deploy ด้วย Docker บนเซิร์ฟเวอร์ Linux ของลูกค้า",
        "รองรับสองภาษา (i18n) ตั้งแต่ต้น",
      ],
      en: [
        "Interactive campus map with layered filtering",
        "Real-time camera reachability checks",
        "Dockerised deploy onto the client's own Linux server",
        "Bilingual (i18n) from day one",
      ],
    },
    featured: true,
    privateRepo: true,
    accent: "abalone",
  },
  {
    slug: "water-pump-management-scmc",
    title: "Water Pump Management — SCMC",
    tagline: {
      th: "ติดตามสถานะปั๊มน้ำและออกรายงาน Excel ตามที่ผู้ใช้ต้องการ",
      en: "Pump status tracking with Excel reports shaped to what the user actually needs",
    },
    year: "2024 – 2025",
    role: { th: "Full-stack developer", en: "Full-stack developer" },
    status: { th: "ส่งมอบแล้ว", en: "Delivered" },
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "MinIO",
      "Docker",
    ],
    body: {
      th: [
        "ระบบติดตามปั๊มน้ำของ SCMC แสดงสถานะปั๊มตามข้อมูลที่เจ้าหน้าที่บันทึก และออกรายงาน Excel ตามเงื่อนไขที่ผู้ใช้เลือกเอง",
        "งานส่วนที่ใช้เวลามากที่สุดคือเรื่องรายงาน เพราะแต่ละฝ่ายอยากได้คอลัมน์ไม่เหมือนกัน ผมเลยทำให้ผู้ใช้เลือกช่วงเวลา มิเตอร์ และคอลัมน์ได้เอง แทนที่จะ hardcode รูปแบบรายงานไว้",
        "Deploy ด้วย Docker image จาก Docker Hub ลงเซิร์ฟเวอร์ Linux พร้อมคู่มือ production deployment และ migration guide",
      ],
      en: [
        "A pump-monitoring system for SCMC that shows pump status from operator readings and exports Excel reports on the user's own terms.",
        "Reporting ate most of the time, because every department wanted different columns. Instead of hardcoding one report shape, I let users choose the date range, the meters and the columns themselves.",
        "Deployed as a Docker image pulled from Docker Hub onto a Linux server, with a written production deployment guide and migration notes.",
      ],
    },
    highlights: {
      th: [
        "Export Excel แบบกำหนดคอลัมน์และช่วงเวลาเองได้",
        "จัดการสารเคมีและการจ่ายสาร (chemical dosing)",
        "เก็บไฟล์แนบด้วย MinIO",
        "เอกสาร deployment และ migration สำหรับทีมที่รับช่วงต่อ",
      ],
      en: [
        "Excel export with user-selected columns and date ranges",
        "Chemical inventory and dosing records",
        "File attachments stored in MinIO",
        "Deployment and migration docs written for whoever takes it over",
      ],
    },
    featured: true,
    privateRepo: true,
    accent: "brass",
  },
  {
    slug: "asset-management-scmc",
    title: "Asset Management — SCMC",
    tagline: {
      th: "ล้างข้อมูล Excel 10,000 แถวเข้าฐานข้อมูล แล้วติด QR ให้ทรัพย์สินทุกชิ้น",
      en: "Ten thousand messy spreadsheet rows into a real database, then a QR tag on every asset",
    },
    year: "2024",
    role: {
      th: "Frontend developer + data cleansing",
      en: "Frontend developer and data cleansing",
    },
    status: { th: "ส่งมอบแล้ว", en: "Delivered" },
    stack: [
      "React 18",
      "Vite",
      "TypeScript",
      "TailwindCSS",
      "TanStack Query",
      "Axios",
      "Radix UI",
      "Express",
    ],
    body: {
      th: [
        "ระบบจัดการทรัพย์สินของ SCMC เริ่มจากไฟล์ Excel ที่สะสมมาหลายปี — ประมาณหนึ่งหมื่นแถว คอลัมน์ไม่ตรงกัน ชื่อสะกดคนละแบบ และมีแถวซ้ำ",
        "ผมเขียนกระบวนการ data cleansing เพื่อ normalize ข้อมูลพวกนั้นแล้ว map เข้าโครงสร้างฐานข้อมูลที่ถูกต้อง จากนั้นทำหน้าเว็บที่ดึงข้อมูลผ่าน React Query ตาม API spec ใน Swagger",
        "ส่วนที่ผู้ใช้ชอบที่สุดคือ QR code ของทรัพย์สินแต่ละชิ้น ที่เข้ารหัสจาก id ในฐานข้อมูล และสั่งพิมพ์เป็นชุดได้จากการเลือกแถวใน DataTable",
      ],
      en: [
        "The asset system started life as an Excel file that had grown for years — roughly ten thousand rows, inconsistent columns, the same thing spelled three ways, and duplicates.",
        "I wrote the data cleansing pass that normalised all of it and mapped it into a correct database structure, then built the UI, fetching through React Query against the documented Swagger API.",
        "The part users liked most: a QR code per asset, encoded from its database id, printable in batches straight from a selection in the data table.",
      ],
    },
    highlights: {
      th: [
        "ล้างและ map ข้อมูลราว 10,000 แถวจาก Excel เข้า DB",
        "QR code ต่อทรัพย์สิน พิมพ์เป็นชุดจาก DataTable ได้",
        "UI component ที่ reuse ได้ บน Radix + Tailwind",
        "Data fetching ด้วย TanStack Query ตาม Swagger spec",
      ],
      en: [
        "Cleansed and mapped ~10,000 spreadsheet rows into the database",
        "Per-asset QR codes, batch-printable from a data table selection",
        "Reusable UI components on Radix + Tailwind",
        "Data fetching via TanStack Query against the Swagger spec",
      ],
    },
    featured: false,
    privateRepo: true,
    accent: "abalone",
  },
  {
    slug: "melon-smart-farm",
    title: "Melon Smart Farm",
    tagline: {
      th: "ระบบติดตามการปลูกเมล่อนตั้งแต่เพาะกล้าถึงเก็บเกี่ยว",
      en: "Tracking a melon crop from seedling to harvest",
    },
    year: "2025",
    role: { th: "Full-stack developer", en: "Full-stack developer" },
    status: { th: "โปรเจกต์ส่วนตัว", en: "Personal project" },
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "shadcn/ui",
      "Docker",
    ],
    body: {
      th: [
        "โปรเจกต์ที่เริ่มจากความอยากรู้ว่าฟาร์มเมล่อนจริง ๆ ต้องเก็บข้อมูลอะไรบ้าง — รอบการปลูก การให้น้ำ ให้ปุ๋ย และผลผลิตต่อแปลง",
        "ใช้เป็นที่ทดลอง Next.js App Router กับ Prisma อย่างจริงจัง รวมถึงระบบ auth ที่แยกสิทธิ์ระหว่างเจ้าของฟาร์มกับคนงาน",
      ],
      en: [
        "This started from wanting to know what a melon farm actually needs to record — planting cycles, watering, fertiliser, and yield per plot.",
        "It doubled as my serious playground for the Next.js App Router with Prisma, including role separation between the farm owner and the workers.",
      ],
    },
    highlights: {
      th: [
        "โครงสร้างข้อมูลรอบการปลูกและผลผลิตต่อแปลง",
        "Auth แยกสิทธิ์ด้วย NextAuth",
        "docker-compose สำหรับ dev ที่รันได้ทันที",
      ],
      en: [
        "Data model for growing cycles and per-plot yield",
        "Role-separated auth with NextAuth",
        "A docker-compose dev setup that runs out of the box",
      ],
    },
    featured: false,
    privateRepo: true,
    accent: "abalone",
  },
  {
    slug: "income-expenses-app",
    title: "Income & Expenses",
    tagline: {
      th: "แอปมือถือบันทึกรายรับรายจ่าย ที่ทำเพราะอยากใช้เอง",
      en: "A mobile money tracker I built because I wanted to use it",
    },
    year: "2025",
    role: { th: "Mobile developer", en: "Mobile developer" },
    status: { th: "โปรเจกต์ส่วนตัว", en: "Personal project" },
    stack: ["React Native", "Expo", "TypeScript", "Jest", "EAS Build"],
    body: {
      th: [
        "ก่อนหน้านี้ผมจดรายรับรายจ่ายไว้ในไฟล์ Excel ซึ่งเปิดบนมือถือแล้วใช้ไม่ไหว เลยเขียนแอปขึ้นมาเอง",
        "เป็นโปรเจกต์แรกที่ผมทำ mobile แบบครบวงจร ตั้งแต่ Expo Router, การเก็บข้อมูลในเครื่อง, เทสต์ด้วย Jest ไปจนถึง build ผ่าน EAS",
      ],
      en: [
        "I used to track my spending in a spreadsheet, which is unusable on a phone. So I wrote the app instead.",
        "It was my first end-to-end mobile project: Expo Router, local persistence, Jest tests, and builds through EAS.",
      ],
    },
    highlights: {
      th: [
        "Expo Router + TypeScript ทั้งโปรเจกต์",
        "Unit test ด้วย Jest",
        "ตั้งค่า EAS build สำหรับ Android/iOS",
      ],
      en: [
        "Expo Router + TypeScript throughout",
        "Unit tested with Jest",
        "EAS build configured for Android and iOS",
      ],
    },
    featured: false,
    privateRepo: true,
    accent: "brass",
  },
  {
    slug: "esp32-smart-bin",
    title: "ESP32 Smart Bin & friends",
    tagline: {
      th: "ถังขยะเปิดเองได้ กล้องโฟกัสอัตโนมัติ และของเล่นฮาร์ดแวร์อื่น ๆ",
      en: "A bin that opens itself, a camera that focuses itself, and other hardware toys",
    },
    year: "2023 – 2024",
    role: { th: "ออกแบบวงจรและเขียนเฟิร์มแวร์", en: "Circuit design and firmware" },
    status: { th: "โปรเจกต์เรียน / งานอดิเรก", en: "Coursework and hobby" },
    stack: ["ESP32", "Arduino", "MQTT", "MicroPython", "C++"],
    body: {
      th: [
        "ช่วงเรียนผมทำโปรเจกต์ฮาร์ดแวร์เล็ก ๆ อยู่หลายตัว ตัวที่ชอบที่สุดคือถังขยะที่เปิดฝาเองเมื่อเอามือเข้าใกล้เซนเซอร์อัลตราโซนิก วัดระดับขยะในถังได้ และสั่งงานผ่าน dashboard บนเว็บได้",
        "นอกจากนั้นมีกล้องที่หมุนวงแหวนโฟกัสด้วยมอเตอร์ตามสูตรคณิตศาสตร์ นาฬิกาจับเวลาด้วยสเต็ปมอเตอร์ที่ส่งสถานะขึ้น MQTT dashboard และไฟที่เปิด-ปิดเองตามเซนเซอร์แสงพร้อมสั่งผ่านเบราว์เซอร์",
        "โปรเจกต์พวกนี้สอนเรื่องที่เว็บไม่เคยสอน: ของจริงมันพัง เซนเซอร์อ่านค่าเพี้ยน และแบตหมดตอนที่ไม่ควรหมด",
      ],
      en: [
        "During my degree I built a run of small hardware projects. My favourite was a bin that opens its own lid when a hand comes near an ultrasonic sensor, measures how full it is, and can be driven entirely from a web dashboard.",
        "There was also a camera that turns its own focus ring with a motor using a derived formula, a stopwatch built on a stepper motor that reports state to an MQTT dashboard, and a light that switches itself by ambient sensor and can be overridden from a browser.",
        "These taught me what web work never does: physical things break, sensors lie, and batteries die at the worst possible moment.",
      ],
    },
    highlights: {
      th: [
        "ถังขยะ ESP32 + servo + ultrasonic พร้อม dashboard",
        "กล้องโฟกัสอัตโนมัติด้วยมอเตอร์และสูตรคำนวณระยะ",
        "MQTT dashboard สำหรับอุปกรณ์หลายตัว",
      ],
      en: [
        "ESP32 + servo + ultrasonic bin with a web dashboard",
        "Motor-driven autofocus camera using a derived distance formula",
        "An MQTT dashboard across several devices",
      ],
    },
    featured: false,
    accent: "abalone",
  },
  {
    slug: "upbeat",
    title: "UPBEAT",
    tagline: {
      th: "เกมวางแผนแบบผลัดตา เขียนด้วย Java OOP ล้วน ๆ",
      en: "A turn-based strategy game, written in plain Java OOP",
    },
    year: "2023",
    role: { th: "Gameplay / game logic", en: "Gameplay and game logic" },
    status: { th: "โปรเจกต์เรียน", en: "University project" },
    stack: ["Java", "JavaFX", "OOP", "Parser / interpreter"],
    body: {
      th: [
        "เกมวางแผนที่ผู้เล่นเขียน 'แผน' เป็นสคริปต์แล้วให้ตัวละครทำตาม ซึ่งแปลว่าต้องเขียน parser และ interpreter ของภาษาเล็ก ๆ ขึ้นมาเอง",
        "นี่เป็นครั้งแรกที่ผมเข้าใจจริง ๆ ว่าทำไม OOP ถึงมีอยู่ — ตอนที่ต้องเพิ่มคำสั่งใหม่ในภาษาแล้วไม่อยากแก้โค้ดทั้งไฟล์",
      ],
      en: [
        "A strategy game where players write a 'plan' as a script and their unit executes it — which means writing a parser and interpreter for a small language from scratch.",
        "It was the first time I actually understood why OOP exists: when you need to add a new command to the language without rewriting the whole file.",
      ],
    },
    highlights: {
      th: [
        "Parser และ interpreter ของภาษาสคริปต์ในเกม",
        "ออกแบบคลาสตาม OOP เพื่อให้เพิ่มคำสั่งใหม่ได้ง่าย",
      ],
      en: [
        "A parser and interpreter for the in-game scripting language",
        "Class design that makes adding a new command cheap",
      ],
    },
    featured: false,
    accent: "brass",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Now page                                                            */
/* ------------------------------------------------------------------ */

export const nowUpdated = "2026-10-18";

export const nowItems: { heading: I18nText; body: I18nText }[] = [
  {
    heading: { th: "งานประจำ", en: "Day job" },
    body: {
      th: "ทำงานเป็น software engineer ที่ VBreathe — แอปมือถือที่คุยกับอุปกรณ์จริง มี backend บน AWS กำลังเรียนรู้ฝั่ง infrastructure และ release process ของแอปมือถืออย่างจริงจัง",
      en: "Working as a software engineer at VBreathe — a mobile app that talks to real hardware, with an AWS backend. I'm getting properly deep into infrastructure and the mobile release process.",
    },
  },
  {
    heading: { th: "โปรเจกต์ข้างเคียง", en: "Side project" },
    body: {
      th: "ดูแล IQ Tutor ต่อเนื่อง ตอนนี้กำลังขยายคู่มือผู้ใช้และเพิ่มชุดเทสต์ที่คุมกฎเรื่องเงินให้แน่นขึ้น",
      en: "Still running IQ Tutor. Right now I'm expanding the user handbook and tightening the test suite that guards the money rules.",
    },
  },
  {
    heading: { th: "กำลังเรียนรู้", en: "Learning" },
    body: {
      th: "AWS (Terraform, Lambda) และการออกแบบระบบที่ส่งมอบให้คนอื่นดูแลต่อได้ — เขียน runbook ให้คนอื่นอ่านรู้เรื่องยากกว่าที่คิด",
      en: "AWS (Terraform, Lambda) and designing systems someone else can take over. Writing a runbook another person can actually follow is harder than it sounds.",
    },
  },
  {
    heading: { th: "นอกจอ", en: "Off-screen" },
    body: {
      th: "ซ้อม fingerstyle guitar, เป่าขลุ่ย, calisthenics พื้นฐาน และเล่น MOBA กับ FPS กับเพื่อน",
      en: "Practising fingerstyle guitar, playing the flute, basic calisthenics, and MOBA/FPS with friends.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Uses page                                                           */
/* ------------------------------------------------------------------ */

export const uses: { group: I18nText; items: { name: string; note: I18nText }[] }[] = [
  {
    group: { th: "เครื่องและระบบ", en: "Machine & OS" },
    items: [
      {
        name: "MacBook (Apple Silicon)",
        note: { th: "เครื่องหลัก ใช้ทุกวัน", en: "Daily driver" },
      },
      {
        name: "Rectangle",
        note: { th: "จัดหน้าต่างด้วยคีย์ลัด", en: "Keyboard window management" },
      },
    ],
  },
  {
    group: { th: "เขียนโค้ด", en: "Writing code" },
    items: [
      {
        name: "VS Code",
        note: { th: "เอดิเตอร์หลัก", en: "Main editor" },
      },
      {
        name: "Claude Code",
        note: {
          th: "ใช้คู่กันทุกวัน โดยเฉพาะตอนไล่บั๊กและเขียนเอกสาร",
          en: "Alongside it every day, especially for debugging and writing docs",
        },
      },
      {
        name: "Docker Desktop",
        note: { th: "Postgres และ service ตอน dev", en: "Postgres and services in dev" },
      },
      {
        name: "DBeaver / Postman",
        note: { th: "ส่องฐานข้อมูลและยิง API", en: "Poking at databases and APIs" },
      },
    ],
  },
  {
    group: { th: "Deploy และโครงสร้าง", en: "Deploy & infra" },
    items: [
      {
        name: "Railway",
        note: { th: "Backend + Postgres ของ IQ Tutor", en: "IQ Tutor's backend + Postgres" },
      },
      {
        name: "Vercel",
        note: { th: "Frontend ทุกตัว รวมถึงเว็บนี้", en: "Every frontend, including this site" },
      },
      {
        name: "GitHub Actions",
        note: { th: "รันเทสต์ก่อน deploy", en: "Tests before deploy" },
      },
    ],
  },
  {
    group: { th: "คิดและจดบันทึก", en: "Thinking & notes" },
    items: [
      {
        name: "Obsidian",
        note: {
          th: "บันทึกงานรายวัน ซึ่งกลายมาเป็นบทความในเว็บนี้",
          en: "Daily build logs, which become the posts on this site",
        },
      },
    ],
  },
  {
    group: { th: "ฮาร์ดแวร์เล่น ๆ", en: "Tinkering" },
    items: [
      {
        name: "ESP32 / Arduino",
        note: { th: "เซนเซอร์และมอเตอร์", en: "Sensors and motors" },
      },
      {
        name: "Acoustic guitar",
        note: { th: "Fingerstyle", en: "Fingerstyle" },
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Music / Gallery / Gaming                                            */
/* ------------------------------------------------------------------ */

export type Track = {
  title: string;
  note: I18nText;
  /** Path under /public. Leave empty until a real file is dropped in. */
  src?: string;
  instrument: "guitar" | "flute";
};

export const tracks: Track[] = [
  {
    title: "Kiss the Rain — fingerstyle arrangement",
    note: {
      th: "เพลงแรกที่เล่นจบทั้งเพลงโดยไม่ต้องดูแท็บ",
      en: "The first piece I could play all the way through without looking at tab",
    },
    instrument: "guitar",
  },
  {
    title: "Canon in D — fingerstyle",
    note: {
      th: "ใช้ซ้อมความนิ่งของมือขวา",
      en: "What I practise right-hand control on",
    },
    instrument: "guitar",
  },
  {
    title: "ลาวดวงเดือน — ขลุ่ยเพียงออ",
    note: {
      th: "เพลงไทยเดิมที่เป่าแล้วสบายใจที่สุด",
      en: "The Thai classic I find most calming to play",
    },
    instrument: "flute",
  },
];

export type Photo = { src: string; caption: I18nText; w: number; h: number };

export const photos: Photo[] = [];

export const gaming: {
  game: string;
  role: I18nText;
  takeaway: I18nText;
  accent: "brass" | "abalone";
}[] = [
  {
    game: "League of Legends",
    role: { th: "MOBA · เล่นมาตั้งแต่มัธยม", en: "MOBA · since high school" },
    takeaway: {
      th: "สอนเรื่องการยอมเสียเปรียบตรงหนึ่งเพื่อได้เปรียบอีกตรง — เหมือนตอนตัดสินใจว่าจะ optimize อะไรในระบบ",
      en: "Taught me to give up ground in one lane to win another — the same trade-off as deciding what to optimise in a system.",
    },
    accent: "brass",
  },
  {
    game: "FPS (Valorant / CS)",
    role: { th: "FPS · เล่นกับเพื่อนเป็นหลัก", en: "FPS · mostly with friends" },
    takeaway: {
      th: "การสื่อสารสั้น ชัด และตรงเวลา สำคัญกว่าการเล็งแม่น",
      en: "Short, clear, well-timed communication beats raw aim.",
    },
    accent: "abalone",
  },
];

/* ------------------------------------------------------------------ */
/* CV                                                                  */
/* ------------------------------------------------------------------ */

export const cv = {
  summary: {
    th: "วิศวกรคอมพิวเตอร์ที่ถนัดงาน full-stack และชอบงานที่ต้องแปลงกฎทางธุรกิจที่คลุมเครือให้กลายเป็นระบบที่ตรวจสอบได้ มีประสบการณ์ดูแลระบบที่ใช้งานจริงด้วยตัวเองตั้งแต่ออกแบบจนถึง deploy",
    en: "A computer engineer who works across the stack and enjoys turning fuzzy business rules into systems a computer can verify. I have taken production systems from design through deployment and kept them running on my own.",
  } as I18nText,
  experience: [
    {
      org: "VBreathe",
      title: { th: "Software Engineer", en: "Software Engineer" } as I18nText,
      period: "2026 – now",
      place: { th: "เชียงใหม่", en: "Chiang Mai" } as I18nText,
      points: {
        th: [
          "พัฒนาแอปมือถือที่เชื่อมต่อกับอุปกรณ์จริง พร้อม backend บน AWS",
          "ร่วมกระบวนการ release ทั้ง Android และ iOS",
        ],
        en: [
          "Mobile app development against real hardware, with an AWS backend",
          "Part of the Android and iOS release process",
        ],
      },
    },
    {
      org: "IQ Tutor",
      title: {
        th: "ผู้พัฒนาและดูแลระบบ (ทำคนเดียว)",
        en: "Sole developer and operator",
      } as I18nText,
      period: "2025 – now",
      place: { th: "โปรเจกต์อิสระ", en: "Independent" } as I18nText,
      points: {
        th: [
          "ออกแบบและสร้างระบบจัดการสถาบันกวดวิชาครบวงจรบน LINE (backend, แอดมินแพเนล, LIFF app)",
          "เขียนกฎการคิดเงินเดือนและการเช็กชื่อ พร้อมชุดเทสต์ที่ยิงกับฐานข้อมูลจริง",
          "ดูแล production เอง ทั้ง deploy, backup และการแก้ปัญหาหน้างาน",
        ],
        en: [
          "Designed and built an end-to-end tutoring-institute system on LINE (backend, admin panel, LIFF app)",
          "Wrote the payroll and attendance rules, with a test suite running against a real database",
          "Operate production myself — deploys, backups, and incidents",
        ],
      },
    },
    {
      org: "Smart City Management Center, Chiang Mai University (SCMC)",
      title: { th: "Full-stack Developer", en: "Full-stack Developer" } as I18nText,
      period: "2024 – 2025",
      place: { th: "เชียงใหม่", en: "Chiang Mai" } as I18nText,
      points: {
        th: [
          "เว็บติดตามกล้องวงจรปิดทั่วมหาวิทยาลัย พร้อม ping เช็กสถานะ (Next.js 15, Docker)",
          "ระบบติดตามปั๊มน้ำพร้อมรายงาน Excel ที่ผู้ใช้กำหนดเองได้",
          "ระบบจัดการทรัพย์สิน: ล้างข้อมูล Excel ~10,000 แถวเข้า DB และทำ QR code ต่อทรัพย์สิน",
        ],
        en: [
          "Campus-wide CCTV tracking site with live reachability checks (Next.js 15, Docker)",
          "Water-pump monitoring with user-configurable Excel reporting",
          "Asset management: cleansed ~10,000 spreadsheet rows into the database and built per-asset QR codes",
        ],
      },
    },
  ],
  education: [
    {
      org: "Chiang Mai University",
      title: {
        th: "วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์ — เกียรตินิยมอันดับ 1",
        en: "B.Eng. Computer Engineering — First Class Honours",
      } as I18nText,
      period: "2022 – 2026",
      note: {
        th: "วิชาที่เกี่ยวข้อง: Full Stack Development, Advanced Database, Data Mining, IoT and Big Data, Big Data Optimization",
        en: "Relevant coursework: Full Stack Development, Advanced Database, Data Mining, IoT and Big Data, Big Data Optimization",
      } as I18nText,
    },
    {
      org: "Montfort College",
      title: {
        th: "มัธยมปลาย สายวิทย์-คณิต",
        en: "High School Diploma, Science & Mathematics",
      } as I18nText,
      period: "2016 – 2022",
      note: { th: "", en: "" } as I18nText,
    },
  ],
  skills: [
    {
      group: { th: "ภาษา", en: "Languages" } as I18nText,
      items: ["TypeScript", "JavaScript", "Java", "Python", "C++", "SQL", "HTML/CSS"],
    },
    {
      group: { th: "เฟรมเวิร์กและไลบรารี", en: "Frameworks & libraries" } as I18nText,
      items: [
        "Next.js",
        "React",
        "React Native / Expo",
        "Express",
        "Prisma",
        "NextAuth",
        "TanStack Query",
        "Tailwind CSS",
        "shadcn/ui",
      ],
    },
    {
      group: { th: "โครงสร้างและเครื่องมือ", en: "Infrastructure & tools" } as I18nText,
      items: [
        "PostgreSQL",
        "Docker",
        "Railway",
        "Vercel",
        "AWS (learning)",
        "GitHub Actions",
        "Nginx",
        "MinIO",
        "LINE Messaging API / LIFF",
      ],
    },
    {
      group: { th: "อื่น ๆ", en: "Other" } as I18nText,
      items: ["ESP32 / Arduino", "MQTT", "Figma (basic)", "Photoshop / Premiere Pro (basic)"],
    },
  ],
  languages: [
    { name: { th: "ไทย", en: "Thai" } as I18nText, level: { th: "ภาษาแม่", en: "Native" } as I18nText },
    {
      name: { th: "อังกฤษ", en: "English" } as I18nText,
      level: { th: "ใช้งานได้ดี (อ่าน/เขียนเอกสารทางเทคนิค)", en: "Professional working (technical reading & writing)" } as I18nText,
    },
  ],
};
