import { FileText, UserRound } from "lucide-react";

// Order here is the order shown in the sidebar and used by Back / Next.
// Choosing a template happens before these steps, on the standalone /templates screen.
export const BUILDER_STEPS = [
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

// Accent colours offered on the templates screen. `value` is applied to headings, rules and highlights.
export const ACCENT_COLORS = [
  { id: "charcoal", name: "Charcoal", value: "#1f2937" },
  { id: "navy", name: "Navy", value: "#1e3a8a" },
  { id: "blue", name: "Blue", value: "#2563eb" },
  { id: "teal", name: "Teal", value: "#0f766e" },
  { id: "green", name: "Green", value: "#166534" },
  { id: "maroon", name: "Maroon", value: "#9f1239" },
  { id: "purple", name: "Purple", value: "#6d28d9" },
  { id: "orange", name: "Orange", value: "#c2410c" },
];

// `supportsPhoto` controls the headshot filter and whether the photo upload shows in Personal details.
// `columns` drives the columns filter. `defaultColor` is an ACCENT_COLORS id.
export const RESUME_TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Single column, top to bottom. The safest choice for ATS scanners.",
    supportsPhoto: false,
    columns: 1,
    recommended: true,
    defaultColor: "charcoal",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Centered serif header with a monogram. Timeless and formal.",
    supportsPhoto: false,
    columns: 1,
    recommended: true,
    defaultColor: "blue",
  },
  {
    id: "side-headings",
    name: "Executive",
    description: "Section titles in a left gutter with a headshot up top.",
    supportsPhoto: true,
    columns: 1,
    recommended: true,
    defaultColor: "blue",
  },
  {
    id: "banner",
    name: "Banner",
    description: "Bold coloured header band with your initials.",
    supportsPhoto: false,
    columns: 1,
    recommended: false,
    defaultColor: "blue",
  },
  {
    id: "classic-photo",
    name: "Classic with photo",
    description: "The classic layout with a profile photo in the header.",
    supportsPhoto: true,
    columns: 1,
    recommended: false,
    defaultColor: "navy",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Letter-spaced header and centered section titles. Quiet and clean.",
    supportsPhoto: false,
    columns: 1,
    recommended: false,
    defaultColor: "charcoal",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Experience laid out on a vertical timeline.",
    supportsPhoto: false,
    columns: 1,
    recommended: false,
    defaultColor: "teal",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Coloured sidebar for photo, contact and skills; experience on the right.",
    supportsPhoto: true,
    columns: 2,
    recommended: false,
    defaultColor: "navy",
  },
  {
    id: "split",
    name: "Split",
    description: "Wide main column with skills and languages in a side panel.",
    supportsPhoto: false,
    columns: 2,
    recommended: false,
    defaultColor: "green",
  },
  {
    id: "profile",
    name: "Profile",
    description: "Tinted header with a headshot and a narrow details column.",
    supportsPhoto: true,
    columns: 2,
    recommended: false,
    defaultColor: "maroon",
  },
];

export const TEMPLATE_FILTERS = {
  headshot: {
    label: "Headshot",
    options: [
      { value: "with", label: "With photo" },
      { value: "without", label: "Without photo" },
    ],
  },
  columns: {
    label: "Columns",
    options: [
      { value: "1", label: "One column" },
      { value: "2", label: "Two columns" },
    ],
  },
};

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
