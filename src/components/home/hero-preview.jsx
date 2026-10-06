"use client";

import { Check, FileUp } from "lucide-react";

import PagedDocument, { FitWidth } from "@/components/builder/paged-document";
import { getColor, getTemplate } from "@/components/builder/templates";
import { Blob, DotGrid, Ring, Waves } from "@/components/ui/decor";
import { BUILDER_STEPS, DEFAULT_THEME } from "@/constants/builder";
import { HERO_CONTENT } from "@/constants/home";
import { SAMPLE_RESUME } from "@/constants/sample-resume";

const TEMPLATE = getTemplate("classic");
const THEME = { ...DEFAULT_THEME, accent: getColor("blue").value };
// The first few builder steps, shown in the mock editor's rail (the first three as completed).
const RAIL_STEPS = BUILDER_STEPS.slice(0, 5).map((step, index) => ({ label: step.label, done: index < 3 }));

// Hero illustration: a simplified builder window around a real template (Classic, with the same example
// content as the templates screen), rendered by the same PagedDocument the builder uses. Decorative only.
export default function HeroPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-xl select-none lg:max-w-none">
      <Blob className="-top-10 -right-10 size-80 sm:size-96" />
      <Blob tone="sky" className="-bottom-16 -left-10 hidden size-72 sm:block" />
      <DotGrid className="-top-8 -left-10 hidden size-40 sm:block" />
      <Ring className="-right-12 bottom-6 hidden size-44 lg:block" />
      <Waves className="-bottom-10 left-1/2 hidden h-28 w-[140%] -translate-x-1/2 sm:block" />

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
        {/* Window bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 truncate text-xs font-medium text-muted-foreground">Resume builder · Classic</span>
        </div>

        <div className="flex">
          {/* Step rail, like the builder's sidebar */}
          <div className="hidden w-40 shrink-0 space-y-1 border-r border-border bg-brand-soft p-3 sm:block">
            {RAIL_STEPS.map((step, index) => (
              <div
                key={step.label}
                className={
                  index === 3
                    ? "flex items-center gap-2 rounded-lg bg-card px-2 py-1.5 text-[11px] font-semibold text-heading shadow-sm"
                    : "flex items-center gap-2 px-2 py-1.5 text-[11px] text-muted-foreground"
                }
              >
                <span
                  className={
                    step.done
                      ? "flex size-4 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground"
                      : "size-4 shrink-0 rounded-full border border-brand/40"
                  }
                >
                  {step.done && <Check className="size-2.5" strokeWidth={3} />}
                </span>
                <span className="truncate">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Live page, cropped with a soft fade */}
          <div className="relative flex-1 bg-muted/50 p-3 sm:p-4">
            <div className="relative aspect-[794/880] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
              <FitWidth>
                {(scale) => (
                  <PagedDocument template={TEMPLATE} resume={SAMPLE_RESUME} theme={THEME} scale={scale} maxPages={1} />
                )}
              </FitWidth>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating import card */}
      <div className="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm motion-safe:animate-float sm:-left-8">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-glow text-brand">
          <FileUp className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-heading">{HERO_CONTENT.importCard.title}</p>
          <p className="text-xs text-muted-foreground">{HERO_CONTENT.importCard.info}</p>
        </div>
      </div>

      {/* Floating status pill */}
      <div className="absolute -top-4 right-4 flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-medium text-heading shadow-md backdrop-blur-sm sm:-right-4">
        <span className="size-2 rounded-full bg-emerald-500" />
        Live preview
      </div>
    </div>
  );
}
