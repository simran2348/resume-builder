"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutTemplate, Maximize, Minus, Paintbrush, Plus, RotateCcw } from "lucide-react";

import { PAGE_HEIGHT, PAGE_WIDTH } from "@/components/builder/scaled-page";
import SidePanel from "@/components/builder/side-panel";
import TemplatesPanel from "@/components/builder/templates-panel";
import ThemePanel from "@/components/builder/theme-panel";
import { getTemplate } from "@/components/builder/templates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

// Space kept around the page when fitting: room for the floating buttons above and zoom bar below.
const FIT_PADDING_X = 48;
const FIT_PADDING_Y = 112;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;

export default function PreviewPanel() {
  const frameRef = useRef(null);
  const contentRef = useRef(null);
  const [fitScale, setFitScale] = useState(0);
  // null = auto-fit the whole page; otherwise a fixed scale chosen with the zoom bar.
  const [zoom, setZoom] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [activePanel, setActivePanel] = useState(null); // null | "templates" | "theme"

  const templateId = useBuilderStore((state) => state.templateId);
  const theme = useBuilderStore((state) => state.theme);
  const personal = useBuilderStore((state) => state.personal);
  const summary = useBuilderStore((state) => state.summary);
  const resetTheme = useBuilderStore((state) => state.resetTheme);
  const { Component } = getTemplate(templateId);

  // Fit one full page into the frame; re-runs as side panels open/close and the frame resizes.
  useEffect(() => {
    const frame = frameRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const fit = Math.min((width - FIT_PADDING_X) / PAGE_WIDTH, (height - FIT_PADDING_Y) / PAGE_HEIGHT);
      setFitScale(Math.max(0.1, fit));
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Add pages as the content grows past one A4 page.
  useEffect(() => {
    const content = contentRef.current;
    const observer = new ResizeObserver(() => {
      setPageCount(Math.max(1, Math.ceil((content.scrollHeight - 1) / PAGE_HEIGHT)));
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activePanel) return;
    const onKeyDown = (e) => e.key === "Escape" && setActivePanel(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePanel]);

  const scale = zoom ?? fitScale;
  const togglePanel = (panel) => setActivePanel((current) => (current === panel ? null : panel));
  const stepZoom = (delta) =>
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((scale + delta) * 10) / 10)));

  return (
    <div className="relative flex h-full">
      <div ref={frameRef} className="relative min-w-0 flex-1 bg-muted/40">
        <div className="absolute inset-0 flex overflow-auto px-6 py-14">
          {/* m-auto centres the pages but still lets them scroll when zoomed past the frame. */}
          <div className={cn("m-auto flex flex-col gap-6", !scale && "invisible")}>
            {Array.from({ length: pageCount }, (_, page) => (
              <div
                key={page}
                className="shrink-0 overflow-hidden shadow-lg ring-1 ring-black/5"
                style={{ width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }}
              >
                <div
                  className="origin-top-left overflow-hidden"
                  style={{
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                    transform: `scale(${scale})`,
                    backgroundColor: theme.background,
                  }}
                >
                  {/* Each page shows the next A4-sized slice of the same content. */}
                  <div
                    ref={page === 0 ? contentRef : undefined}
                    style={{ transform: `translateY(-${page * PAGE_HEIGHT}px)` }}
                    aria-hidden={page > 0}
                  >
                    <Component resume={{ personal, summary }} theme={theme} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <FloatingButton
            icon={LayoutTemplate}
            label="Templates"
            active={activePanel === "templates"}
            onClick={() => togglePanel("templates")}
          />
          <FloatingButton
            icon={Paintbrush}
            label="Theme"
            active={activePanel === "theme"}
            onClick={() => togglePanel("theme")}
          />
        </div>

        <div className="absolute right-3 bottom-3 z-10 flex items-center gap-0.5 rounded-full border border-border bg-background/95 p-1 shadow-md backdrop-blur-sm">
          <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={() => stepZoom(-0.1)} disabled={scale <= MIN_ZOOM} aria-label="Zoom out">
            <Minus />
          </Button>
          <span className="w-11 text-center text-xs font-medium text-foreground tabular-nums" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={() => stepZoom(0.1)} disabled={scale >= MAX_ZOOM} aria-label="Zoom in">
            <Plus />
          </Button>
          <span className="mx-1 h-4 w-px bg-border" />
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn("rounded-full", zoom === null && "text-brand")}
            onClick={() => setZoom(null)}
            aria-label="Fit page to screen"
            title="Fit page"
          >
            <Maximize />
          </Button>
        </div>
      </div>

      <SidePanel
        open={activePanel === "templates"}
        title="Templates"
        icon={LayoutTemplate}
        widthClass="w-[260px]"
        onClose={() => setActivePanel(null)}
      >
        <TemplatesPanel />
      </SidePanel>

      <SidePanel
        open={activePanel === "theme"}
        title="Theme"
        icon={Paintbrush}
        widthClass="w-[360px]"
        onClose={() => setActivePanel(null)}
        actions={
          <Button variant="ghost" size="sm" onClick={resetTheme} className="text-muted-foreground">
            <RotateCcw />
            Reset
          </Button>
        }
      >
        <ThemePanel />
      </SidePanel>
    </div>
  );
}

function FloatingButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium shadow-md backdrop-blur-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-background/95 text-foreground hover:bg-muted"
      )}
    >
      <Icon className="size-4" />
      <span className="max-sm:sr-only">{label}</span>
    </button>
  );
}
