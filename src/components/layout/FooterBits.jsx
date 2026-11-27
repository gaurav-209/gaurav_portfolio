"use client";

import { useEffect, useState } from "react";

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

// Reopens the analytics cookie banner (see Analytics.jsx), so visitors can change their choice any time.
// Hidden when analytics isn't set up, since there is then nothing to choose.
export function CookieSettingsButton({ className = "" }) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("cookie-settings"))} className={className}>
      Cookie settings
    </button>
  );
}
