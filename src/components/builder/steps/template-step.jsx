"use client";

import { Check } from "lucide-react";

import { RESUME_TEMPLATES } from "@/constants/builder";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

export default function TemplateStep() {
  const templateId = useBuilderStore((state) => state.templateId);
  const setTemplate = useBuilderStore((state) => state.setTemplate);

  return (
    <div role="radiogroup" aria-label="Resume templates" className="grid gap-4 sm:grid-cols-2">
      {RESUME_TEMPLATES.map((template) => {
        const isSelected = template.id === templateId;
        return (
          <button
            key={template.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTemplate(template.id)}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
              isSelected ? "border-brand ring-1 ring-brand" : "border-border hover:border-brand/50"
            )}
          >
            <div className="bg-muted/60 p-4">
              <TemplateThumbnail showPhoto={template.supportsPhoto} />
            </div>
            <div className="p-4">
              <p className="font-medium text-foreground">{template.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {template.description}
              </p>
            </div>
            {isSelected && (
              <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-sm">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Simple wireframe of the layout; always light since it represents paper.
function TemplateThumbnail({ showPhoto }) {
  return (
    <div className="mx-auto aspect-[210/297] w-full max-w-40 rounded-md bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        {showPhoto && <div className="size-6 shrink-0 rounded-full bg-neutral-200" />}
        <div className="flex-1 space-y-1">
          <div className="h-1.5 w-3/4 rounded-full bg-neutral-700" />
          <div className="h-1 w-1/2 rounded-full bg-neutral-300" />
        </div>
      </div>
      {[0, 1, 2].map((section) => (
        <div key={section} className="mt-3 space-y-1">
          <div className="h-1 w-1/3 rounded-full bg-neutral-500" />
          <div className="h-px w-full bg-neutral-200" />
          <div className="h-1 w-full rounded-full bg-neutral-200" />
          <div className="h-1 w-5/6 rounded-full bg-neutral-200" />
          <div className="h-1 w-2/3 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}
