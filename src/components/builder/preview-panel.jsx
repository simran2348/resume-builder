"use client";

import { useEffect, useRef, useState } from "react";

import { getTemplate } from "@/components/builder/templates";
import { useBuilderStore } from "@/store/builderStore";

// A4 at 96 DPI.
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

export default function PreviewPanel() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const templateId = useBuilderStore((state) => state.templateId);
  const personal = useBuilderStore((state) => state.personal);
  const summary = useBuilderStore((state) => state.summary);
  const template = getTemplate(templateId);

  // Shrink the page to fit the panel width while keeping real A4 proportions.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / PAGE_WIDTH));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <p className="text-sm font-medium text-foreground">Live preview</p>
        <span className="rounded-full bg-brand-glow px-2.5 py-0.5 text-xs font-medium text-brand">
          {template.name}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/40 p-4 sm:p-8">
        <div ref={containerRef} className="mx-auto w-full max-w-[794px]">
          <div style={{ height: PAGE_HEIGHT * scale }}>
            <div
              className="origin-top-left bg-white shadow-lg ring-1 ring-black/5"
              style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT, transform: `scale(${scale})` }}
            >
              <template.Component
                resume={{ personal, summary }}
                showPhoto={template.supportsPhoto}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
