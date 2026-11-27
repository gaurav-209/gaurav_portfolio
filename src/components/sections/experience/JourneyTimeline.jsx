"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navigation2, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const label = { work: "Full-time", internship: "Internship", training: "Training", education: "Education", earlier: "Earlier role" };
const projectName = Object.fromEntries(projects.map((p) => [p.slug, p.name]));

// "2025-10" → "Oct 2025", "2024" → "2024", "present" → "Present"
const fmt = (d) => (d === "present" ? "Present" : d.length === 4 ? d : `${MONTHS[Number(d.slice(5)) - 1]} ${d.slice(0, 4)}`);
const range = (s, e) => (s === e ? fmt(s) : `${fmt(s)} – ${fmt(e)}`);

// Length of a role from the stored dates, counting first and last month (Oct 2025 – Nov 2026 = 1 yr 2 mos).
// Ongoing ("present") roles show no length: the page is pre-rendered, so "today" isn't known.
function duration(start, end) {
  if (end === "present") return null;
  if (start.length === 4) {
    const yrs = Number(end) - Number(start);
    return yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}` : null;
  }
  const toMonths = (d) => Number(d.slice(0, 4)) * 12 + Number(d.slice(5)) - 1;
  const n = toMonths(end) - toMonths(start) + 1;
  if (n <= 1) return null;
  const y = Math.floor(n / 12);
  const m = n % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

const DOT_OFFSET = 28; // where each stop's dot sits, measured from the top of its card

// A winding road down the timeline. A location arrow travels along it with the scroll (down when you
// scroll down, back up when you scroll up), the road behind it fills orange, and each stop lights up
// once the arrow reaches it. Desktop: road in the middle, cards alternate sides. Mobile: road on the left.
// Without JS everything is simply shown, fully visible.
export default function JourneyTimeline({ items }) {
  const listRef = useRef(null);
  const pathRef = useRef(null);
  const trailRef = useRef(null);
  const pinRef = useRef(null);
  const [geo, setGeo] = useState(null);
  const [reached, setReached] = useState(-1);

  // Build the road through every stop; rebuilt whenever the list changes size.
  useEffect(() => {
    const list = listRef.current;
    const build = () => {
      const box = list.getBoundingClientRect();
      const wide = window.matchMedia("(min-width: 768px)").matches;
      const cx = wide ? box.width / 2 : 14;
      const amp = wide ? 40 : 8;
      const dots = [...list.querySelectorAll("[data-stop]")].map((el) => el.getBoundingClientRect().top - box.top + DOT_OFFSET);
      const ys = [0, ...dots, box.height];
      let d = `M ${cx} 0`;
      for (let i = 1; i < ys.length; i++) {
        const [y0, y1] = [ys[i - 1], ys[i]];
        const side = i % 2 ? 1 : -1; // alternate bulges → a gently winding road
        d += ` C ${cx + amp * side} ${y0 + (y1 - y0) * 0.35}, ${cx + amp * side} ${y0 + (y1 - y0) * 0.65}, ${cx} ${y1}`;
      }
      setGeo({ w: box.width, h: box.height, d, cx, dots });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Move the arrow to where the middle of the screen meets the road.
  useEffect(() => {
    if (!geo) return;
    const list = listRef.current;
    const path = pathRef.current;
    const total = path.getTotalLength();
    let lastY = window.scrollY;
    let dir = 1;

    // The road always heads down, so y grows with length: binary-search the length at a given y.
    const lengthAtY = (y) => {
      let lo = 0;
      let hi = total;
      for (let k = 0; k < 22; k++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    // Runs on every scroll event (browsers send at most one per frame; this is a few cheap lookups).
    const update = () => {
      const pin = pinRef.current;
      const trail = trailRef.current;
      // A scroll can land while React is swapping these nodes (hot reload, or the page being
      // hidden/re-shown on navigation); skip that frame instead of crashing.
      if (!pin || !trail || !path.isConnected) return;
      const sy = window.scrollY;
      if (sy !== lastY) {
        dir = sy > lastY ? 1 : -1;
        lastY = sy;
      }
      const y = Math.min(Math.max(window.innerHeight * 0.5 - list.getBoundingClientRect().top, 0), geo.h);
      const len = lengthAtY(y);
      const pt = path.getPointAtLength(len);
      const a = path.getPointAtLength(Math.max(len - 2, 0));
      const b = path.getPointAtLength(Math.min(len + 2, total));
      // Navigation2 points up; turn it along the road, and flip it when scrolling up.
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90 + (dir < 0 ? 180 : 0);
      pin.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      pin.firstElementChild.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      trail.style.strokeDasharray = `${len / total} 1`;
      const idx = geo.dots.reduce((acc, dotY, i) => (dotY <= pt.y + 1 ? i : acc), -1);
      setReached((prev) => (prev === idx ? prev : idx));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [geo]);

  return (
    <ol ref={listRef} className="relative">
      {geo && (
        <>
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={geo.w} height={geo.h} aria-hidden>
            <path ref={pathRef} d={geo.d} fill="none" stroke="var(--line)" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" />
            <path ref={trailRef} d={geo.d} fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="0 1" />
            {geo.dots.map((y, i) => {
              const on = i <= reached;
              const small = items[i].type === "earlier";
              return (
                <circle
                  key={i}
                  cx={geo.cx}
                  cy={y}
                  r={small ? 5 : 7}
                  fill={on ? "var(--color-accent)" : "#FFFBF6"}
                  stroke={on ? "var(--color-accent)" : "var(--color-base-content)"}
                  strokeOpacity={on ? 1 : 0.25}
                  strokeWidth="2"
                  style={{ transition: "fill 0.3s, stroke 0.3s" }}
                />
              );
            })}
          </svg>
          {/* The travelling location arrow */}
          <div ref={pinRef} className="pointer-events-none absolute left-0 top-0 z-20" aria-hidden>
            <span className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-[0_0_0_6px_rgba(244,123,32,0.18),0_10px_24px_-8px_rgba(244,123,32,0.8)] transition-transform duration-300 ease-out">
              <Navigation2 size={18} fill="currentColor" />
            </span>
          </div>
        </>
      )}

      {items.map((item, i) => {
        const left = i % 2 === 0;
        const lit = !geo || i <= reached;
        const earlier = item.type === "earlier";
        const len = duration(item.start, item.end);
        return (
          <li key={`${item.company}-${item.role}`} className="relative grid pb-10 pl-11 last:pb-0 md:grid-cols-2 md:gap-x-32 md:pb-14 md:pl-0">
            {/* Entry: open text (no card) tied to the road by a short connector line at the dot's height */}
            <div data-stop className={`md:row-start-1 ${left ? "md:col-start-1" : "md:col-start-2"}`}>
              <article className={`relative pt-5 transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-50"}`}>
                <span
                  aria-hidden
                  className={`absolute top-[28px] h-0 border-t-2 border-dashed transition-colors duration-500 ${
                    lit ? "border-[var(--color-accent)]" : "border-[var(--line)]"
                  } -left-[1.4rem] w-[1.05rem] ${left ? "md:left-auto md:-right-[calc(4rem-12px)] md:w-[calc(4rem-20px)]" : "md:-left-[calc(4rem-12px)] md:w-[calc(4rem-20px)]"}`}
                />
                <p className="ui-eyebrow -translate-y-1.5">{label[item.type]}</p>
                {/* Phones: dates under the label (desktop shows them across the road) */}
                <p className="-mt-0.5 font-mono text-xs text-[var(--text-muted)] md:hidden">
                  {range(item.start, item.end)}
                  {len && ` · ${len}`}
                </p>
                <h3 className={`mt-1.5 font-heading font-semibold leading-tight tracking-tight ${earlier ? "text-lg" : "text-2xl md:text-[1.75rem]"}`}>{item.role}</h3>
                <p className={`mt-1 font-medium ${earlier ? "text-sm text-[var(--text-muted)]" : "text-[15px] text-accent-ink"}`}>
                  {item.company}
                  {item.location && <span className="font-normal text-[var(--text-muted)]"> · {item.location}</span>}
                </p>
                {item.summary && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--text-muted)]">{item.summary}</p>}
                {item.highlights?.length > 0 && (
                  <ul className={`max-w-xl space-y-1.5 border-l-2 border-[var(--color-accent)]/30 pl-4 text-sm leading-relaxed ${earlier ? "mt-2.5" : "mt-4"}`}>
                    {item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                {item.tech?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {item.tech.map((t) => (
                      <li key={t} className="ui-tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {item.projects && (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Projects from this role">
                    {item.projects.map((slug) => (
                      <li key={slug}>
                        <Link href={`/projects/${slug}`} className="ui-chip">
                          {projectName[slug] ?? slug} <ArrowUpRight size={12} aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>

            {/* Date on the other side of the road (desktop) */}
            <div className={`hidden pt-3 md:row-start-1 md:block ${left ? "md:col-start-2 text-left" : "md:col-start-1 text-right"}`}>
              <p
                className={`font-heading text-4xl font-semibold tracking-tight transition-colors duration-500 ${lit ? "text-[var(--text)]" : "text-[var(--color-base-content)]/25"}`}
              >
                {item.start.slice(0, 4)}
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                {range(item.start, item.end)}
                {len && ` · ${len}`}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
