// Scroll the page from code with the same smooth glide as the mouse wheel (see SmoothScroll.jsx).
// `target` is a y position in pixels or an element. Falls back to the browser's smooth scroll when
// Lenis isn't running (reduced motion, or before it starts).
const NAV_OFFSET = -80; // keep targets clear of the floating navbar

export function smoothScrollTo(target) {
  const lenis = typeof window !== "undefined" ? window.lenis : null;
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : NAV_OFFSET });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target?.scrollIntoView({ behavior: "smooth" });
}
