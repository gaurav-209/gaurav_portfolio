"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

const categoryColor = {
  // Brand orange for frontend; the rest are low-chroma tints so they support the orange instead of competing.
  frontend: "#F47B20",
  backend: "oklch(74% 0.08 240)", // dusty blue
  desktop: "oklch(74% 0.08 300)", // lavender
  database: "oklch(76% 0.08 160)", // sage
  "state-tools": "oklch(75% 0.08 350)", // dusty rose
  specialized: "oklch(82% 0.08 90)", // sand
};

const tint = (c, pct) => `color-mix(in oklch, ${c} ${pct}%, transparent)`;
const HUB = 6; // skills with this many connections are drawn as bigger "stars"

function buildLines(skills, byId) {
  const lines = [];
  const seen = new Set();
  for (const skill of skills) {
    for (const rel of skill.related || []) {
      if (!byId[rel]) continue;
      const key = [skill.id, rel].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push({ key, a: skill, b: byId[rel] });
    }
  }
  return lines;
}

// Rendered twice (portrait `mpos` on phones and tablets, `pos` from lg up) and toggled with CSS, so no hydration flash.
function Canvas({ skills, lines, degree, posKey, className, focus, selectedId, connected, onSelect, onHover }) {
  return (
    <div className={`constellation-sky relative ${className}`}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {lines.map((l) => {
          const lit = focus && (l.a.id === focus.id || l.b.id === focus.id);
          return (
            <line
              key={l.key}
              x1={`${l.a[posKey].x}%`}
              y1={`${l.a[posKey].y}%`}
              x2={`${l.b[posKey].x}%`}
              y2={`${l.b[posKey].y}%`}
              stroke={lit ? "#F47B20" : "#ffffff"}
              strokeOpacity={lit ? 0.85 : focus ? 0.04 : 0.12}
              strokeWidth={lit ? 1.5 : 1}
              strokeDasharray={lit ? "5 6" : undefined}
              className={`transition-[stroke-opacity] duration-500 ${lit ? "constellation-flow" : ""}`}
            />
          );
        })}
      </svg>
      {skills.map((skill) => {
        const selected = selectedId === skill.id;
        const isFocus = focus?.id === skill.id;
        const linked = connected?.has(skill.id) && !isFocus;
        const dimmed = connected && !connected.has(skill.id);
        const hub = degree[skill.id] >= HUB;
        const color = categoryColor[skill.category];
        return (
          <button
            key={skill.id}
            type="button"
            data-skill={skill.id}
            onClick={() => onSelect(skill.id)}
            onPointerEnter={(e) => e.pointerType === "mouse" && onHover(skill.id)}
            onPointerLeave={() => onHover(null)}
            aria-pressed={selected}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F47B20] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(16%_0.006_56)] ${
              hub ? "px-3.5 py-2 text-xs md:text-sm font-semibold" : "px-2.5 py-1.5 text-[11px] md:text-xs font-medium"
            } ${
              selected
                ? "z-20 scale-105 border-[#F47B20] bg-[#F47B20] text-black shadow-[0_0_0_6px_rgba(244,123,32,0.15),0_0_32px_rgba(244,123,32,0.45)]"
                : isFocus
                  ? "z-20 border-[#F47B20] bg-[oklch(25%_0.006_56/0.9)] text-white shadow-[0_0_24px_rgba(244,123,32,0.35)]"
                  : linked
                    ? "z-10 border-[#F47B20]/60 bg-[oklch(25%_0.006_56/0.9)] text-white"
                    : "z-10 border-white/12 bg-[oklch(22%_0.006_56/0.85)] text-[#e9e4dc] hover:border-[#F47B20]/70 hover:text-white"
            } ${dimmed ? "opacity-30" : "opacity-100"}`}
            style={{ left: `${skill[posKey].x}%`, top: `${skill[posKey].y}%` }}
          >
            {/* The "star": category colour with a soft glow */}
            <span
              className={`inline-block rounded-full align-middle ${hub ? "mr-2 h-2 w-2" : "mr-1.5 h-1.5 w-1.5"}`}
              style={{
                backgroundColor: selected ? "#1a1714" : color,
                boxShadow: selected ? "none" : `0 0 0 3px ${tint(color, 18)}, 0 0 10px ${tint(color, 80)}`,
              }}
              aria-hidden
            />
            {skill.name}
          </button>
        );
      })}
    </div>
  );
}

const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[oklch(25%_0.006_56)] px-3 py-1.5 text-xs md:text-sm text-[#f5f2ed] transition-colors hover:border-[#F47B20]/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F47B20]";
const label = "mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f8a82]";

// lg and up shows the details under the canvas; below that they open in a popup sheet.
const desktopQuery = "(min-width: 1024px)";
const subscribeDesktop = (cb) => {
  const mq = window.matchMedia(desktopQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useIsDesktop = () => useSyncExternalStore(subscribeDesktop, () => window.matchMedia(desktopQuery).matches, () => true);

// Phones: a bottom sheet with the selected skill's details. It covers only the lower part of the screen over
// a light backdrop, so the lit-up constellation stays visible above it. It scrolls on its own and closes with a
// swipe down (on the handle, or from the top of the content), a tap on the backdrop or Escape. Closing keeps
// the skill selected.
function SkillSheet({ onClose, children }) {
  const ref = useRef(null);
  const bodyRef = useRef(null); // the scrolling part under the handle
  const drag = useRef(null); // { y, dy } while a swipe-down is in progress
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    const before = document.activeElement;
    ref.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === "Escape" && close.current();
    // The popup belongs to the Skills section: once the section has scrolled out of the visible area above
    // the sheet (past it, or back up above it), close it.
    const section = document.getElementById("skills");
    const onScroll = () => {
      if (!section) return;
      const r = section.getBoundingClientRect();
      if (r.bottom < window.innerHeight * 0.3 || r.top > window.innerHeight * 0.45) close.current();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      before?.focus?.({ preventScroll: true });
    };
  }, []);

  // Swipe down to close: only when the sheet is scrolled to its top, so scrolling the content still works.
  const onTouchStart = (e) => {
    const onHandle = e.target.closest("[data-sheet-handle]");
    drag.current = onHandle || bodyRef.current.scrollTop <= 0 ? { y: e.touches[0].clientY, dy: 0 } : null;
  };
  const onTouchMove = (e) => {
    if (!drag.current) return;
    const dy = e.touches[0].clientY - drag.current.y;
    if (dy < 0 && drag.current.dy === 0) return void (drag.current = null); // swiping up = scrolling content
    drag.current.dy = Math.max(dy, 0);
    ref.current.style.transition = "none";
    ref.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onTouchEnd = () => {
    if (!drag.current) return;
    const { dy } = drag.current;
    drag.current = null;
    ref.current.style.transition = "transform 0.25s ease";
    if (dy > 90) {
      ref.current.style.transform = "translateY(100%)";
      setTimeout(() => close.current(), 200);
    } else ref.current.style.transform = "";
  };

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close details"
        onClick={() => close.current()}
        className="skill-sheet-backdrop fixed inset-0 z-[70] bg-black/25"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-sheet-title"
        tabIndex={-1}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="skill-sheet fixed inset-x-0 bottom-0 z-[71] flex max-h-[52svh] flex-col overflow-hidden rounded-t-3xl border-t border-white/10 bg-[oklch(16%_0.006_56)] text-[#f5f2ed] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)] outline-none"
      >
        {/* Handle: drag it down to close */}
        <div data-sheet-handle className="flex shrink-0 justify-center pb-3 pt-3">
          <span className="h-1.5 w-10 rounded-full bg-white/25" aria-hidden />
        </div>
        <div ref={bodyRef} className="overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

export default function SkillConstellation({ skills, categories, activeSkillId, onSelect }) {
  const [hoverId, setHoverId] = useState(null);
  const byId = useMemo(() => Object.fromEntries(skills.map((s) => [s.id, s])), [skills]);
  const lines = useMemo(() => buildLines(skills, byId), [skills, byId]);
  // Each skill's neighbours, from the lines (so `related` in either direction counts).
  const neighbours = useMemo(() => {
    const map = Object.fromEntries(skills.map((s) => [s.id, []]));
    for (const l of lines) {
      map[l.a.id].push(l.b);
      map[l.b.id].push(l.a);
    }
    return map;
  }, [skills, lines]);
  const degree = useMemo(() => Object.fromEntries(Object.entries(neighbours).map(([id, n]) => [id, n.length])), [neighbours]);

  const active = activeSkillId ? byId[activeSkillId] : null;
  const isDesktop = useIsDesktop();
  // Phones: the sheet can be closed while the skill stays selected (so its lines stay lit on the sky).
  const [sheetClosedFor, setSheetClosedFor] = useState(null);
  const sheetOpen = !!active && !isDesktop && sheetClosedFor !== active.id;

  const select = (id) => {
    if (!isDesktop) {
      setSheetClosedFor(null);
      // Tapping the selected star again just reopens its details instead of deselecting it.
      if (active?.id === id) return;
      // Bring the star up into the top part of the screen, above the sheet.
      const star = [...document.querySelectorAll(`[data-skill="${id}"]`)].find((el) => el.offsetParent);
      if (star) window.scrollBy({ top: star.getBoundingClientRect().top - window.innerHeight * 0.22, behavior: "smooth" });
    }
    onSelect(id);
  };
  // Hovering previews a skill's connections; the selected skill (if any) drives the detail panel.
  const focus = (hoverId && byId[hoverId]) || active;
  const connected = useMemo(() => (focus ? new Set([focus.id, ...neighbours[focus.id].map((s) => s.id)]) : null), [focus, neighbours]);

  const canvasProps = { skills, lines, degree, focus, selectedId: active?.id, connected, onSelect: select, onHover: setHoverId };

  // The selected skill's details: shown under the canvas on desktop and in a popup sheet on phones.
  const renderDetails = (skill, headingId) => (
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
        <div>
          <p className="mb-1.5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: categoryColor[skill.category] }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryColor[skill.category] }} aria-hidden />
            {categories.find((c) => c.id === skill.category)?.label}
          </p>
          <h4 id={headingId} className="font-heading text-2xl font-semibold text-[#f5f2ed] md:text-3xl">{skill.name}</h4>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#d6d0c6] md:text-base">{skill.usage}</p>
        </div>
        <div className="space-y-4">
          {neighbours[skill.id].length > 0 && (
            <div>
              <p className={label}>Connects with</p>
              <ul className="flex flex-wrap gap-2">
                {neighbours[skill.id].map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => select(s.id)} className={chip}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryColor[s.category] }} aria-hidden />
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className={label}>Used in</p>
            {skill.projects.length > 0 ? (
              <ul className="flex flex-wrap gap-2" aria-label="Related projects">
                {skill.projects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className={chip}>
                      {p.name} <ArrowUpRight size={14} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#b7b1a8]">Part of my everyday workflow on every project.</p>
            )}
          </div>
        </div>
      </div>
  );

  return (
    <div className="overflow-clip rounded-2xl border border-white/10 bg-[oklch(16%_0.006_56)] shadow-[0_30px_80px_-40px_rgba(244,123,32,0.35)]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#8f8a82]">
          <span className="text-[#F47B20]">{skills.length}</span> technologies · <span className="text-[#F47B20]">{lines.length}</span> connections
        </p>
        <ul className="flex flex-wrap gap-2 lg:justify-end" aria-label="Categories">
          {categories.map((c) => (
            <li key={c.id} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs text-[#b7b1a8]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: categoryColor[c.id], boxShadow: `0 0 8px ${tint(categoryColor[c.id], 80)}` }}
                aria-hidden
              />
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      <Canvas {...canvasProps} posKey="mpos" className="h-[1100px] lg:hidden" />
      <Canvas {...canvasProps} posKey="pos" className="hidden h-[640px] lg:block" />

      {/* Details panel under the canvas. On phones a selected skill opens in the popup sheet below instead. */}
      <div className="border-t border-white/10 px-5 py-5 md:px-6" aria-live="polite">
        {active && isDesktop ? (
          renderDetails(active)
        ) : (
          <p className="flex items-center gap-2.5 text-sm text-[#b7b1a8]">
            <Sparkles size={16} className="shrink-0 text-[#F47B20]" aria-hidden />
            {isDesktop
              ? "Hover or select a technology to see how it connects, how I use it and which projects it powers."
              : "Tap a technology to see how it connects, how I use it and which projects it powers."}
          </p>
        )}
      </div>
      {sheetOpen && <SkillSheet onClose={() => setSheetClosedFor(active.id)}>{renderDetails(active, "skill-sheet-title")}</SkillSheet>}
    </div>
  );
}
