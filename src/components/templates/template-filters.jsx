"use client";

import { Check, Heart, X } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACCENT_COLORS, TEMPLATE_FILTERS } from "@/constants/builder";
import { cn } from "@/lib/utils";

export default function TemplateFilters({ filters, onChange, favoriteCount }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm lg:flex-row lg:items-center lg:gap-6 lg:px-6">
      <p className="text-sm font-semibold text-foreground">Filter by</p>

      <div className="flex flex-wrap gap-3">
        {Object.entries(TEMPLATE_FILTERS).map(([key, filter]) => (
          <Select
            key={key}
            value={filters[key]}
            onValueChange={(value) => onChange(key, value)}
            items={filter.options}
          >
            <SelectTrigger aria-label={filter.label} className="h-10 min-w-44 flex-1 bg-background sm:flex-none">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        <button
          type="button"
          aria-pressed={filters.favorites}
          onClick={() => onChange("favorites", !filters.favorites)}
          className={cn(
            "flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
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

      <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
        <p className="text-sm font-semibold text-foreground">Colors</p>
        <div role="group" aria-label="Accent colour" className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((color) => {
            const isSelected = filters.color === color.id;
            return (
              <button
                key={color.id}
                type="button"
                aria-label={color.name}
                aria-pressed={isSelected}
                title={color.name}
                onClick={() => onChange("color", isSelected ? null : color.id)}
                style={{ backgroundColor: color.value }}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-white ring-offset-2 ring-offset-card transition-transform outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-brand/50",
                  isSelected && "ring-2 ring-foreground"
                )}
              >
                {isSelected && <Check className="size-4" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Chips for each active filter, each removable, plus "Clear all".
export function AppliedFilters({ chips, onRemove, onClearAll }) {
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Applied filters:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-glow py-1 pr-1 pl-3 text-sm text-foreground"
        >
          {chip.swatch && (
            <span className="size-3 rounded-full" style={{ backgroundColor: chip.swatch }} aria-hidden />
          )}
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            aria-label={`Remove ${chip.label} filter`}
            className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-md px-2 py-1 text-sm font-medium text-brand underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        Clear all
      </button>
    </div>
  );
}
