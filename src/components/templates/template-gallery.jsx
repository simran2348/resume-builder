"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, SearchX } from "lucide-react";

import { ALL_TEMPLATES, getColor } from "@/components/builder/templates";
import TemplateCard from "@/components/templates/template-card";
import TemplateFilters, { AppliedFilters } from "@/components/templates/template-filters";
import { Button } from "@/components/ui/button";
import { TEMPLATE_FILTERS } from "@/constants/builder";
import { useBuilderStore } from "@/store/builderStore";
import { useResumeStore } from "@/store/resumeStore";

const EMPTY_FILTERS = { headshot: null, columns: null, color: null, favorites: false };

function matches(template, { headshot, columns, favorites }, favoriteIds) {
  if (favorites && !favoriteIds.includes(template.id)) return false;
  if (headshot === "with" && !template.supportsPhoto) return false;
  if (headshot === "without" && template.supportsPhoto) return false;
  if (columns && String(template.columns) !== columns) return false;
  return true;
}

export default function TemplateGallery() {
  const router = useRouter();
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const currentTemplateId = useBuilderStore((state) => state.templateId);
  const theme = useBuilderStore((state) => state.theme);
  const chooseTemplate = useBuilderStore((state) => state.chooseTemplate);
  const favoriteIds = useBuilderStore((state) => state.favoriteTemplates);
  const importedFileName = useResumeStore((state) => state.importedFileName);

  useEffect(() => {
    useBuilderStore.persist.rehydrate();
    useResumeStore.persist.rehydrate();
  }, []);

  const visible = useMemo(
    () => ALL_TEMPLATES.filter((t) => matches(t, filters, favoriteIds)),
    [filters, favoriteIds]
  );
  const selectedColor = filters.color ? getColor(filters.color) : null;
  // Every card uses the same theme so only the layouts differ; a picked colour overrides the accent.
  // Contact icons follow each template's own default.
  const cardTheme = useMemo(
    () => ({
      ...theme,
      showContactIcons: null,
      ...(selectedColor && { accent: selectedColor.value, photoBorderColor: selectedColor.value }),
    }),
    [theme, selectedColor]
  );

  const chips = [
    ...Object.entries(TEMPLATE_FILTERS).flatMap(([key, filter]) => {
      const option = filter.options.find((o) => o.value === filters[key]);
      return option ? [{ key, label: option.label }] : [];
    }),
    ...(selectedColor ? [{ key: "color", label: selectedColor.name, swatch: selectedColor.value }] : []),
    ...(filters.favorites ? [{ key: "favorites", label: "Favourites" }] : []),
  ];

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleChoose(template) {
    chooseTemplate(template.id, selectedColor?.value);
    router.push("/builder");
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Choose a template
        </h1>
        <p className="mt-3 text-muted-foreground">You can always change your template later.</p>
      </div>

      {importedFileName && (
        <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand-glow px-4 py-2.5 text-center text-sm text-foreground">
          <FileCheck2 className="size-4 shrink-0 text-brand" />
          <span>
            We&apos;ve read <span className="font-medium">{importedFileName}</span>. Your details will be filled
            into whichever template you pick.
          </span>
        </p>
      )}

      <div className="mt-8 space-y-4">
        <TemplateFilters filters={filters} onChange={setFilter} favoriteCount={favoriteIds.length} />
        <AppliedFilters
          chips={chips}
          onRemove={(key) => setFilter(key, EMPTY_FILTERS[key])}
          onClearAll={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{visible.length}</span>{" "}
        {visible.length === 1 ? "template" : "templates"}
      </p>

      {visible.length > 0 ? (
        <div className="mt-4 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              theme={cardTheme}
              isCurrent={template.id === currentTemplateId}
              onChoose={handleChoose}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">No templates match these filters</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilters(EMPTY_FILTERS)}>
            Clear all filters
          </Button>
        </div>
      )}
    </section>
  );
}
