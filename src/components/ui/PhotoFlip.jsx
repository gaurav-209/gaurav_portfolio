"use client";

import { useEffect, useRef, useState } from "react";
import TiltCard from "@/components/ui/TiltCard";
import PhotoCard from "@/components/ui/PhotoCard";

// Scroll-driven photo flight: the card starts in the hero slot, glides to the About slot while the
// page scrolls, and flips 180° on the way so it lands showing the About photo. Scrolling back reverses it.
//
// How it fits together:
// - Place this inside a `position: relative` wrapper that also contains two slot elements:
//   [data-photo-slot="hero"] and [data-photo-slot="about"]. Each slot holds a static card.
// - Without JS, or with reduced motion, the static cards simply stay put.
// - When the effect runs, the wrapper gets [data-photo-at] = "hero" | "flying" | "about".
//   At rest ("hero" / "about") the ordinary flat card in that slot is shown and this moving card is
//   hidden; only while "flying" is this 3D card shown (CSS in globals.css). The swap happens at the
//   exact same position, so it's invisible, and nothing 3D stays on screen once you stop scrolling.
// - Progress p = scroll from the top (0) to the landing point (1). The landing point is SETTLE of a
//   screen height before the About slot is centred (negative = after), so it sets how much scrolling the
//   flight takes: lower values give the flip more time.
const SETTLE = -0.12;

export default function PhotoFlip({ front, back }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = ref.current.parentElement;
    const heroSlot = wrap.querySelector('[data-photo-slot="hero"]');
    const aboutSlot = wrap.querySelector('[data-photo-slot="about"]');
    if (!heroSlot || !aboutSlot) return;

    let hero, about, end, midScale = 0.05, raf = 0;

    const update = () => {
      raf = 0;
      const el = ref.current;
      const flip = el?.querySelector("[data-flip]");
      if (!flip || !hero) return;
      const p = Math.min(Math.max(window.scrollY / end, 0), 1);
      const at = p <= 0 ? "hero" : p >= 1 ? "about" : "flying";
      if (wrap.getAttribute("data-photo-at") !== at) wrap.setAttribute("data-photo-at", at);
      const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2; // ease in-out
      el.style.left = `${hero.x}px`;
      el.style.top = `${hero.y}px`;
      el.style.width = `${hero.w}px`;
      // Vertical follows scroll linearly, so the card holds its height on screen instead of bobbing;
      // sideways movement, size and the flip use the eased value.
      el.style.transform = `translate(${(about.x - hero.x) * e}px, ${(about.y - hero.y) * p}px) scale(${1 + (about.w / hero.w - 1) * e})`;
      // The turn itself uses a gentle sine curve, so it rotates steadily through the whole flight instead of
      // spinning mostly in the middle.
      const turn = (1 - Math.cos(Math.PI * p)) / 2;
      // Flip. On wide screens it lifts slightly mid-flight; on phones, where the card fills the width and
      // starts low on the screen, it dips smaller mid-flight instead so the whole card stays in view.
      flip.style.transform = `perspective(1400px) rotateY(${180 * turn}deg) scale(${1 + midScale * Math.sin(Math.PI * turn)})`;
    };

    // Slot positions relative to the wrapper; re-measured whenever the layout changes.
    const measure = () => {
      const w = wrap.getBoundingClientRect();
      const rel = (slot) => {
        const b = slot.getBoundingClientRect();
        return { x: b.left - w.left, y: b.top - w.top, w: b.width };
      };
      hero = rel(heroSlot);
      about = rel(aboutSlot);
      const aboutBox = aboutSlot.getBoundingClientRect();
      end = Math.max(1, aboutBox.top + window.scrollY + aboutBox.height / 2 - window.innerHeight * (0.5 + SETTLE));
      midScale = window.innerWidth < 1024 ? -0.2 : 0.05;
      update();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    setOn(true);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
      wrap.removeAttribute("data-photo-at");
    };
  }, []);

  return (
    // Always rendered (so the effect can measure and position it straight away), hidden until it's active.
    <div ref={ref} className="photo-flip absolute z-20 origin-top-left will-change-transform" hidden={!on}>
      <TiltCard className="group">
        <div data-flip className="relative [transform-style:preserve-3d]">
          <div className="[backface-visibility:hidden]">
            <PhotoCard {...front} />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <PhotoCard {...back} />
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
