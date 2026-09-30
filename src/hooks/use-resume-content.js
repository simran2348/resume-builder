"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { RESUME_DATA_KEYS, isResumeEmpty, toTemplateResume } from "@/lib/resume-data";
import { useBuilderStore } from "@/store/builderStore";

// The user's resume content from the store: raw `data`, the template-ready `resume`, and `isEmpty`.
export function useResumeContent() {
  const data = useBuilderStore(useShallow((state) => Object.fromEntries(RESUME_DATA_KEYS.map((k) => [k, state[k]]))));
  const resume = useMemo(() => toTemplateResume(data), [data]);
  return { data, resume, isEmpty: isResumeEmpty(data) };
}
