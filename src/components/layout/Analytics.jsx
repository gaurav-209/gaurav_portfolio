"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";

// Google Analytics 4, loaded only after the visitor clicks "Allow analytics". Until then no Google script
// runs and no analytics cookie is set. The choice is remembered in this browser (localStorage), and the
// footer's "Cookie settings" link reopens the banner (it fires the "cookie-settings" event).
//
// Setup: NEXT_PUBLIC_GA_ID = your GA4 measurement ID ("G-XXXXXXXXXX", from Google Analytics → Admin →
// Data streams). Without it there is nothing to consent to, so the banner isn't shown at all.

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const KEY = "analytics-consent"; // "granted" | "denied"

const readChoice = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null; // private mode / blocked storage: ask again next time
  }
};

// The saved choice, read from localStorage and re-read whenever it changes (here or in another tab).
const subscribe = (onChange) => {
  window.addEventListener("storage", onChange);
  window.addEventListener("analytics-consent", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("analytics-consent", onChange);
  };
};

export default function Analytics() {
  // "pending" on the server, so returning visitors never see the banner flash before their choice is read
  const choice = useSyncExternalStore(subscribe, readChoice, () => "pending");
  const [reopened, setReopened] = useState(false);
  const open = choice === null || reopened;

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener("cookie-settings", reopen);
    return () => window.removeEventListener("cookie-settings", reopen);
  }, []);

  if (!GA_ID) return null;

  const decide = (value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    window.dispatchEvent(new Event("analytics-consent"));
    setReopened(false);
    // Withdrawing consent after GA has loaded: tell it to stop, delete its _ga cookies, and reload so the
    // script is gone.
    if (value === "denied" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "denied" });
      const domain = location.hostname.replace(/^www\./, "");
      for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga"))) {
        for (const d of ["", `; domain=${domain}`, `; domain=.${domain}`]) document.cookie = `${name}=; Max-Age=0; path=/${d}`;
      }
      window.location.reload();
    }
  };

  return (
    <>
      {choice === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Cookie choice"
          className="fixed inset-x-3 bottom-3 z-[60] rounded-2xl bg-[#1c1917] p-5 text-[#f5f2ed] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:left-5 sm:bottom-5 sm:max-w-sm"
        >
          <p className="font-heading text-[17px] leading-snug">
            Allow Google Analytics cookies to measure visits and where they come from?
          </p>
          <Link href="/privacy" className="mt-2 inline-block text-sm text-[#f5f2ed] underline underline-offset-4 hover:text-[#F47B20]">
            Privacy details
          </Link>
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="rounded-full border border-white/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="rounded-full border border-white/70 px-4 py-2 text-sm font-medium transition-colors hover:border-[#F47B20] hover:bg-[#F47B20] hover:text-black"
            >
              Allow analytics
            </button>
          </div>
        </div>
      )}
    </>
  );
}
