"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";

import { BUILDER_STEPS, DEFAULT_THEME, FORM_PANEL_WIDTH } from "@/constants/builder";
import { fromParsedExperience, newBullet, newExperience } from "@/lib/resume-data";

// Applies `update` to the experience entry with `id`.
function mapExperience(state, id, update) {
  return { experience: state.experience.map((job) => (job.id === id ? update(job) : job)) };
}

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
      // Steps the user has moved away from; their required-field errors are shown from then on.
      visitedSteps: [],
      formWidth: FORM_PANEL_WIDTH.default,
      // Chosen on /templates; the builder redirects there while this is empty.
      templateId: null,
      // Visual settings shared by every template (fonts, sizes, colours, spacing).
      theme: DEFAULT_THEME,
      personal: EMPTY_PERSONAL,
      summary: "",
      experience: [],
      // User-edited section headings, keyed by section ("summary", "experience", ...). Empty = template default.
      sectionTitles: {},
      // File name of the uploaded resume last merged in, so it's only imported once.
      importedFrom: "",

      setStep: (step) =>
        set((state) => ({
          currentStep: step,
          visitedSteps: state.visitedSteps.includes(state.currentStep)
            ? state.visitedSteps
            : [...state.visitedSteps, state.currentStep],
        })),
      setFormWidth: (formWidth) => set({ formWidth }),
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
      // Clears everything the user has entered and returns to the first step.
      // Template, theme and favourites are kept.
      resetResume: () =>
        set({
          currentStep: BUILDER_STEPS[0].id,
          visitedSteps: [],
          personal: EMPTY_PERSONAL,
          summary: "",
          experience: [],
          sectionTitles: {},
          importedFrom: "",
        }),
      setSectionTitle: (section, title) =>
        set((state) => ({ sectionTitles: { ...state.sectionTitles, [section]: title } })),

      // Experience. Adders return the new id so the UI can focus / expand it.
      addExperience: () => {
        const job = newExperience();
        set((state) => ({ experience: [...state.experience, job] }));
        return job.id;
      },
      updateExperience: (id, field, value) => set((state) => mapExperience(state, id, (job) => ({ ...job, [field]: value }))),
      removeExperience: (id) => set((state) => ({ experience: state.experience.filter((job) => job.id !== id) })),
      addBullet: (jobId, afterIndex) => {
        const bullet = newBullet();
        set((state) =>
          mapExperience(state, jobId, (job) => {
            const bullets = [...job.bullets];
            bullets.splice(afterIndex ?? bullets.length, 0, bullet);
            return { ...job, bullets };
          })
        );
        return bullet.id;
      },
      updateBullet: (jobId, bulletId, text) =>
        set((state) =>
          mapExperience(state, jobId, (job) => ({
            ...job,
            bullets: job.bullets.map((b) => (b.id === bulletId ? { ...b, text } : b)),
          }))
        ),
      removeBullet: (jobId, bulletId) =>
        set((state) =>
          mapExperience(state, jobId, (job) => ({ ...job, bullets: job.bullets.filter((b) => b.id !== bulletId) }))
        ),
      moveBullet: (jobId, fromIndex, toIndex) =>
        set((state) =>
          mapExperience(state, jobId, (job) => ({ ...job, bullets: arrayMove(job.bullets, fromIndex, toIndex) }))
        ),

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
            experience: state.experience.length ? state.experience : fromParsedExperience(parsed.experience),
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
