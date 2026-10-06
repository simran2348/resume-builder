// Content for the home page. Edit the values below and the UI updates automatically.
// Add, remove or reorder entries freely — each item renders as its own card / accordion row.
// Keep claims in line with what the app actually does (see comments next to each section).

import {
  ArrowDownUp,
  ClipboardCopy,
  Eye,
  FileDown,
  FileUp,
  HardDrive,
  LayoutTemplate,
  Paintbrush,
  ScanText,
} from "lucide-react";

import { SITE } from "@/constants/site";

export const HERO_CONTENT = {
  badge: "Free · No account needed",
  title: "Build a resume that gets read.",
  subtitle: "Create a clean, professional, ATS-friendly resume for free.",
  uploadTitle: "Upload existing resume",
  uploadHint: "We read your details so you can keep editing instead of starting over.",
  createButtonLabel: "Create new resume",
  // Upload parsing runs on this site's own server route and the file isn't stored (src/app/api/resume/parse).
  privacyNote: "Your file is only used to read your details. It isn't stored.",
};

export const UPLOAD_CONFIG = {
  maxSizeMB: 10,
  // Extensions and MIME types accepted by the upload box.
  acceptedExtensions: [".pdf", ".docx"],
  acceptedMimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// ---------- About / product explanation ----------

export const ABOUT_SECTION = {
  title: "The free resume builder that gets past ATS software",
  intro: [
    "Most job applications are read by software before they're ever read by a human. Applicant Tracking Systems (ATS) scan your resume first, and only then does it reach a recruiter's desk.",
    `${SITE.name} is built around that reality. Instead of chasing colored sidebars, icon-heavy layouts or multi-column graphics, its recommended templates focus on what parsing software and recruiters both read easily.`,
  ],
  principlesTitle: "Built around",
  principles: [
    "Clean single-column formatting",
    "Standard section headings",
    "Predictable document structure",
    "ATS-friendly typography",
    "Structured resume data",
    "Easy editing",
    "Professional PDF output",
  ],
  promise: "Clean, readable, professional — and easy for both humans and ATS software to understand.",
  workflowTitle: "The complete workflow, in one place",
  workflowIntro: "You see the formatted resume update while you edit, so there's no guessing what the final page looks like.",
  // Mirrors the builder steps and features.
  workflow: [
    "Personal details",
    "Work experience",
    "Education",
    "Skills",
    "Projects",
    "Section reordering",
    "Template selection",
    "Live preview",
    "PDF export",
  ],
};

// ---------- Why ATS-friendly formatting matters ----------

export const ATS_SECTION = {
  title: "Why an ATS-friendly resume builder matters",
  intro:
    "Applicant Tracking Systems turn your resume into structured data so employers can search and filter candidates. When the layout is hard to read, important details can be missed or scrambled.",
  scansTitle: "What ATS software looks for",
  scans: ["Keywords from the job description", "Dates and durations", "Section headings", "Resume structure", "Relevant experience"],
  risksTitle: "What can make parsing harder",
  risks: ["Multi-column layouts", "Tables and text boxes", "Graphics and icons", "Image-based headers"],
  callout: "A resume should look good without sacrificing machine readability.",
  approachTitle: `How ${SITE.name}'s recommended templates are designed`,
  approach: ["Single-column layouts", "Standard section headings", "Standard, widely available fonts", "A predictable reading order"],
  // Some templates are two-column / photo designs (Sidebar, Split, Profile, ...), so be upfront about it.
  note: "Designed to be broadly ATS-friendly. Prefer a photo or a two-column design? Those are available too, clearly labelled, so you can choose with your eyes open.",
};

// ---------- Features ----------

export const DETAILS_SECTION = {
  title: "Everything you need in a free resume builder",
  subtitle: "Every feature below is available today, for free, without an account.",
};

// Each detail needs a `title` and an `info`; `icon` is optional.
export const APP_DETAILS = [
  {
    icon: Eye,
    title: "Live preview",
    info: "Edit your resume and see the formatted result update as you type, page breaks included.",
  },
  {
    icon: ArrowDownUp,
    title: "Drag-and-drop section reordering",
    info: "Move sections such as Experience, Education, Skills and Projects into the order that suits the role.",
  },
  {
    icon: LayoutTemplate,
    title: "11 templates to choose from",
    info: "Classic, Centered, Elegant, Minimal, Timeline and more. Filter by photo or columns, and switch at any time without losing your content.",
  },
  {
    icon: FileDown,
    title: "Free PDF download",
    info: "Save a clean, print-ready PDF from your browser's print dialog. No watermark, real selectable text and clickable links.",
  },
  {
    icon: FileUp,
    title: "Upload and import",
    info: "Upload an existing PDF or Word (.docx) resume and your details are pulled into editable fields. Review them, then keep going.",
  },
  {
    icon: ScanText,
    title: "Example content",
    info: "Every template shows a complete example resume, so you can see how it looks before you type a word.",
  },
  {
    icon: HardDrive,
    title: "Autosave in your browser",
    info: "Your work is saved locally in your browser so you can continue editing without creating an account. Download a backup file whenever you like.",
  },
  {
    icon: Paintbrush,
    title: "Make it yours",
    info: "Adjust fonts, sizes, colours, spacing and dividers, and see every change on the page immediately.",
  },
  {
    icon: ClipboardCopy,
    title: "Copy as plain text",
    info: "Copy or download a plain-text version for job portals that ask you to paste your resume.",
  },
];

// ---------- Comparison ----------

export const COMPARISON_SECTION = {
  title: "A simpler alternative to traditional resume builders",
  intro:
    "Popular builders such as Indeed Resume Builder, LinkedIn's resume tools and Zety are often tied to an account, a job platform or a paid plan. They can be great tools, but sometimes you just want to make a good resume and download it.",
  pointsTitle: `What you get with ${SITE.name}`,
  points: [
    { title: "No account required", info: "Open the builder and start. There's no sign-up step." },
    { title: "No email required", info: "We never ask for your email address to build or download a resume." },
    { title: "Free PDF download", info: "Downloading is free, with no watermark and no paywall at the last step." },
    { title: "Start from what you have", info: "Upload an existing resume and continue editing instead of retyping everything." },
    { title: "Privacy-focused", info: "Your resume is saved in your browser, not on our servers." },
  ],
};

// ---------- FAQ ----------

export const FAQ_SECTION = {
  title: "Frequently asked questions",
  subtitle: "Can't find what you're looking for? Get in touch through our Contact page.",
};

// Each FAQ needs a `question` and an `answer`. An answer can be a string, or an array of
// paragraphs where an item can also be `{ list: [...] }` for a bulleted list.
export const FAQS = [
  {
    question: "How do I use a resume builder for free?",
    answer: [
      `Open ${SITE.name}, choose a template and fill in your personal details, summary, experience, skills and education, plus optional sections like projects. Or upload an existing PDF or Word resume to prefill those sections automatically.`,
      "Reorder sections if you need to, check the live preview, then download the PDF. The whole workflow is free and doesn't require an account or payment.",
    ],
  },
  {
    question: "What should you put on a resume?",
    answer:
      "At minimum, include your contact information, a professional summary, work experience, education and relevant skills. Projects can also be useful, especially early in your career or when changing fields. Keep the formatting simple and ATS-friendly.",
  },
  {
    question: "What skills should you put on a resume, and how do you list them?",
    answer:
      "List skills that are relevant to the job description, using the same terminology employers use where it's accurate. Include technical or role-specific skills and genuinely relevant soft skills. Keep the list concise and leave out anything you couldn't confidently discuss in an interview.",
  },
  {
    question: "What is the best layout for a resume?",
    answer: [
      "For most applications, especially those screened by ATS software, a single-column layout with standard section headings is a safe approach. Avoid unnecessary tables, text boxes, graphics and icons that may interfere with parsing.",
      `${SITE.name}'s recommended templates follow this single-column approach. Two-column and photo designs are also available and clearly labelled if you prefer them.`,
    ],
  },
  {
    question: "What is the difference between a CV and a resume?",
    answer: [
      "A resume is usually a concise summary of your most relevant experience, tailored to a specific job and often one or two pages long. A CV (curriculum vitae) is typically more comprehensive and is common in academic, research and medical contexts.",
      "Terminology varies by country: in the UK and much of Europe, \"CV\" is often used for what Americans call a resume.",
    ],
  },
  {
    question: "Should I make a different resume for every job application?",
    answer: [
      "Tailoring your resume for each role is recommended. Small changes can make it far more relevant, for example:",
      { list: ["Your professional summary", "The skills you highlight", "Which experience you emphasise", "The order of your sections", "Your achievement bullets"] },
    ],
  },
  {
    question: `Do I need to create an account to use ${SITE.name}?`,
    answer: `No. You can use ${SITE.name} without creating an account, providing an email address or setting a password.`,
  },
  {
    question: "Does this website sell my data to third parties?",
    answer: [
      `No. ${SITE.name} does not sell your resume data. Editing, previewing and creating your PDF all happen in your browser.`,
      "The one exception is importing: if you upload an existing resume, the file is sent to our server only so its text can be read. It isn't stored or shared, and the extracted details are sent straight back to your browser.",
    ],
  },
  {
    question: "Is my resume data stored securely, and where?",
    answer: [
      `Your resume is stored locally in your browser on your device (in its local storage). It isn't stored on a ${SITE.name} server. That also means:`,
      {
        list: [
          "It doesn't automatically sync across devices or browsers.",
          "Clearing your browser or site data removes it.",
          "Anyone with access to your browser profile can see it.",
        ],
      },
      "Download your PDF, and use \"Save backup\" on the Preview & download step to keep a copy you can restore later.",
    ],
  },
  {
    question: "How do I create a resume from LinkedIn?",
    answer: [
      `${SITE.name} doesn't connect to LinkedIn directly. Instead, open your LinkedIn profile, use its "Save to PDF" option, and upload that PDF here.`,
      "Importing is best-effort, so review the imported details before you download your resume.",
    ],
  },
  {
    question: `Does ${SITE.name} use AI?`,
    answer: `No. ${SITE.name} focuses on structure, formatting and ATS-friendly resume creation. Importing uses rule-based text parsing, not AI, and the content remains yours.`,
  },
];

export const FOOTER_CONTENT = {
  brand: SITE.name,
  tagline: SITE.tagline,
  links: [
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms & conditions", href: "/terms" },
  ],
};
