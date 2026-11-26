import { Download } from "lucide-react";
import { site, about, philosophy, photoCards } from "@/data/site";
import { timeline } from "@/data/experience";
import Reveal from "@/components/ui/Reveal";
import PhotoCard from "@/components/ui/PhotoCard";

// Three balanced columns: who I am + resume (left), photo + how I work (middle), my story (right).
export default function About() {
  const current = timeline.find((e) => e.type === "work");
  const place = site.location.split(",").map((s) => s.trim());
  const location = `${place[0]}, ${place.at(-1)}`;

  return (
    <section className="section-pad min-h-[100svh] flex items-center" id="about" aria-labelledby="about-heading">
      <div className="container-wide grid lg:grid-cols-[1fr_18rem_1fr] xl:grid-cols-[1fr_22rem_1fr] gap-12 lg:gap-10 xl:gap-14 items-center">
        {/* Left: name, role, where I work */}
        <div>
          <Reveal>
            {/* Same style as SectionHeading (second line orange); kept inline because it sits in a column. */}
            <h2 id="about-heading" className="font-heading font-semibold tracking-[-0.035em] text-[clamp(2.75rem,6vw,5rem)] leading-[0.95]">
              Hi, I&apos;m
              <span className="block">
                <span className="hero-gradient-text">{about.firstName}</span>
                <span className="text-[var(--color-accent)]">.</span>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-5 font-heading text-2xl md:text-[1.75rem] font-semibold leading-tight">
              {about.roleLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
          </Reveal>
          {current && (
            <Reveal delay={120}>
              <div className="mt-7 max-w-xs border-t border-[var(--line)] pt-5">
                <p className="text-sm text-[var(--text-muted)]">Currently at</p>
                <p className="mt-2 font-semibold">{current.company}</p>
                <p>{current.role}</p>
                <p className="text-[var(--text-muted)]">{location}</p>
              </div>
            </Reveal>
          )}
          <Reveal delay={180}>
            <a href={site.resume} download className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
              Download resume <Download size={16} aria-hidden />
            </a>
          </Reveal>
        </div>

        {/* Middle: photo slot (the hero photo card lands here, flipped; see PhotoFlip), "how I work" under it */}
        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <div data-photo-slot="about" className="relative">
            <Reveal>
              <PhotoCard {...photoCards.back} />
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="mt-4 text-center font-mono text-[12px] leading-relaxed whitespace-nowrap">
              <span className="block text-[var(--text-muted)]">{"// how I work"}</span>
              <span className="text-[var(--text)]">{about.howIWork}</span>
            </p>
          </Reveal>
        </div>

        {/* Right: my story and how I think. Small, light paragraphs. */}
        <div className="max-w-md lg:max-w-none">
          <Reveal>
            <div className="space-y-3 text-[15px] md:text-base leading-[1.75] text-[var(--text-muted)]">
              {about.story.map((para, p) => (
                <p key={p}>
                  {para.map(([text, highlight], i) =>
                    highlight ? <span key={i} className="font-medium text-accent-ink">{text}</span> : <span key={i}>{text}</span>
                  )}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-3 text-[15px] md:text-base leading-[1.75] text-[var(--text-muted)]">
              <span className="font-medium text-[var(--text)]">{philosophy.headline}</span> {philosophy.description}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
