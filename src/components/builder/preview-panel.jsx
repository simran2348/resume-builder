"use client";

import ScaledPage from "@/components/builder/scaled-page";
import { getTemplate } from "@/components/builder/templates";
import { useBuilderStore } from "@/store/builderStore";

export default function PreviewPanel() {
  const templateId = useBuilderStore((state) => state.templateId);
  const accentColor = useBuilderStore((state) => state.accentColor);
  const personal = useBuilderStore((state) => state.personal);
  const summary = useBuilderStore((state) => state.summary);
  const template = getTemplate(templateId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <p className="text-sm font-medium text-foreground">Live preview</p>
        <span className="rounded-full bg-brand-glow px-2.5 py-0.5 text-xs font-medium text-brand">
          {template.name}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/40 p-4 sm:p-8">
        <ScaledPage className="mx-auto max-w-[794px] shadow-lg ring-1 ring-black/5">
          <template.Component
            resume={{ personal, summary }}
            accent={accentColor || template.defaultAccent}
          />
        </ScaledPage>
      </div>
    </div>
  );
}
