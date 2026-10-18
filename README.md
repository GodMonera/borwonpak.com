# borwonpak.com

เว็บไซต์ส่วนตัวของ **บวรภัค ดวงจันทร์ (ปาล์ม)** — ไม่ใช่แค่ portfolio
แต่เป็นที่รวมงาน บันทึก ของเล่นที่เล่นได้จริง และผู้ช่วย AI ที่ตอบคำถามเกี่ยวกับตัวผมได้

สองภาษา (ไทย / อังกฤษ) สลับได้ทุกหน้า

---

## มีอะไรบ้าง

| เส้นทาง | คืออะไร |
| --- | --- |
| `/th` · `/en` | หน้าแรก — งานเด่น บันทึกล่าสุด และ "ตอนนี้ทำอะไรอยู่" |
| `/work` · `/work/[slug]` | ผลงานทั้งหมด พร้อมหน้ารายละเอียดต่อโปรเจกต์ |
| `/blog` · `/blog/[slug]` | บันทึกการทำงาน เขียนจากไฟล์ markdown ใน `content/posts/` |
| `/lab` | ของเล่น 3 ตัวที่เล่นได้จริงบนหน้าเว็บ (ดูด้านล่าง) |
| `/ask` | แชทบอทที่รู้จักเนื้อหาทั้งเว็บ ตอบสตรีมทีละตัวอักษร |
| `/guestbook` | สมุดเยี่ยม เก็บลง Postgres |
| `/now` | หน้า `/now` ตามธรรมเนียม nownownow.com |
| `/uses` | อุปกรณ์และเครื่องมือที่ใช้ |
| `/music` · `/gallery` · `/gaming` | ด้านที่ไม่ใช่งาน |
| `/cv` | เรซูเม่ สั่งพิมพ์เป็น PDF ได้ |
| `/feed.xml` · `/sitemap.xml` · `/robots.txt` | RSS และ SEO |

### ของเล่นใน `/lab`

1. **แผนผังคอร์ดกีตาร์** — 8 คอร์ดที่ใช้บ่อยตอนเล่น fingerstyle กดแล้วได้ยินเสียงจริง
   สังเคราะห์สดด้วย Web Audio ไม่มีไฟล์เสียงสักไฟล์
2. **เครื่องคิดค่าสอนติวเตอร์** — จำลองรูปร่างของ business logic แบบที่เจอใน IQ Tutor
   แสดง "กฎที่ถูกใช้" ทีละข้อ ให้เห็นว่ากฎไหนชนะกฎไหน
   *(ตัวเลขเป็นตัวอย่างสมมติ ไม่ใช่อัตราจริงของสถาบันใด)*
3. **ถังขยะ ESP32 จำลอง** — ถังขยะที่ประกอบตอนเรียน ย้ายมาอยู่ในเบราว์เซอร์
   พร้อม serial log จำลอง และ debounce ตัวจริงที่แก้ปัญหาฝากระพือ

---

## เทคโนโลยี

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **@anthropic-ai/sdk** — แชทบอทบน `/ask` (Claude Opus 5, สตรีม)
- **pg** — สมุดเยี่ยม (Postgres)
- `gray-matter` + `marked` — อ่านบทความจาก markdown

ทุกหน้ายกเว้น API เป็น static (SSG) ทั้งสองภาษา

---

## รันในเครื่อง

```bash
npm install
cp .env.example .env.local   # ใส่ค่าหรือปล่อยว่างก็ได้
npm run dev
```

เปิด http://localhost:3000 — จะถูก redirect ไป `/th` หรือ `/en` ตามภาษาเบราว์เซอร์

### ตัวแปรสภาพแวดล้อม

ทั้งสองตัว **ไม่จำเป็น** — เว็บ build และรันได้โดยไม่ต้องมี เพียงแต่ฟีเจอร์ที่ต้องใช้จะแสดงข้อความบอกว่ายังไม่ได้ตั้งค่า

| ตัวแปร | ใช้ทำอะไร | ไม่ใส่แล้วเป็นยังไง |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | แชทบอทบน `/ask` | หน้า `/ask` ขึ้นว่า "แชทยังไม่เปิดใช้งาน" |
| `DATABASE_URL` | สมุดเยี่ยม | หน้า `/guestbook` ขึ้นเป็นโหมดอ่านอย่างเดียว |
| `DATABASE_SSL` | ตั้งเป็น `off` เฉพาะตอนต่อ Postgres ที่ไม่ใช้ TLS (เช่น container ในเครื่อง) | ใช้ TLS โดยปริยาย |

ตาราง `guestbook` ถูกสร้างอัตโนมัติตอนใช้งานครั้งแรก ไม่ต้องรัน migration เอง

---

## แก้เนื้อหา

เนื้อหาเกือบทั้งหมดอยู่ในสองที่ ไม่ต้องแตะ component

### `content/site.ts`

ไฟล์เดียวที่คุมเกือบทุกอย่าง — ข้อมูลติดต่อ, รายการโปรเจกต์, หน้า `/now`, `/uses`,
รายชื่อเพลง, แกลเลอรี, เกม และเรซูเม่ ทุกข้อความเป็นคู่ `{ th, en }`

เพิ่มโปรเจกต์ใหม่: เพิ่ม object ใน array `projects` — หน้า `/work/<slug>`,
sitemap และข้อมูลของแชทบอทจะอัปเดตตามเองทั้งหมด

### `content/posts/`

บทความหนึ่งเรื่อง = ไฟล์ markdown สองไฟล์ ชื่อเดียวกันต่างกันที่ภาษา:

```
content/posts/my-post.th.md
content/posts/my-post.en.md
```

frontmatter ที่ต้องมี:

```yaml
---
title: "หัวข้อ"
date: "2026-10-18"
summary: "สรุปหนึ่งบรรทัด"
tags: ["IQ Tutor", "testing"]
---
```

มีภาษาเดียวก็ได้ — บทความจะขึ้นเฉพาะในภาษานั้น

### รูปและเสียง

- เพลง: วางไฟล์ `.mp3` ใน `public/audio/` แล้วใส่ `src: "/audio/ชื่อไฟล์.mp3"` ใน `tracks`
- รูป: วางใน `public/img/gallery/` แล้วเพิ่มใน `photos` พร้อมความกว้าง/สูงจริง

---

## แชทบอทรู้อะไรบ้าง

`lib/knowledge.ts` ประกอบ "เอกสารอ้างอิง" จาก `content/site.ts` และบทความทุกเรื่อง
แล้วส่งทั้งก้อนไปกับ system prompt

ที่ไม่ใช้ vector search เพราะเนื้อหาทั้งเว็บมีแค่ไม่กี่พัน token — ส่งทั้งหมดแม่นกว่า
การตัดเป็น chunk และถูกกว่าด้วย เพราะก้อนนี้เหมือนเดิมทุก request จึงวาง
cache breakpoint ไว้ท้ายก้อนและได้ cache hit แทบทุกครั้ง

เพิ่มเนื้อหาใน `content/site.ts` หรือเขียนบทความใหม่ แชทบอทจะรู้ทันทีโดยไม่ต้องแก้โค้ด

ตัวป้องกัน: จำกัดจำนวนคำถามต่อ IP, ตัดความยาวข้อความ, และใน system prompt สั่งไว้ว่า
ห้ามเชื่อคำสั่งที่แฝงมาในข้อความของผู้ใช้

---

## Deploy

### 1. Push ขึ้น GitHub

```bash
git remote add origin https://github.com/GodMonera/borwonpak.com.git
git push -u origin main
```

### 2. ต่อกับ Vercel

Import repo ที่ [vercel.com/new](https://vercel.com/new) — Vercel ตรวจเจอ Next.js เอง
ไม่ต้องตั้งค่า build command

ใส่ environment variables ทั้งสองตัวใน **Settings → Environment Variables**
(เลือกให้ครบทั้ง Production, Preview, Development)

### 3. ฐานข้อมูลสำหรับสมุดเยี่ยม

ทางที่เร็วที่สุดคือ Neon: สร้าง project → copy connection string → ใส่เป็น `DATABASE_URL`
Railway ก็ใช้ได้เหมือนกัน

### 4. ผูกโดเมน

ใน Vercel: **Settings → Domains → Add** แล้วใส่ `borwonpak.com`
จากนั้นตั้ง DNS ที่ผู้ให้บริการโดเมน:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

ถ้าใช้ Cloudflare Registrar ให้ตั้ง proxy เป็น **DNS only** (เมฆสีเทา)
เพื่อให้ Vercel ออกใบรับรอง TLS ได้

> ค่าข้างบนเป็นค่าที่ Vercel ใช้อยู่ตอนเขียน — ให้ยึดค่าที่หน้า Domains ของ Vercel
> แสดงจริงเป็นหลัก เพราะอาจเปลี่ยนได้

---

## สคริปต์

```bash
npm run dev     # dev server
npm run build   # production build (ตรวจ type ให้ด้วย)
npm start       # รัน production build
npx eslint .    # lint
```
