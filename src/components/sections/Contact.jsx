"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { sendMessage } from "@/app/actions/sendMessage";
import { CONSENT_TEXT } from "@/data/contact";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { Check, Mail, Rocket } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const linkPill =
  "ui-chip gap-2 bg-[var(--color-base-100)] px-3.5 py-2 text-sm";
const topics = ["a website", "a web app", "a desktop app", "something else"];
const MIN_MESSAGE = 10;
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Each part of the sentence is its own row with a fixed-size field, so typing never reflows the card.
// `attention` briefly rings the field that's still missing (no movement).
const blank = (flagged) =>
  `h-10 w-full min-w-0 border-0 border-b-2 bg-transparent px-1 pr-7 font-heading text-lg font-semibold text-accent-ink outline-none transition-colors placeholder:font-normal placeholder:text-[var(--color-base-content)]/35 focus:border-solid focus:border-[var(--color-accent)] md:text-xl ${
    flagged ? "border-solid border-[var(--color-accent)]" : "border-dashed border-[var(--color-base-content)]/25"
  }`;
const prompt = "shrink-0 font-heading text-lg text-[var(--color-base-content)] md:text-xl";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "", consent: false });
  const [attention, setAttention] = useState("");
  // idle → sending → sent, or error (with the reason from the server)
  const [status, setStatus] = useState({ state: "idle", error: "" });
  const sent = status.state === "sent";
  const sending = status.state === "sending";

  const set = (key, value) => {
    setStatus({ state: "idle", error: "" });
    setAttention("");
    setForm((f) => ({ ...f, [key]: value }));
  };

  // "Start a project like this" in Services picks the matching topic here.
  useEffect(() => {
    const pick = (e) => {
      if (!topics.includes(e.detail)) return;
      setStatus({ state: "idle", error: "" });
      setForm((f) => ({ ...f, topic: e.detail }));
    };
    window.addEventListener("contact:topic", pick);
    return () => window.removeEventListener("contact:topic", pick);
  }, []);

  const steps = [
    { key: "name", ok: form.name.trim().length > 0, hint: "Add your name" },
    { key: "email", ok: isEmail(form.email), hint: "Add a valid email" },
    { key: "topic", ok: !!form.topic, hint: "Pick a topic" },
    { key: "message", ok: form.message.trim().length >= MIN_MESSAGE, hint: "Describe your idea" },
    { key: "consent", ok: form.consent, hint: "Tick the box" },
  ];
  const done = steps.filter((s) => s.ok).length;
  const missing = steps.find((s) => !s.ok);
  const ready = !missing;
  const messageLeft = Math.max(MIN_MESSAGE - form.message.trim().length, 0);

  const label = sent
    ? "Message sent. I'll get back to you soon"
    : sending
      ? "Launching..."
      : status.state === "error"
        ? "Try again"
        : ready
      ? "Launch it my way"
      : done === 0
        ? "Fill the blanks to launch"
        : `${missing.hint} · ${done}/${steps.length}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending || sent) return;
    if (!ready) {
      setAttention(missing.key);
      e.currentTarget.querySelector(`[data-step="${missing.key}"]`)?.focus();
      return;
    }
    const website = e.currentTarget.elements.website.value; // hidden honeypot, see below
    setStatus({ state: "sending", error: "" });
    try {
      const res = await sendMessage({ ...form, website });
      setStatus(res.ok ? { state: "sent", error: "" } : { state: "error", error: res.error });
    } catch {
      setStatus({ state: "error", error: "Couldn't reach the server. Please email me directly." });
    }
  };

  return (
    <section className="section-pad" id="contact" aria-labelledby="contact-heading">
      <div className="container-wide grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-heading"
            lead="Let's Build"
            accent="Together"
            subtitle="Have a project or an idea in mind? Fill in the blanks and launch it my way."
          />
          <Reveal delay={80}>
            <ul className="-mt-4 flex flex-wrap gap-2.5 md:-mt-6" aria-label="Other ways to reach me">
              <li>
                <a href={`mailto:${site.email}`} className={linkPill}>
                  <Mail size={15} className="text-accent-ink" aria-hidden /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noreferrer" className={linkPill}>
                  <FaLinkedin size={15} className="text-accent-ink" aria-hidden /> LinkedIn
                </a>
              </li>
              <li>
                <a href={site.github} target="_blank" rel="noreferrer" className={linkPill}>
                  <FaGithub size={15} className="text-accent-ink" aria-hidden /> GitHub
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <form
            id="contact-form"
            onSubmit={onSubmit}
            noValidate
            className="card-surface space-y-4 p-5 md:p-7"
          >
            <p className="ui-eyebrow ui-eyebrow-muted">
              <span className="text-accent-ink">{"//"}</span> new message
            </p>
            {/* Honeypot: hidden from people, but bots fill it in, and the server then drops the message. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            {/* Hi Gaurav, I'm ___ */}
            <label className="flex items-end gap-3">
              <span className={prompt}>Hi Gaurav, I&apos;m</span>
              <span className="relative flex-1">
                <input
                  data-step="name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="your name"
                  aria-label="Your name"
                  className={blank(attention === "name")}
                />
                {steps[0].ok && <Check size={18} strokeWidth={3} className="absolute bottom-2.5 right-1 text-accent-ink" aria-hidden />}
              </span>
            </label>

            {/* I'd love to talk about [topic] */}
            <div>
              <p className={prompt} id="topic-label">
                and I&apos;d love to talk about
              </p>
              <div
                role="radiogroup"
                aria-labelledby="topic-label"
                className={`mt-2 flex flex-wrap gap-2 rounded-xl p-1 transition-shadow ${attention === "topic" ? "ring-2 ring-[var(--color-accent)]" : ""}`}
              >
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    data-step={t === topics[0] ? "topic" : undefined}
                    aria-checked={form.topic === t}
                    onClick={() => set("topic", form.topic === t ? "" : t)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      form.topic === t
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-base-content)]/20 text-[var(--text-muted)] hover:border-[var(--color-accent)] hover:text-accent-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* You can reach me at ___ */}
            <label className="flex items-end gap-3">
              <span className={prompt}>Reach me at</span>
              <span className="relative flex-1">
                <input
                  data-step="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Your email"
                  className={blank(attention === "email")}
                />
                {steps[1].ok && <Check size={18} strokeWidth={3} className="absolute bottom-2.5 right-1 text-accent-ink" aria-hidden />}
              </span>
            </label>

            {/* The idea */}
            <label className="block">
              <span className="mb-1.5 flex items-baseline justify-between text-sm text-[var(--text-muted)]">
                <span>Here&apos;s the idea</span>
                <span className={`font-mono text-xs ${messageLeft === 0 ? "text-accent-ink" : ""}`} aria-hidden>
                  {messageLeft === 0 ? "✓ looks good" : `${messageLeft} more characters`}
                </span>
              </span>
              <textarea
                data-lenis-prevent
                data-step="message"
                name="message"
                rows={3}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="A few lines about what you'd like to build, and any timeline..."
                className={`block h-24 w-full resize-none rounded-xl border bg-transparent px-3.5 py-2.5 text-[15px] placeholder:text-[var(--color-base-content)]/40 focus:border-[var(--color-accent)] focus:outline-none ${
                  attention === "message" ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30" : "border-[var(--color-base-content)]/20"
                }`}
              />
            </label>

            <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-[var(--text-muted)]">
              <input
                data-step="consent"
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className={`checkbox checkbox-sm mt-0.5 rounded-md checked:border-[var(--color-accent)] checked:bg-[var(--color-accent)] checked:text-white ${
                  attention === "consent" ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30" : "border-[var(--color-base-content)]/30"
                }`}
              />
              <span>{CONSENT_TEXT}</span>
            </label>

            {/* The launch button fills up as the message comes together */}
            <button
              type="submit"
              disabled={sending}
              aria-describedby="contact-progress"
              className={`group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border px-6 font-semibold transition-colors ${
                ready ? "border-transparent text-white" : "border-[var(--color-accent)]/40 text-[var(--color-base-content)]"
              }`}
            >
              <span
                className="absolute inset-y-0 left-0 bg-[linear-gradient(135deg,#F47B20,#EA580C)] transition-[width,opacity] duration-500 ease-out"
                style={{ width: `${(done / steps.length) * 100}%`, opacity: ready ? 1 : 0.22 }}
                aria-hidden
              />
              <Rocket
                size={18}
                className={`relative shrink-0 transition-transform duration-300 ${sent ? "animate-[contact-launch_0.7s_ease-in_forwards]" : ready ? "-rotate-12 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : ""}`}
                aria-hidden
              />
              <span className="relative truncate">{label}</span>
            </button>
            <p id="contact-progress" className="sr-only" aria-live="polite">
              {sent ? "Message sent." : sending ? "Sending your message." : ready ? "Ready to send." : `${done} of ${steps.length} done. Next: ${missing.hint}.`}
            </p>
            {status.state === "error" && (
              <p role="alert" className="text-center text-sm text-[var(--text-muted)]">
                {status.error}{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-accent-ink underline underline-offset-2">
                  {site.email}
                </a>
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
