import {
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  GraduationCap,
  Languages,
  Puzzle,
  ScanEye,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

// Every builder step, in default order. Choosing a template happens before these, on /templates.
// `section` links a step to a resume section (makes its title editable and lets it be reordered /
// removed on the review step). `required` steps must be complete; optional ones have no validation.
export const BUILDER_STEPS = [
  {
    id: "personal",
    label: "Personal details",
    description: "How recruiters will reach you. Only filled-in fields appear on your resume.",
    icon: UserRound,
    required: true,
  },
  {
    id: "summary",
    label: "Professional summary",
    description: "A short pitch at the top of your resume that sums up who you are.",
    icon: FileText,
    section: "summary",
    required: true,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Your work history, most recent first. Focus on achievements, not just duties.",
    icon: BriefcaseBusiness,
    section: "experience",
    required: true,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Tools, technologies and strengths recruiters search for. Drag to put the most relevant first.",
    icon: Sparkles,
    section: "skills",
    required: true,
  },
  {
    id: "education",
    label: "Education",
    description: "Degrees, diplomas and relevant courses, most recent first.",
    icon: GraduationCap,
    section: "education",
    required: true,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Optional. Side projects, open source or notable work that shows what you can do.",
    icon: FolderKanban,
    section: "projects",
  },
  {
    id: "hobbies",
    label: "Hobbies",
    description: "Optional. A few interests can make you memorable. Keep it short.",
    icon: Puzzle,
    section: "hobbies",
  },
  {
    id: "languages",
    label: "Languages",
    description: "Optional. Languages you speak and how well.",
    icon: Languages,
    section: "languages",
  },
  {
    id: "achievements",
    label: "Achievements",
    description: "Optional. Awards, recognitions and results you're proud of.",
    icon: Trophy,
    section: "achievements",
  },
  {
    id: "certifications",
    label: "Certifications",
    description: "Optional. Licences and certificates, with the issuing organisation.",
    icon: BadgeCheck,
    section: "certifications",
  },
  {
    id: "preview",
    label: "Preview & download",
    description: "Reorder, edit or remove sections, then download or print your resume.",
    icon: ScanEye,
  },
];

// Default order of resume sections after the summary (which always stays first).
// The review step lets users reorder these; the builder steps follow the same order.
export const DEFAULT_SECTION_ORDER = [
  "experience",
  "skills",
  "education",
  "projects",
  "hobbies",
  "languages",
  "achievements",
  "certifications",
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
// `sectionTitles` overrides DEFAULT_SECTION_TITLES for that template (users can override both).
// `columns` drives the columns filter. `contactIcons` is the template's default for the
// "Include contact icons" theme option. Colours, fonts and sizes come from the shared theme (DEFAULT_THEME).
// `skillLayout` is "list" or "categories"; see RESUME_TEMPLATES below.
// `headingWeight` is the font weight of section titles when the user hasn't chosen (default 700, bold);
// the "Bold section titles" theme option overrides it.
const BASE_TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    sectionTitles: { summary: "Professional Summary" },
    description: "Single column, top to bottom. The safest choice for ATS scanners.",
    supportsPhoto: false,
    columns: 1,
    recommended: true,
    contactIcons: false,
  },
  {
    id: "centered",
    name: "Centered",
    sectionTitles: { summary: "Professional Summary" },
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
    headingWeight: 400,
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
    sectionTitles: { summary: "Professional Summary" },
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
    headingWeight: 600,
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
    sectionTitles: { summary: "Profile" },
    description: "Tinted header with a headshot and a narrow details column.",
    supportsPhoto: true,
    columns: 2,
    recommended: false,
    contactIcons: true,
  },
];

// Every single-column template also comes in a "Grouped skills" version that shows skills by category
// ("Frontend: React, Next.js"). It shares the base template's component (`baseId`) and sits right after it.
export const RESUME_TEMPLATES = BASE_TEMPLATES.flatMap((template) => {
  const base = { ...template, skillLayout: "list" };
  if (template.columns !== 1) return [base];
  return [
    base,
    {
      ...base,
      id: `${template.id}-skill-groups`,
      baseId: template.id,
      name: `${template.name} · Grouped skills`,
      skillLayout: "categories",
    },
  ];
});

// Template gallery switches. Each is on or off, so the gallery shows one family of layouts at a time
// (e.g. one column, no photo, simple skills list). `matches` says whether a template belongs with the switch on.
export const TEMPLATE_TOGGLES = [
  { key: "photo", label: "Photo", matches: (t) => t.supportsPhoto },
  { key: "twoColumns", label: "Two columns", matches: (t) => t.columns === 2 },
  { key: "groupedSkills", label: "Grouped skills", matches: (t) => t.skillLayout === "categories" },
];

// How many templates can be compared side by side on the templates screen.
export const MAX_COMPARE = 3;

// `required: true` fields must be filled for the step to count as complete (see src/lib/validation.js).
export const PERSONAL_FIELD_GROUPS = [
  {
    title: "Basic info",
    fields: [
      { name: "fullName", label: "Full name", placeholder: "Jane Doe", autoComplete: "name", required: true },
      { name: "jobTitle", label: "Job title", placeholder: "Frontend Engineer", autoComplete: "organization-title" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "email", label: "Email", placeholder: "jane@example.com", type: "email", autoComplete: "email", required: true },
      { name: "phone", label: "Phone", placeholder: "+1 555 123 4567", type: "tel", autoComplete: "tel", required: true },
      { name: "location", label: "Location", placeholder: "San Francisco, CA", autoComplete: "address-level2", required: true },
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
  accent: "#1f2937",
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
  photoBorderColor: "#1f2937",
  // null = follow the selected template's `contactIcons` default; reset whenever the template changes.
  showContactIcons: null,
  // Thin rules between sections / under headings, in templates that use them.
  showDividers: true,
  // Section titles in bold. null = follow the selected template's `headingWeight`; reset with the template.
  boldHeadings: null,
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

// Section headings used when neither the template nor the user sets one.
export const DEFAULT_SECTION_TITLES = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  hobbies: "Hobbies",
  languages: "Languages",
  achievements: "Achievements",
  certifications: "Certifications",
};

export const EXPERIENCE_FIELDS = [
  { name: "role", label: "Job title", placeholder: "Senior Software Engineer", required: true },
  { name: "company", label: "Employer", placeholder: "Acme Corp" },
  { name: "location", label: "Location", placeholder: "San Francisco, CA or Remote" },
];

export const EXPERIENCE_CONFIG = {
  bulletPlaceholder: "Led a team of 5 engineers to rebuild checkout, increasing conversion by 18%.",
  bulletTip:
    "Start each point with an action verb and add numbers where you can. Press Enter for a new point; Ctrl/⌘+B or Ctrl/⌘+I for bold or italic.",
  // How far back the year pickers go.
  yearsBack: 50,
};

// Width limits (px) for the draggable form panel in the builder.
export const FORM_PANEL_WIDTH = { min: 360, max: 760, default: 420 };

// Chip-style sections (a list of short names).
export const CHIP_SECTIONS = {
  skills: {
    inputLabel: "Add a skill",
    placeholder: "e.g. React, Figma, Project management",
    hint: "Press Enter or comma to add. Paste a comma-separated list to add several at once.",
    emptyText: "No skills yet. Add the ones most relevant to the job you want.",
  },
  hobbies: {
    inputLabel: "Add a hobby or interest",
    placeholder: "e.g. Rock climbing, Photography",
    hint: "Press Enter or comma to add.",
    emptyText: "No hobbies added. This section is optional.",
  },
};

export const LANGUAGE_LEVELS = [
  { value: "Native", label: "Native", level: 5 },
  { value: "Fluent", label: "Fluent", level: 4.5 },
  { value: "Professional", label: "Professional", level: 4 },
  { value: "Intermediate", label: "Intermediate", level: 3 },
  { value: "Basic", label: "Basic", level: 2 },
];

// Config for list-style sections edited with the generic ListEditor.
// Field types: text (default) | url | month | checkbox | textarea | select.
// `disabledBy` disables a field while another (checkbox) field is true. `span: 2` = full width.
export const LIST_SECTIONS = {
  education: {
    itemLabel: "education",
    addLabel: "Add education",
    emptyTitle: "No education added yet",
    emptyText: "Add your highest or most relevant qualification first.",
    titleField: "degree",
    subtitleField: "school",
    fields: [
      { name: "degree", label: "Degree / qualification", placeholder: "B.S. Computer Science", required: true },
      { name: "school", label: "School / university", placeholder: "University of Texas at Austin", required: true },
      { name: "location", label: "Location", placeholder: "Austin, TX", span: 2 },
      { name: "startDate", label: "Start date", type: "month" },
      { name: "endDate", label: "End date", type: "month", disabledBy: "current" },
      { name: "current", label: "I currently study here", type: "checkbox", span: 2 },
      { name: "grade", label: "Grade / GPA", placeholder: "GPA 3.8 / 4.0" },
      { name: "description", label: "Details", type: "textarea", span: 2, placeholder: "Relevant coursework, thesis, honours…" },
    ],
  },
  projects: {
    itemLabel: "project",
    addLabel: "Add project",
    emptyTitle: "No projects added",
    emptyText: "Optional. Show off side projects, open source or notable work.",
    titleField: "name",
    subtitleField: "role",
    fields: [
      { name: "name", label: "Project title", placeholder: "Open-source design system" },
      { name: "role", label: "Your role / tech stack", placeholder: "Creator · React, TypeScript" },
      { name: "link", label: "Link", type: "url", placeholder: "github.com/you/project", span: 2 },
      { name: "startDate", label: "Start date", type: "month" },
      { name: "endDate", label: "End date", type: "month", disabledBy: "current" },
      { name: "current", label: "Ongoing project", type: "checkbox", span: 2 },
      // `bullets` adds a list button: the description can be a paragraph, bullet points ("- " lines) or both.
      {
        name: "description",
        label: "Description",
        type: "textarea",
        bullets: true,
        span: 2,
        placeholder: "What it does, your contribution and the impact. Write a paragraph, or use the list button for bullet points.",
      },
    ],
  },
  languages: {
    itemLabel: "language",
    addLabel: "Add language",
    emptyTitle: "No languages added",
    emptyText: "Optional. List languages you speak and your level.",
    compact: true,
    fields: [
      { name: "name", label: "Language", placeholder: "Spanish" },
      { name: "proficiency", label: "Level", type: "select", options: LANGUAGE_LEVELS, placeholder: "Level" },
    ],
  },
  achievements: {
    itemLabel: "achievement",
    addLabel: "Add achievement",
    emptyTitle: "No achievements added",
    emptyText: "Optional. Awards, recognitions or standout results.",
    titleField: "title",
    fields: [
      { name: "title", label: "Achievement", placeholder: "Engineering Excellence Award", span: 2 },
      { name: "date", label: "Date", type: "month" },
      { name: "description", label: "Description", type: "textarea", span: 2, placeholder: "What you achieved and why it mattered…" },
    ],
  },
  certifications: {
    itemLabel: "certification",
    addLabel: "Add certification",
    emptyTitle: "No certifications added",
    emptyText: "Optional. Licences and certificates with the issuing organisation.",
    titleField: "name",
    subtitleField: "issuer",
    fields: [
      { name: "name", label: "Certification", placeholder: "AWS Certified Solutions Architect", span: 2 },
      { name: "issuer", label: "Issued by", placeholder: "Amazon Web Services" },
      { name: "date", label: "Date", type: "month" },
      { name: "link", label: "Credential link", type: "url", placeholder: "credly.com/badges/…", span: 2 },
    ],
  },
};
