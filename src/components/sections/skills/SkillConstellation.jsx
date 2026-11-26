"use client";

import { useMemo, useState } from "react";
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
  // Hovering previews a skill's connections; the selected skill (if any) drives the detail panel.
  const focus = (hoverId && byId[hoverId]) || active;
  const connected = useMemo(() => (focus ? new Set([focus.id, ...neighbours[focus.id].map((s) => s.id)]) : null), [focus, neighbours]);

  const canvasProps = { skills, lines, degree, focus, selectedId: active?.id, connected, onSelect, onHover: setHoverId };

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

      {/* Sticky on mobile while a skill is selected, so its details stay visible below the tall canvas
          (needs overflow-clip, not hidden, on ancestors). Capped and scrollable there so a big hub like
          React doesn't cover the sky. */}
      <div
        className={`z-30 border-t border-white/10 bg-[oklch(16%_0.006_56/0.95)] px-5 py-5 backdrop-blur md:px-6 lg:static ${active ? "sticky bottom-0 max-h-[45svh] overflow-y-auto overscroll-contain lg:max-h-none lg:overflow-visible" : ""}`}
        aria-live="polite"
      >
        {active ? (
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
            <div>
              <p className="mb-1.5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: categoryColor[active.category] }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryColor[active.category] }} aria-hidden />
                {categories.find((c) => c.id === active.category)?.label}
              </p>
              <h4 className="font-heading text-2xl font-semibold text-[#f5f2ed] md:text-3xl">{active.name}</h4>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#d6d0c6] md:text-base">{active.usage}</p>
            </div>
            <div className="space-y-4">
              {neighbours[active.id].length > 0 && (
                <div>
                  <p className={label}>Connects with</p>
                  <ul className="flex flex-wrap gap-2">
                    {neighbours[active.id].map((s) => (
                      <li key={s.id}>
                        <button type="button" onClick={() => onSelect(s.id)} className={chip}>
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
                {active.projects.length > 0 ? (
                  <ul className="flex flex-wrap gap-2" aria-label="Related projects">
                    {active.projects.map((p) => (
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
        ) : (
          <p className="flex items-center gap-2.5 text-sm text-[#b7b1a8]">
            <Sparkles size={16} className="shrink-0 text-[#F47B20]" aria-hidden />
            Hover or select a technology to see how it connects, how I use it and which projects it powers.
          </p>
        )}
      </div>
    </div>
  );
}
