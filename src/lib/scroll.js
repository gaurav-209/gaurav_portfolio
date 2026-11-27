// Scroll the page from code with the same smooth glide as the mouse wheel (see SmoothScroll.jsx).
// `target` is a y position in pixels or an element; `offset` is added to it (default: clear the navbar
// for elements, none for pixel positions). Falls back to the browser's smooth scroll without Lenis.
//
// While such a scroll is under way `window.__autoScrolling` is true, so scroll-catching sections (Services)
// let it pass instead of stopping it at their panels.
const NAV_OFFSET = -80;

export function smoothScrollTo(target, { offset } = {}) {
  if (typeof window === "undefined") return;
  const off = offset ?? (typeof target === "number" ? 0 : NAV_OFFSET);
  window.__autoScrolling = true;
  const done = () => (window.__autoScrolling = false);
  const lenis = window.lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset: off, onComplete: done });
    return;
  }
  const y = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  window.addEventListener("scrollend", done, { once: true });
  setTimeout(done, 1500); // in case the browser doesn't fire scrollend
  window.scrollTo({ top: y + off, behavior: "smooth" });
}
