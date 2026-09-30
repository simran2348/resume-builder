"use client";

import { useMemo } from "react";

import { getStepErrors } from "@/lib/validation";
import { useBuilderStore } from "@/store/builderStore";

// Live errors for a step, plus whether to show them (only once the user has left the step at least once).
export function useStepValidation(stepId) {
  const personal = useBuilderStore((state) => state.personal);
  const summary = useBuilderStore((state) => state.summary);
  const experience = useBuilderStore((state) => state.experience);
  const visited = useBuilderStore((state) => state.visitedSteps.includes(stepId));

  const errors = useMemo(
    () => getStepErrors(stepId, { personal, summary, experience }),
    [stepId, personal, summary, experience]
  );
  const errorCount = Object.keys(errors).length;

  return { errors, errorCount, isValid: errorCount === 0, visited, showErrors: visited && errorCount > 0 };
}
