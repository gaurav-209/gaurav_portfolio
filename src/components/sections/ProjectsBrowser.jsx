"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";

const filters = [
  { label: "All", test: () => true },
  { label: "Work", test: (p) => p.kind === "work" },
  { label: "Personal", test: (p) => p.kind === "personal" && p.status !== "in-progress" },
  { label: "In progress", test: (p) => p.status === "in-progress" },
];

// /projects: every project in a grid, with filters.
export default function ProjectsBrowser() {
  const [filter, setFilter] = useState(filters[0]);
  const items = projects.filter(filter.test);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              filter === f
                ? "btn-primary border-transparent"
                : "border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--color-base-content)]/40 hover:text-[var(--text)]"
            }`}
          >
            {f.label} <span className="font-mono text-xs opacity-70">({projects.filter(f.test).length})</span>
          </button>
        ))}
      </div>
      {items.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3" aria-live="polite">
          {items.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      ) : (
        // A filter with nothing in it (e.g. "In progress" once everything ships)
        <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-base-content)]/20 px-6 py-14 text-center" role="status">
          <p className="font-heading text-2xl font-semibold tracking-tight">Nothing here right now.</p>
          <p className="mx-auto mt-2 max-w-sm text-[var(--text-muted)]">
            No {filter.label.toLowerCase()} projects at the moment. Check back soon, or browse everything else.
          </p>
          <button
            type="button"
            onClick={() => setFilter(filters[0])}
            className="ui-btn ui-btn-sm btn-primary mt-6"
          >
            Show all projects
          </button>
        </div>
      )}
    </>
  );
}
