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
      <ul className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3" aria-live="polite">
        {items.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
