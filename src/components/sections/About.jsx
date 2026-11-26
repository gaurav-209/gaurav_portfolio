import { ArrowDown, Download } from "lucide-react";
import { site, about, philosophy, photoCards } from "@/data/site";
import { timeline } from "@/data/experience";
import Reveal from "@/components/ui/Reveal";
import PhotoCard from "@/components/ui/PhotoCard";

// Three balanced columns: who I am (left), photo + how I work (middle), my short story + buttons (right).
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
            {/* One line on phones ("Hi, I'm Gaurav."), two lines on desktop where the column is narrow */}
            <h2 id="about-heading" className="whitespace-nowrap font-heading font-semibold tracking-[-0.035em] text-[clamp(2rem,10.5vw,3.75rem)] leading-[0.95] lg:whitespace-normal lg:text-[clamp(2.75rem,6vw,5rem)]">
              Hi, I&apos;m{" "}
              <span className="lg:block">
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
        </div>

        {/* Middle: photo slot (the hero photo card lands here, flipped; see PhotoFlip), "how I work" under it.
            On phones it comes first, so the card lands right under the hero before "Hi, I'm Gaurav". */}
        <div className="order-first mx-auto w-full max-w-sm lg:order-none lg:max-w-none">
          <div data-photo-slot="about" className="relative">
            <Reveal>
              <PhotoCard {...photoCards.back} />
            </Reveal>
          </div>
          {/* Desktop only: on phones this line sits in the hero, under the first photo */}
          <Reveal delay={120} className="hidden lg:block">
            <p className="mt-4 text-center font-mono text-[12px] leading-relaxed whitespace-nowrap">
              <span className="block text-[var(--text-muted)]">{"// how I work"}</span>
              <span className="text-[var(--text)]">{about.howIWork}</span>
            </p>
          </Reveal>
        </div>

        {/* Right: my story, how I think, and the buttons. Small, light paragraphs. */}
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
          {/* Buttons under the story. Phones: "Explore My Work" (main) + "Download resume" (outlined), since the
              hero button moved here. Desktop: the hero keeps "Explore My Work", so "Download resume" is the main one. */}
          <Reveal delay={120}>
            <div className="mt-6 grid max-w-sm grid-cols-2 gap-2.5 lg:flex lg:max-w-none lg:flex-wrap lg:items-center lg:gap-3">
              <a href="#work" className="btn-primary group inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-semibold lg:hidden">
                Explore My Work <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
              <a
                href={site.resume}
                download
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-2 border-[var(--color-accent)] px-3 py-2 text-[13px] font-semibold lg:gap-2 lg:px-5 lg:text-sm lg:shadow-[0_12px_26px_-12px_rgba(244,123,32,0.7)] text-accent-ink transition hover:bg-[var(--color-accent)]/10 lg:border-transparent lg:bg-[linear-gradient(135deg,#F47B20,#EA580C)] lg:py-2.5 lg:text-white lg:[text-shadow:0_1px_1px_rgba(0,0,0,0.25)] lg:hover:bg-[linear-gradient(135deg,#F47B20,#EA580C)] lg:hover:brightness-110"
              >
                Download resume <Download size={16} aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
