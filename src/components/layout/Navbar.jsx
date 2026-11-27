"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { smoothScrollTo } from "@/lib/scroll";

// Sections tracked for the active underline. FAQ and Contact aren't in the navbar, but tracking them
// means "Skills" stops being underlined once you scroll past it.
const tracked = [...navLinks.map((l) => l.href.split("#")[1]), "faq", "contact"];

// Orange underline shared by the logo and the links.
function Underline({ on }) {
  return (
    <span
      aria-hidden
      className={`absolute left-1/2 -bottom-0.5 h-[2.5px] -translate-x-1/2 rounded-full bg-[var(--color-accent)] transition-all duration-300 ${on ? "w-[calc(100%-1rem)] opacity-100" : "w-0 opacity-0"}`}
    />
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Looked up per scroll: the navbar lives in the layout and outlives page navigations.
      const sections = tracked.map((id) => document.getElementById(id)).filter(Boolean);
      // Active = last tracked section whose top has passed 40% of the viewport; "" = still in the hero.
      let current = "";
      for (const s of sections) if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
      if (sections.length && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections.at(-1).id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]); // re-run on navigation so a highlight from the homepage doesn't stick on project pages

  // Highlights only mean something on the homepage. The logo is "active" while the hero is on screen.
  const onHome = pathname === "/";
  const isActive = (href) => onHome && active === href.split("#")[1];
  const heroActive = onHome && active === "";

  // Mobile menu: Escape closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Logo: on the homepage, scroll back up to the hero (a link to the current page does nothing on its own).
  const onLogoClick = (e) => {
    if (!onHome) return;
    e.preventDefault();
    setOpen(false);
    smoothScrollTo(0);
    if (window.location.hash) history.replaceState(null, "", "/");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 pt-3 md:pt-4">
      {/* Floating glass pill; gets a little more solid once the page scrolls */}
      <nav
        aria-label="Primary"
        className={`mx-auto flex h-14 md:h-16 max-w-5xl items-center justify-between gap-4 rounded-full border pl-3 pr-2 md:pl-4 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-[var(--line)] bg-[var(--color-base-100)]/85 shadow-[0_12px_32px_-16px_rgba(37,52,63,0.45)]"
            : "border-[var(--color-base-100)]/60 bg-[var(--color-base-100)]/55 shadow-[0_8px_24px_-18px_rgba(37,52,63,0.35)]"
        }`}
      >
        {/* Left: logo + links */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            onClick={onLogoClick}
            className="relative flex items-center rounded-full px-2 py-2"
            aria-label={`${site.name} home`}
            aria-current={heroActive ? "page" : undefined}
          >
            <Image src="/images/projects/logo.png" alt={`${site.name} logo`} width={140} height={48} className="h-7 md:h-8 w-auto" priority />
            <Underline on={heroActive} />
          </Link>

          <span className="hidden md:block h-6 w-px bg-[var(--line)]" aria-hidden />

          <div className="hidden md:flex items-center gap-1 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "true" : undefined}
                className={`relative rounded-full px-3.5 py-2 font-medium transition-colors ${
                  isActive(link.href) ? "text-accent-ink" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
                <Underline on={isActive(link.href)} />
              </a>
            ))}
          </div>
        </div>

        {/* Right: Let's talk (desktop) / menu button (mobile) */}
        <Link href="/#contact" className="btn-primary hidden md:inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold">
          Let&apos;s talk <ArrowUpRight size={16} aria-hidden />
        </Link>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--color-base-100)]/80"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu: a card that drops down under the pill */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden mx-auto mt-2 max-w-5xl rounded-3xl border border-[var(--line)] bg-[var(--color-base-100)]/95 p-3 backdrop-blur-xl shadow-[0_20px_40px_-20px_rgba(37,52,63,0.5)]"
        >
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "true" : undefined}
                className={`rounded-2xl px-4 py-3 text-lg font-heading ${
                  isActive(link.href) ? "bg-[var(--color-accent)]/12 text-accent-ink" : "text-[var(--text)] hover:bg-[var(--color-base-content)]/5"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 font-semibold"
            >
              Let&apos;s talk <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
