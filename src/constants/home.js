// Content for the home page. Edit the values below and the UI updates automatically.
// Add, remove or reorder entries freely — each item renders as its own card / accordion row.

export const HERO_CONTENT = {
  badge: "ATS-friendly resume builder",
  title: "Build a resume that gets past the bots.",
  subtitle:
    "Upload your existing resume and we'll pull out your details, or start from scratch with a clean, recruiter-approved template.",
  createButtonLabel: "Create new resume",
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

export const DETAILS_SECTION = {
  title: "Why build with us?",
  subtitle: "Everything you need to land more interviews.",
};

// Each detail needs a `title` and an `info`.
export const APP_DETAILS = [
  {
    title: "Detail title",
    info: "Detail info goes here. Replace this with a description of your feature.",
  },
  {
    title: "Detail title",
    info: "Detail info goes here. Replace this with a description of your feature.",
  },
  {
    title: "Detail title",
    info: "Detail info goes here. Replace this with a description of your feature.",
  },
];

export const FAQ_SECTION = {
  title: "Frequently asked questions",
  subtitle: "Can't find what you're looking for? Reach out to us.",
};

// Each FAQ needs a `question` and an `answer`.
export const FAQS = [
  {
    question: "Question goes here?",
    answer: "Answer goes here. Replace this with the answer to your question.",
  },
  {
    question: "Question goes here?",
    answer: "Answer goes here. Replace this with the answer to your question.",
  },
];

export const FOOTER_CONTENT = {
  brand: "Linkfolio",
  tagline: "ATS-friendly resumes, built in minutes.",
  links: [
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms & conditions", href: "/terms" },
  ],
};
