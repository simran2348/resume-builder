"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { BUILDER_STEPS, DEFAULT_TEMPLATE_ID } from "@/constants/builder";

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
      templateId: DEFAULT_TEMPLATE_ID,
      personal: EMPTY_PERSONAL,
      summary: "",
      // File name of the uploaded resume last merged in, so it's only imported once.
      importedFrom: "",

      setStep: (currentStep) => set({ currentStep }),
      setTemplate: (templateId) => set({ templateId }),
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
    // Rehydrated manually after mount to avoid SSR hydration mismatches.
    { name: "resume-builder", skipHydration: true }
  )
);
