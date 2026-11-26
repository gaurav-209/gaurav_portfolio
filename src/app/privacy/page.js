import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "@/data/site";
import { CONSENT_TEXT } from "@/data/contact";
import SectionHeading from "@/components/ui/SectionHeading";
import { CookieSettingsButton } from "@/components/layout/FooterBits";

export const metadata = {
  title: `Privacy | ${site.name}`,
  description: `How ${site.name}'s portfolio handles contact-form messages and analytics cookies.`,
};

const UPDATED = "26 November 2026";

const h2 = "font-heading text-xl font-semibold tracking-tight md:text-2xl";
const p = "mt-3 leading-relaxed text-[var(--text-muted)]";

// Plain-language privacy notice. Keep it in sync with what the site actually does:
// contact form → MongoDB + email (src/app/actions/sendMessage.js), analytics → Google Analytics after consent.
export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="container-wide px-5 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-accent-ink">
          <ArrowLeft size={16} aria-hidden /> Back to home
        </Link>
        <div className="mt-8">
          <SectionHeading level={1} lead="Your" accent="Privacy" subtitle={`What this site collects, why, and how to reach me about it. Last updated ${UPDATED}.`} />
        </div>

        <div className="max-w-2xl space-y-10">
          <section>
            <h2 className={h2}>Who is responsible</h2>
            <p className={p}>
              This is the personal portfolio of {site.name}, {site.location}. For anything about your data, email{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-accent-ink underline underline-offset-2">
                {site.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className={h2}>The contact form</h2>
            <p className={p}>
              When you send a message, I receive your name, email, the topic you picked and your message, along with the time you agreed to this:
            </p>
            <p className="mt-3 border-l-2 border-[var(--color-accent)] pl-4 italic text-[var(--text)]">&ldquo;{CONSENT_TEXT}&rdquo;</p>
            <p className={p}>
              The message is emailed to me (sent through Resend) and saved in a private database (MongoDB Atlas) so I can reply and follow up on
              your enquiry. It isn&apos;t used for marketing, sold or shared with anyone else. To stop spam, the server briefly counts messages per
              internet address; that count isn&apos;t stored.
            </p>
          </section>

          <section>
            <h2 className={h2}>Analytics cookies</h2>
            <p className={p}>
              Only if you click &ldquo;Allow analytics&rdquo;, the site loads Google Analytics, which sets cookies (names starting with
              <code className="mx-1 rounded bg-[var(--surface)] px-1 font-mono text-sm">_ga</code>) to count visits, pages viewed and where visitors
              come from. If you decline, or don&apos;t choose, Google Analytics isn&apos;t loaded and no analytics cookie is set. Your choice is
              remembered in your browser&apos;s local storage.
            </p>
            <p className={p}>
              You can change your mind at any time:{" "}
              <CookieSettingsButton className="font-medium text-accent-ink underline underline-offset-2" />
              <span className="sr-only"> (opens the cookie choice)</span>.
            </p>
          </section>

          <section>
            <h2 className={h2}>Your rights</h2>
            <p className={p}>
              You can ask to see, correct or delete the details you sent me, or withdraw your consent, by emailing{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-accent-ink underline underline-offset-2">
                {site.email}
              </a>
              . I&apos;ll act on it and confirm by email.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
