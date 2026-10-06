import { Check } from "lucide-react";

import SectionHeading from "@/components/home/section-heading";
import { DotGrid } from "@/components/ui/decor";
import { ABOUT_SECTION } from "@/constants/home";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="reveal mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="about-title"
            align="left"
            eyebrow={ABOUT_SECTION.eyebrow}
            title={ABOUT_SECTION.title}
            className="mb-6"
          />
          <div className="max-w-xl space-y-4 text-lg leading-relaxed text-pretty text-muted-foreground">
            {ABOUT_SECTION.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="relative pt-10 sm:pt-12">
          <DotGrid className="-right-6 -bottom-8 hidden size-40 sm:block" />

          {/* Handwritten note pointing at the card */}
          <p
            aria-hidden
            className="absolute top-0 right-2 flex -rotate-3 items-end gap-1 font-hand text-2xl text-brand sm:right-8 sm:text-[1.7rem]"
          >
            {ABOUT_SECTION.annotation}
            <svg viewBox="0 0 40 40" fill="none" className="mb-[-14px] size-8 rotate-12 sm:size-9">
              <path
                d="M6 6 C 22 6, 30 14, 30 30 M30 30 L 24 24 M30 30 L 35 23"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </p>

          <div className="relative rounded-3xl border border-border bg-card p-7 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.3)] sm:p-8">
            <h3 className="text-sm font-semibold text-muted-foreground">{ABOUT_SECTION.principlesTitle}</h3>
            <ul className="mt-5 space-y-3.5">
              {ABOUT_SECTION.principles.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base font-medium text-heading">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-glow text-brand">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
