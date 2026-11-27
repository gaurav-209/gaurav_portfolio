"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

// Shown in place of a page if something on it crashes; the navbar and footer stay. Offers a retry (which
// re-renders the page) and a way home. Technical details stay in the console, never on screen.
export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[100svh] items-center px-5 pb-16 pt-28 md:px-8">
      <div className="container-wide">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink">Something broke</p>
        <h1 className="hero-title mt-4 text-[clamp(3rem,12vw,7rem)] leading-[0.95]">
          Well, that
          <span className="block">
            <span className="hero-gradient-text">wasn&apos;t planned</span>
            <span className="text-[var(--color-accent)]">.</span>
          </span>
        </h1>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[var(--text-muted)]">
          This page hit an unexpected error. Trying again usually fixes it; if not, head back home.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={() => retry()} className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">
            <RotateCcw size={17} aria-hidden /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-accent)] px-6 py-2.5 font-semibold text-accent-ink transition hover:bg-[var(--color-accent)]/10"
          >
            <ArrowLeft size={17} aria-hidden /> Back to home
          </Link>
        </div>
        {error?.digest && <p className="mt-8 font-mono text-xs text-[var(--text-muted)]">Error reference: {error.digest}</p>}
      </div>
    </div>
  );
}
