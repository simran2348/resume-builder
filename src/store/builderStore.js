"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { BUILDER_STEPS } from "@/constants/builder";

const EMPTY_PERSONAL = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  photo: "",
};

// The resume being edited in the builder. Every form field writes here and the preview reads from here.
export const useBuilderStore = create(
  persist(
    (set) => ({
      currentStep: BUILDER_STEPS[0].id,
      // Chosen on /templates; the builder redirects there while this is empty.
      templateId: null,
      accentColor: "",
      personal: EMPTY_PERSONAL,
      summary: "",
      // File name of the uploaded resume last merged in, so it's only imported once.
      importedFrom: "",

      setStep: (currentStep) => set({ currentStep }),
      chooseTemplate: (templateId, accentColor) => set({ templateId, accentColor }),
      updatePersonal: (field, value) =>
        set((state) => ({ personal: { ...state.personal, [field]: value } })),
      setSummary: (summary) => set({ summary }),

      // Fills only empty fields from a parsed resume so user edits are never overwritten.
      importResume: (parsed, fileName) =>
        set((state) => {
          const personal = { ...state.personal };
          for (const key of Object.keys(EMPTY_PERSONAL)) {
            if (!personal[key] && parsed.personal?.[key]) personal[key] = parsed.personal[key];
          }
          return {
            personal,
            summary: state.summary || parsed.summary || "",
            importedFrom: fileName,
          };
        }),
    }),
    {
      name: "resume-builder",
      version: 1,
      // v0 had "template" as a builder step.
      migrate: (state) => ({
        ...state,
        currentStep: BUILDER_STEPS.some((step) => step.id === state.currentStep)
          ? state.currentStep
          : BUILDER_STEPS[0].id,
      }),
      // Rehydrated manually after mount to avoid SSR hydration mismatches.
      skipHydration: true,
    }
  )
);
