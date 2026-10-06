import SectionHeading from "@/components/home/section-heading";
import { WORKFLOW_SECTION } from "@/constants/home";

// Vertical timeline on small screens, horizontal from lg up.
export default function WorkflowSection() {
  return (
    <section id="how-it-works" aria-labelledby="workflow-title" className="scroll-mt-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="reveal mx-auto max-w-6xl">
        <SectionHeading id="workflow-title" eyebrow={WORKFLOW_SECTION.eyebrow} title={WORKFLOW_SECTION.title} />

        <ol className="relative mx-auto grid max-w-md gap-8 lg:max-w-none lg:grid-cols-5 lg:gap-6">
          {/* Connecting line */}
          <span
            aria-hidden
            className="absolute top-5 bottom-5 left-5 w-px bg-gradient-to-b from-brand/40 to-brand/15 lg:top-5 lg:right-[10%] lg:bottom-auto lg:left-[10%] lg:h-px lg:w-auto lg:bg-gradient-to-r"
          />
          {WORKFLOW_SECTION.steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-4 lg:text-center">
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-card text-sm font-semibold text-brand shadow-sm ring-4 ring-background">
                {index + 1}
              </span>
              <div className="pt-1.5 lg:pt-0">
                <h3 className="text-lg font-semibold text-heading">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.info}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
