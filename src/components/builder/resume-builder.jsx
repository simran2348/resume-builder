"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2, PencilLine } from "lucide-react";

import BuilderSidebar from "@/components/builder/builder-sidebar";
import PreviewPanel from "@/components/builder/preview-panel";
import StepPanel from "@/components/builder/step-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";
import { useResumeStore } from "@/store/resumeStore";

export default function ResumeBuilder() {
  const [isHydrated, setIsHydrated] = useState(false);
  // Below lg only one panel fits, so the user toggles between editing and previewing.
  const [mobileView, setMobileView] = useState("edit");

  useEffect(() => {
    async function hydrate() {
      await Promise.all([
        useBuilderStore.persist.rehydrate(),
        useResumeStore.persist.rehydrate(),
      ]);

      // Auto-fill from a resume uploaded on the home page (once per uploaded file).
      const { importedResume, importedFileName } = useResumeStore.getState();
      const { importedFrom, importResume } = useBuilderStore.getState();
      if (importedResume && importedFileName && importedFileName !== importedFrom) {
        importResume(importedResume, importedFileName);
      }
      setIsHydrated(true);
    }
    hydrate();
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex h-svh items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" aria-label="Loading builder" />
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background lg:grid lg:grid-cols-[72px_minmax(380px,460px)_1fr]">
      <BuilderSidebar />

      <section
        aria-label="Resume details"
        className={cn(
          "min-h-0 flex-1 border-border lg:block lg:border-r",
          mobileView === "edit" ? "block" : "hidden"
        )}
      >
        <StepPanel />
      </section>

      <section
        aria-label="Resume preview"
        className={cn("min-h-0 flex-1 lg:block", mobileView === "preview" ? "block" : "hidden")}
      >
        <PreviewPanel />
      </section>

      <Button
        onClick={() => setMobileView((view) => (view === "edit" ? "preview" : "edit"))}
        className="fixed right-4 bottom-20 z-40 h-11 gap-2 rounded-full bg-foreground px-4 text-background shadow-lg hover:bg-foreground/90 lg:hidden"
      >
        {mobileView === "edit" ? <Eye /> : <PencilLine />}
        {mobileView === "edit" ? "Preview" : "Edit"}
      </Button>
    </div>
  );
}
