import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

export const alt = `${site.name} – ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The picture shown when the site is shared (LinkedIn, WhatsApp, X…). It mirrors the hero:
// warm cream background, "Full-Stack Developer." with the orange word, and the photo card on the right.
// The image renderer only bundles a regular-weight font, so headings are thickened with a text stroke.
export default async function Image() {
  const file = (p) => readFile(join(process.cwd(), "public", p), "base64");
  const [photo, logo] = await Promise.all([file(site.photo), file("images/projects/logo.png")]);
  const ink = "#1c1917";
  const muted = "#57534e";
  const orange = "#EA580C";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "56px 64px",
          color: ink,
          background:
            "radial-gradient(ellipse 60% 70% at 95% 5%, #FFE7CC, rgba(255,231,204,0) 70%), radial-gradient(ellipse 55% 60% at 0% 100%, #FFF0DC, rgba(255,240,220,0) 70%), #FFFFFF",
        }}
      >
        {/* Left: who and what */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
          <img alt="" src={`data:image/png;base64,${logo}`} height={56} style={{ alignSelf: "flex-start", marginLeft: -10 }} />
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 34,
              padding: "8px 18px",
              borderRadius: 999,
              border: "2px solid rgba(234,88,12,0.35)",
              background: "rgba(244,123,32,0.08)",
              color: orange,
              fontSize: 20,
              letterSpacing: 4,
            }}
          >
            {site.heroTags.join("  •  ").toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontSize: 92, lineHeight: 0.95, letterSpacing: -2 }}>
            <span style={{ WebkitTextStroke: `3px ${ink}` }}>Full-Stack</span>
            <span style={{ color: orange, WebkitTextStroke: `3px ${orange}` }}>Developer.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.35, color: muted, maxWidth: 560 }}>{site.heroLine}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", fontSize: 26 }}>
            <span style={{ WebkitTextStroke: `0.6px ${ink}` }}>{site.name}</span>
            <span style={{ margin: "0 14px", color: orange }}>·</span>
            <span style={{ color: muted }}>gauravmahavar.in</span>
          </div>
        </div>

        {/* Right: the photo card */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 380,
              height: 475,
              borderRadius: 28,
              overflow: "hidden",
              transform: "rotate(3deg)",
              boxShadow: "0 30px 60px -20px rgba(28,25,23,0.45)",
              border: "6px solid #FFFFFF",
            }}
          >
            <img alt="" src={`data:image/jpeg;base64,${photo}`} width={380} height={475} style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
