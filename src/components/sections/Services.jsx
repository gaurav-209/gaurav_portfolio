"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, LayoutDashboard, MonitorSmartphone, Server } from "lucide-react";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { smoothScrollTo } from "@/lib/scroll";

const icons = { "web-apps": LayoutDashboard, "desktop-apps": MonitorSmartphone, websites: Globe, apis: Server };
const nameOf = Object.fromEntries(projects.map((p) => [p.slug, p.name]));
const num = (i) => String(i + 1).padStart(2, "0");

// Jump to the contact form with this service's topic already picked (Contact listens for the event).
const startWith = (topic) => {
  window.dispatchEvent(new CustomEvent("contact:topic", { detail: topic }));
  smoothScrollTo(document.getElementById("contact"));
};

// What a service says: summary, points, proof projects and the "start" button.
function Details({ s, interactive = true }) {
  const tab = interactive ? undefined : -1;
  return (
    <>
      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--text-muted)] lg:mt-2 lg:text-base">{s.summary}</p>
      <ul className="mt-3 space-y-1 text-[14px] lg:mt-4 lg:space-y-1.5 lg:text-[15px]">
        {s.points.map((pt) => (
          <li key={pt} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
            {pt}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-3 lg:pt-5">
        {/* label hidden on short phone screens to keep the card within the screen */}
        <p className="mb-2 font-mono max-lg:[@media(max-height:780px)]:hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">See it in</p>
        <div className="flex flex-wrap gap-2">
          {s.proof.map((slug) => (
            <Link
              key={slug}
              href={`/projects/${slug}`}
              tabIndex={tab}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium transition-colors hover:border-[var(--color-accent)] hover:text-accent-ink"
            >
              {nameOf[slug]} <ArrowUpRight size={12} aria-hidden />
            </Link>
          ))}
        </div>
        <button
          type="button"
          tabIndex={tab}
          onClick={() => startWith(s.topic)}
          className="btn-primary group/btn mt-3 inline-flex lg:mt-5 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          Start a project like this
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" aria-hidden />
        </button>
      </div>
    </>
  );
}

// One design on every screen: expanding panels, side by side on desktop and stacked on phones/tablets.
// The section pins while you're in it, and each scroll (one wheel flick, trackpad swipe or finger swipe)
// opens exactly the next or previous panel, never more, however fast you scroll. Scrolling in from
// above or below always stops at the first/last panel, so none can be skipped. After the last panel the
// page carries on as normal.
const STEP = 120; // page pixels between panels (the pinned stretch is STEP × (panels − 1))
const LOCK_MS = 650; // after a step, ignore further scrolling this long so momentum can't skip a panel
const BURST_GAP = 260; // wheel events closer than this belong to the same flick (trackpad momentum can pause ~200ms)

function Panels() {
  const [open, setOpen] = useState(0);
  const trackRef = useRef(null);
  const n = services.length;

  // `goTo` is used by clicks/focus and set up inside the effect, where the scroll logic lives.
  const goToRef = useRef(() => {});

  useEffect(() => {
    const track = trackRef.current;
    const range = () => {
      const a = track.getBoundingClientRect().top + window.scrollY;
      return [a, a + STEP * (n - 1)];
    };
    const clampIndex = (i) => Math.min(Math.max(i, 0), n - 1);
    const indexAt = (y) => clampIndex(Math.round((y - range()[0]) / STEP));
    const inRange = (y = window.scrollY) => {
      const [a, b] = range();
      return y >= a - 2 && y <= b + 2;
    };
    const scrollToY = (y, immediate = false) => {
      if (window.lenis) window.lenis.scrollTo(y, { immediate, force: true, duration: 0.55 });
      else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
    };
    // Stop a phone's momentum scroll dead (it ignores scrollTo while flinging).
    const killMomentum = () => {
      if (window.lenis) return;
      const el = document.documentElement;
      el.style.overflow = "hidden";
      setTimeout(() => (el.style.overflow = ""), 60);
    };

    let lockUntil = 0;
    let lastWheel = 0;
    const lock = () => (lockUntil = Date.now() + LOCK_MS);
    const step = (i) => {
      const [a] = range();
      lock();
      setOpen(i);
      scrollToY(a + i * STEP);
    };
    goToRef.current = (i) => step(clampIndex(i));

    // Keep the open panel in step with the scroll position, and catch fast scrolls arriving from outside.
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const [a, b] = range();
      if (Date.now() >= lockUntil) {
        // Any scroll that isn't one of our steps (a fast flick or fling, a glide already under way, the
        // keyboard) and lands between two panel stops, or jumps right over the panels, gets caught at the panel
        // it entered from, so no panel is ever skipped.
        let stop = null;
        if (lastY < a - 2 && y > b + 2) stop = 0; // flew right past from above
        else if (lastY > b + 2 && y < a - 2) stop = n - 1; // flew right past from below
        else if (y > a + 2 && y < b - 2) {
          const pos = (y - a) / STEP;
          if (Math.abs(pos - Math.round(pos)) * STEP > 2) stop = clampIndex(y > lastY ? Math.floor(pos) : Math.ceil(pos));
        } else if (lastY < a - 2 && y >= b - 2 && y <= b + 2) stop = 0;
        else if (lastY > b + 2 && y >= a - 2 && y <= a + 2) stop = n - 1;
        if (stop !== null) {
          killMomentum();
          scrollToY(a + stop * STEP, true);
          lastY = a + stop * STEP;
          lock();
          setOpen(stop);
          return;
        }
      }
      lastY = y;
      // While a step is gliding to its panel, the scroll position still reads as the old panel for a moment;
      // following it then would flip the cards back and forth (a visible blink), so wait for the step to land.
      if (Date.now() < lockUntil) return;
      const i = y < a ? 0 : y > b ? n - 1 : indexAt(y);
      setOpen((prev) => (prev === i ? prev : i));
    };

    // Mouse wheel / trackpad: one flick = one panel. Registered in the capture phase so it runs before the
    // smooth-scroll library and can stop the page from moving while a panel changes.
    const onWheel = (e) => {
      if (!inRange() || !e.deltaY) return;
      const now = Date.now();
      const gap = now - lastWheel;
      lastWheel = now;
      const dir = e.deltaY > 0 ? 1 : -1;
      const i = indexAt(window.scrollY);
      const leaving = (dir > 0 && i === n - 1) || (dir < 0 && i === 0);
      // At the first/last panel a *new* flick in that direction continues the page normally.
      if (leaving && now >= lockUntil && gap >= BURST_GAP) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (leaving || now < lockUntil || gap < BURST_GAP) return;
      step(i + dir);
    };

    // Touch: one swipe = one panel.
    let touchY = null;
    const onTouchStart = (e) => (touchY = inRange() ? e.touches[0].clientY : null);
    const onTouchMove = (e) => {
      if (touchY == null || !inRange()) return;
      const dir = touchY - e.touches[0].clientY > 0 ? 1 : -1;
      const i = indexAt(window.scrollY);
      const leaving = (dir > 0 && i === n - 1) || (dir < 0 && i === 0);
      if (!leaving || Date.now() < lockUntil) e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (touchY == null) return;
      const dy = touchY - e.changedTouches[0].clientY;
      touchY = null;
      if (Math.abs(dy) < 40 || Date.now() < lockUntil || !inRange()) return;
      const dir = dy > 0 ? 1 : -1;
      const i = indexAt(window.scrollY);
      if ((dir > 0 && i === n - 1) || (dir < 0 && i === 0)) return;
      step(i + dir);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [n]);

  return (
    <div ref={trackRef} style={{ height: `calc(100svh + ${STEP * (n - 1)}px)` }}>
      <div className="sticky top-0 flex h-[100svh] items-center pb-3 pt-[4.75rem] lg:pb-0 lg:pt-0">
        <Reveal className="h-full w-full lg:h-auto">
          <ul className="flex h-full w-full flex-col gap-2 lg:h-[29rem] lg:flex-row lg:gap-4">
            {services.map((s, i) => {
              const Icon = icons[s.id];
              const isOpen = open === i;
              return (
                <li
                  key={s.id}
                  className={`relative min-h-0 overflow-hidden rounded-[1.75rem] border transition-[flex-grow,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(.22,.8,.3,1)] basis-14 lg:basis-0 lg:rounded-[2rem] ${
                    isOpen
                      ? "grow lg:grow-[4] border-[var(--color-accent)]/40 bg-[var(--color-base-100)] shadow-[0_30px_60px_-34px_rgba(244,123,32,0.55)]"
                      : "grow-0 lg:grow cursor-pointer border-[var(--line)] bg-[var(--color-base-100)]/60 hover:border-[var(--color-accent)]/40"
                  }`}
                >
                  {/* Slim state: a row on phones, a tall column with the title running up on desktop */}
                  <button
                    type="button"
                    onClick={() => goToRef.current(i)}
                    onFocus={() => open !== i && goToRef.current(i)}
                    aria-expanded={isOpen}
                    aria-controls={`service-${s.id}`}
                    className={`absolute inset-x-0 top-0 flex h-14 items-center gap-3 px-4 text-left transition-opacity duration-300 lg:inset-0 lg:h-auto lg:flex-col lg:justify-between lg:px-0 lg:py-8 ${
                      isOpen ? "pointer-events-none opacity-0" : "opacity-100"
                    }`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-accent)]/10 text-accent-ink lg:h-12 lg:w-12 lg:rounded-2xl">
                      <Icon size={20} aria-hidden />
                    </span>
                    <span className="font-heading text-lg font-semibold tracking-tight lg:rotate-180 lg:whitespace-nowrap lg:text-xl lg:[writing-mode:vertical-rl]">
                      {s.title}
                    </span>
                    <span className="ml-auto font-mono text-sm text-[var(--text-muted)] lg:ml-0">{num(i)}</span>
                  </button>

                  {/* Open state: the full card */}
                  <div
                    id={`service-${s.id}`}
                    inert={!isOpen}
                    className={`flex h-full flex-col p-4 transition-opacity sm:p-5 lg:min-w-[26rem] lg:p-8 ${isOpen ? "opacity-100 duration-300 delay-100" : "opacity-0 duration-150"}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-accent)] text-white lg:h-12 lg:w-12">
                        <Icon size={22} aria-hidden />
                      </span>
                      <span className="font-mono text-sm text-[var(--text-muted)]">
                        {num(i)} / {num(n - 1)}
                      </span>
                    </div>
                    <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight sm:text-2xl lg:mt-6 lg:text-3xl">{s.title}</h3>
                    <Details s={s} interactive={isOpen} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="section-pad overflow-clip" id="services" aria-labelledby="services-heading">
      <div className="container-wide">
        <SectionHeading
          id="services-heading"
          lead="How I Can"
          accent="Help"
          subtitle="From first idea to a shipped product. Here's what you can bring to me, with the work that shows it."
        />
        <Panels />
      </div>
    </section>
  );
}
