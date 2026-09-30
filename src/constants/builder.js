import { FileText, LayoutTemplate, UserRound } from "lucide-react";

// Order here is the order shown in the sidebar and used by Back / Next.
export const BUILDER_STEPS = [
  {
    id: "template",
    label: "Choose template",
    description: "Pick a layout. You can switch at any time without losing your details.",
    icon: LayoutTemplate,
  },
  {
    id: "personal",
    label: "Personal details",
    description: "How recruiters will reach you. Only filled-in fields appear on your resume.",
    icon: UserRound,
  },
  {
    id: "summary",
    label: "Professional summary",
    description: "A short pitch at the top of your resume that sums up who you are.",
    icon: FileText,
  },
];

// `supportsPhoto` controls whether the photo upload shows in Personal details.
export const RESUME_TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Single column, top to bottom. The safest choice for ATS scanners.",
    supportsPhoto: false,
  },
  {
    id: "classic-photo",
    name: "Classic with photo",
    description: "The classic layout with a profile photo in the header.",
    supportsPhoto: true,
  },
];

export const DEFAULT_TEMPLATE_ID = RESUME_TEMPLATES[0].id;

export const PERSONAL_FIELD_GROUPS = [
  {
    title: "Basic info",
    fields: [
      { name: "fullName", label: "Full name", placeholder: "Jane Doe", autoComplete: "name" },
      { name: "jobTitle", label: "Job title", placeholder: "Frontend Engineer", autoComplete: "organization-title" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "email", label: "Email", placeholder: "jane@example.com", type: "email", autoComplete: "email" },
      { name: "phone", label: "Phone", placeholder: "+1 555 123 4567", type: "tel", autoComplete: "tel" },
      { name: "location", label: "Location", placeholder: "San Francisco, CA", autoComplete: "address-level2" },
    ],
  },
  {
    title: "Links",
    fields: [
      { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/janedoe", type: "url" },
      { name: "github", label: "GitHub", placeholder: "github.com/janedoe", type: "url" },
      { name: "website", label: "Website / Portfolio", placeholder: "janedoe.dev", type: "url" },
    ],
  },
];

export const SUMMARY_CONFIG = {
  placeholder:
    "Frontend engineer with 5+ years of experience building fast, accessible web apps with React and Next.js...",
  recommendedMin: 300,
  recommendedMax: 600,
  tips: [
    "Keep it to 2–4 sentences.",
    "Lead with your role and years of experience.",
    "Mention 2–3 skills or achievements that match the job you want.",
  ],
};

export const PHOTO_CONFIG = {
  maxSizeMB: 5,
  // Photos are resized to this many pixels (square) before being saved.
  outputSize: 400,
};
