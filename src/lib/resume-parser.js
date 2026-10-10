import mammoth from "mammoth";
import { getDocumentProxy } from "unpdf";

// Reads an uploaded resume (PDF or .docx) and pulls out its details with plain rules (no AI). Best effort:
// the user always reviews the result in the builder.
//
// 1. extractResumeDocument() turns the file into lines. PDF lines keep their position on the page, which is
//    how wrapped lines, bullet indents and right-aligned dates are told apart; Word lines know whether they
//    were list items.
// 2. parseResumeDocument() splits the lines into sections by their headings and reads each section.

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const PDF_MIME = "application/pdf";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// Browsers don't always report a MIME type for .docx, so fall back to the extension.
export function getResumeFileKind(file) {
  const name = file.name?.toLowerCase() ?? "";
  if (file.type === PDF_MIME || name.endsWith(".pdf")) return "pdf";
  if (file.type === DOCX_MIME || name.endsWith(".docx")) return "docx";
  return null;
}

// ---------- Step 1: file → lines ----------

// Letter-spaced text ("S U M M A R Y"), as produced by wide letter-spacing in headings and names.
const SPACED_RE = /^(?:\S ){2,}\S$/;
// Marks a wide horizontal gap inside a line (e.g. between a job title and its right-aligned date).
const GAP = "\t";
const BULLET_RE = /^[•\-*▪●◦‣·–○■□➢➤✓✔]\s+/;
// A line that is only bullet glyphs (some PDFs draw the markers separately from their text).
const ONLY_MARKERS_RE = /^[•\-*▪●◦‣·–○■□➢➤✓✔\s]+$/;

// Lines of a PDF, in reading order: { text, page, x, y, right, marker, full }.
// `full` means the text runs to the right edge of its column, i.e. the line was wrapped.
async function extractPdfLines(buffer) {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const lines = [];
  const links = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const { items } = await page.getTextContent();
    const pageLines = [];
    let current = null;

    const flush = () => {
      if (current && current.text.trim() && !ONLY_MARKERS_RE.test(current.text)) {
        const text = current.text
          .split(GAP)
          .map((part) => part.replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .join(GAP);
        pageLines.push({ text, page: pageNumber, x: current.x, y: current.y, right: current.right });
      }
      current = null;
    };

    for (const item of items) {
      const isBlank = !item.str.trim();
      if (!isBlank) {
        const x = item.transform[4];
        current ??= { text: "", x, y: item.transform[5], right: x };
        current.text += SPACED_RE.test(item.str) ? item.str.replace(/ /g, "") : item.str;
        current.right = Math.max(current.right, x + item.width);
      } else if (current && item.str) {
        // Whitespace between words; a much wider one separates columns of the same line.
        const height = item.height || Math.abs(item.transform[3]) || 10;
        current.text += item.width > height * 1.5 ? GAP : " ";
      }
      if (item.hasEOL) flush();
    }
    flush();

    // A line is "full" when it reaches the right edge of the lines around its own column.
    for (const line of pageLines) {
      const columnRight = Math.max(...pageLines.filter((l) => Math.abs(l.x - line.x) < 40).map((l) => l.right));
      line.full = !line.text.includes(GAP) && line.right - line.x >= (columnRight - line.x) * 0.8;
      line.marker = BULLET_RE.test(line.text);
    }
    lines.push(...pageLines);

    // Link targets (the real URL behind "linkedin/jane" or an icon-only link).
    for (const annotation of await page.getAnnotations()) {
      if (annotation.subtype === "Link" && annotation.url) {
        links.push({ url: annotation.url, page: pageNumber, y: annotation.rect?.[1] ?? 0 });
      }
    }
  }
  return { lines, links };
}

const HTML_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };

function htmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#39|amp|lt|gt|quot|apos|nbsp);/g, (_, name) => HTML_ENTITIES[name]);
}

// Lines of a Word document: { text, marker } where `marker` is true for list items (Word's own bullets
// aren't part of the text, so the document is read as HTML to keep them).
async function extractDocxLines(buffer) {
  const { value: html } = await mammoth.convertToHtml({ buffer: Buffer.from(buffer) });
  const lines = [];
  const links = [];
  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) links.push({ url: htmlToText(match[1]) });
  for (const match of html.matchAll(/<(p|li|h[1-6]|td|th)\b[^>]*>([\s\S]*?)(?=<\/?(?:p|li|ul|ol|h[1-6]|td|th|tr|table)\b)/gi)) {
    for (const text of htmlToText(match[2]).split("\n")) {
      const clean = text.replace(/\s+/g, " ").trim();
      if (clean && !ONLY_MARKERS_RE.test(clean)) lines.push({ text: clean, marker: match[1].toLowerCase() === "li" || BULLET_RE.test(clean) });
    }
  }
  return { lines, links };
}

export async function extractResumeDocument(buffer, kind) {
  if (kind === "pdf") return extractPdfLines(buffer);
  if (kind === "docx") return extractDocxLines(buffer);
  throw new Error(`Unsupported file kind: ${kind}`);
}

// ---------- Step 2: lines → resume ----------

// Heading keywords mapped to the section they start.
const SECTION_HEADINGS = {
  summary: ["summary", "profile", "professional summary", "career summary", "objective", "about me", "about", "career objective", "professional profile"],
  experience: ["experience", "work experience", "professional experience", "employment history", "work history", "employment", "career history", "relevant experience"],
  education: ["education", "academic background", "qualifications", "academics", "education and training", "academic qualifications"],
  skills: ["skills", "technical skills", "core skills", "core competencies", "key skills", "technologies", "tech stack", "skills and tools", "professional skills", "areas of expertise"],
  projects: ["projects", "personal projects", "key projects", "side projects", "academic projects"],
  certifications: ["certifications", "certificates", "licenses and certifications", "courses", "courses and certifications", "training"],
  achievements: ["achievements", "awards", "honors", "honours", "awards and achievements", "accomplishments", "awards and honors"],
  languages: ["languages", "languages known"],
  hobbies: ["hobbies", "interests", "hobbies and interests"],
};

const HEADING_LOOKUP = new Map(
  Object.entries(SECTION_HEADINGS).flatMap(([section, words]) =>
    // Also keyed without spaces, for letter-spaced headings whose word breaks were lost.
    words.flatMap((word) => [
      [word, section],
      [word.replace(/ /g, ""), section],
    ])
  )
);

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL_RE = /((?:https?:\/\/)?(?:www\.)?[\w-]+\.[a-z]{2,}(?:\/[^\s|,]*)?)/gi;
const LOCATION_RE = /^[\p{L}][\p{L} .'-]*,\s*[\p{L}][\p{L} .'-]*$/u;
const GRADE_RE = /\d+(?:\.\d+)?\s*%|\b(?:c?gpa|grade|percentage|first class|distinction)\b|\d(?:\.\d+)?\s*\/\s*\d/i;

const DATE_PART = String.raw`(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?,?\s+|\d{1,2}\/)?(?:19|20)\d{2}`;
// "Apr 2022 – Present", "2019 - 2023", "Jan 2020 to Mar 2021"
const RANGE_RE = new RegExp(`(?:${DATE_PART})\\s*(?:–|—|-|to|until)\\s*(?:${DATE_PART}|present|current|now|ongoing|till date|today)`, "i");
// A single date at the end of a line: "… 2022", "… Mar 2023"
const TRAILING_DATE_RE = new RegExp(`(?:${DATE_PART})$`, "i");
const ONLY_DATE_RE = new RegExp(`^(?:${DATE_PART})$`, "i");

const plain = (text) => text.replaceAll(GAP, " ");

function detectHeading(text) {
  const normalized = plain(text)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized || normalized.length > 40) return null;
  return HEADING_LOOKUP.get(normalized) ?? HEADING_LOOKUP.get(normalized.replace(/ /g, "")) ?? null;
}

// "SIMRANJIT SINGH" → "Simranjit Singh"; mixed-case text is left alone.
function fixCase(text) {
  if (text !== text.toUpperCase() || !/\p{L}/u.test(text)) return text;
  return text.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase());
}

// Words that commonly start a hyphenated compound ("high-impact", "cross-browser"). When a line ends in
// "word-" these keep their hyphen; anything else ("environ-" + "ments") is treated as a word split in two.
const COMPOUND_STARTS = new Set(
  "high low well cross real full part long short self user client server data end front back open multi non co pre post cost time large small fast hands state single first second third top best in on off up built mid hard soft test event object team cloud micro ai api day week month year one two three four five on-site e re de anti semi cutting hands".split(" ")
);
// Lower-cased words of the document being parsed, used to resolve line-end hyphens (set per parse).
let documentWords = new Set();

// "high-" + "impact" → "high-impact"; "environ-" + "ments" → "environments".
function joinHyphenated(before, after) {
  const head = before.match(/([\p{L}]+)-$/u)?.[1].toLowerCase() ?? "";
  const tail = after.match(/^[\p{L}]+/u)?.[0].toLowerCase() ?? "";
  const keepHyphen = !documentWords.has(head + tail) && (documentWords.has(`${head}-${tail}`) || COMPOUND_STARTS.has(head));
  return keepHyphen ? before + after : before.slice(0, -1) + after;
}

// Joins lines that are one wrapped paragraph or bullet. With positions (PDF), a line continues the previous
// one when that one ran to the edge of its column; `sameBlock` adds the caller's own conditions.
function joinWrapped(lines, sameBlock = () => true) {
  const merged = [];
  for (const line of lines) {
    const prev = merged[merged.length - 1];
    const endsSentence = prev && /[.!?:]$/.test(prev.text) && /^[\p{Lu}\d]/u.test(line.text);
    if (prev?.full && !line.marker && !endsSentence && sameBlock(prev, line)) {
      const hyphenated = /\p{L}-$/u.test(prev.text) && /^\p{Ll}/u.test(line.text);
      prev.text = hyphenated ? joinHyphenated(prev.text, line.text) : `${prev.text} ${line.text}`;
      prev.full = line.full;
    } else {
      merged.push({ ...line });
    }
  }
  return merged;
}

const paragraph = (lines) => joinWrapped(lines).map((line) => plain(line.text)).join(" ");

// Removes a date range (or a single trailing date) from a line. Returns [textWithoutDate, date].
function takeDate(text) {
  // A date sitting alone in its own column or between separators ("Degree   2019   64%", "School • 2019 • 64%").
  const columns = text.split(/\t|\s+[·|•]\s+/);
  const column = columns.find((part) => ONLY_DATE_RE.test(part.trim()));
  if (column && !RANGE_RE.test(text)) {
    return [columns.filter((part) => part !== column).join(GAP), column.trim()];
  }
  const match = text.match(RANGE_RE) ?? text.match(TRAILING_DATE_RE);
  if (!match) return [text, ""];
  const rest = (text.slice(0, match.index) + GAP + text.slice(match.index + match[0].length))
    .replace(/\(\s*\)/g, "")
    .replace(/[\s\t·|,•–—-]+$/, "")
    .replace(/^[\s\t·|,•–—-]+/, "");
  return [rest, match[0].trim()];
}

// "Engineer · Acme | Pune, India" → ["Engineer", "Acme", "Pune, India"]
const splitParts = (text) =>
  text
    .split(/\t|\s+[·|•]\s+|\s+[–—-]\s+|\s+@\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

// Groups a section's lines into entries (jobs, degrees, projects):
//   { title, org, location, grade, link, dates, bullets: [], text: [] }
// A bullet is a line with a bullet character, a Word list item, or (PDF) a line indented past the section's
// left edge. A new entry starts at a title line that follows bullets, or at a second line carrying dates;
// lines sitting between two dates are shared out by where the first entry kept its date (title line or later).
function toEntries(sectionLines) {
  const hasPositions = sectionLines.some((line) => line.x !== undefined);
  const left = hasPositions ? Math.min(...sectionLines.map((line) => line.x)) : 0;
  const isIndented = (line) => hasPositions && line.x > left + 3;
  // Wrapped lines stay within a title block or within a bullet; a title never swallows the bullet below it.
  const lines = joinWrapped(
    sectionLines.map((line) => ({ ...line, indented: isIndented(line) })),
    (prev, line) => prev.marker || prev.indented === line.indented
  );

  const entries = [];
  let current = null;
  // How many title lines come before the date line in this section's entries (learnt from the first one).
  let linesBeforeDate = null;
  const start = () => {
    // `sinceDate`: title lines added after this entry's date line.
    current = { heading: [], dates: "", bullets: [], text: [], sinceDate: 0 };
    entries.push(current);
  };

  for (const line of lines) {
    const isBullet = line.marker || line.indented;
    if (isBullet) {
      if (!current) start();
      current.bullets.push(plain(line.text).replace(BULLET_RE, ""));
      continue;
    }

    const [rest, date] = takeDate(line.text);
    // A long sentence under the title (no bullet) is description text, not part of the title.
    const isProse = current?.heading.length > 0 && !date && plain(line.text).length > 90;
    if (isProse && !current.bullets.length) {
      current.text.push(plain(line.text));
      continue;
    }

    if (!current || current.bullets.length || current.text.length || (date && current.dates)) {
      // A second dated line without bullets in between: the title lines just above it (as many as the
      // first entry had above its date) belong to the new entry, not the previous one.
      const carry = current && date && current.dates ? Math.min(linesBeforeDate ?? 0, current.sinceDate) : 0;
      const carried = carry ? current.heading.splice(-carry) : [];
      start();
      current.heading.push(...carried);
    }
    if (date && !current.dates) {
      current.dates = date;
      linesBeforeDate ??= current.heading.length;
    } else if (current.dates && rest) {
      current.sinceDate++;
    }
    if (rest) current.heading.push(rest);
  }

  return entries
    .map(({ heading, dates, bullets, text }) => {
      const parts = heading.flatMap(splitParts);
      const [title = "", ...rest] = parts;
      const link = rest.find((part) => /^(?:https?:\/\/|www\.)|^[\w-]+(?:\.[\w-]+)+\/\S*$/i.test(part)) ?? "";
      const grade = rest.find((part) => part !== link && GRADE_RE.test(part)) ?? "";
      let location = rest.find((part) => part !== grade && part !== link && (LOCATION_RE.test(part) || /^remote$/i.test(part))) ?? "";
      let org = rest.find((part) => part !== grade && part !== location && part !== link) ?? "";
      let name = title;
      if (!org && name.includes(", ")) {
        // "Senior Analyst, Accenture": the organisation follows the last comma.
        org = name.slice(name.lastIndexOf(", ") + 2).trim();
        name = name.slice(0, name.lastIndexOf(", ")).trim();
      } else if (!org && location.includes(",")) {
        // "Acme, Pune" on its own: the first part is the organisation.
        org = location.slice(0, location.indexOf(",")).trim();
        location = location.slice(location.indexOf(",") + 1).trim();
      }
      return { title: name, org, location, grade, link, dates, bullets, text };
    })
    .filter((entry) => entry.title || entry.bullets.length || entry.text.length);
}

function toList(lines) {
  return lines
    .flatMap((line) => plain(line.text).replace(BULLET_RE, "").split(/[,|•·;]/))
    .map((item) => item.trim())
    .filter(Boolean);
}

// Skills written as "Frontend: React, Next.js" lines become groups. Returns [] when no line has a label.
// Unlabelled lines in a labelled section go into an "Other" group.
const SKILL_GROUP_RE = /^([^:,]{1,30}):\s*(.+)$/;

function toSkills(lines) {
  const groups = [];
  const other = [];
  for (const line of joinWrapped(lines)) {
    const text = plain(line.text).replace(BULLET_RE, "").trim();
    const match = text.match(SKILL_GROUP_RE);
    const items = (match ? match[2] : text)
      .split(/[,|•·;]/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (match) groups.push({ name: match[1].trim(), items });
    else other.push(...items);
  }
  const skills = [...groups.flatMap((group) => group.items), ...other];
  if (!groups.length) return { skills, skillGroups: [] };
  return { skills, skillGroups: other.length ? [...groups, { name: "Other", items: other }] : groups };
}

// "English: Native · Spanish (Intermediate)" → [{ name, level }]
function toLanguages(lines) {
  return toList(lines).map((item) => {
    const match = item.match(/^(.+?)\s*(?:[:–—-]\s*|\(\s*)([^()]+?)\)?$/);
    return match ? { name: match[1].trim(), level: match[2].trim() } : { name: item, level: "" };
  });
}

// One certification per line: "AWS Solutions Architect · Amazon Web Services   2022"
function toCertifications(lines) {
  return joinWrapped(lines)
    .map((line) => {
      const [rest, date] = takeDate(line.text.replace(BULLET_RE, ""));
      const [name = "", issuer = ""] = splitParts(rest);
      return { name, issuer, date };
    })
    .filter((item) => item.name);
}

// Achievements: a line with a date (or, when none are dated, every line) starts a new one; undated lines
// after it are its description.
function toAchievements(sectionLines) {
  const lines = joinWrapped(sectionLines);
  const anyDated = lines.some((line) => takeDate(line.text)[1]);
  const items = [];
  for (const line of lines) {
    const [rest, date] = takeDate(line.text.replace(BULLET_RE, ""));
    if (!items.length || date || !anyDated) items.push({ title: plain(rest), date, description: "" });
    else items[items.length - 1].description += (items[items.length - 1].description ? " " : "") + plain(rest);
  }
  return items.filter((item) => item.title);
}

// Some resumes put the company before the job title (or the school before the degree). When only the
// second one reads like a role / degree, swap them.
const ROLE_RE = /\b(?:engineer|developer|analyst|manager|designer|consultant|intern|lead|architect|specialist|officer|director|associate|administrator|scientist|executive|head|president|founder|tester|programmer|coordinator|assistant|supervisor|technician|trainee|accountant|teacher|writer|editor|recruiter)\b/i;
const DEGREE_RE = /\b(?:bachelor|master|b\.?\s?tech|m\.?\s?tech|b\.?\s?sc|m\.?\s?sc|b\.?\s?e|b\.?\s?a|m\.?\s?a|b\.?\s?com|m\.?\s?com|bca|mca|mba|ph\.?d|diploma|degree|doctor|xii|high school|secondary|12th|10th)\b/i;

function orderTitle(entries, titleRe) {
  return entries.map((entry) =>
    entry.org && titleRe.test(entry.org) && !titleRe.test(entry.title)
      ? { ...entry, title: entry.org, org: entry.title }
      : entry
  );
}

// Name, job title, contact details and links from the lines above the first section heading.
function parseHeader(headerLines, allText, links) {
  const segments = headerLines.flatMap((line) => line.text.split(/\t|\s+[|•·]\s+/)).map((s) => s.trim());
  const headerText = headerLines.map((line) => plain(line.text)).join("\n");
  const isContact = (text) => EMAIL_RE.test(text) || PHONE_RE.test(text) || /linkedin|github|https?:|www\./i.test(text);
  const isWords = (text, maxWords) => /^[\p{L}][\p{L}' .&/,-]+$/u.test(text) && text.split(/\s+/).length <= maxWords;

  const titleLines = headerLines.slice(0, 5).map((line) => plain(line.text)).filter((text) => !isContact(text));
  const fullName = titleLines.find((text) => isWords(text, 5) && !text.includes(",")) ?? "";
  const jobTitle = titleLines.find((text) => text !== fullName && isWords(text, 8) && !LOCATION_RE.test(text)) ?? "";
  const location = segments.find((text) => LOCATION_RE.test(text) && text !== fullName && text !== jobTitle) ?? "";

  const profile = { linkedin: "", github: "", website: "" };
  const addUrl = (url) => {
    if (/^(mailto|tel):/i.test(url) || url.includes("@")) return;
    if (/linkedin\.com/i.test(url)) profile.linkedin ||= url;
    else if (/github\.com/i.test(url)) profile.github ||= url;
    else if (/\//.test(url) || /^(https?:\/\/|www\.)/i.test(url)) profile.website ||= url;
  };
  // Real link targets first, then URLs and short forms ("linkedin/jane", "github: jane") in the text.
  for (const link of links) addUrl(link.url.replace(/\/$/, ""));
  for (const match of headerText.matchAll(URL_RE)) addUrl(match[1]);
  const short = (site) => headerText.match(new RegExp(`\\b${site}\\s*[/:]\\s*(?:in/)?([\\w-]{2,})`, "i"))?.[1];
  if (!profile.linkedin && short("linkedin")) profile.linkedin = `linkedin.com/in/${short("linkedin")}`;
  if (!profile.github && short("github")) profile.github = `github.com/${short("github")}`;

  return {
    fullName: fixCase(fullName),
    jobTitle: fixCase(jobTitle),
    email: (headerText.match(EMAIL_RE) ?? allText.match(EMAIL_RE))?.[0] ?? "",
    phone: (headerText.match(PHONE_RE) ?? allText.match(PHONE_RE))?.[1]?.trim() ?? "",
    location,
    ...profile,
  };
}

export function parseResumeDocument({ lines, links = [] }) {
  const sections = {};
  const headerLines = [];
  let currentSection = null;
  let firstHeading = null;

  for (const line of lines) {
    const heading = detectHeading(line.text);
    if (heading) {
      currentSection = heading;
      firstHeading ??= line;
      sections[currentSection] ??= [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    } else {
      headerLines.push(line);
    }
  }

  const rawText = lines.map((line) => plain(line.text)).join("\n");
  documentWords = new Set(rawText.toLowerCase().match(/[\p{L}]+(?:-[\p{L}]+)*/gu) ?? []);
  // Only links in the header area are the person's own profiles (project links come later).
  const headerLinks = links.filter(
    (link) => link.page === undefined || !firstHeading?.page || (link.page === firstHeading.page && link.y > firstHeading.y)
  );
  const section = (key) => sections[key] ?? [];

  return {
    personal: parseHeader(headerLines, rawText, headerLinks),
    summary: paragraph(section("summary")),
    experience: orderTitle(toEntries(section("experience")), ROLE_RE),
    education: orderTitle(toEntries(section("education")), DEGREE_RE),
    projects: toEntries(section("projects")),
    ...toSkills(section("skills")),
    certifications: toCertifications(section("certifications")),
    achievements: toAchievements(section("achievements")),
    languages: toLanguages(section("languages")),
    hobbies: toList(section("hobbies")),
    rawText,
  };
}
