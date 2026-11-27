"use client";

import { useEffect, useState } from "react";

// Types its lines out one character at a time after `delay` ms, with a blinking caret on the line being
// typed. The untyped rest is kept in place (invisible) so nothing shifts while it types. Screen readers get
// the full text straight away; with reduced motion it simply shows everything.
// lines: [{ text, className }]
export default function Typewriter({ lines, delay = 0, speed = 38, className = "" }) {
  const total = lines.reduce((n, l) => n + l.text.length, 0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer;
    const start = setTimeout(
      () => {
        if (reduce) return setShown(total);
        timer = setInterval(() => {
          setShown((n) => {
            if (n + 1 >= total) clearInterval(timer);
            return Math.min(n + 1, total);
          });
        }, speed);
      },
      reduce ? 0 : delay
    );
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [total, delay, speed]);

  // Where each line starts in the overall character count.
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.text.length, 0));

  return (
    <p className={className} aria-label={lines.map((l) => l.text).join(" ")}>
      {lines.map((l, i) => {
        const typed = Math.min(Math.max(shown - starts[i], 0), l.text.length);
        const typing = shown < total && shown >= starts[i] && typed < l.text.length;
        return (
          <span key={i} className={`block ${l.className ?? ""}`} aria-hidden>
            {l.text.slice(0, typed)}
            {typing && <span className="typewriter-caret" />}
            <span className="invisible">{l.text.slice(typed)}</span>
          </span>
        );
      })}
    </p>
  );
}
