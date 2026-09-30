"use client";

import { FORM_PANEL_WIDTH } from "@/constants/builder";

const KEYBOARD_STEP = 24;
const clamp = (width) => Math.min(FORM_PANEL_WIDTH.max, Math.max(FORM_PANEL_WIDTH.min, Math.round(width)));

// Drag handle on the form panel's right edge (large screens only). Arrow keys resize, double-click resets.
export default function PanelResizer({ width, onChange }) {
  function handlePointerDown(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const onMove = (event) => onChange(clamp(startWidth + event.clientX - startX));
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    // Keep the resize cursor and avoid selecting text while dragging across the page.
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  function handleKeyDown(e) {
    const delta = { ArrowLeft: -KEYBOARD_STEP, ArrowRight: KEYBOARD_STEP }[e.key];
    if (delta) {
      e.preventDefault();
      onChange(clamp(width + delta));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      onChange(e.key === "Home" ? FORM_PANEL_WIDTH.min : FORM_PANEL_WIDTH.max);
    }
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize form panel"
      aria-valuemin={FORM_PANEL_WIDTH.min}
      aria-valuemax={FORM_PANEL_WIDTH.max}
      aria-valuenow={width}
      tabIndex={0}
      title="Drag to resize · double-click to reset"
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onDoubleClick={() => onChange(FORM_PANEL_WIDTH.default)}
      className="group absolute inset-y-0 -right-2 z-20 hidden w-4 cursor-col-resize touch-none outline-none lg:block"
    >
      <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-transparent transition-colors group-hover:bg-brand/50 group-focus-visible:bg-brand group-active:bg-brand" />
      <span className="absolute top-1/2 left-1/2 h-10 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm transition-colors group-hover:border-brand group-hover:bg-brand group-focus-visible:bg-brand" />
    </div>
  );
}
