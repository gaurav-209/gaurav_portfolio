import { faqs } from "@/data/faqs";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  return (
    <section className="section-pad min-h-[100svh] flex flex-col justify-center" id="faq" aria-labelledby="faq-heading">
      <div className="container-wide">
        <SectionHeading
          id="faq-heading"
          lead="Questions,"
          accent="Answered"
          subtitle="A few common things recruiters and collaborators may want to know."
        />
        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 40}>
              <details className="group card-surface bg-[var(--color-base-100)] overflow-hidden">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4 p-5 md:p-6 font-medium">
                  <span className="font-heading text-lg md:text-xl pr-4">{faq.question}</span>
                  <ChevronDown size={18} className="text-accent-ink shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-[var(--text-muted)] leading-relaxed border-t border-[var(--line)]/60 mt-0">
                  <p className="pt-4">{faq.answer}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
