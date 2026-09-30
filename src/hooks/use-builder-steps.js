"use client";

import { useMemo } from "react";

import { getOrderedSteps } from "@/lib/steps";
import { useBuilderStore } from "@/store/builderStore";

// Visible builder steps in the user's current section order.
export function useBuilderSteps() {
  const sectionOrder = useBuilderStore((state) => state.sectionOrder);
  const hiddenSections = useBuilderStore((state) => state.hiddenSections);
  return useMemo(() => getOrderedSteps(sectionOrder, hiddenSections), [sectionOrder, hiddenSections]);
}
