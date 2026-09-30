"use client";

import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

// Heart toggle that adds / removes a template from the user's favourites.
export default function FavoriteButton({ templateId, templateName, className }) {
  const isFavorite = useBuilderStore((state) => state.favoriteTemplates.includes(templateId));
  const toggleFavorite = useBuilderStore((state) => state.toggleFavorite);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(templateId)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${templateName} from favourites` : `Add ${templateName} to favourites`}
      title={isFavorite ? "Remove from favourites" : "Add to favourites"}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border border-black/5 bg-white/90 text-neutral-500 shadow-sm backdrop-blur-sm transition-all outline-none hover:scale-110 hover:text-rose-500 focus-visible:ring-3 focus-visible:ring-brand/40",
        isFavorite && "text-rose-500",
        className
      )}
    >
      <Heart className={cn("size-4", isFavorite && "fill-current")} />
    </button>
  );
}
