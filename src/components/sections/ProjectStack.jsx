"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ProjectVisual, projectBadge } from "@/components/ui/ProjectCard";

const TOP = 96; // px below the top of the screen where cards stick (clears the floating navbar)
const STEP = 16; // each later card sticks a little lower, so the edges of earlier cards peek out like a deck

const chip = "rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-xs text-[var(--text-muted)]";
const iconLink =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-muted)] transition hover:border-[var(--color-accent)] hover:text-accent-ink";

function Card({ project, index, total }) {
  const href = `/projects/${project.slug}`;
  const tags = project.cardTech ?? Object.values(project.stack ?? {}).flat().slice(0, 3);
  const { repo, live } = project.links ?? {};
  return (
    <article className="grid overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--color-base-100)] shadow-[0_-12px_40px_-24px_rgba(37,52,63,0.35)] md:h-[min(540px,calc(100svh-9rem))] md:grid-cols-[1fr_1.15fr]">
      {/* Text */}
      <div className="order-2 flex flex-col p-5 md:order-1 md:p-9">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-accent-ink">
            {String(index + 1).padStart(2, "0")}
            <span className="text-[var(--text-muted)]"> / {String(total).padStart(2, "0")}</span>
          </span>
          <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
            {projectBadge(project)}
          </span>
        </div>
        <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {project.category}
          {project.year && ` · ${project.year}`}
        </p>
        <h3 className="mt-1.5 font-heading text-2xl font-semibold leading-tight tracking-tight md:text-4xl">
          <Link href={href} className="transition-colors hover:text-accent-ink">
            {project.name}
          </Link>
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)] md:text-base">{project.tagline}</p>
        {project.highlight && (
          <p className="mt-4 hidden border-l-2 border-[var(--color-accent)] pl-3 text-sm leading-snug md:block">
            <span className="mb-0.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
              {project.kind === "work" ? "My part" : "Highlight"}
            </span>
            {project.highlight}
          </p>
        )}
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Key technologies">
          {tags.map((t) => (
            <li key={t} className={chip}>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <Link href={href} className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
            Read case study <ArrowUpRight size={16} aria-hidden />
          </Link>
          <div className="flex gap-2">
            {live && (
              <a href={live} target="_blank" rel="noreferrer" className={iconLink} aria-label={`${project.name} live site`}>
                <ExternalLink size={16} aria-hidden />
              </a>
            )}
            {repo && (
              <a href={repo} target="_blank" rel="noreferrer" className={iconLink} aria-label={`${project.name} source code`}>
                <FaGithub size={16} aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Visual */}
      {/* Screenshots are 16:10, so keep that shape (centred in the column) rather than cropping them */}
      <Link href={href} tabIndex={-1} aria-hidden className="group order-1 flex items-center p-3 md:order-2 md:p-4 md:pl-0">
        <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          <ProjectVisual project={project} sizes="(max-width: 768px) 92vw, 55vw" />
        </span>
      </Link>
    </article>
  );
}

function SeeAll({ rest, totalCount }) {
  return (
    <article className="flex flex-col justify-center overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--color-base-100)] p-6 shadow-[0_-12px_40px_-24px_rgba(37,52,63,0.35)] md:h-[min(540px,calc(100svh-9rem))] md:p-10">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
        That&apos;s {totalCount - rest.length} of {totalCount}
      </p>
      <h3 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
        There&apos;s more where <span className="hero-gradient-text">these came from</span>
        <span className="text-[var(--color-accent)]">.</span>
      </h3>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--text-muted)] md:text-base">
        Full-stack apps, client websites and work in progress: browse every project and filter by work, personal or in progress.
      </p>
      <ul className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3" aria-label="More projects">
        {rest.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className="group block">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                <ProjectVisual project={p} sizes="160px" />
              </span>
              <span className="mt-1.5 block truncate text-xs text-[var(--text-muted)] transition-colors group-hover:text-accent-ink">{p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/projects" className="btn-primary mt-7 inline-flex items-center gap-2 self-start rounded-full px-6 py-3 font-semibold">
        See all {totalCount} projects <ArrowRight size={18} aria-hidden />
      </Link>
    </article>
  );
}

// One project at a time: each card sticks under the navbar and the next one slides up over it from the
// bottom. Cards that get covered shrink and dim a little, like a deck. With reduced motion it's a plain list.
export default function ProjectStack({ featured, rest }) {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [...list.children];
    const update = () => {
      for (let i = 0; i < items.length - 1; i++) {
        const cur = items[i].getBoundingClientRect();
        const next = items[i + 1].getBoundingClientRect();
        // 0 while the next card is a full card-height away, 1 once it fully covers this one.
        const p = Math.min(Math.max(1 - (next.top - cur.top) / cur.height, 0), 1);
        const inner = items[i].firstElementChild;
        inner.style.transform = `scale(${1 - 0.06 * p})`;
        inner.style.filter = `brightness(${1 - 0.12 * p})`;
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const total = featured.length;
  return (
    <ol ref={listRef} className="space-y-[12vh]" aria-label="Featured projects">
      {featured.map((p, i) => (
        <li key={p.slug} className="sticky motion-reduce:static" style={{ top: TOP + i * STEP }}>
          <div className="origin-top will-change-transform">
            <Card project={p} index={i} total={total} />
          </div>
        </li>
      ))}
      <li className="sticky motion-reduce:static" style={{ top: TOP + total * STEP }}>
        <div className="origin-top">
          <SeeAll rest={rest} totalCount={total + rest.length} />
        </div>
      </li>
    </ol>
  );
}
