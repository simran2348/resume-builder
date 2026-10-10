"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";

import { BUILDER_STEPS, DEFAULT_SECTION_ORDER, DEFAULT_THEME, FORM_PANEL_WIDTH } from "@/constants/builder";
import {
  RESUME_DATA_KEYS,
  fromParsedResume,
  newBullet,
  newChip,
  newExperience,
  newListItem,
  newSkillCategory,
} from "@/lib/resume-data";

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

// Everything the user enters. `resetResume` restores this.
const EMPTY_RESUME = {
  personal: EMPTY_PERSONAL,
  summary: "",
  experience: [],
  // Chip sections: [{ id, name }]. Skills also have a `categoryId` while categories are in use.
  skills: [],
  hobbies: [],
  // Skill categories, e.g. [{ id, name: "Frontend" }]. Empty = skills are one simple list.
  skillCategories: [],
  // List sections (see LIST_SECTIONS): [{ id, ...fields }]
  education: [],
  projects: [],
  languages: [],
  achievements: [],
  certifications: [],
  // User-edited section headings, keyed by section. Empty = template default.
  sectionTitles: {},
  // Order of sections after the summary, and sections removed on the review step.
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

// The resume being edited in the builder. Every form field writes here and the preview reads from here.
export const useBuilderStore = create(
  persist(
    (set) => ({
      ...EMPTY_RESUME,
      currentStep: BUILDER_STEPS[0].id,
      // Steps the user has moved away from; their required-field errors are shown from then on.
      visitedSteps: [],
      formWidth: FORM_PANEL_WIDTH.default,
      // Chosen on /templates; the builder redirects there while this is empty.
      templateId: null,
      // Visual settings shared by every template (fonts, sizes, colours, spacing).
      theme: DEFAULT_THEME,
      favoriteTemplates: [],
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
      toggleFavorite: (templateId) =>
        set((state) => ({
          favoriteTemplates: state.favoriteTemplates.includes(templateId)
            ? state.favoriteTemplates.filter((id) => id !== templateId)
            : [...state.favoriteTemplates, templateId],
        })),

      updatePersonal: (field, value) => set((state) => ({ personal: { ...state.personal, [field]: value } })),
      setSummary: (summary) => set({ summary }),
      setSectionTitle: (section, title) =>
        set((state) => ({ sectionTitles: { ...state.sectionTitles, [section]: title } })),

      // Clears everything the user has entered and returns to the first step.
      // Template, theme and favourites are kept.
      resetResume: () => set({ ...EMPTY_RESUME, currentStep: BUILDER_STEPS[0].id, visitedSteps: [], importedFrom: "" }),

      // Replaces the resume with a backup file's data (see createBackup in resume-data.js).
      loadBackup: (data) =>
        set((state) => {
          // Stays on the review step, where backups are restored.
          const next = { currentStep: "preview", visitedSteps: [], importedFrom: "" };
          for (const key of RESUME_DATA_KEYS) next[key] = data[key] ?? EMPTY_RESUME[key];
          next.personal = { ...EMPTY_PERSONAL, ...data.personal };
          if (data.templateId) next.templateId = data.templateId;
          next.theme = { ...DEFAULT_THEME, ...(data.theme ?? state.theme) };
          return next;
        }),

      // ---------- Section order (review step) ----------
      moveSection: (activeKey, overKey) =>
        set((state) => ({
          sectionOrder: arrayMove(
            state.sectionOrder,
            state.sectionOrder.indexOf(activeKey),
            state.sectionOrder.indexOf(overKey)
          ),
        })),
      hideSection: (key) => set((state) => ({ hiddenSections: [...new Set([...state.hiddenSections, key])] })),
      restoreSection: (key) => set((state) => ({ hiddenSections: state.hiddenSections.filter((k) => k !== key) })),

      // ---------- Chip and list sections (skills, hobbies, education, projects, ...) ----------
      // `addItem` returns the new id so the UI can focus / expand it.
      addItem: (section, fields = {}) => {
        const item =
          section === "skills" || section === "hobbies"
            ? newChip(fields.name, fields.categoryId)
            : newListItem(section, fields);
        set((state) => ({ [section]: [...state[section], item] }));
        return item.id;
      },
      updateItem: (section, id, field, value) =>
        set((state) => ({
          [section]: state[section].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        })),
      removeItem: (section, id) => set((state) => ({ [section]: state[section].filter((item) => item.id !== id) })),
      moveItem: (section, fromIndex, toIndex) =>
        set((state) => ({ [section]: arrayMove(state[section], fromIndex, toIndex) })),

      // ---------- Skill categories ----------
      // Turning categories on puts every existing skill into one first (unnamed) category.
      enableSkillCategories: () =>
        set((state) => {
          const category = newSkillCategory();
          return {
            skillCategories: [category],
            skills: state.skills.map((skill) => ({ ...skill, categoryId: category.id })),
          };
        }),
      // Turning them off keeps every skill, in category order, as one simple list.
      disableSkillCategories: () =>
        set((state) => {
          const known = new Set(state.skillCategories.map((c) => c.id));
          const ordered = [
            ...state.skillCategories.flatMap((c) => state.skills.filter((skill) => skill.categoryId === c.id)),
            ...state.skills.filter((skill) => !known.has(skill.categoryId)),
          ];
          // eslint-disable-next-line no-unused-vars
          return { skillCategories: [], skills: ordered.map(({ categoryId, ...skill }) => skill) };
        }),
      addSkillCategory: () => {
        const category = newSkillCategory();
        set((state) => ({ skillCategories: [...state.skillCategories, category] }));
        return category.id;
      },
      renameSkillCategory: (id, name) =>
        set((state) => ({
          skillCategories: state.skillCategories.map((c) => (c.id === id ? { ...c, name } : c)),
        })),
      // Removes the category and the skills in it.
      removeSkillCategory: (id) =>
        set((state) => ({
          skillCategories: state.skillCategories.filter((c) => c.id !== id),
          skills: state.skills.filter((skill) => skill.categoryId !== id),
        })),
      moveSkillCategory: (fromIndex, toIndex) =>
        set((state) => ({ skillCategories: arrayMove(state.skillCategories, fromIndex, toIndex) })),

      // ---------- Experience ----------
      addExperience: () => {
        const job = newExperience();
        set((state) => ({ experience: [...state.experience, job] }));
        return job.id;
      },
      updateExperience: (id, field, value) =>
        set((state) => mapExperience(state, id, (job) => ({ ...job, [field]: value }))),
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

      // Fills only empty fields / empty sections from a parsed resume so user edits are never overwritten.
      importResume: (parsed, fileName) =>
        set((state) => {
          const personal = { ...state.personal };
          for (const key of Object.keys(EMPTY_PERSONAL)) {
            if (!personal[key] && parsed.personal?.[key]) personal[key] = parsed.personal[key];
          }
          const next = { personal, summary: state.summary || parsed.summary || "", importedFrom: fileName };
          const { skillCategories, ...sections } = fromParsedResume(parsed);
          for (const [section, items] of Object.entries(sections)) {
            next[section] = state[section].length ? state[section] : items;
          }
          // Imported categories only come along with the imported skills they group.
          if (!state.skills.length && skillCategories.length) next.skillCategories = skillCategories;
          return next;
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
      // Deep-merge the theme, and append any sections added in later versions to the saved order.
      merge: (persisted, current) => {
        const order = persisted?.sectionOrder ?? current.sectionOrder;
        return {
          ...current,
          ...persisted,
          theme: { ...current.theme, ...persisted?.theme },
          sectionOrder: [...order, ...DEFAULT_SECTION_ORDER.filter((key) => !order.includes(key))],
        };
      },
      // Rehydrated manually after mount to avoid SSR hydration mismatches.
      skipHydration: true,
    }
  )
);
