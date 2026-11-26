import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { site, navLinks } from "@/data/site";
import { Wordmark, LocalTime } from "@/components/layout/FooterBits";

const pages = [...navLinks, { label: "FAQ", href: "/#faq" }, { label: "Contact", href: "/#contact" }];
const elsewhere = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Email", href: `mailto:${site.email}` },
];
const heading = "mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f8a82]";
const link = "group inline-flex items-center gap-1 text-[15px] text-[#e9e4dc] transition-colors hover:text-[#F47B20]";

// The site ends under the night sky of the Skills section: a dark card that rises over the page,
// a closing line, the usual links, a spinning back-to-top badge and the name as a giant outline
// that lights up under the mouse.
export default function Footer() {
  const year = 2026; // fixed: pages are pre-rendered, so reading today's date isn't allowed at build time

  return (
    <footer className="constellation-sky relative mt-6 overflow-hidden rounded-t-[2rem] text-[#f5f2ed] md:rounded-t-[3rem]">
      <div className="container-wide px-5 pt-10 md:px-8 md:pt-12">
        {/* Closing line + back-to-top badge */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F47B20]">That&apos;s a wrap</p>
            <p className="mt-3 font-heading text-[clamp(1.85rem,3.6vw,3rem)] font-semibold leading-[1] tracking-[-0.035em]">
              Thanks for
              <span className="block">
                <span className="hero-gradient-text">scrolling by</span>
                <span className="text-[#F47B20]">.</span>
              </span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#b7b1a8]">
              Designed and built from scratch by me, with Next.js and Tailwind CSS. Every pixel, every line.
            </p>
          </div>

          <a href="#top" aria-label="Back to top" className="group relative grid h-24 w-24 shrink-0 place-items-center md:h-28 md:w-28">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]" aria-hidden>
              <defs>
                <path id="footer-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-[#b7b1a8] font-mono text-[9.5px] uppercase tracking-[0.32em]">
                <textPath href="#footer-ring">Back to top • Back to top •</textPath>
              </text>
            </svg>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F47B20] text-black shadow-[0_0_0_6px_rgba(244,123,32,0.15),0_0_30px_rgba(244,123,32,0.45)] transition-transform duration-300 group-hover:-translate-y-1">
              <ArrowUp size={18} aria-hidden />
            </span>
          </a>
        </div>

        {/* Links and details */}
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/10 pt-7 md:grid-cols-[1.4fr_1fr_1fr]">
          <nav aria-label="Footer" className="col-span-2 md:col-span-1">
            <p className={heading}>Pages</p>
            <ul className="grid grid-cols-3 gap-x-4 gap-y-2 md:grid-cols-2">
              {pages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={heading}>Elsewhere</p>
            <ul className="space-y-2">
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={link} {...(l.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}>
                    {l.label}
                    <ArrowUpRight size={14} className="opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={heading}>Based in</p>
            <p className="text-[15px] text-[#e9e4dc]">{site.location}</p>
            <p className="mt-1 font-mono text-sm text-[#8f8a82]">
              <LocalTime />
            </p>
          </div>
        </div>

        <p className="mt-8 flex flex-col gap-1.5 text-xs text-[#8f8a82] sm:flex-row sm:justify-between">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span>{site.title} · React · Node.js · Electron</span>
        </p>
      </div>

      {/* Giant name, cropped by the bottom edge */}
      <div className="mt-2 translate-y-[20%] px-2">
        <Wordmark text={site.name} />
      </div>
    </footer>
  );
}
