"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Right-hand panel that slides open by animating its width, so the preview beside it resizes with it.
// Below lg it overlays the preview instead.
export default function SidePanel({ open, title, icon: Icon, widthClass, onClose, actions, children }) {
  return (
    <aside
      aria-label={title}
      inert={!open}
      className={cn(
        "shrink-0 overflow-hidden border-border bg-background transition-[width] duration-300 ease-out",
        "max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-30 max-lg:max-w-full max-lg:shadow-2xl",
        open ? cn(widthClass, "border-l") : "w-0"
      )}
    >
      <div className={cn("flex h-full max-w-[100vw] flex-col", widthClass)}>
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
