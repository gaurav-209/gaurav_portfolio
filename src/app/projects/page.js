import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectsBrowser from "@/components/sections/ProjectsBrowser";

export const metadata = {
  title: `Projects | ${site.name}`,
  description: `All ${projects.length} projects by ${site.name}: fintech platforms built at work, plus full-stack apps and websites of my own.`,
  openGraph: { title: `Projects | ${site.name}`, images: ["/opengraph-image"] },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="container-wide px-5 md:px-8">
        <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-accent-ink">
          <ArrowLeft size={16} aria-hidden /> Back to home
        </Link>
        <div className="mt-8">
          <SectionHeading
            level={1}
            lead="All"
            accent="Projects"
            subtitle="Fintech platforms I build at work, plus full-stack apps and websites of my own. Filter, then open any project for the full case study."
          />
        </div>
        <ProjectsBrowser />
        <p className="mt-8 text-sm text-[var(--text-muted)]">
          Work projects are part of my job on the Swiftfolios platform. The apps are private, so their images come from the public Swiftfolios website.
        </p>
      </div>
    </div>
  );
}
