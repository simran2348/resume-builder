import { nanoid } from "nanoid";

import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_TITLES,
  LANGUAGE_LEVELS,
  LIST_SECTIONS,
} from "@/constants/builder";
import { stripRichText } from "@/lib/rich-text";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_OPTIONS = MONTHS.map((label, i) => ({ value: String(i + 1).padStart(2, "0"), label }));

// Store keys that make up the resume content (used for preview, backups and reset).
export const RESUME_DATA_KEYS = [
  "personal",
  "summary",
  "experience",
  "skills",
  "skillCategories",
  "education",
  "projects",
  "hobbies",
  "languages",
  "achievements",
  "certifications",
  "sectionTitles",
  "sectionOrder",
  "hiddenSections",
];

// Dates are stored as "YYYY-MM" or "YYYY" (year only).
export function formatMonthYear(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

function formatRange(item) {
  return {
    startDate: formatMonthYear(item.startDate),
    endDate: item.current ? "Present" : formatMonthYear(item.endDate),
  };
}

export function newBullet(text = "") {
  return { id: nanoid(8), text };
}

export function newExperience(fields = {}) {
  return {
    id: nanoid(8),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [newBullet()],
    ...fields,
  };
}

// Empty item for a LIST_SECTIONS section (fields default to "" / false).
export function newListItem(section, fields = {}) {
  const defaults = Object.fromEntries(
    LIST_SECTIONS[section].fields.map((f) => [f.name, f.type === "checkbox" ? false : ""])
  );
  return { id: nanoid(8), ...defaults, ...fields };
}

// Skills also carry an optional `categoryId` (see skillCategories).
export function newChip(name, categoryId) {
  return { id: nanoid(8), name, ...(categoryId && { categoryId }) };
}

export function newSkillCategory(name = "") {
  return { id: nanoid(8), name };
}

// Skills in display order plus, when categories are in use, their groups. Skills keep one flat list in the
// store; with categories on, each has a `categoryId` and is listed in category order. List-style templates
// use `skills`, "Grouped skills" templates use `groups`.
export function groupSkills(skills = [], categories = []) {
  if (!categories.length) return { skills: skills.map((s) => s.name), groups: [] };
  const known = new Set(categories.map((c) => c.id));
  const groups = [
    ...categories.map((c) => ({ name: c.name.trim(), items: skills.filter((s) => s.categoryId === c.id) })),
    // Safety net: a skill whose category no longer exists still shows, without a label.
    { name: "", items: skills.filter((s) => !known.has(s.categoryId)) },
  ]
    .map((g) => ({ name: g.name, items: g.items.map((s) => s.name) }))
    .filter((g) => g.items.length);
  return { skills: groups.flatMap((g) => g.items), groups };
}

const hasText = (...values) => values.some((v) => typeof v === "string" && v.trim());

// Converts builder state into the plain shape templates render (formatted dates, strings, visible sections).
export function toTemplateResume(data) {
  const {
    personal,
    summary = "",
    experience = [],
    skills = [],
    skillCategories = [],
    education = [],
    projects = [],
    hobbies = [],
    languages = [],
    achievements = [],
    certifications = [],
    sectionTitles = {},
    sectionOrder = DEFAULT_SECTION_ORDER,
    hiddenSections = [],
  } = data;

  const groupedSkills = groupSkills(skills, skillCategories);

  return {
    personal,
    summary,
    sectionTitles,
    sectionOrder: ["summary", ...sectionOrder.filter((key) => !hiddenSections.includes(key))],
    experience: experience
      .filter((job) => hasText(job.role, job.company) || job.bullets.some((b) => b.text.trim()))
      .map((job) => ({
        role: job.role,
        company: job.company,
        location: job.location,
        ...formatRange(job),
        bullets: job.bullets.map((b) => b.text.trim()).filter(Boolean),
      })),
    skills: groupedSkills.skills,
    skillGroups: groupedSkills.groups,
    hobbies: hobbies.map((h) => h.name),
    education: education
      .filter((e) => hasText(e.degree, e.school))
      .map((e) => ({ ...e, ...formatRange(e) })),
    projects: projects.filter((p) => hasText(p.name, p.description)).map((p) => ({ ...p, ...formatRange(p) })),
    languages: languages
      .filter((l) => hasText(l.name))
      .map((l) => ({
        name: l.name,
        proficiency: l.proficiency,
        level: LANGUAGE_LEVELS.find((lvl) => lvl.value === l.proficiency)?.level,
      })),
    achievements: achievements.filter((a) => hasText(a.title)).map((a) => ({ ...a, date: formatMonthYear(a.date) })),
    certifications: certifications
      .filter((c) => hasText(c.name))
      .map((c) => ({ ...c, date: formatMonthYear(c.date) })),
  };
}

// True when nothing has been entered yet (first visit or after a reset).
export function isResumeEmpty(data) {
  return (
    !Object.values(data.personal).some(Boolean) &&
    !data.summary.trim() &&
    ["experience", "skills", "education", "projects", "hobbies", "languages", "achievements", "certifications"].every(
      (key) => !data[key]?.length
    )
  );
}

// ---------- Mapping from an uploaded resume (best effort) ----------

const MONTH_LOOKUP = Object.fromEntries(MONTHS.map((m, i) => [m.toLowerCase(), String(i + 1).padStart(2, "0")]));
const DATE_PART = String.raw`(?:([A-Za-z]{3,9})\.?\s+)?(\d{4})`;
const RANGE_RE = new RegExp(`${DATE_PART}\\s*(?:–|—|-|to)\\s*(?:${DATE_PART}|(present|current|now))`, "i");

function toStoredDate(monthName, year) {
  if (!year) return "";
  const month = monthName && MONTH_LOOKUP[monthName.slice(0, 3).toLowerCase()];
  return month ? `${year}-${month}` : year;
}

function splitEntry({ title = "", subtitle = "" }) {
  const match = `${title} · ${subtitle}`.match(RANGE_RE);
  const place = subtitle
    .replace(RANGE_RE, "")
    .split(/\s*[·|,]\s*/)
    .find((part) => part.trim());
  return {
    place: place?.trim() ?? "",
    startDate: match ? toStoredDate(match[1], match[2]) : "",
    endDate: match ? toStoredDate(match[3], match[4]) : "",
    current: Boolean(match?.[5]),
  };
}

// Skills from an imported resume. Lines like "Frontend: React, Next.js" become categories.
function importedSkills(parsed) {
  if (!parsed.skillGroups?.length) {
    return { skills: [...new Set(parsed.skills ?? [])].map((name) => newChip(name)), skillCategories: [] };
  }
  const skillCategories = [];
  const skills = [];
  const seen = new Set();
  for (const group of parsed.skillGroups) {
    const category = newSkillCategory(group.name);
    skillCategories.push(category);
    for (const name of group.items) {
      if (seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      skills.push(newChip(name, category.id));
    }
  }
  return { skills, skillCategories };
}

// Converts the parser output (see src/lib/resume-parser.js) into builder items.
export function fromParsedResume(parsed) {
  return {
    experience: (parsed.experience ?? []).map((entry) => {
      const { place, ...dates } = splitEntry(entry);
      return newExperience({
        role: entry.title,
        company: place,
        ...dates,
        bullets: entry.bullets?.length ? entry.bullets.map((b) => newBullet(b)) : [newBullet()],
      });
    }),
    education: (parsed.education ?? []).map((entry) => {
      const { place, ...dates } = splitEntry(entry);
      return newListItem("education", { degree: entry.title, school: place, ...dates, description: entry.bullets?.join("\n") ?? "" });
    }),
    projects: (parsed.projects ?? []).map((entry) =>
      newListItem("projects", { name: entry.title, role: entry.subtitle, description: entry.bullets?.join("\n") ?? "" })
    ),
    ...importedSkills(parsed),
    languages: (parsed.languages ?? []).map((name) => newListItem("languages", { name })),
    certifications: (parsed.certifications ?? []).map((name) => newListItem("certifications", { name })),
    achievements: (parsed.achievements ?? []).map((title) => newListItem("achievements", { title })),
  };
}

// ---------- Backup files ----------

const BACKUP_APP = "linkfolio-resume";

export function createBackup(state) {
  const data = { templateId: state.templateId, theme: state.theme };
  for (const key of RESUME_DATA_KEYS) data[key] = state[key];
  return { app: BACKUP_APP, version: 1, savedAt: new Date().toISOString(), data };
}

// Returns the backup's data, or throws with a user-facing message.
export function parseBackup(text) {
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("That file isn't a valid resume backup.");
  }
  if (json?.app !== BACKUP_APP || typeof json.data !== "object" || !json.data?.personal) {
    throw new Error("That file isn't a resume backup from this app.");
  }
  return json;
}

// ---------- Plain text (for pasting into job portals) ----------

export function toPlainText(resume) {
  const { personal } = resume;
  const titleFor = (key) => resume.sectionTitles[key]?.trim() || DEFAULT_SECTION_TITLES[key];
  const lines = [personal.fullName, personal.jobTitle].filter(Boolean);
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.website]
    .filter(Boolean)
    .join(" | ");
  if (contact) lines.push(contact);

  const range = (item) => [item.startDate, item.endDate].filter(Boolean).join(" – ");
  const renderers = {
    summary: () => (resume.summary ? [resume.summary] : []),
    experience: () =>
      resume.experience.flatMap((job) => [
        [job.role, job.company].filter(Boolean).join(", ") + (range(job) ? ` (${range(job)})` : ""),
        ...job.bullets.map((b) => `• ${b}`),
      ]),
    skills: () =>
      resume.skillGroups?.length
        ? resume.skillGroups.map((g) => (g.name ? `${g.name}: ` : "") + g.items.join(", "))
        : resume.skills.length
          ? [resume.skills.join(", ")]
          : [],
    education: () =>
      resume.education.flatMap((e) => [
        [e.degree, e.school].filter(Boolean).join(", ") + (range(e) ? ` (${range(e)})` : ""),
        ...(e.grade ? [e.grade] : []),
        ...(e.description ? [e.description] : []),
      ]),
    projects: () =>
      resume.projects.flatMap((p) => [
        [p.name, p.role].filter(Boolean).join(" – ") + (range(p) ? ` (${range(p)})` : ""),
        ...(p.link ? [p.link] : []),
        ...(p.description ? [p.description] : []),
      ]),
    hobbies: () => (resume.hobbies.length ? [resume.hobbies.join(", ")] : []),
    languages: () => resume.languages.map((l) => [l.name, l.proficiency].filter(Boolean).join(": ")),
    achievements: () => resume.achievements.map((a) => [a.title, a.date, a.description].filter(Boolean).join(" – ")),
    certifications: () => resume.certifications.map((c) => [c.name, c.issuer, c.date].filter(Boolean).join(", ")),
  };

  for (const key of resume.sectionOrder) {
    const body = renderers[key]?.() ?? [];
    if (body.length) lines.push("", titleFor(key).toUpperCase(), ...body);
  }
  return stripRichText(lines.join("\n"));
}
