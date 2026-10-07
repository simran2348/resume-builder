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

import { NAV_LINKS, SITE } from "@/constants/site";

export const HERO_CONTENT = {
  title: "Build a Resume That Gets Read",
  subtitle: `Create a clean, professional, ATS-friendly resume for free. Upload an existing resume or start from scratch with ${SITE.name}.`,
  uploadButtonLabel: "Upload Existing Resume",
  createButtonLabel: "Create New Resume",
  // Upload parsing runs on this site's own server route and the file isn't stored (src/app/api/resume/parse).
  privacyNote: "Your file is only read to fill in your details. It isn't stored.",
  benefits: ["Free to use", "No account required", "Privacy-focused"],
  // Floating card beside the preview. Only formats the upload actually accepts (UPLOAD_CONFIG).
  importCard: { title: "Import your resume", info: "From PDF or DOCX" },
};

export const UPLOAD_CONFIG = {
  maxSizeMB: 10,
  // Extensions and MIME types accepted by the upload box.
  acceptedExtensions: [".pdf", ".docx"],
  acceptedMimeTypes: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

// ---------- Why Rireki ----------

export const ABOUT_SECTION = {
  eyebrow: `Why ${SITE.name}`,
  title: "The Free Resume Builder That Gets Past ATS Software",
  intro: [
    `Most job applications are read by software before humans. ${SITE.name} focuses on clean, predictable resume formatting that is easier for Applicant Tracking Systems to parse.`,
    "Instead of chasing icon-heavy layouts and decorative graphics, the recommended templates put your experience in a structure that both parsing software and recruiters read easily.",
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
  annotation: "Clean. Readable. Professional.",
};

// ---------- Why ATS-friendly formatting matters ----------

export const ATS_SECTION = {
  eyebrow: "ATS basics",
  title: "Why ATS-Friendly Formatting Matters",
  intro:
    "Applicant Tracking Systems turn your resume into structured data so employers can search and filter candidates. When the layout is hard to read, important details can be missed or scrambled.",
  scansTitle: "ATS software commonly scans",
  scans: ["Keywords", "Dates", "Section headings", "Skills", "Work experience", "Education"],
  risksTitle: "Formatting that can be harder to parse",
  risks: ["Multi-column layouts", "Tables", "Text boxes", "Image-based headers", "Decorative graphics"],
  // Some templates are two-column / photo designs (Sidebar, Split, Profile, ...), so be upfront about it.
  note: `${SITE.name}'s recommended templates are single-column with standard headings. Prefer a photo or a two-column design? Those are available too, clearly labelled, so you can choose knowingly.`,
};

// ---------- Features ----------

export const DETAILS_SECTION = {
  eyebrow: "Features",
  title: "Everything You Need in a Free Resume Builder",
  subtitle: "Build, edit, import, reorder, preview, and download your resume without unnecessary barriers.",
};

// Each detail needs a `title` and an `info`; `icon` is optional.
export const APP_DETAILS = [
  {
    icon: Eye,
    title: "Live Preview",
    info: "See your resume update while you edit it, page breaks included.",
  },
  {
    icon: ArrowDownUp,
    title: "Drag-and-Drop Section Reordering",
    info: "Rearrange sections such as Experience, Education, Skills and Projects to control the structure of your resume.",
  },
  {
    icon: LayoutTemplate,
    title: "A Growing Template Library",
    info: "Start with designs like Classic, Elegant, Minimal and Timeline, with more on the way. Filter by photo or columns, and switch any time without losing your content.",
  },
  {
    icon: FileDown,
    title: "Free PDF Download",
    info: "Save your finished resume as a PDF from your browser's print dialog. No watermark, selectable text and clickable links.",
  },
  {
    icon: FileUp,
    title: "Upload and Import",
    info: "Import an existing PDF or Word (.docx) resume instead of retyping it. Review the imported details, then keep editing.",
  },
  {
    icon: ScanText,
    title: "Example Content",
    info: "Every template shows a complete example resume, so you can see how it looks before you type a word.",
  },
  {
    icon: HardDrive,
    title: "Autosave in Your Browser",
    info: "Your work is saved in your browser's local storage as you go. Download a backup file whenever you like.",
  },
  {
    icon: Paintbrush,
    title: "Make It Yours",
    info: "Adjust fonts, sizes, colours, spacing and dividers, and see every change on the page immediately.",
  },
  {
    icon: ClipboardCopy,
    title: "Copy as Plain Text",
    info: "Copy or download a plain-text version for job portals that ask you to paste your resume.",
  },
];

// ---------- How it works ----------

export const WORKFLOW_SECTION = {
  eyebrow: "How it works",
  title: "From Blank Page to PDF in Five Steps",
  steps: [
    { title: "Start", info: "Upload an existing resume or create a new one." },
    { title: "Edit", info: "Enter your personal details, experience, education, skills, and projects." },
    { title: "Customize", info: "Reorder sections and choose an ATS-friendly template." },
    { title: "Preview", info: "See the final resume update live as you type." },
    { title: "Download", info: "Export the finished resume as a PDF." },
  ],
};

// ---------- Comparison ----------

// Kept generic and restrained on purpose: no named competitors, and "often / sometimes / varies" for others.
export const COMPARISON_SECTION = {
  eyebrow: "Compare",
  title: "A Simpler Way to Build Your Resume",
  intro:
    "Many resume builders are great tools, but they are often tied to an account, a job platform or a paid plan. Sometimes you just want to make a good resume and download it.",
  columns: [SITE.name, "Traditional resume builders"],
  // `value`: true = yes, false = no; `other`: a short text answer.
  rows: [
    { label: "Account required", value: false, other: "Often" },
    { label: "Email required", value: false, other: "Often" },
    { label: "Premium tier blocking download", value: false, other: "Sometimes" },
    { label: "Import existing resume", value: true, other: "Varies" },
    { label: "ATS-friendly templates", value: true, other: "Varies" },
    { label: "Live preview", value: true, other: "Yes" },
  ],
};

// ---------- FAQ ----------

export const FAQ_SECTION = {
  eyebrow: "FAQ",
  title: "Frequently Asked Questions",
  subtitle: "Straight answers about how the builder works, what it stores and what it doesn't.",
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
      'Terminology varies by country: in the UK and much of Europe, "CV" is often used for what Americans call a resume.',
    ],
  },
  {
    question: "Should I make a different resume for every job application?",
    answer: [
      "Tailoring your resume for each role is recommended. Small changes can make it far more relevant, for example:",
      {
        list: [
          "Your professional summary",
          "The skills you highlight",
          "Which experience you emphasise",
          "The order of your sections",
          "Your achievement bullets",
        ],
      },
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
      "If you upload an existing resume, the file is sent to our server only so its text can be read. It isn't stored or shared, and the extracted details are sent straight back to your browser.",
      "If you use the contact form, your name, email and message are emailed to us through our email provider so we can reply.",
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
      'Download your PDF, and use "Save backup" on the Preview & download step to keep a copy you can restore later.',
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

// ---------- Final call to action ----------

export const CTA_SECTION = {
  title: "Ready to Build Your Resume?",
  subtitle: "Create a clean, professional resume without unnecessary sign-ups, paywalls, or complexity.",
};

export const FOOTER_CONTENT = {
  brand: SITE.name,
  tagline: "A free resume builder focused on clean, professional, ATS-friendly resumes.",
  // "Upload Resume" points at the hero, where the upload button lives.
  groups: [
    {
      title: "Product",
      links: [
        { label: "Create Resume", href: "/templates" },
        { label: "Upload Resume", href: "/#get-started" },
      ],
    },
    { title: "Information", links: NAV_LINKS },
  ],
};
