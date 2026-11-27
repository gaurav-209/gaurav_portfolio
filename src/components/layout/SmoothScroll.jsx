"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { smoothScrollTo } from "@/lib/scroll";

const NAV_OFFSET = -80; // keep "#section" targets clear of the floating navbar

// Smooth, slower mouse-wheel / trackpad scrolling (Lenis). Each wheel step moves less and the page glides
// to a stop, so sections have time to appear. Phones keep their own native touch scrolling, and visitors
// who ask for reduced motion get normal scrolling. Elements marked `data-lenis-prevent` (popups, the
// message box) scroll on their own.
//
// "#section" links glide too. A target can set its own offset with `data-anchor-offset` (or
// `data-anchor-offset-lg` for desktop only); otherwise NAV_OFFSET. About uses 0, so the link lands exactly
// where the flying photo has settled.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: 0.075, // lower = smoother, longer glide (default 0.1)
      wheelMultiplier: 0.75, // each wheel step scrolls 75% of the usual distance
      autoRaf: true,
    });
    window.lenis = lenis; // so code that scrolls the page (buttons, popups) can glide the same way

    const onClick = (e) => {
      // (Next.js links mark the click as handled; the same-page glide is still ours to do.)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.composedPath().find((n) => n instanceof HTMLAnchorElement);
      const href = a?.getAttribute("href");
      if (!href || !/^(\/|\.\/)?#/.test(href)) return;
      const id = href.split("#")[1];
      if (!id || id === "top") return void smoothScrollTo(0);
      const target = document.getElementById(id);
      if (!target) return;
      const lg = window.matchMedia("(min-width: 1024px)").matches;
      const custom = (lg ? target.dataset.anchorOffsetLg : undefined) ?? target.dataset.anchorOffset;
      smoothScrollTo(target, { offset: custom != null ? Number(custom) : NAV_OFFSET });
    };
    window.addEventListener("click", onClick);
    // A visitor scrolling interrupts any glide from code, so stop treating the scroll as automatic.
    const userScroll = () => (window.__autoScrolling = false);
    const opts = { passive: true, capture: true };
    for (const t of ["wheel", "touchstart", "keydown"]) window.addEventListener(t, userScroll, opts);

    return () => {
      window.removeEventListener("click", onClick);
      for (const t of ["wheel", "touchstart", "keydown"]) window.removeEventListener(t, userScroll, opts);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);
  return null;
}
