import Image from "next/image";

// The portrait card used in the hero (front) and the About section (back).
// Hover zoom follows the nearest `.group` (the TiltCard around it).
export default function PhotoCard({ src, alt, eyebrow, title, position = "50% 30%", priority = false }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-photo)]">
      <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full border border-[var(--color-accent)]/40" aria-hidden />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover scale-[1.12] transition-transform duration-700 group-hover:scale-[1.16]"
        style={{ objectPosition: position, transformOrigin: position }}
        sizes="(max-width: 1024px) 100vw, 400px"
      />
      {(eyebrow || title) && (
        <>
          {/* Darkens the bottom half so the caption reads over the photo. Desktop only: on phones the hero
              title and name sit right next to the card, so the caption would just repeat them. */}
          <div className="absolute inset-x-0 bottom-0 hidden h-1/2 lg:block bg-gradient-to-t from-black/90 via-black/55 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 hidden px-5 pb-5 text-white lg:block">
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] mb-1">{eyebrow}</p>}
            {title && <p className="font-heading text-xl font-semibold">{title}</p>}
          </div>
        </>
      )}
    </div>
  );
}
