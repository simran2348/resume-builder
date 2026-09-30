"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import PersonalStep from "@/components/builder/steps/personal-step";
import SummaryStep from "@/components/builder/steps/summary-step";
import { Button } from "@/components/ui/button";
import { BUILDER_STEPS } from "@/constants/builder";
import { useBuilderStore } from "@/store/builderStore";

const STEP_COMPONENTS = {
  personal: PersonalStep,
  summary: SummaryStep,
};

export default function StepPanel() {
  const currentStep = useBuilderStore((state) => state.currentStep);
  const setStep = useBuilderStore((state) => state.setStep);
  const importedFrom = useBuilderStore((state) => state.importedFrom);

  const index = Math.max(0, BUILDER_STEPS.findIndex((step) => step.id === currentStep));
  const step = BUILDER_STEPS[index];
  const prev = BUILDER_STEPS[index - 1];
  const next = BUILDER_STEPS[index + 1];
  const StepComponent = STEP_COMPONENTS[step.id];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
        <p className="text-xs font-medium text-brand">
          Step {index + 1} of {BUILDER_STEPS.length}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">{step.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

        {importedFrom && (
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
