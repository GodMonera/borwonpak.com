/**
 * A skin is the site's visual language: palette, hero, section divider and
 * type treatment. The page *structure* is shared, so adding one means a token
 * block in globals.css plus a hero component — not a second copy of the site.
 */
export const skins = ["neck", "hud", "palm"] as const;
export type Skin = (typeof skins)[number];
export const defaultSkin: Skin = "neck";

export function isSkin(value: unknown): value is Skin {
  return typeof value === "string" && (skins as readonly string[]).includes(value);
}

export const skinMeta: Record<
  Skin,
  { name: { th: string; en: string }; note: { th: string; en: string } }
> = {
  neck: {
    name: { th: "คอกีตาร์", en: "Fretboard" },
    note: {
      th: "ไม้โรสวูดกับลวดเฟร็ตทองเหลือง เมนูเป็นคอร์ดที่กดแล้วมีเสียง",
      en: "Rosewood and brass fret wire. The menu is chords you can hear.",
    },
  },
  hud: {
    name: { th: "เครื่องมือวัด", en: "Instrument" },
    note: {
      th: "พื้นดำ เส้นบางเป็นตาราง ตัวเลขกำกับทุกหมวด เหมือนหน้าจอเครื่องมือ",
      en: "Near-black, hairline grid, everything numbered. Reads like a readout.",
    },
  },
  palm: {
    name: { th: "ดูลายมือ", en: "Palm reading" },
    note: {
      th: "กระดาษข่อย หมึกดำ หัวข้อสีชาด เล่นกับชื่อเล่นที่แปลว่าฝ่ามือ",
      en: "Paper and ink with red rubrics, playing on a nickname that means palm.",
    },
  },
};
