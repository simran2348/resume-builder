import { BUILDER_STEPS, DEFAULT_SECTION_ORDER } from "@/constants/builder";

const STEP_BY_ID = Object.fromEntries(BUILDER_STEPS.map((step) => [step.id, step]));

// Section steps follow the user's section order (set on the review step); removed sections are skipped.
export function getOrderedSteps(sectionOrder = DEFAULT_SECTION_ORDER, hiddenSections = []) {
  return [
    STEP_BY_ID.personal,
    STEP_BY_ID.summary,
    ...sectionOrder.filter((id) => !hiddenSections.includes(id) && STEP_BY_ID[id]).map((id) => STEP_BY_ID[id]),
    STEP_BY_ID.preview,
  ];
}

export function getStep(id) {
  return STEP_BY_ID[id];
}
