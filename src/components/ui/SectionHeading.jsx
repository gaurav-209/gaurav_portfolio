import Reveal from "@/components/ui/Reveal";

// Shared section heading: big two-line title (second line orange, ends with an orange full stop),
// a short light intro underneath, and an optional item on the right (e.g. a link).
// `dark` = light text for sections on a dark background (Skills).
export default function SectionHeading({ id, lead, accent, subtitle, aside, dark = false, level = 2 }) {
  const H = level === 1 ? "h1" : "h2"; // h1 on pages where this is the page title (e.g. /projects)
  return (
    <div className="mb-10 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal>
          <H
            id={id}
            className={`font-heading font-semibold tracking-[-0.035em] text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] ${dark ? "text-[#f5f2ed]" : ""}`}
          >
            {lead}
            <span className="block">
              <span className="hero-gradient-text">{accent}</span>
              <span className="text-[var(--color-accent)]">.</span>
            </span>
          </H>
        </Reveal>
        {subtitle && (
          <Reveal delay={60}>
            <p className={`mt-6 max-w-md text-base md:text-[17px] leading-[1.85] ${dark ? "text-[#b7b1a8]" : "text-[var(--text-muted)]"}`}>
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
      {aside && <Reveal delay={120}>{aside}</Reveal>}
    </div>
  );
}
