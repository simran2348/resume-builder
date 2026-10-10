"use client";

import { X } from "lucide-react";

import PagedDocument, { FitWidth } from "@/components/builder/paged-document";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { MAX_COMPARE } from "@/constants/builder";
import { SAMPLE_RESUME } from "@/constants/sample-resume";
import { cn } from "@/lib/utils";

// Floating bar listing the templates picked for comparison, with Compare / Clear.
export function CompareBar({ templates, onRemove, onClear, onCompare }) {
  if (!templates.length) return null;

  return (
    <div
      role="region"
      aria-label="Template comparison"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:pl-4"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">
          Compare {templates.length} of {MAX_COMPARE}
          {templates.length < 2 && " · pick at least one more"}
        </p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {templates.map((template) => (
            <li
              key={template.id}
              className="flex items-center gap-1 rounded-full border border-brand/25 bg-brand-glow py-0.5 pr-0.5 pl-2.5 text-xs font-medium text-foreground"
            >
              {template.name}
              <button
                type="button"
                onClick={() => onRemove(template)}
                aria-label={`Remove ${template.name} from comparison`}
                className="flex size-5 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" onClick={onClear} className="h-10 flex-1 sm:flex-none">
          Clear
        </Button>
        <Button
          onClick={onCompare}
          disabled={templates.length < 2}
          className="h-10 flex-1 bg-brand px-5 text-brand-foreground hover:bg-brand/90 sm:flex-none"
        >
          Compare
        </Button>
      </div>
    </div>
  );
}

// Side-by-side view of the selected templates with the same example resume, every page shown.
// Scrolls sideways on small screens; each column has its own "Use this template".
export function CompareDialog({ open, templates, theme, onClose, onRemove, onChoose }) {
  return (
    <Dialog open={open && templates.length > 1} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex h-[92vh] flex-col gap-0 p-0 sm:max-w-[min(92vw,1400px)]">
        <div className="border-b border-border px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">Compare templates</DialogTitle>
          <DialogDescription className="mt-0.5 text-xs">
            The same example resume in each layout. Scroll to see every page.
          </DialogDescription>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-muted/50">
          <div
            className={cn(
              "grid min-h-full snap-x snap-mandatory gap-4 p-4 sm:gap-6 sm:p-6",
              // Phones: each column takes most of the screen and scrolls sideways.
              templates.length === 2
                ? "grid-cols-[repeat(2,minmax(85vw,1fr))] sm:grid-cols-2"
                : "grid-cols-[repeat(3,minmax(85vw,1fr))] sm:grid-cols-[repeat(3,minmax(300px,1fr))]"
            )}
          >
            {templates.map((template) => (
              <section
                key={template.id}
                aria-label={template.name}
                className="mx-auto flex w-full max-w-[460px] snap-start flex-col"
              >
                {/* Sticks to the top while scrolling the pages, so "Use" is always in reach. */}
                <div className="sticky top-0 z-10 -mx-1 mb-3 flex items-center justify-between gap-2 rounded-xl bg-muted/95 px-1 py-2 backdrop-blur-sm">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {template.columns === 1 ? "1 column" : "2 columns"}
                      {template.supportsPhoto && " · photo"}
                      {template.skillLayout === "categories" && " · grouped skills"}
                    </p>
                  </div>
                  <Button
                    onClick={() => onChoose(template)}
                    className="h-9 shrink-0 bg-brand px-4 text-brand-foreground hover:bg-brand/90"
                  >
                    Use this
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemove(template)}
                    aria-label={`Remove ${template.name} from comparison`}
                    className="shrink-0 rounded-full"
                  >
                    <X />
                  </Button>
                </div>

                <FitWidth>
                  {(scale) => (
                    <PagedDocument
                      template={template}
                      resume={SAMPLE_RESUME}
                      theme={theme}
                      scale={scale}
                      gap={12}
                      pageClassName="shadow-md ring-1 ring-black/5"
                    />
                  )}
                </FitWidth>
              </section>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
