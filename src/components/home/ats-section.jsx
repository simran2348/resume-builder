import { Check, Search, TriangleAlert } from "lucide-react";

import SectionHeading from "@/components/home/section-heading";
import { ATS_SECTION } from "@/constants/home";

export default function AtsSection() {
  return (
    <section id="ats" aria-labelledby="ats-title" className="scroll-mt-8 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="ats-title" title={ATS_SECTION.title} subtitle={ATS_SECTION.intro} />

        <div className="grid gap-4 md:grid-cols-2">
          <ListCard icon={Search} title={ATS_SECTION.scansTitle} items={ATS_SECTION.scans} />
          <ListCard icon={TriangleAlert} title={ATS_SECTION.risksTitle} items={ATS_SECTION.risks} tone="warning" />
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-center text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
          “{ATS_SECTION.callout}”
        </p>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-brand/25 bg-brand-glow p-6 sm:p-8">
          <h3 className="font-semibold text-foreground">{ATS_SECTION.approachTitle}</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ATS_SECTION.approach.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-brand" strokeWidth={3} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">{ATS_SECTION.note}</p>
        </div>
      </div>
    </section>
  );
}

function ListCard({ icon: Icon, title, items, tone = "default" }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm">
      <h3 className="flex items-center gap-2 font-semibold text-foreground">
        <Icon
          className={tone === "warning" ? "size-5 text-amber-600 dark:text-amber-400" : "size-5 text-brand"}
          aria-hidden
        />
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span
              className={
                tone === "warning"
                  ? "mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                  : "mt-2 size-1.5 shrink-0 rounded-full bg-brand"
              }
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
