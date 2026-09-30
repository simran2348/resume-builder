"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Holds details extracted from an uploaded resume so any template can be auto-filled later.
export const useResumeStore = create(
  persist(
    (set) => ({
      importedResume: null,
      importedFileName: "",
      setImportedResume: (data, fileName) =>
        set({ importedResume: data, importedFileName: fileName }),
      clearImportedResume: () => set({ importedResume: null, importedFileName: "" }),
    }),
    // Rehydrated manually after mount to avoid SSR hydration mismatches.
    { name: "imported-resume", skipHydration: true }
  )
);
