"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PagedDocument, { FitWidth } from "@/components/builder/paged-document";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SAMPLE_RESUME } from "@/constants/sample-resume";

// Large preview of a template filled with the example data; arrows (or ←/→) browse the filtered list.
export default function TemplatePreviewDialog({ templates, index, onIndexChange, onClose, onChoose, theme }) {
  const template = index === null ? null : templates[index];
  const hasMany = templates.length > 1;
  const step = (delta) => onIndexChange((index + delta + templates.length) % templates.length);

  useEffect(() => {
    if (!template || !hasMany) return;
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") onIndexChange((index + 1) % templates.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + templates.length) % templates.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [template, hasMany, index, templates.length, onIndexChange]);

  return (
    <Dialog open={Boolean(template)} onOpenChange={(open) => !open && onClose()}>
      {template && (
        <DialogContent className="flex max-h-[92vh] flex-col gap-0 p-0 sm:max-w-3xl">
          <div className="border-b border-border px-5 py-4 pr-12">
            <DialogTitle className="text-base font-semibold">{template.name}</DialogTitle>
            <DialogDescription className="mt-0.5 text-xs">
              {template.description} · {template.columns === 1 ? "1 column" : "2 columns"}
              {template.supportsPhoto && " · photo"}
            </DialogDescription>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-muted/50 p-4 sm:p-6">
            <FitWidth key={template.id} className="mx-auto max-w-[640px]">
              {(scale) => (
                <PagedDocument
                  template={template}
                  resume={SAMPLE_RESUME}
                  theme={theme}
                  scale={scale}
                  gap={16}
                  pageClassName="shadow-lg ring-1 ring-black/5"
                />
              )}
            </FitWidth>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
            <div className="flex items-center gap-1">
              {hasMany && (
                <>
                  <Button variant="outline" size="icon" onClick={() => step(-1)} aria-label="Previous template">
                    <ChevronLeft />
                  </Button>
                  <span className="px-2 text-xs text-muted-foreground tabular-nums">
                    {index + 1} / {templates.length}
                  </span>
                  <Button variant="outline" size="icon" onClick={() => step(1)} aria-label="Next template">
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>
            <Button onClick={() => onChoose(template)} className="h-10 bg-brand px-5 text-brand-foreground hover:bg-brand/90">
              Use this template
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
