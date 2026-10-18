# Working notes for this repo

เว็บไซต์ส่วนตัวของบวรภัค ดวงจันทร์ (ปาล์ม) — Next.js 16 App Router, สองภาษา ไทย/อังกฤษ

## สิ่งที่ต้องรู้ก่อนแก้

**Root layout อยู่ที่ `app/[locale]/layout.tsx` ไม่ใช่ `app/layout.tsx`** — ทำแบบนี้เพื่อให้
`<html lang>` ตรงกับภาษาของหน้าจริง ๆ ตามแพตเทิร์น i18n ของ Next.js เอง
อย่าสร้าง `app/layout.tsx` หรือ `app/page.tsx` ขึ้นมา — `/` ถูกจัดการด้วย `proxy.ts`
ที่ redirect ไปตาม `accept-language`

**เนื้อหาอยู่ใน `content/` ไม่ใช่ใน component** ถ้าจะเพิ่มโปรเจกต์ แก้ข้อมูลส่วนตัว
หรือแก้หน้า now/uses/cv ให้แก้ที่ `content/site.ts` อย่างเดียว ทุกข้อความเป็นคู่ `{ th, en }`

**คำแปล UI อยู่ใน `lib/i18n.ts`** พจนานุกรมถูก type ไว้ ถ้าเพิ่มคีย์ในภาษาหนึ่ง
แล้วลืมอีกภาษา `tsc` จะฟ้อง

**แชทบอทกินเนื้อหาทั้งเว็บ** `lib/knowledge.ts` ประกอบ context จาก `content/site.ts`
และบทความทุกเรื่อง เพิ่มเนื้อหาที่ใดที่หนึ่งแล้วแชทบอทรู้ทันที ไม่ต้องแก้โค้ด
ถ้าแก้ `systemPrompt()` ให้ระวังส่วน boundaries — มันกันไม่ให้บอทแต่งเรื่องและกัน prompt injection

## กฎที่ใช้ในโค้ดนี้

**ทุกฟีเจอร์ที่ต้องพึ่ง env var ต้องทำงานได้เมื่อไม่มี env var** หน้า `/ask` และ `/guestbook`
แสดงข้อความ "ยังไม่ได้ตั้งค่า" แทนที่จะพัง — ทำให้ build ผ่านและ deploy ได้ตั้งแต่ commit แรก
ถ้าเพิ่มฟีเจอร์ที่ต้องใช้ service ภายนอก ให้ทำแบบเดียวกัน

**ห้ามใส่ setState ใน useEffect** ESLint rule `react-hooks/set-state-in-effect` เปิดอยู่และเป็น error
ถ้าจะ sync state กับ event ให้ทำใน event handler (ดู `components/lab/smart-bin.tsx`)
ถ้าต้องรีเซ็ต state เมื่อ prop เปลี่ยน ให้ปรับ state ระหว่าง render (ดู `components/site-header.tsx`)

**ธีมสว่าง/มืดคุมด้วย CSS ไม่ใช่ React state** `components/theme-script.tsx` อ่าน localStorage
ก่อน paint และไอคอนปุ่มสลับธีมเลือกด้วย CSS (`.icon-when-light` / `.icon-when-dark`)
วิธีนี้ทำให้ markup ฝั่ง server กับ client ตรงกันเสมอและไม่มีจอขาวแวบ

**ข้อมูลลูกค้าที่เป็นความลับห้ามขึ้นเว็บ** โดยเฉพาะอัตราค่าจ้างจริง ชื่อคนจริง
หรือรายละเอียด infrastructure ของที่ทำงาน เครื่องคิดค่าสอนใน `/lab` ใช้ตัวเลขสมมติ
และบอกไว้ชัดเจนบนหน้าเว็บว่าเป็นตัวอย่าง — ให้คงไว้แบบนั้น

## ก่อน commit

```bash
npm run build   # ตรวจ type ด้วยในตัว
npx eslint .
```
