import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, featuredProjects } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectStack from "@/components/sections/ProjectStack";

// Home page: the featured projects stack one at a time as you scroll, then a card leads to /projects.
export default function Projects() {
  const rest = projects.filter((p) => !p.featured);
  return (
    <section className="section-pad" id="work" aria-labelledby="projects-heading">
      <div className="container-wide">
        <SectionHeading
          id="projects-heading"
          lead="Featured"
          accent="Projects"
          subtitle="Fintech platforms I build at work, plus projects of my own. Scroll through, or open one to read the full case study."
          aside={
            <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] transition-colors hover:text-accent-ink">
              All {projects.length} projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          }
        />
        <ProjectStack featured={featuredProjects} rest={rest} />
        <p className="mt-6 text-sm text-[var(--text-muted)]">
          Work projects are part of my job on the Swiftfolios platform. The apps are private, so their images come from the public Swiftfolios website.
        </p>
      </div>
    </section>
  );
}
