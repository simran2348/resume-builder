import { nanoid } from "nanoid";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_OPTIONS = MONTHS.map((label, i) => ({ value: String(i + 1).padStart(2, "0"), label }));

// Dates are stored as "YYYY-MM" or "YYYY" (year only).
export function formatMonthYear(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
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

// Converts builder state into the plain shape templates render (formatted dates, bullet strings).
export function toTemplateResume({ personal, summary, experience = [], sectionTitles = {} }) {
  return {
    personal,
    summary,
    sectionTitles,
    experience: experience
      .filter((job) => job.role || job.company || job.bullets.some((b) => b.text.trim()))
      .map((job) => ({
        role: job.role,
        company: job.company,
        location: job.location,
        startDate: formatMonthYear(job.startDate),
        endDate: job.current ? "Present" : formatMonthYear(job.endDate),
        bullets: job.bullets.map((b) => b.text.trim()).filter(Boolean),
      })),
  };
}

const MONTH_LOOKUP = Object.fromEntries(MONTHS.map((m, i) => [m.toLowerCase(), String(i + 1).padStart(2, "0")]));
const DATE_PART = String.raw`(?:([A-Za-z]{3,9})\.?\s+)?(\d{4})`;
const RANGE_RE = new RegExp(`${DATE_PART}\\s*(?:–|—|-|to)\\s*(?:${DATE_PART}|(present|current|now))`, "i");

function toStoredDate(monthName, year) {
  if (!year) return "";
  const month = monthName && MONTH_LOOKUP[monthName.slice(0, 3).toLowerCase()];
  return month ? `${year}-${month}` : year;
}

// Best-effort mapping of an uploaded resume's experience entries ({ title, subtitle, bullets }).
export function fromParsedExperience(entries = []) {
  return entries.map(({ title = "", subtitle = "", bullets = [] }) => {
    const text = `${title} · ${subtitle}`;
    const match = text.match(RANGE_RE);
    const company = subtitle
      .replace(RANGE_RE, "")
      .split(/\s*[·|,]\s*/)
      .find((part) => part.trim());
    return newExperience({
      role: title,
      company: company?.trim() ?? "",
      startDate: match ? toStoredDate(match[1], match[2]) : "",
      endDate: match ? toStoredDate(match[3], match[4]) : "",
      current: Boolean(match?.[5]),
      bullets: bullets.length ? bullets.map((b) => newBullet(b)) : [newBullet()],
    });
  });
}
