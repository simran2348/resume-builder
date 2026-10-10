"use client";

import { ArrowLeft, ArrowRight, CircleAlert, PencilLine, RotateCcw } from "lucide-react";

import ChipsStep from "@/components/builder/steps/chips-step";
import ExperienceStep from "@/components/builder/steps/experience-step";
import ListStep from "@/components/builder/steps/list-step";
import PersonalStep from "@/components/builder/steps/personal-step";
import ReviewStep from "@/components/builder/steps/review-step";
import SkillsStep from "@/components/builder/steps/skills-step";
import SummaryStep from "@/components/builder/steps/summary-step";
import { getDefaultSectionTitle } from "@/components/builder/templates";
import { Button } from "@/components/ui/button";
import { useBuilderSteps } from "@/hooks/use-builder-steps";
import { useStepValidation } from "@/hooks/use-step-validation";
import { useBuilderStore } from "@/store/builderStore";
import { useResumeStore } from "@/store/resumeStore";

const STEP_COMPONENTS = {
  personal: PersonalStep,
  summary: SummaryStep,
  experience: ExperienceStep,
  skills: SkillsStep,
  education: () => <ListStep section="education" />,
  projects: () => <ListStep section="projects" />,
  hobbies: () => <ChipsStep section="hobbies" />,
  languages: () => <ListStep section="languages" />,
  achievements: () => <ListStep section="achievements" />,
  certifications: () => <ListStep section="certifications" />,
  preview: ReviewStep,
};

export default function StepPanel() {
  const currentStep = useBuilderStore((state) => state.currentStep);
  const setStep = useBuilderStore((state) => state.setStep);
  const importedFrom = useBuilderStore((state) => state.importedFrom);
  // Only mention the upload while it's still attached on the home page.
  const uploadedFileName = useResumeStore((state) => state.importedFileName);
  const showImportNotice = Boolean(importedFrom) && importedFrom === uploadedFileName;

  const steps = useBuilderSteps();
  const index = Math.max(0, steps.findIndex((step) => step.id === currentStep));
  const step = steps[index];
  const prev = steps[index - 1];
  const next = steps[index + 1];
  const StepComponent = STEP_COMPONENTS[step.id];
  const { showErrors, errorCount } = useStepValidation(step.id);

  return (
    <div className="flex h-full flex-col">
      {/* Keyed by step so each step (and a reset) starts scrolled to the top. */}
      <div key={step.id} className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
        <p className="flex items-center gap-2 text-xs font-medium text-brand">
          Step {index + 1} of {steps.length}
          {step.section && !step.required && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Optional
            </span>
          )}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">{step.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

        {step.section && <SectionTitleField section={step.section} />}

        {showErrors && (
          <p
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            <CircleAlert className="size-4 shrink-0" />
            {errorCount === 1 ? "1 required field is missing." : `${errorCount} required fields are missing.`} Fields
            marked * are required.
          </p>
        )}

        {showImportNotice && (
          <p className="mt-4 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Pre-filled from <span className="font-medium text-foreground">{importedFrom}</span>.
            Please double-check the details.
          </p>
        )}

        <div className="mt-6">
          <StepComponent />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3 sm:px-8">
        <Button
          variant="ghost"
          onClick={() => prev && setStep(prev.id)}
          disabled={!prev}
          className="h-10 px-4"
        >
          <ArrowLeft />
          Back
        </Button>
        {next && (
          <Button
            onClick={() => setStep(next.id)}
            className="h-10 bg-brand px-4 text-brand-foreground hover:bg-brand/90"
          >
            Next: {next.label}
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}

// Lets the user rename the heading this section gets on the resume; empty falls back to the template default.
function SectionTitleField({ section }) {
  const templateId = useBuilderStore((state) => state.templateId);
  const value = useBuilderStore((state) => state.sectionTitles[section] ?? "");
  const setSectionTitle = useBuilderStore((state) => state.setSectionTitle);
  const id = `section-title-${section}`;

  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-1.5 focus-within:border-brand/60 focus-within:ring-3 focus-within:ring-brand/20">
      <PencilLine className="size-3.5 shrink-0 text-muted-foreground" />
      <label htmlFor={id} className="shrink-0 text-xs text-muted-foreground">
        Section title
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => setSectionTitle(section, e.target.value)}
        placeholder={getDefaultSectionTitle(templateId, section)}
        maxLength={40}
        className="h-7 min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-foreground/70"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setSectionTitle(section, "")}
          aria-label="Reset section title to template default"
          title="Reset to default"
        >
          <RotateCcw />
        </Button>
      )}
    </div>
  );
}
