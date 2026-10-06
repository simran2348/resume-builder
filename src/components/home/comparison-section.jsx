import { Check } from "lucide-react";

import SectionHeading from "@/components/home/section-heading";
import { COMPARISON_SECTION } from "@/constants/home";

export default function ComparisonSection() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-8 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <SectionHeading id="compare-title" title={COMPARISON_SECTION.title} subtitle={COMPARISON_SECTION.intro} />

        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <h3 className="font-semibold text-foreground">{COMPARISON_SECTION.pointsTitle}</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {COMPARISON_SECTION.points.map((point) => (
              <li key={point.title} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                <div>
                  <p className="font-medium text-foreground">{point.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{point.info}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
