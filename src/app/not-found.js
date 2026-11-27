import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { featuredProjects } from "@/data/projects";

export const metadata = {
  title: `Page not found | ${site.name}`,
};

// Shown for any address that doesn't exist (and for unknown project slugs). Keeps the site's look and offers
// the useful ways onward: home, all projects, a few featured case studies, and the contact form.
export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] items-center px-5 pb-16 pt-28 md:px-8">
      <div className="container-wide">
        <p className="ui-eyebrow">Error 404</p>
        <h1 className="hero-title mt-4 text-[clamp(3rem,12vw,7rem)] leading-[0.95]">
          Lost in
          <span className="block">
            <span className="hero-gradient-text">the code</span>
            <span className="text-[var(--color-accent)]">.</span>
          </span>
        </h1>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[var(--text-muted)]">
          This page doesn&apos;t exist, or it moved. Here are some good places to go instead.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="ui-btn btn-primary">
            <ArrowLeft size={17} aria-hidden /> Back to home
          </Link>
          <Link
            href="/projects"
            className="ui-btn ui-btn-secondary"
          >
            See all projects <ArrowRight size={17} aria-hidden />
          </Link>
        </div>

        <div className="mt-12 max-w-2xl border-t border-[var(--line)] pt-6">
          <p className="ui-eyebrow ui-eyebrow-muted mb-3">Popular case studies</p>
          <ul className="flex flex-wrap gap-2">
            {featuredProjects.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="ui-chip px-3.5 py-1.5 text-sm"
                >
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                className="ui-chip px-3.5 py-1.5 text-sm"
              >
                Contact me
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
