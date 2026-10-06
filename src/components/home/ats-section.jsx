import { CircleAlert, Info } from "lucide-react";

import SectionHeading from "@/components/home/section-heading";
import { Blob } from "@/components/ui/decor";
import { cn } from "@/lib/utils";
import { ATS_SECTION } from "@/constants/home";

export default function AtsSection() {
  return (
    <section id="ats" aria-labelledby="ats-title" className="scroll-mt-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="reveal mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <ParsedDocument />

        <div className="lg:order-first">
          <SectionHeading
            id="ats-title"
            align="left"
            eyebrow={ATS_SECTION.eyebrow}
            title={ATS_SECTION.title}
            subtitle={ATS_SECTION.intro}
            className="mb-8"
          />

          <h3 className="text-sm font-semibold text-heading">{ATS_SECTION.scansTitle}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ATS_SECTION.scans.map((item) => (
              <li
                key={item}
                className="rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-sm font-medium text-heading"
              >
                {item}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-semibold text-heading">{ATS_SECTION.risksTitle}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {ATS_SECTION.risks.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CircleAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8 flex gap-3 rounded-2xl border border-border bg-card/80 p-4 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            {ATS_SECTION.note}
          </p>
        </div>
      </div>
    </section>
  );
}

// Illustration of a single-column resume with the parts ATS software reads highlighted. Decorative only.
function ParsedDocument() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md select-none">
      <Blob className="top-10 -left-10 size-72" />

      <div className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.3)] sm:p-8">
        <div className="space-y-2 border-b border-border pb-5">
          <Bar className="h-3.5 w-2/5 bg-heading/80" />
          <Bar className="w-1/4 bg-brand/60" />
          <Bar className="w-3/5" />
        </div>

        <Block tag="Section heading">
          <Bar className="h-2.5 w-1/4 bg-heading/70" />
        </Block>
        <Block tag="Dates" tagClassName="right-0">
          <div className="flex items-center justify-between gap-4">
            <Bar className="w-2/5 bg-heading/40" />
            <span className="h-2 w-16 rounded-full bg-brand/50 ring-4 ring-brand/10" />
          </div>
          <Bar className="w-full" />
          <Bar className="w-5/6" />
        </Block>
        <Block tag="Skills">
          <div className="flex flex-wrap gap-1.5">
            {["w-12", "w-16", "w-10", "w-14", "w-12"].map((width, i) => (
              <span key={i} className={cn("h-4 rounded-full bg-brand/15 ring-1 ring-brand/25", width)} />
            ))}
          </div>
        </Block>
        <Block tag="Education">
          <Bar className="w-1/2 bg-heading/40" />
          <Bar className="w-2/3" />
        </Block>
      </div>

      <div className="absolute -right-3 -bottom-5 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-heading shadow-lg sm:-right-6">
        <span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />
        Easy to parse
      </div>
    </div>
  );
}

function Block({ tag, tagClassName = "left-0", children }) {
  return (
    <div className="relative mt-6 space-y-2 pt-5">
      <span
        className={cn(
          "absolute top-0 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-brand-foreground uppercase",
          tagClassName
        )}
      >
        {tag}
      </span>
      {children}
    </div>
  );
}

function Bar({ className }) {
  return <div className={cn("h-2 rounded-full bg-muted-foreground/20", className)} />;
}
