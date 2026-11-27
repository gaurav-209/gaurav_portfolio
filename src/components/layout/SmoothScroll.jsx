"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Smooth, slower mouse-wheel / trackpad scrolling (Lenis). Each wheel step moves less and the page glides
// to a stop, so sections have time to appear. Phones keep their own native touch scrolling, and visitors
// who ask for reduced motion get normal scrolling. Elements marked `data-lenis-prevent` (popups, the
// message box) scroll on their own.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: 0.075, // lower = smoother, longer glide (default 0.1)
      wheelMultiplier: 0.75, // each wheel step scrolls 75% of the usual distance
      anchors: { offset: -80 }, // "#section" links glide there too, clearing the floating navbar
      autoRaf: true,
    });
    window.lenis = lenis; // so code that scrolls the page (buttons, popups) can glide the same way
    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);
  return null;
}
