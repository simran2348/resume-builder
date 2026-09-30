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
// `columns` drives the columns filter. `contactIcons` is the template's default for the
// "Include contact icons" theme option. Colours, fonts and sizes come from the shared theme (DEFAULT_THEME).
export const RESUME_TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Single column, top to bottom. The safest choice for ATS scanners.",
    supportsPhoto: false,
    columns: 1,
    recommended: true,
    contactIcons: false,
  },
  {
    id: "centered",
    name: "Centered",
    description: "Name, role and contact details centred at the top; classic sections below.",
    supportsPhoto: false,
    columns: 1,
    recommended: true,
    contactIcons: true,
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Centered header with a monogram. Timeless and formal.",
    supportsPhoto: false,
    columns: 1,
    recommended: true,
    contactIcons: false,
  },
  {
    id: "side-headings",
    name: "Executive",
    description: "Section titles in a left gutter with a headshot up top.",
    supportsPhoto: true,
    columns: 1,
    recommended: true,
    contactIcons: true,
  },
  {
    id: "banner",
    name: "Banner",
    description: "Bold coloured header band with your initials.",
    supportsPhoto: false,
    columns: 1,
    recommended: false,
    contactIcons: false,
  },
  {
    id: "classic-photo",
    name: "Classic with photo",
    description: "The classic layout with a profile photo in the header.",
    supportsPhoto: true,
    columns: 1,
    recommended: false,
    contactIcons: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Letter-spaced header and centered section titles. Quiet and clean.",
    supportsPhoto: false,
    columns: 1,
    recommended: false,
    contactIcons: false,
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Experience laid out on a vertical timeline.",
    supportsPhoto: false,
    columns: 1,
    recommended: false,
    contactIcons: false,
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Coloured sidebar for photo, contact and skills; experience on the right.",
    supportsPhoto: true,
    columns: 2,
    recommended: false,
    contactIcons: true,
  },
  {
    id: "split",
    name: "Split",
    description: "Wide main column with skills and languages in a side panel.",
    supportsPhoto: false,
    columns: 2,
    recommended: false,
    contactIcons: false,
  },
  {
    id: "profile",
    name: "Profile",
    description: "Tinted header with a headshot and a narrow details column.",
    supportsPhoto: true,
    columns: 2,
    recommended: false,
    contactIcons: true,
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

// Fonts offered in the theme panel. `variable` is defined by next/font (see src/lib/resume-fonts.js).
export const RESUME_FONTS = [
  { id: "inter", label: "Inter", variable: "--font-inter", fallback: "sans-serif" },
  { id: "roboto", label: "Roboto", variable: "--font-resume-roboto", fallback: "sans-serif" },
  { id: "open-sans", label: "Open Sans", variable: "--font-resume-open-sans", fallback: "sans-serif" },
  { id: "lato", label: "Lato", variable: "--font-resume-lato", fallback: "sans-serif" },
  { id: "montserrat", label: "Montserrat", variable: "--font-resume-montserrat", fallback: "sans-serif" },
  { id: "poppins", label: "Poppins", variable: "--font-resume-poppins", fallback: "sans-serif" },
  { id: "merriweather", label: "Merriweather", variable: "--font-resume-merriweather", fallback: "serif" },
  { id: "lora", label: "Lora", variable: "--font-resume-lora", fallback: "serif" },
  { id: "playfair", label: "Playfair Display", variable: "--font-resume-playfair", fallback: "serif" },
  { id: "garamond", label: "EB Garamond", variable: "--font-resume-garamond", fallback: "serif" },
];

// Swatches in the theme panel's colour grid.
export const THEME_PALETTE = [
  "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2563eb", "#03a9f4", "#00bcd4",
  "#009688", "#166534", "#4caf50", "#8bc34a", "#c2410c", "#ff9800", "#1f2937", "#9e9e9e",
];

// One theme shared by every template, so templates differ only in layout.
export const DEFAULT_THEME = {
  accent: "#2563eb",
  background: "#ffffff",
  text: "#262626",
  headingFont: "inter",
  bodyFont: "inter",
  nameSize: 32,
  headingSize: 13,
  bodySize: 12.5,
  lineHeight: 1.5,
  sectionSpacing: 22,
  pageMargin: 52,
  photoShape: "circle",
  photoBorderWidth: 0,
  photoBorderColor: "#2563eb",
  // null = follow the selected template's `contactIcons` default; reset whenever the template changes.
  showContactIcons: null,
};

// Slider ranges for the theme panel.
export const THEME_LIMITS = {
  nameSize: { min: 20, max: 48, step: 1, unit: "px" },
  headingSize: { min: 10, max: 22, step: 0.5, unit: "px" },
  bodySize: { min: 9, max: 16, step: 0.5, unit: "px" },
  lineHeight: { min: 1.1, max: 2, step: 0.05, unit: "" },
  sectionSpacing: { min: 8, max: 48, step: 1, unit: "px" },
  pageMargin: { min: 24, max: 96, step: 2, unit: "px" },
  photoBorderWidth: { min: 0, max: 10, step: 1, unit: "px" },
};

export const PHOTO_SHAPES = [
  { id: "circle", label: "Circle", radius: "9999px" },
  { id: "rounded", label: "Rounded", radius: "14%" },
  { id: "square", label: "Square", radius: "0px" },
];
