"use client";

import ScaledPage from "@/components/builder/scaled-page";
import FavoriteButton from "@/components/templates/favorite-button";
import { SAMPLE_RESUME } from "@/constants/sample-resume";
import { cn } from "@/lib/utils";

export default function TemplateCard({ template, theme, isCurrent, onChoose }) {
  const { Component } = template;

  return (
    <div className="group">
      <div className="relative transition-transform group-hover:-translate-y-0.5">
        <button
          type="button"
          onClick={() => onChoose(template)}
          aria-label={`Choose ${template.name} template`}
          className={cn(
            "relative block w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all outline-none",
            "hover:border-brand/50 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-brand/40",
            isCurrent ? "border-brand ring-1 ring-brand" : "border-border"
          )}
        >
          <ScaledPage clip>
            <Component resume={SAMPLE_RESUME} theme={theme} />
          </ScaledPage>

          {/* Always visible on touch screens; revealed on hover / focus on larger screens. */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/25 to-transparent pt-16 pb-5 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
            <span className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg">
              Choose template
            </span>
          </div>
        </button>

        {/* Sibling of the card button (buttons can't nest). */}
        <FavoriteButton templateId={template.id} templateName={template.name} className="absolute top-3 right-3" />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          {/* Badges live here rather than on the page so they never cover the layout. */}
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="font-medium text-foreground">{template.name}</p>
            {isCurrent && (
              <span className="rounded-md bg-brand px-1.5 py-0.5 text-[11px] font-semibold text-brand-foreground">
                Current
              </span>
            )}
            {template.recommended && (
              <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-semibold text-sky-900 dark:bg-sky-500/20 dark:text-sky-200">
                Recommended
              </span>
            )}
          </div>
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
