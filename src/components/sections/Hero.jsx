import { ArrowDown, Sparkles } from "lucide-react";
import { site, about, photoCards } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import PhotoCard from "@/components/ui/PhotoCard";
import Typewriter from "@/components/ui/Typewriter";

// Two layouts from one set of elements:
// - Phones/tablets: a big "FULL-STACK / DEVELOPER" title in front of the photo card (which tucks
//   up under it) and the "// how I work" line under the photo, centred on the screen.
//   ("Explore My Work" moves to the About section on phones, next to "Download resume".)
//   (The text column uses `contents`, so its pieces join the photo in one column and are reordered;
//   the title and the bottom row both take spare space, so title + photo + button sit centred.)
// - Desktop (lg+): pill, title, one-line pitch and button on the left, photo card on the right.
export default function Hero() {
  const [first, ...rest] = site.title.split(" "); // "Full-Stack", "Developer"

  return (
    <section className="relative flex min-h-[100svh] items-center px-5 pb-8 pt-24 md:px-8 md:pt-32 lg:pb-32">
      <div className="container-wide relative flex min-h-[calc(100svh-8rem)] flex-col items-center lg:grid lg:min-h-0 lg:grid-cols-[1.5fr_.8fr] lg:items-center lg:gap-14">
        {/* Text (on phones its children join the column below, see `contents`) */}
        <div className="contents lg:block lg:max-w-2xl">
          {/* Pill: desktop only, above the title */}
          <Reveal className="hidden lg:block">
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

          <Reveal delay={60} className="relative z-10 order-1 mt-auto w-full lg:z-auto lg:order-none lg:mt-0">
            <h1 className="hero-title text-[var(--text)] lg:mt-6 lg:text-[clamp(2.6rem,14vw,6.25rem)]">
              {/* Phones/tablets: uppercase, orange first line, dark second line stepped to the right */}
              <span className="block text-[clamp(2.6rem,14.2vw,6rem)] uppercase leading-[0.92] lg:hidden" aria-label={site.title}>
                <span className="hero-from-left block whitespace-nowrap" aria-hidden>
                  <span className="hero-gradient-text">{first}</span>
                </span>
                <span className="hero-from-right block whitespace-nowrap text-right" aria-hidden>
                  {rest.join(" ")}
                </span>
              </span>
              {/* Desktop: the original two-line title with the orange last word */}
              <span className="hidden lg:block">
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
              </span>
            </h1>
          </Reveal>

          <Reveal delay={120} className="hidden lg:block">
            <p className="mt-7 text-lg md:text-xl text-[var(--text-muted)] leading-relaxed max-w-md text-balance">{site.heroLine}</p>
          </Reveal>

          <Reveal delay={180} className="hidden lg:block">
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 lg:mt-9 lg:justify-start">
              <a href="#work" className="ui-btn ui-btn-lg btn-primary group">
                Explore My Work <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Photo slot: where the photo card starts. The static card shows without JS / with reduced
            motion; otherwise PhotoFlip (in page.js) draws a moving card over it that flips into About.
            On phones it tucks up behind the title. */}
        <div data-photo-slot="hero" className="relative order-2 -mt-6 w-[62%] max-w-[18rem] md:max-w-[20rem] lg:order-none lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[22rem]">
          {/* Phones: the photo appears first (the animation is on this inner box, so the slot PhotoFlip
              measures never moves) */}
          <div className="hero-photo-in">
            <Reveal delay={120}>
              <TiltCard className="group">
                <PhotoCard {...photoCards.front} priority />
              </TiltCard>
            </Reveal>
          </div>
        </div>

        {/* Phones/tablets: the "how I work" line under the photo (on desktop it is in About) */}
        {/* ...then the title slides in from both sides, then this types itself out */}
        <div className="order-3 mb-auto lg:hidden">
          <Typewriter
            delay={1500}
            className="mt-5 text-center font-mono text-[12px] leading-relaxed whitespace-nowrap"
            lines={[
              { text: "// how I work", className: "text-[var(--text-muted)]" },
              { text: about.howIWork, className: "text-[var(--text)]" },
            ]}
          />
        </div>

      </div>

      {/* Scroll cue: desktop layout only. */}
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
