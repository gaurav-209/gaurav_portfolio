"use client";

import { useEffect, useRef, useState } from "react";

// Giant outlined name; an orange spotlight fills the letters wherever the mouse is.
export function Wordmark({ text }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  const reset = () => {
    ref.current.style.removeProperty("--x");
    ref.current.style.removeProperty("--y");
  };
  return (
    <p
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden
      className="select-none whitespace-nowrap text-center font-heading text-[clamp(2.25rem,8.5vw,8.5rem)] font-semibold leading-[0.8] tracking-[-0.045em] text-transparent"
      style={{
        WebkitTextStroke: "1px rgba(255,255,255,0.16)",
        // Resting state: a soft glow rising from the bottom edge. With the mouse: a spotlight that follows it.
        backgroundImage:
          "radial-gradient(260px circle at var(--x, 50%) var(--y, 140%), #F47B20, rgba(234,88,12,0.55) 45%, transparent 75%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
    >
      {text}
    </p>
  );
}

// Live local time in Ahmedabad. Rendered only after mount: pages are pre-rendered, so there is no "now" at build time.
export function LocalTime({ timeZone = "Asia/Kolkata" }) {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [timeZone]);
  return <span suppressHydrationWarning>{time ? `${time} IST` : "IST (UTC+5:30)"}</span>;
}
