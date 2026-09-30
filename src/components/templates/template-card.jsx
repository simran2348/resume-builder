"use client";

import ScaledPage from "@/components/builder/scaled-page";
import { SAMPLE_RESUME } from "@/constants/sample-resume";
import { cn } from "@/lib/utils";

export default function TemplateCard({ template, theme, isCurrent, onChoose }) {
  const { Component } = template;

  return (
    <div className="group">
      <button
        type="button"
        onClick={() => onChoose(template)}
        aria-label={`Choose ${template.name} template`}
        className={cn(
          "relative block w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all outline-none",
          "hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-brand/40",
          isCurrent ? "border-brand ring-1 ring-brand" : "border-border"
        )}
      >
        <ScaledPage clip>
          <Component resume={SAMPLE_RESUME} theme={theme} />
        </ScaledPage>

        <div className="absolute top-3 right-3 flex gap-1.5">
          {isCurrent && (
            <span className="rounded-md bg-brand px-2 py-1 text-xs font-semibold text-brand-foreground shadow-sm">
              Current
            </span>
          )}
          {template.recommended && (
            <span className="rounded-md bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-900 shadow-sm">
              Recommended
            </span>
          )}
        </div>

        {/* Always visible on touch screens; revealed on hover / focus on larger screens. */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/25 to-transparent pt-16 pb-5 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <span className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg">
            Choose template
          </span>
        </div>
      </button>

      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="font-medium text-foreground">{template.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{template.description}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Tag>{template.columns === 1 ? "1 col" : "2 col"}</Tag>
          {template.supportsPhoto && <Tag>Photo</Tag>}
        </div>
      </div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
