"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, LayoutDashboard, MonitorSmartphone, Server } from "lucide-react";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons = { "web-apps": LayoutDashboard, "desktop-apps": MonitorSmartphone, websites: Globe, apis: Server };
const nameOf = Object.fromEntries(projects.map((p) => [p.slug, p.name]));

// Jump to the contact form with this service's topic already picked (Contact listens for the event).
const startWith = (topic) => {
  window.dispatchEvent(new CustomEvent("contact:topic", { detail: topic }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
};

export default function Services() {
  return (
    <section className="section-pad" id="services" aria-labelledby="services-heading">
      <div className="container-wide">
        <SectionHeading
          id="services-heading"
          lead="How I Can"
          accent="Help"
          subtitle="From first idea to a shipped product. Here's what you can bring to me, with the work that shows it."
        />

        <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
          {services.map((s, i) => {
            const Icon = icons[s.id];
            return (
              <li key={s.id}>
              <Reveal className="h-full" delay={i * 60}>
                <article className="group flex h-full flex-col rounded-3xl border border-[var(--line)] bg-[var(--color-base-100)] p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/50 hover:shadow-[0_24px_50px_-30px_rgba(244,123,32,0.55)] md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/10 text-accent-ink transition-colors duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white">
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className="font-mono text-sm text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{s.summary}</p>
                  <ul className="mt-5 space-y-2 text-[15px]">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">See it in</p>
                    <div className="flex flex-wrap gap-2">
                      {s.proof.map((slug) => (
                        <Link
                          key={slug}
                          href={`/projects/${slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium transition-colors hover:border-[var(--color-accent)] hover:text-accent-ink"
                        >
                          {nameOf[slug]} <ArrowUpRight size={12} aria-hidden />
                        </Link>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => startWith(s.topic)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink"
                    >
                      Start a project like this
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </button>
                  </div>
                </article>
              </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
