import { LIST_SECTIONS, PERSONAL_FIELD_GROUPS } from "@/constants/builder";

const REQUIRED_PERSONAL_FIELDS = PERSONAL_FIELD_GROUPS.flatMap((group) => group.fields).filter((f) => f.required);
const REQUIRED_EDUCATION_FIELDS = LIST_SECTIONS.education.fields.filter((f) => f.required);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Required-field errors for a builder step, keyed by field ("fullName", "summary", "role-<id>", ...).
// Optional steps (projects, hobbies, ...) never have errors.
export function getStepErrors(stepId, { personal, summary, experience, skills, education }) {
  const errors = {};

  if (stepId === "personal") {
    for (const field of REQUIRED_PERSONAL_FIELDS) {
      if (!personal[field.name]?.trim()) errors[field.name] = `${field.label} is required`;
    }
    if (!errors.email && !EMAIL_RE.test(personal.email.trim())) errors.email = "Enter a valid email address";
  }

  if (stepId === "summary" && !summary.trim()) {
    errors.summary = "A professional summary is required";
  }

  if (stepId === "experience") {
    if (!experience.length) errors.experience = "Add at least one role";
    for (const job of experience) {
      if (!job.role.trim()) errors[`role-${job.id}`] = "Job title is required";
    }
  }

  if (stepId === "skills" && !skills.length) {
    errors.skills = "Add at least one skill";
  }

  if (stepId === "education") {
    if (!education.length) errors.education = "Add at least one education entry";
    for (const item of education) {
      for (const field of REQUIRED_EDUCATION_FIELDS) {
        if (!item[field.name]?.trim()) errors[`${field.name}-${item.id}`] = `${field.label} is required`;
      }
    }
  }

  return errors;
}
