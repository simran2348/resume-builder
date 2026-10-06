import { Check } from "lucide-react";

import SectionHeading from "@/components/home/section-heading";
import { ABOUT_SECTION } from "@/constants/home";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-8 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="about-title" title={ABOUT_SECTION.title} />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {ABOUT_SECTION.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="border-l-2 border-brand pl-4 font-medium text-foreground">{ABOUT_SECTION.promise}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm">
            <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              {ABOUT_SECTION.principlesTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {ABOUT_SECTION.principles.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-glow text-brand">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {ABOUT_SECTION.workflowTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">{ABOUT_SECTION.workflowIntro}</p>
          <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {ABOUT_SECTION.workflow.map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/80 px-3 py-3 text-sm font-medium text-foreground backdrop-blur-sm lg:flex-col lg:items-start lg:gap-2"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
