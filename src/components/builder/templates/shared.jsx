/* eslint-disable @next/next/no-img-element -- photo is a local data URL */

// Building blocks shared by all resume templates.
// Templates set `--tpl` (the accent colour) on their root; use `text-(--tpl)`, `bg-(--tpl)` etc. to apply it.
// Colours are fixed neutrals otherwise, because the page represents printed paper in both themes.

import { cn } from "@/lib/utils";

export const SECTION_TITLES = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  languages: "Languages",
};

export const DEFAULT_SECTION_ORDER = ["summary", "experience", "education", "skills", "languages"];

export function dateRange({ startDate, endDate }) {
  return [startDate, endDate].filter(Boolean).join(" – ");
}

export function getContacts(personal) {
  return [personal.email, personal.phone, personal.location].filter(Boolean);
}

export function getLinks(personal) {
  return [personal.linkedin, personal.github, personal.website].filter(Boolean);
}

export function getInitials(name) {
  return (name || "Your Name")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function accentStyle(accent) {
  return { "--tpl": accent };
}

// Name with a faded placeholder when empty so the layout is still visible.
export function Name({ value, className }) {
  return <h1 className={cn(className, !value && "opacity-30")}>{value || "Your Name"}</h1>;
}

export function Photo({ src, className }) {
  return (
    <div className={cn("shrink-0 overflow-hidden bg-neutral-200", className)}>
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <svg viewBox="0 0 100 100" className="size-full text-neutral-400" aria-hidden>
          <circle cx="50" cy="38" r="18" fill="currentColor" />
          <path d="M14 96c4-20 18-32 36-32s32 12 36 32z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

export function Bullets({ items, className }) {
  if (!items?.length) return null;
  return (
    <ul className={cn("mt-1 list-disc space-y-0.5 pl-4 marker:text-neutral-400", className)}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function ExperienceList({ items, variant = "default" }) {
  if (variant === "timeline") {
    return (
      <div className="relative ml-1.5 space-y-4 border-l-2 border-(--tpl)/25 pl-5">
        {items.map((job, i) => (
          <div key={i} className="relative">
            <span className="absolute top-1.5 -left-[27px] size-3 rounded-full border-2 border-white bg-(--tpl)" />
            <p className="text-[11px] font-medium text-(--tpl)">{dateRange(job)}</p>
            <p className="font-semibold text-neutral-900">{job.role}</p>
            <p className="text-[12px] text-neutral-600">
              {[job.company, job.location].filter(Boolean).join(" · ")}
            </p>
            <Bullets items={job.bullets} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((job, i) => (
        <div key={i}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-semibold text-neutral-900">
              {job.role}
              {job.company && <span className="font-normal text-neutral-600"> · {job.company}</span>}
            </p>
            <p className="shrink-0 text-[11px] text-neutral-500">{dateRange(job)}</p>
          </div>
          {job.location && <p className="text-[11px] text-neutral-500">{job.location}</p>}
          <Bullets items={job.bullets} />
        </div>
      ))}
    </div>
  );
}

export function EducationList({ items }) {
  return (
    <div className="space-y-2">
      {items.map((edu, i) => (
        <div key={i}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-semibold text-neutral-900">{edu.degree}</p>
            <p className="shrink-0 text-[11px] text-neutral-500">{dateRange(edu)}</p>
          </div>
          <p className="text-[12px] text-neutral-600">
            {[edu.school, edu.location].filter(Boolean).join(" · ")}
          </p>
        </div>
      ))}
    </div>
  );
}

// variant: "inline" (comma separated) | "grid" (two-column bullets) | "tags" (chips) | "stack" (one per line)
export function SkillsList({ items, variant = "grid" }) {
  if (variant === "inline") return <p>{items.join(" · ")}</p>;
  if (variant === "tags") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((skill) => (
          <span
            key={skill}
            className="rounded border border-(--tpl)/30 bg-(--tpl)/5 px-2 py-0.5 text-[11px] text-neutral-800"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }
  if (variant === "stack") {
    return (
      <ul className="space-y-1">
        {items.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid list-disc grid-cols-2 gap-x-8 gap-y-0.5 pl-4 marker:text-neutral-400">
      {items.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}

// variant: "inline" (Name: Level) | "bars" (proficiency bars)
export function LanguagesList({ items, variant = "inline" }) {
  if (variant === "bars") {
    return (
      <div className="space-y-2">
        {items.map((lang) => (
          <div key={lang.name}>
            <div className="flex justify-between text-[12px]">
              <span className="font-medium text-neutral-900">{lang.name}</span>
              <span className="text-neutral-500">{lang.proficiency}</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-(--tpl)"
                style={{ width: `${((lang.level ?? 3) / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <p>
      {items.map((lang, i) => (
        <span key={lang.name}>
          {i > 0 && " · "}
          <span className="font-medium text-neutral-900">{lang.name}</span>
          {lang.proficiency && `: ${lang.proficiency}`}
        </span>
      ))}
    </p>
  );
}

function renderSection(key, resume, variants) {
  switch (key) {
    case "summary":
      return resume.summary ? <p className="whitespace-pre-line">{resume.summary}</p> : null;
    case "experience":
      return resume.experience?.length ? (
        <ExperienceList items={resume.experience} variant={variants.experience} />
      ) : null;
    case "education":
      return resume.education?.length ? <EducationList items={resume.education} /> : null;
    case "skills":
      return resume.skills?.length ? <SkillsList items={resume.skills} variant={variants.skills} /> : null;
    case "languages":
      return resume.languages?.length ? (
        <LanguagesList items={resume.languages} variant={variants.languages} />
      ) : null;
    default:
      return null;
  }
}

// Renders each non-empty section inside the template's own `Section({ title, children })` wrapper.
export function ResumeSections({ resume, Section, sections = DEFAULT_SECTION_ORDER, variants = {}, titles = {} }) {
  return sections.map((key) => {
    const content = renderSection(key, resume, variants);
    if (!content) return null;
    return (
      <Section key={key} title={titles[key] ?? SECTION_TITLES[key]}>
        {content}
      </Section>
    );
  });
}
