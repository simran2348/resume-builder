"use client";

import { Check } from "lucide-react";

import ScaledPage from "@/components/builder/scaled-page";
import { ALL_TEMPLATES } from "@/components/builder/templates";
import { SAMPLE_RESUME } from "@/constants/sample-resume";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

// Single column of template thumbnails; clicking one applies it to the preview immediately.
export default function TemplatesPanel() {
  const templateId = useBuilderStore((state) => state.templateId);
  const theme = useBuilderStore((state) => state.theme);
  const setTemplate = useBuilderStore((state) => state.setTemplate);

  return (
    <div role="radiogroup" aria-label="Templates" className="space-y-5 p-5">
      {ALL_TEMPLATES.map((template) => {
        const isSelected = template.id === templateId;
        const { Component } = template;
        return (
          <button
            key={template.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTemplate(template.id)}
            className="group block w-full text-left outline-none"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-lg border shadow-sm transition-all group-hover:shadow-md group-focus-visible:ring-3 group-focus-visible:ring-brand/40",
                isSelected ? "border-brand ring-2 ring-brand" : "border-border group-hover:border-brand/50"
              )}
            >
              <ScaledPage clip>
                <Component resume={SAMPLE_RESUME} theme={theme} />
              </ScaledPage>
              {isSelected && (
                <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-brand text-brand-foreground shadow">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              )}
            </div>
            <p className={cn("mt-2 text-sm font-medium", isSelected ? "text-brand" : "text-foreground")}>
              {template.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}
