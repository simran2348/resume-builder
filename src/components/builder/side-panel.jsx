"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Panel widths in px, shared with the mobile floating buttons so they can sit beside an open panel.
export const PANEL_WIDTHS = { templates: 260, theme: 360, steps: 280 };

// Below lg a panel overlays the content and is capped to leave this much room on its left for the floating
// buttons (see ResumeBuilder).
export const MOBILE_PANEL_GAP = "7rem";

// Right-hand panel that slides open by animating its width, so the preview beside it resizes with it.
// Below lg it overlays the content instead.
export default function SidePanel({ open, title, icon: Icon, width, onClose, actions, className, children }) {
  return (
    <aside
      aria-label={title}
      inert={!open}
      style={{ width: open ? width : 0 }}
      className={cn(
        "shrink-0 overflow-hidden border-border bg-background transition-[width] duration-300 ease-out",
        "max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-30 max-lg:max-w-[calc(100%-7rem)] max-lg:shadow-2xl",
        open && "border-l",
        className
      )}
    >
      <div style={{ width }} className="flex h-full flex-col max-lg:max-w-[calc(100vw-7rem)]">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          {Icon && <Icon className="size-4 text-brand" />}
          <h2 className="flex-1 text-sm font-semibold text-foreground">{title}</h2>
          {actions}
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label={`Close ${title}`} className="rounded-full">
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </aside>
  );
}
