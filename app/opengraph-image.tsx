import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — computer engineer, Chiang Mai`;

/**
 * Latin-only on purpose: the renderer has no Thai font loaded, and shipping a
 * webfont just for the share card is not worth the weight.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#191310",
          color: "#e8e6e1",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 6, background: "#f2a007" }} />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#f2a007",
            }}
          >
            Computer engineer · Chiang Mai
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 86,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            <span>I build systems that</span>
            <span>real people depend on</span>
          </div>
          <div style={{ fontSize: 34, color: "#8b95a3" }}>{site.name}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#4ec5bd",
          }}
        >
          <span>{site.domain}</span>
          <span>@{site.githubHandle}</span>
        </div>
      </div>
    ),
    size,
  );
}
