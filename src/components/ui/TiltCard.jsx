"use client";

import { useRef } from "react";

// 3D tilt on hover: the part under the cursor is pushed back and the opposite side comes forward.
// Strongest at the corners, flat in the middle; springs back when the cursor leaves.
// Mouse only (touch scrolling stays normal) and off for reduced-motion users.
//
// The mouse is tracked on the OUTER box, which never moves; only the inner box tilts.
// Tracking the tilting box itself made the corners shake: a tilted corner moves away from
// the cursor, the cursor "leaves", the card snaps flat, the cursor is on it again, and so on.
// Hover styles inside should use this outer box as their `group` (pass className="group").
export default function TiltCard({ children, className = "", max = 12 }) {
  const inner = useRef(null);

  const onMove = (e) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1; // -1 left … 1 right
    const y = ((e.clientY - r.top) / r.height) * 2 - 1; // -1 top … 1 bottom
    // rotateY(+) moves the right edge away; rotateX(+) moves the top edge away.
    inner.current.style.transform = `rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
  };

  const reset = () => {
    inner.current.style.transform = "";
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={reset} className={`[perspective:900px] ${className}`}>
      <div ref={inner} className="transition-transform duration-200 ease-out will-change-transform">
        {children}
      </div>
    </div>
  );
}
