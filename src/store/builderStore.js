"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { BUILDER_STEPS, DEFAULT_THEME } from "@/constants/builder";

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
      // Visual settings shared by every template (fonts, sizes, colours, spacing).
      theme: DEFAULT_THEME,
      personal: EMPTY_PERSONAL,
      summary: "",
      // File name of the uploaded resume last merged in, so it's only imported once.
      importedFrom: "",

      setStep: (currentStep) => set({ currentStep }),
      // Changing template resets per-template theme defaults (contact icons).
      setTemplate: (templateId) =>
        set((state) => ({ templateId, theme: { ...state.theme, showContactIcons: null } })),
      // From the templates screen; an accent picked there is carried into the theme.
      chooseTemplate: (templateId, accent) =>
        set((state) => ({
          templateId,
          theme: {
            ...state.theme,
            showContactIcons: null,
            ...(accent && { accent, photoBorderColor: accent }),
          },
        })),
      updateTheme: (key, value) => set((state) => ({ theme: { ...state.theme, [key]: value } })),
      resetTheme: () => set({ theme: DEFAULT_THEME }),
      favoriteTemplates: [],
      toggleFavorite: (templateId) =>
        set((state) => ({
          favoriteTemplates: state.favoriteTemplates.includes(templateId)
            ? state.favoriteTemplates.filter((id) => id !== templateId)
            : [...state.favoriteTemplates, templateId],
        })),
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
      version: 2,
      // v0 had "template" as a builder step; v1 stored a single `accentColor` instead of `theme`.
      migrate: ({ accentColor, ...state }) => ({
        ...state,
        currentStep: BUILDER_STEPS.some((step) => step.id === state.currentStep)
          ? state.currentStep
          : BUILDER_STEPS[0].id,
        theme: {
          ...DEFAULT_THEME,
          ...state.theme,
          ...(accentColor && { accent: accentColor, photoBorderColor: accentColor }),
        },
      }),
      // Deep-merge the theme so settings added later get their defaults.
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        theme: { ...current.theme, ...persisted?.theme },
      }),
      // Rehydrated manually after mount to avoid SSR hydration mismatches.
      skipHydration: true,
    }
  )
);
