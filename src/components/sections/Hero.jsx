import { ArrowDown, Sparkles } from "lucide-react";
import { site, photoCards } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import PhotoCard from "@/components/ui/PhotoCard";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center px-5 pt-28 pb-16 md:px-8 md:pt-32 lg:pb-32">
      <div className="container-wide relative grid lg:grid-cols-[1.5fr_.8fr] gap-12 lg:gap-14 items-center">
        {/* Text */}
        <div className="max-w-2xl">
          <Reveal>
            <p className="hero-pill inline-flex items-center gap-1.5 md:gap-2.5 rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-base-100)]/70 px-3.5 md:px-4 py-2 backdrop-blur-sm font-mono text-[11px] md:text-sm font-bold uppercase tracking-[0.12em] md:tracking-[0.2em] text-accent-ink">
              <Sparkles size={16} className="text-[var(--color-accent)]" aria-hidden />
              {site.heroTags.map((tag, i) => (
                <span key={tag} className="inline-flex items-center gap-1.5 md:gap-2.5">
                  {i > 0 && <span className="text-[var(--color-accent)]" aria-hidden>•</span>}
                  <span className="hero-gradient-text">{tag}</span>
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="hero-title mt-6 text-[clamp(2.6rem,14vw,6.25rem)] text-[var(--text)]">
              {site.title.split(" ").map((word, i, words) =>
                i === words.length - 1 ? (
                  <span key={word} className="block whitespace-nowrap">
                    <span className="hero-gradient-text">{word}</span>
                    <span className="hero-dot" aria-hidden />
                  </span>
                ) : (
                  <span key={word} className="block whitespace-nowrap">{word}</span>
                )
              )}
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-7 text-lg md:text-xl text-[var(--text-muted)] leading-relaxed max-w-md text-balance">{site.heroLine}</p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="btn-primary group inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold"
              >
                Explore My Work <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Photo slot: where the photo card starts. The static card shows without JS / with reduced
            motion; otherwise PhotoFlip (in page.js) draws a moving card over it that flips into About. */}
        <div data-photo-slot="hero" className="relative mx-auto w-full max-w-sm lg:max-w-[22rem]">
          <Reveal delay={120}>
            <TiltCard className="group">
              <PhotoCard {...photoCards.front} priority />
            </TiltCard>
          </Reveal>
        </div>
      </div>

      {/* Scroll cue: desktop layout only. On phones and tablets the photo stacks below the text,
          so the hero is taller than the screen and the cue would sit out of sight. */}
      <a
        href="#about"
        className="hero-scroll absolute bottom-7 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)] hover:text-accent-ink transition-colors"
      >
        <span className="relative flex h-9 w-6 justify-center rounded-full border-2 border-current" aria-hidden>
          <span className="hero-scroll-dot mt-1.5 h-2 w-1 rounded-full bg-[var(--color-accent)]" />
        </span>
        Scroll to explore
      </a>
    </section>
  );
}
