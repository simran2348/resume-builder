"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, ListOrdered, Loader2, PencilLine } from "lucide-react";

import BuilderSidebar, { StepList } from "@/components/builder/builder-sidebar";
import PanelResizer from "@/components/builder/panel-resizer";
import PreviewPanel from "@/components/builder/preview-panel";
import SidePanel, { MOBILE_PANEL_GAP, PANEL_WIDTHS } from "@/components/builder/side-panel";
import StepPanel from "@/components/builder/step-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";
import { useResumeStore } from "@/store/resumeStore";

export default function ResumeBuilder() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  // Below lg only one panel fits, so the user toggles between editing and previewing.
  const [mobileView, setMobileView] = useState("edit");
  // Right-hand panel: "templates" / "theme" (opened from the preview) or "steps" (small screens only).
  const [activePanel, setActivePanel] = useState(null);
  const formWidth = useBuilderStore((state) => state.formWidth);
  const setFormWidth = useBuilderStore((state) => state.setFormWidth);

  useEffect(() => {
    async function hydrate() {
      await Promise.all([
        useBuilderStore.persist.rehydrate(),
        useResumeStore.persist.rehydrate(),
      ]);

      // Auto-fill from a resume uploaded on the home page (once per uploaded file).
      const { importedResume, importedFileName } = useResumeStore.getState();
      const { importedFrom, importResume, templateId } = useBuilderStore.getState();
      // A template must be picked first.
      if (!templateId) {
        router.replace("/templates");
        return;
      }
      if (importedResume && importedFileName && importedFileName !== importedFrom) {
        importResume(importedResume, importedFileName);
      }
      setIsHydrated(true);
    }
    hydrate();
  }, [router]);

  useEffect(() => {
    if (!activePanel) return;
    const onKeyDown = (e) => e.key === "Escape" && setActivePanel(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePanel]);

  if (!isHydrated) {
    return (
      <div className="flex h-svh items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-label="Loading builder" />
      </div>
    );
  }

  // Below lg the floating buttons sit just left of an open panel, which is capped to leave them room
  // (MOBILE_PANEL_GAP); the icon-only Edit / Preview button keeps them narrow enough to fit.
  const panelWidth = activePanel ? PANEL_WIDTHS[activePanel] : 0;
  const fabRight = activePanel ? `calc(min(${panelWidth}px, 100vw - ${MOBILE_PANEL_GAP}) + 0.5rem)` : "1rem";
  const isEditing = mobileView === "edit";

  return (
    <div
      style={{ "--form-width": `${formWidth}px` }}
      className="flex h-svh flex-col overflow-hidden bg-background lg:grid lg:grid-cols-[72px_var(--form-width)_1fr]"
    >
      <BuilderSidebar />

      {/* Positions the Steps panel below the header on small screens; a plain grid passthrough on lg. */}
      <div className="relative flex min-h-0 flex-1 flex-col lg:contents">
        <section
          aria-label="Resume details"
          className={cn(
            "relative min-h-0 flex-1 border-border lg:block lg:border-r",
            isEditing ? "block" : "hidden"
          )}
        >
          <StepPanel />
          <PanelResizer width={formWidth} onChange={setFormWidth} />
        </section>

        <section aria-label="Resume preview" className={cn("min-h-0 flex-1 lg:block", isEditing ? "hidden" : "block")}>
          <PreviewPanel activePanel={activePanel} onPanelChange={setActivePanel} />
        </section>

        <SidePanel
          open={activePanel === "steps"}
          title="Steps"
          icon={ListOrdered}
          width={PANEL_WIDTHS.steps}
          onClose={() => setActivePanel(null)}
          className="lg:hidden"
        >
          <StepList
            onNavigate={() => {
              setMobileView("edit");
              setActivePanel(null);
            }}
          />
        </SidePanel>
      </div>

      <div
        style={{ right: fabRight }}
        className="fixed bottom-20 z-40 flex items-center gap-2 transition-[right] duration-300 ease-out lg:hidden"
      >
        <Button
          onClick={() => {
            setMobileView(isEditing ? "preview" : "edit");
            // Templates / Theme only exist on the preview.
            if (activePanel !== "steps") setActivePanel(null);
          }}
          aria-label={isEditing ? "Preview" : "Edit"}
          className={cn(
            "h-11 gap-2 rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90",
            activePanel ? "w-11 px-0" : "px-4"
          )}
        >
          {isEditing ? <Eye /> : <PencilLine />}
          {!activePanel && (isEditing ? "Preview" : "Edit")}
        </Button>
        <Button
          onClick={() => setActivePanel((panel) => (panel === "steps" ? null : "steps"))}
          aria-label="Steps"
          aria-expanded={activePanel === "steps"}
          className="size-11 rounded-full bg-brand text-brand-foreground shadow-lg ring-4 ring-brand/20 hover:bg-brand/90"
        >
          <ListOrdered className="size-5" />
        </Button>
      </div>
    </div>
  );
}
