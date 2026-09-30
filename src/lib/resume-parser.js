import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const PDF_MIME = "application/pdf";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// Browsers don't always report a MIME type for .docx, so fall back to the extension.
export function getResumeFileKind(file) {
  const name = file.name?.toLowerCase() ?? "";
  if (file.type === PDF_MIME || name.endsWith(".pdf")) return "pdf";
  if (file.type === DOCX_MIME || name.endsWith(".docx")) return "docx";
  return null;
}

export async function extractResumeText(buffer, kind) {
  if (kind === "pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }
  if (kind === "docx") {
    const { value } = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
    return value;
  }
  throw new Error(`Unsupported file kind: ${kind}`);
}

// Heading keywords mapped to the section they start.
const SECTION_HEADINGS = {
  summary: ["summary", "profile", "professional summary", "objective", "about me", "career objective"],
  experience: ["experience", "work experience", "professional experience", "employment history", "work history", "employment"],
  education: ["education", "academic background", "qualifications", "academics"],
  skills: ["skills", "technical skills", "core competencies", "key skills", "technologies", "tech stack"],
  projects: ["projects", "personal projects", "key projects"],
  certifications: ["certifications", "certificates", "licenses & certifications", "licenses and certifications"],
  achievements: ["achievements", "awards", "honors", "awards & achievements", "accomplishments"],
  languages: ["languages"],
};

const HEADING_LOOKUP = new Map(
  Object.entries(SECTION_HEADINGS).flatMap(([section, words]) =>
    words.map((word) => [word, section])
  )
);

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL_RE = /((?:https?:\/\/)?(?:www\.)?[\w-]+\.[a-z]{2,}(?:\/[^\s|,]*)?)/gi;
const BULLET_RE = /^[•\-*▪●◦‣·–]\s*/;

function detectHeading(line) {
  const normalized = line.toLowerCase().replace(/[:|]/g, "").trim();
  return HEADING_LOOKUP.get(normalized) ?? null;
}

function extractLinks(text) {
  const links = { linkedin: "", github: "", website: "" };
  for (const match of text.matchAll(URL_RE)) {
    const url = match[1];
    if (EMAIL_RE.test(url) || url.includes("@")) continue;
    if (/linkedin\.com/i.test(url)) links.linkedin ||= url;
    else if (/github\.com/i.test(url)) links.github ||= url;
    else if (/\//.test(url) || /^(https?:\/\/|www\.)/i.test(url)) links.website ||= url;
  }
  return links;
}

function guessName(lines) {
  return (
    lines
      .slice(0, 5)
      .find(
        (line) =>
          !EMAIL_RE.test(line) &&
          !PHONE_RE.test(line) &&
          !detectHeading(line) &&
          /^[\p{L}][\p{L}' .-]+$/u.test(line) &&
          line.split(/\s+/).length <= 5
      ) ?? ""
  );
}

// Groups section lines into entries: a new entry starts on a non-bullet line that follows bullets.
function toEntries(lines) {
  const entries = [];
  let current = null;
  let lastWasBullet = false;

  for (const line of lines) {
    const isBullet = BULLET_RE.test(line);
    if (!current || (!isBullet && lastWasBullet)) {
      current = { heading: [], bullets: [] };
      entries.push(current);
    }
    if (isBullet) current.bullets.push(line.replace(BULLET_RE, ""));
    else if (current.bullets.length) current.bullets[current.bullets.length - 1] += ` ${line}`;
    else current.heading.push(line);
    lastWasBullet = isBullet;
  }

  return entries.map(({ heading, bullets }) => ({
    title: heading[0] ?? "",
    subtitle: heading.slice(1).join(" · "),
    bullets,
  }));
}

function toList(lines) {
  return lines
    .flatMap((line) => line.replace(BULLET_RE, "").split(/[,|•·;]/))
    .map((item) => item.replace(/^[^:]{1,30}:\s*/, "").trim())
    .filter(Boolean);
}

export function parseResumeText(rawText) {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = {};
  const headerLines = [];
  let currentSection = null;

  for (const line of lines) {
    const heading = detectHeading(line);
    if (heading) {
      currentSection = heading;
      sections[currentSection] ??= [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    } else {
      headerLines.push(line);
    }
  }

  const headerText = headerLines.join("\n");

  return {
    personal: {
      fullName: guessName(headerLines),
      email: rawText.match(EMAIL_RE)?.[0] ?? "",
      phone: headerText.match(PHONE_RE)?.[1]?.trim() ?? rawText.match(PHONE_RE)?.[1]?.trim() ?? "",
      ...extractLinks(headerText || rawText),
    },
    summary: (sections.summary ?? []).join(" "),
    experience: toEntries(sections.experience ?? []),
    education: toEntries(sections.education ?? []),
    projects: toEntries(sections.projects ?? []),
    skills: toList(sections.skills ?? []),
    certifications: toList(sections.certifications ?? []),
    achievements: (sections.achievements ?? []).map((line) => line.replace(BULLET_RE, "")),
    languages: toList(sections.languages ?? []),
    rawText,
  };
}
