"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, SearchX } from "lucide-react";

import { ALL_TEMPLATES } from "@/components/builder/templates";
import TemplateCard from "@/components/templates/template-card";
import { CompareBar, CompareDialog } from "@/components/templates/template-compare";
import TemplateFilters from "@/components/templates/template-filters";
import TemplatePreviewDialog from "@/components/templates/template-preview-dialog";
import { Button } from "@/components/ui/button";
import { DEFAULT_THEME, MAX_COMPARE, TEMPLATE_TOGGLES } from "@/constants/builder";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";
import { useResumeStore } from "@/store/resumeStore";

const DEFAULT_FILTERS = { photo: false, twoColumns: false, groupedSkills: false, favorites: false };
// Every card uses the default (charcoal) theme so only the layouts differ. Contact icons follow each
// template's own default.
const CARD_THEME = DEFAULT_THEME;

// Each switch must match exactly (on = has it, off = doesn't), so the gallery shows one family at a time.
// The Favourites view shows every favourite and ignores the switches.
function matches(template, filters, favoriteIds) {
  if (filters.favorites) return favoriteIds.includes(template.id);
  return TEMPLATE_TOGGLES.every((toggle) => toggle.matches(template) === filters[toggle.key]);
}

// Grouped-skills versions exist only for one-column layouts.
const DISABLED_WITH_TWO_COLUMNS = { groupedSkills: "Grouped skills are available for one-column templates" };

export default function TemplateGallery() {
  const router = useRouter();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // Templates picked for side-by-side comparison (kept while the switches change), and whether it's open.
  const [compareIds, setCompareIds] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  // Index into `visible` of the template open in the preview dialog.
  const [previewIndex, setPreviewIndex] = useState(null);

  const currentTemplateId = useBuilderStore((state) => state.templateId);
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
  const compared = compareIds.map((id) => ALL_TEMPLATES.find((t) => t.id === id));
  const disabledToggles = filters.twoColumns ? DISABLED_WITH_TWO_COLUMNS : {};

  function setFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      // Turning on two columns switches grouped skills off (there are no grouped two-column templates).
      ...(key === "twoColumns" && value && { groupedSkills: false }),
    }));
  }

  function toggleCompare(template) {
    const next = compareIds.includes(template.id)
      ? compareIds.filter((id) => id !== template.id)
      : compareIds.length < MAX_COMPARE
        ? [...compareIds, template.id]
        : compareIds;
    setCompareIds(next);
    // Close the comparison once there's nothing left to compare against.
    if (next.length < 2) setIsComparing(false);
  }

  function handleChoose(template) {
    chooseTemplate(template.id);
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
        <TemplateFilters
          filters={filters}
          onChange={setFilter}
          disabled={disabledToggles}
          favoriteCount={favoriteIds.length}
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{visible.length}</span>{" "}
        {visible.length === 1 ? "template" : "templates"}
      </p>

      {visible.length > 0 ? (
        <div className={cn("mt-4 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3", compared.length && "pb-36 sm:pb-24")}>
          {visible.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              theme={CARD_THEME}
              isCurrent={template.id === currentTemplateId}
              onChoose={handleChoose}
              onPreview={(t) => setPreviewIndex(visible.findIndex((v) => v.id === t.id))}
              isCompared={compareIds.includes(template.id)}
              compareFull={compareIds.length >= MAX_COMPARE}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">
            {filters.favorites ? "No favourites yet" : "No templates match these filters"}
          </p>
          {filters.favorites && (
            <p className="mt-1 text-sm text-muted-foreground">Tap the heart on a template to save it here.</p>
          )}
          <Button variant="outline" className="mt-4" onClick={() => setFilters(DEFAULT_FILTERS)}>
            Show all one-column templates
          </Button>
        </div>
      )}

      <TemplatePreviewDialog
        templates={visible}
        index={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
        onChoose={handleChoose}
        theme={CARD_THEME}
      />

      <CompareBar
        templates={compared}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onCompare={() => setIsComparing(true)}
      />
      <CompareDialog
        open={isComparing}
        templates={compared}
        theme={CARD_THEME}
        onClose={() => setIsComparing(false)}
        onRemove={toggleCompare}
        onChoose={handleChoose}
      />
    </section>
  );
}
