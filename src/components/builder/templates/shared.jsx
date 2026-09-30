/* eslint-disable @next/next/no-img-element -- photo is a local data URL */

// Building blocks shared by all resume templates.
// Every visual setting comes from the theme via CSS variables set by `themeStyle` on the template root,
// so the theme panel updates all templates in real time. Use the `tw` classes below rather than fixed
// colours, fonts or sizes.

import { DEFAULT_THEME, PHOTO_SHAPES, RESUME_FONTS } from "@/constants/builder";
import { cn } from "@/lib/utils";

export const tw = {
  root: "min-h-full bg-(--tpl-bg) font-(family-name:--tpl-body-font) text-(length:--tpl-body-size) leading-(--tpl-line-height) text-(--tpl-text)",
  name: "font-(family-name:--tpl-heading-font) text-(length:--tpl-name-size) leading-tight font-bold",
  heading: "font-(family-name:--tpl-heading-font) text-(length:--tpl-heading-size) leading-snug",
  title: "text-(length:--tpl-title-size)",
  small: "text-(length:--tpl-small-size)",
  strong: "text-(--tpl-text)",
  muted: "text-(--tpl-text)/75",
  faint: "text-(--tpl-text)/60",
  rule: "border-(--tpl-text)/15",
  line: "bg-(--tpl-text)/20",
  padX: "px-(--tpl-margin)",
  padY: "py-(--tpl-margin)",
  gap: "mt-(--tpl-section-gap)",
};

function fontStack(fontId) {
  const font = RESUME_FONTS.find((f) => f.id === fontId) ?? RESUME_FONTS[0];
  return `var(${font.variable}), ${font.fallback}`;
}

export function themeStyle(theme = DEFAULT_THEME) {
  const t = { ...DEFAULT_THEME, ...theme };
  const shape = PHOTO_SHAPES.find((s) => s.id === t.photoShape) ?? PHOTO_SHAPES[0];
  return {
    "--tpl": t.accent,
    "--tpl-bg": t.background,
    "--tpl-text": t.text,
    "--tpl-heading-font": fontStack(t.headingFont),
    "--tpl-body-font": fontStack(t.bodyFont),
    "--tpl-name-size": `${t.nameSize}px`,
    "--tpl-heading-size": `${t.headingSize}px`,
    "--tpl-body-size": `${t.bodySize}px`,
    "--tpl-title-size": `${t.bodySize * 1.25}px`,
    "--tpl-small-size": `${t.bodySize * 0.9}px`,
    "--tpl-line-height": t.lineHeight,
    "--tpl-section-gap": `${t.sectionSpacing}px`,
    "--tpl-margin": `${t.pageMargin}px`,
    "--tpl-photo-radius": shape.radius,
    "--tpl-photo-border": `${t.photoBorderWidth}px`,
    "--tpl-photo-border-color": t.photoBorderColor,
  };
}

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

// Name with a faded placeholder when empty so the layout is still visible.
export function Name({ value, className }) {
  return <h1 className={cn(tw.name, className, !value && "opacity-30")}>{value || "Your Name"}</h1>;
}

// Shape and border come from the theme.
export function Photo({ src, className }) {
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-(--tpl-photo-radius) border-(length:--tpl-photo-border) border-solid border-(--tpl-photo-border-color) bg-neutral-200",
        className
      )}
    >
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
    <ul className={cn("mt-1 list-disc space-y-0.5 pl-4 marker:text-(--tpl-text)/40", className)}>
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
            <span className="absolute top-1.5 -left-[27px] size-3 rounded-full border-2 border-(--tpl-bg) bg-(--tpl)" />
            <p className={cn(tw.small, "font-medium text-(--tpl)")}>{dateRange(job)}</p>
            <p className={cn(tw.strong, "font-semibold")}>{job.role}</p>
            <p className={cn(tw.small, tw.muted)}>{[job.company, job.location].filter(Boolean).join(" · ")}</p>
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
            <p className={cn(tw.strong, "font-semibold")}>
              {job.role}
              {job.company && <span className={cn(tw.muted, "font-normal")}> · {job.company}</span>}
            </p>
            <p className={cn(tw.small, tw.faint, "shrink-0")}>{dateRange(job)}</p>
          </div>
          {job.location && <p className={cn(tw.small, tw.faint)}>{job.location}</p>}
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
            <p className={cn(tw.strong, "font-semibold")}>{edu.degree}</p>
            <p className={cn(tw.small, tw.faint, "shrink-0")}>{dateRange(edu)}</p>
          </div>
          <p className={cn(tw.small, tw.muted)}>{[edu.school, edu.location].filter(Boolean).join(" · ")}</p>
        </div>
      ))}
    </div>
  );
}

// variant: "inline" (dot separated) | "grid" (two-column bullets) | "tags" (chips) | "stack" (one per line)
export function SkillsList({ items, variant = "grid" }) {
  if (variant === "inline") return <p>{items.join(" · ")}</p>;
  if (variant === "tags") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((skill) => (
          <span key={skill} className={cn(tw.small, "rounded border border-(--tpl)/30 bg-(--tpl)/5 px-2 py-0.5")}>
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
    <ul className="grid list-disc grid-cols-2 gap-x-8 gap-y-0.5 pl-4 marker:text-(--tpl-text)/40">
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
            <div className={cn(tw.small, "flex justify-between")}>
              <span className={cn(tw.strong, "font-medium")}>{lang.name}</span>
              <span className={tw.faint}>{lang.proficiency}</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-(--tpl-text)/12">
              <div className="h-full rounded-full bg-(--tpl)" style={{ width: `${((lang.level ?? 3) / 5) * 100}%` }} />
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
          <span className={cn(tw.strong, "font-medium")}>{lang.name}</span>
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
