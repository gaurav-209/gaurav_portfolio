import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { techList } from "@/data/projects";

export function projectBadge(project) {
  if (project.kind === "work") return "Work project";
  return project.status === "in-progress" ? "In progress" : "Personal project";
}

export function ProjectVisual({ project, sizes, priority = false }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={project.imageAlt ?? ""}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        sizes={sizes}
      />
    );
  }
  // No screenshot yet: a branded tile with the project's initials.
  const initials = project.name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#BFC9D1] to-[#25343F]">
      <span className="font-heading text-5xl md:text-6xl font-semibold text-[#EAEFEF] tracking-tight">{initials}</span>
    </div>
  );
}

const iconLink =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-muted)] hover:text-accent-ink hover:border-[var(--color-accent)] transition";

export default function ProjectCard({ project }) {
  const href = `/projects/${project.slug}`;
  const tags = project.cardTech ?? techList(project).slice(0, 3);
  const { repo, live } = project.links ?? {};

  return (
    <article className="card-surface overflow-hidden group flex flex-col h-full bg-[var(--color-base-100)]">
      <Link href={href} className="relative block aspect-[16/10] shrink-0 overflow-hidden bg-[var(--surface)]" tabIndex={-1} aria-hidden>
        <ProjectVisual project={project} sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw" />
        <span className="absolute top-3 left-3 font-mono text-[11px] font-semibold uppercase tracking-wider rounded-full bg-[var(--color-base-100)]/90 text-accent-ink px-2.5 py-1 backdrop-blur-sm">
          {projectBadge(project)}
        </span>
      </Link>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent-ink font-semibold mb-2">
          {project.category}
          {project.year && <span className="text-[var(--text-muted)]"> · {project.year}</span>}
        </p>
        <h3 className="font-heading text-xl md:text-2xl font-semibold leading-snug mb-2">
          <Link href={href} className="hover:text-accent-ink transition-colors">{project.name}</Link>
        </h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{project.tagline ?? project.shortDescription}</p>

        {project.highlight && (
          <div className="mt-4 rounded-xl border-l-2 border-[var(--color-accent)] bg-[var(--surface)] px-3.5 py-2.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
              {project.kind === "work" ? "My part" : "Highlight"}
            </p>
            <p className="mt-0.5 text-sm leading-snug text-[var(--text)]">{project.highlight}</p>
          </div>
        )}

        <div className="mt-auto pt-5">
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-5" aria-label="Key technologies">
              {tags.map((t) => (
                <li key={t} className="font-mono text-xs px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--text-muted)]">{t}</li>
              ))}
            </ul>
          )}
          <div className="flex min-h-9 items-center justify-between gap-3">
            <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-ink hover:gap-2.5 transition-all">
              Read case study <ArrowUpRight size={16} aria-hidden />
            </Link>
            {(live || repo) && (
              <div className="flex gap-2">
                {live && (
                  <a href={live} target="_blank" rel="noreferrer" className={iconLink} aria-label={`${project.name}: live site`} title="Live site">
                    <ExternalLink size={15} />
                  </a>
                )}
                {repo && (
                  <a href={repo} target="_blank" rel="noreferrer" className={iconLink} aria-label={`${project.name}: source code`} title="Source code">
                    <FaGithub size={15} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
