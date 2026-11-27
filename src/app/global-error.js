"use client"; // Error boundaries must be Client Components

// Last-resort error screen, used only if the whole site layout fails. It replaces the layout, so it can't
// use the site's stylesheet or fonts: everything here is plain inline styles in the site's colours.
export default function GlobalError({ error, retry }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: "#1c1917",
          background: "radial-gradient(ellipse 60% 60% at 90% 10%, #FFF0DC, transparent 72%), #FFFFFF",
        }}
      >
        <title>Something went wrong | Gaurav Mahavar</title>
        <main style={{ maxWidth: 520 }}>
          <p style={{ margin: 0, fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#EA580C" }}>
            Something broke
          </p>
          <h1 style={{ margin: "14px 0 0", fontSize: "clamp(2.4rem, 9vw, 4rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            The site couldn&apos;t load<span style={{ color: "#F47B20" }}>.</span>
          </h1>
          <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.6, color: "#57534e" }}>
            Something unexpected went wrong. Please try again in a moment.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{ border: 0, borderRadius: 999, padding: "12px 24px", font: "inherit", fontWeight: 600, color: "#fff", cursor: "pointer", background: "linear-gradient(135deg, #F47B20, #EA580C)" }}
            >
              Try again
            </button>
            {/* A plain link on purpose: the app's router may be what failed */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ borderRadius: 999, padding: "10px 22px", border: "2px solid #F47B20", color: "#EA580C", fontWeight: 600, textDecoration: "none" }}>
              Back to home
            </a>
          </div>
          {error?.digest && <p style={{ marginTop: 28, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#57534e" }}>Error reference: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
