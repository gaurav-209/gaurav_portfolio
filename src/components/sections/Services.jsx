"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, LayoutDashboard, MonitorSmartphone, Server } from "lucide-react";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons = { "web-apps": LayoutDashboard, "desktop-apps": MonitorSmartphone, websites: Globe, apis: Server };
const nameOf = Object.fromEntries(projects.map((p) => [p.slug, p.name]));
const num = (i) => String(i + 1).padStart(2, "0");

// Jump to the contact form with this service's topic already picked (Contact listens for the event).
const startWith = (topic) => {
  window.dispatchEvent(new CustomEvent("contact:topic", { detail: topic }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
};

// What a service says: summary, points, proof projects and the "start" button. Shared by both layouts.
function Details({ s, interactive = true }) {
  const tab = interactive ? undefined : -1;
  return (
    <>
      <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{s.summary}</p>
      <ul className="mt-4 space-y-1.5 text-[15px]">
        {s.points.map((pt) => (
          <li key={pt} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
            {pt}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">See it in</p>
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
          className="btn-primary group/btn mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          Start a project like this
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" aria-hidden />
        </button>
      </div>
    </>
  );
}

// Phones/tablets: a 3D card carousel. The current card faces you; its neighbours turn away on either side.
// Swipe or tap a side card to switch. With reduced motion the cards still change, just without animation.
function Carousel() {
  const [index, setIndex] = useState(0);
  const start = useRef(null);
  const go = (i) => setIndex(Math.min(Math.max(i, 0), services.length - 1));

  const onPointerDown = (e) => (start.current = e.clientX);
  const onPointerUp = (e) => {
    if (start.current == null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="lg:hidden" role="region" aria-roledescription="carousel" aria-label="Services">
      <div
        className="relative h-[38rem] touch-pan-y select-none [perspective:1200px] sm:h-[34rem]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
      >
        {services.map((s, i) => {
          const offset = i - index;
          const away = Math.abs(offset);
          const Icon = icons[s.id];
          return (
            <article
              key={s.id}
              aria-hidden={offset !== 0}
              inert={offset !== 0}
              onClick={offset !== 0 ? () => go(i) : undefined}
              className={`absolute inset-y-0 left-1/2 flex w-[84%] max-w-sm flex-col rounded-[2rem] border bg-[var(--color-base-100)] p-5 sm:p-6 transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(.22,.8,.3,1)] ${
                offset === 0
                  ? "border-[var(--color-accent)]/40 shadow-[0_30px_60px_-30px_rgba(244,123,32,0.55)]"
                  : "cursor-pointer border-[var(--line)] shadow-[0_20px_40px_-30px_rgba(37,52,63,0.45)]"
              }`}
              style={{
                transform: `translateX(calc(-50% + ${offset * 72}%)) rotateY(${offset * -38}deg) scale(${1 - Math.min(away, 2) * 0.12})`,
                zIndex: 10 - away,
                opacity: away > 1 ? 0 : 1,
              }}
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)] text-white">
                  <Icon size={22} aria-hidden />
                </span>
                <span className="font-mono text-sm text-[var(--text-muted)]">{num(i)}</span>
              </div>
              <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight">{s.title}</h3>
              <Details s={s} interactive={offset === 0} />
            </article>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Service {index + 1} of {services.length}: {services[index].title}
      </p>
    </div>
  );
}

// Desktop: expanding panels driven by scroll. The row pins in the middle of the screen while you scroll
// through a tall track, and each stretch of scrolling opens the next panel (the slim ones show the icon,
// number and the title running vertically). Clicking or tabbing to a slim panel scrolls to its stretch.
const SCROLL_PER_PANEL = 0.55; // screen heights of scrolling per panel

function Panels() {
  const [open, setOpen] = useState(0);
  const trackRef = useRef(null);

  // Which panel is open follows how far you've scrolled through the track.
  useEffect(() => {
    const track = trackRef.current;
    const onScroll = () => {
      const r = track.getBoundingClientRect();
      const span = r.height - window.innerHeight; // scroll distance while the row is pinned
      if (span <= 0) return;
      const p = Math.min(Math.max(-r.top / span, 0), 0.9999);
      const i = Math.floor(p * services.length);
      setOpen((prev) => (prev === i ? prev : i));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Jump to the middle of a panel's stretch of the track (for clicks and keyboard focus).
  const goTo = (i) => {
    const track = trackRef.current;
    const span = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY + span * ((i + 0.5) / services.length);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={trackRef} className="hidden lg:block" style={{ height: `calc(100vh + ${services.length * SCROLL_PER_PANEL * 100}vh)` }}>
      <div className="sticky top-0 flex h-screen items-center">
      <Reveal className="w-full">
      <ul className="flex h-[29rem] w-full gap-4">
        {services.map((s, i) => {
          const Icon = icons[s.id];
          const isOpen = open === i;
          return (
            <li
              key={s.id}
              className={`relative overflow-hidden rounded-[2rem] border transition-[flex-grow,background-color,border-color] duration-500 ease-[cubic-bezier(.22,.8,.3,1)] ${
                isOpen
                  ? "grow-[4] basis-0 border-[var(--color-accent)]/40 bg-[var(--color-base-100)] shadow-[0_30px_60px_-34px_rgba(244,123,32,0.55)]"
                  : "grow basis-0 cursor-pointer border-[var(--line)] bg-[var(--color-base-100)]/60 hover:border-[var(--color-accent)]/40"
              }`}
            >
              {/* Slim state: a button that opens the panel (also how keyboard users switch) */}
              <button
                type="button"
                onClick={() => goTo(i)}
                onFocus={() => open !== i && goTo(i)}
                aria-expanded={isOpen}
                aria-controls={`service-${s.id}`}
                className={`absolute inset-0 flex flex-col items-center justify-between py-8 text-left transition-opacity duration-300 ${
                  isOpen ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/10 text-accent-ink">
                  <Icon size={22} aria-hidden />
                </span>
                <span className="font-heading text-xl font-semibold tracking-tight [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                  {s.title}
                </span>
                <span className="font-mono text-sm text-[var(--text-muted)]">{num(i)}</span>
              </button>

              {/* Open state: the full card */}
              <div
                id={`service-${s.id}`}
                inert={!isOpen}
                className={`flex h-full min-w-[26rem] flex-col p-8 transition-opacity duration-500 ${isOpen ? "opacity-100 delay-150" : "opacity-0"}`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)] text-white">
                    <Icon size={22} aria-hidden />
                  </span>
                  <span className="font-mono text-sm text-[var(--text-muted)]">
                    {num(i)} / {num(services.length - 1)}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-3xl font-semibold tracking-tight">{s.title}</h3>
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
        <Carousel />
        <Panels />
      </div>
    </section>
  );
}
