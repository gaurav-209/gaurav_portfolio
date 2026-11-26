"use client";

import { useLayoutEffect, useRef } from "react";

// Fades its children in when they scroll into view.
// Content is visible in the server HTML; only once this code runs (before the browser paints) does an
// element that is still below the screen get "armed" (hidden) and then faded in on scroll. Anything already
// on screen just stays visible, and if JavaScript fails to load nothing is ever hidden.
export default function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return; // already in view: leave it shown
    el.classList.add("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
