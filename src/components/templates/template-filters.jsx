"use client";

import { Heart } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { TEMPLATE_TOGGLES } from "@/constants/builder";
import { cn } from "@/lib/utils";

// Switches for photo / two columns / grouped skills, plus a Favourites view. `disabled` lists switches that
// can't apply right now (e.g. grouped skills with two columns); favourites mode ignores the switches.
export default function TemplateFilters({ filters, onChange, disabled = {}, favoriteCount }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 lg:px-6">
      <p className="text-sm font-semibold text-foreground">Show templates with</p>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {TEMPLATE_TOGGLES.map((toggle) => {
          const id = `template-toggle-${toggle.key}`;
          const isDisabled = filters.favorites || Boolean(disabled[toggle.key]);
          return (
            <div key={toggle.key} className="flex items-center gap-2.5" title={disabled[toggle.key] || undefined}>
              <Switch
                id={id}
                checked={filters[toggle.key]}
                onCheckedChange={(checked) => onChange(toggle.key, checked)}
                disabled={isDisabled}
                aria-describedby={disabled[toggle.key] ? `${id}-note` : undefined}
                className="data-checked:bg-brand"
              />
              <label
                htmlFor={id}
                className={cn("text-sm font-medium text-foreground select-none", isDisabled ? "opacity-50" : "cursor-pointer")}
              >
                {toggle.label}
              </label>
              {disabled[toggle.key] && (
                <span id={`${id}-note`} className="sr-only">
                  {disabled[toggle.key]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-pressed={filters.favorites}
        onClick={() => onChange("favorites", !filters.favorites)}
        className={cn(
          "flex h-10 items-center gap-2 self-start rounded-lg border px-3 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:ml-auto sm:self-auto",
          filters.favorites
            ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300"
            : "border-input bg-background text-muted-foreground hover:bg-muted dark:bg-input/30"
        )}
      >
        <Heart className={cn("size-4", filters.favorites && "fill-current")} />
        Favourites
        <span className="rounded-full bg-foreground/10 px-1.5 text-xs tabular-nums">{favoriteCount}</span>
      </button>
    </div>
  );
}
