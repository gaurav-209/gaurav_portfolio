import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ProjectVisual, projectBadge } from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

// Every slug is prerendered from static data, so a blocking route costs nothing here.
export const instant = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: `Page not found | ${site.name}` };
  return {
    title: `${project.name} | ${site.name}`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.name} | ${site.name}`,
      description: project.shortDescription,
      images: ["/opengraph-image"],
    },
  };
}

const bullet = <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0" aria-hidden />;

function Section({ id, eyebrow, title, children }) {
  return (
    <section aria-labelledby={id}>
      {eyebrow && <p className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-accent-ink mb-2">{eyebrow}</p>}
      <h2 id={id} className="font-heading text-2xl md:text-3xl font-semibold tracking-tight mb-5">{title}</h2>
      {children}
    </section>
  );
}

function Contributions({ items }) {
  if (typeof items[0] === "string") {
    return (
      <ul className="card-surface p-6 space-y-3 text-[var(--text-muted)]">
        {items.map((c) => <li key={c} className="flex gap-3">{bullet}{c}</li>)}
      </ul>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((group) => (
        <div key={group.area} className="card-surface p-5 md:p-6">
          <h3 className="font-heading text-lg font-semibold mb-3">{group.area}</h3>
          <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
            {group.items.map((c) => <li key={c} className="flex gap-3">{bullet}{c}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const { repo, live } = project.links ?? {};
  const isWork = project.kind === "work";

  const facts = [
    ["Role", project.facts?.role],
    ["Type", projectBadge(project)],
    ["Platform", project.facts?.platform],
    ["Team", project.facts?.team],
    ["Timeline", project.facts?.timeline ?? project.year],
  ].filter(([, v]) => v);
  const stack = Object.entries(project.stack ?? {}).filter(([, list]) => list.length);

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24 min-h-screen">
      <div className="container-wide px-5 md:px-8">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-accent-ink transition-colors">
          <ArrowLeft size={16} aria-hidden /> Back to projects
        </Link>

        {/* 1. Header + quick facts */}
        <header className="mt-6 mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="font-mono text-xs font-semibold tracking-[0.12em] uppercase text-accent-ink">{project.category}</p>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-accent-ink px-2.5 py-0.5">
              {projectBadge(project)}
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight mb-4 max-w-4xl">{project.name}</h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-3xl">{project.description}</p>

          {(live || repo) && (
            <div className="flex flex-wrap gap-3 mt-6">
              {live && (
                <a href={live} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
                  <ExternalLink size={15} aria-hidden /> {isWork ? `Visit ${new URL(live).hostname.replace(/^www\./, "")}` : "Live site"}
                </a>
              )}
              {repo && (
                <a href={repo} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
                  <FaGithub size={15} aria-hidden /> Source code
                </a>
              )}
            </div>
          )}

          {/* Cells stretch to fill each row, so any number of facts leaves no empty gaps. */}
          <dl className="mt-8 flex flex-wrap gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)]">
            {facts.map(([label, value]) => (
              <div key={label} className="flex-[1_1_160px] bg-[var(--color-base-100)] px-5 py-4">
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</dt>
                <dd className="mt-1 text-sm md:text-base font-semibold text-[var(--text)]">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* 2. Visual + gallery */}
        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
          <ProjectVisual project={project} sizes="(max-width: 1280px) 100vw, 1200px" priority />
        </div>
        {project.gallery?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.gallery.map((g) => (
              <div key={g.src} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            ))}
          </div>
        )}
        {isWork && (
          <p className="mt-3 text-sm text-[var(--text-muted)]">The app itself is private, so these images are from the public Swiftfolios website; no client data is shown.</p>
        )}

        <div className="mt-12 md:mt-16 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-12 lg:gap-14 items-start">
          <div className="space-y-14 md:space-y-16 min-w-0">
            {/* 3. Problem → solution */}
            {(project.problem || project.solution) && (
              <Section id="overview" eyebrow="Overview" title="Problem and solution">
                <div className="grid md:grid-cols-2 gap-4">
                  {project.problem && (
                    <div className="card-surface p-6">
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">The problem</h3>
                      <p className="leading-relaxed">{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="card-surface p-6 border-[var(--color-accent)]/40">
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-ink mb-2">The solution</h3>
                      <p className="leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* 4. Contributions */}
            <Section id="contributions" eyebrow={isWork ? "My role" : "What I built"} title={isWork ? "My contributions" : "What I built"}>
              <p className="text-[var(--text-muted)] mb-5 max-w-2xl">{project.role}</p>
              {project.contributions.length > 0 ? (
                <Contributions items={project.contributions} />
              ) : (
                <p className="text-[var(--text-muted)]">Details coming soon. This project is still in development.</p>
              )}
            </Section>

            {/* 5. Technical challenges */}
            {project.challenges?.length > 0 && (
              <Section id="challenges" eyebrow="Engineering" title="Technical challenges">
                <ol className="space-y-4">
                  {project.challenges.map((c, i) => (
                    <li key={c.title} className="card-surface p-6 flex gap-5">
                      <span className="font-heading text-3xl font-semibold text-accent-ink/80 leading-none tabular-nums" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-semibold mb-1.5">{c.title}</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed">{c.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {/* 6. Key features */}
            {project.keyFunctionality.length > 0 && (
              <Section id="features" eyebrow="Product" title="Key features">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {project.keyFunctionality.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--color-base-100)] px-4 py-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-accent-ink">
                        <Check size={13} strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* 7. Results (real numbers only) */}
            {project.outcomes?.length > 0 && (
              <Section id="results" eyebrow="Impact" title="Results">
                <ul className="grid sm:grid-cols-2 gap-4">
                  {project.outcomes.map((o) => (
                    <li key={o} className="card-surface p-5 font-semibold leading-relaxed">{o}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* 9. What I learned */}
            {project.learned && (
              <Section id="learned" eyebrow="Reflection" title="What I learned">
                <p className="text-[var(--text-muted)] leading-relaxed max-w-2xl">{project.learned}</p>
              </Section>
            )}
          </div>

          {/* 8. Tech stack, grouped */}
          {stack.length > 0 && (
            <aside className="lg:sticky lg:top-28 card-surface p-6" aria-labelledby="stack-heading">
              <h2 id="stack-heading" className="font-heading text-xl font-semibold mb-5">Tech stack</h2>
              <dl className="space-y-5">
                {stack.map(([group, list]) => (
                  <div key={group}>
                    <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">{group}</dt>
                    <dd className="flex flex-wrap gap-2">
                      {list.map((t) => (
                        <span key={t} className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--line)] text-[var(--text)]">{t}</span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>

        {/* 10. Next / previous + contact */}
        <nav className="mt-16 md:mt-20 grid sm:grid-cols-2 gap-4" aria-label="More projects">
          {[["Previous project", prev, ArrowLeft], ["Next project", next, ArrowRight]].map(([label, p, Icon]) => (
            <Link
              key={label}
              href={`/projects/${p.slug}`}
              className={`card-surface p-5 md:p-6 group flex flex-col gap-1 ${label === "Next project" ? "sm:items-end sm:text-right" : ""}`}
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {label === "Previous project" && <Icon size={14} aria-hidden />}
                {label}
                {label === "Next project" && <Icon size={14} aria-hidden />}
              </span>
              <span className="font-heading text-lg md:text-xl font-semibold group-hover:text-accent-ink transition-colors">{p.name}</span>
              <span className="text-sm text-[var(--text-muted)]">{p.category}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 rounded-3xl bg-[var(--color-base-content)] text-[var(--color-base-100)] px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight">Building something similar?</h2>
            <p className="mt-1 opacity-80">I&apos;m happy to talk about the details, or about your project.</p>
          </div>
          <Link
            href="/#contact"
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold shrink-0"
          >
            <Mail size={17} aria-hidden /> Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
