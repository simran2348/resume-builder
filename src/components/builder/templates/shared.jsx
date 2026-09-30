/* eslint-disable @next/next/no-img-element -- photo is a local data URL */

// Building blocks shared by all resume templates.
// Every visual setting comes from the theme via CSS variables set by `themeStyle` on the template root,
// so the theme panel updates all templates in real time. Use the `tw` classes below rather than fixed
// colours, fonts or sizes.

import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { DEFAULT_SECTION_ORDER as DEFAULT_ORDER, DEFAULT_THEME, PHOTO_SHAPES, RESUME_FONTS } from "@/constants/builder";
import { parseRichText } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

export const tw = {
  // No background here: PagedDocument paints the page colour, with any PageBackground layered on top.
  root: "min-h-full font-(family-name:--tpl-body-font) text-(length:--tpl-body-size) leading-(--tpl-line-height) text-(--tpl-text)",
  name: "font-(family-name:--tpl-heading-font) text-(length:--tpl-name-size) leading-tight font-bold",
  heading: "font-(family-name:--tpl-heading-font) text-(length:--tpl-heading-size) leading-snug break-after-avoid",
  // Keeps an entry (a job, a degree, ...) on one printed page.
  entry: "break-inside-avoid",
  title: "text-(length:--tpl-title-size)",
  small: "text-(length:--tpl-small-size)",
  strong: "text-(--tpl-text)",
  muted: "text-(--tpl-text)/75",
  faint: "text-(--tpl-text)/60",
  // Dividers: transparent when the theme's "Show dividers" option is off, so layouts never shift.
  rule: "border-(--tpl-divider)",
  line: "bg-(--tpl-divider)",
  accentRule: "border-(--tpl-accent-divider)",
  accentLine: "bg-(--tpl-accent-divider)",
  inverseRule: "border-(--tpl-inverse-divider)",
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
    "--tpl-divider": t.showDividers ? `color-mix(in oklab, ${t.text} 18%, transparent)` : "transparent",
    "--tpl-accent-divider": t.showDividers ? t.accent : "transparent",
    "--tpl-inverse-divider": t.showDividers ? "rgb(255 255 255 / 0.3)" : "transparent",
  };
}

export const DEFAULT_SECTION_ORDER = ["summary", ...DEFAULT_ORDER];

// Where two-column templates place each section. Order within each column follows the user's order.
export const SIDE_SECTIONS = ["skills", "languages", "certifications", "hobbies"];
export const MAIN_SECTIONS = ["summary", "experience", "education", "projects", "achievements"];

export function dateRange({ startDate, endDate }) {
  return [startDate, endDate].filter(Boolean).join(" – ");
}

const CONTACT_FIELDS = ["email", "phone", "location"];
const LINK_FIELDS = ["linkedin", "github", "website"];

// Contact details as `{ type, value }` items so they can be rendered with matching icons.
export function getContacts(personal) {
  return CONTACT_FIELDS.filter((type) => personal[type]).map((type) => ({ type, value: personal[type] }));
}

export function getLinks(personal) {
  return LINK_FIELDS.filter((type) => personal[type]).map((type) => ({ type, value: personal[type] }));
}

// lucide doesn't ship brand icons, so LinkedIn and GitHub are inline SVGs.
function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V23H.22V8.02zM8.34 8.02h4.37v2.05h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V23H8.34V8.02z" />
    </svg>
  );
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3" />
    </svg>
  );
}

// Turns a contact value into a link target: mail app for email, dialer for phone, web page for links.
// Kept as real <a> elements so they stay clickable in the downloaded PDF.
export function toHref(type, value) {
  const text = value.trim();
  if (!text) return null;
  if (type === "email") return text.includes("@") ? `mailto:${text}` : null;
  if (type === "phone") {
    const digits = text.replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : null;
  }
  if (type === "location") return null;
  return /^https?:\/\//i.test(text) ? text : `https://${text.replace(/^\/+/, "")}`;
}

// Link that looks like the surrounding text; web links open in a new tab.
export function ResumeLink({ href, children, className }) {
  if (!href) return <span className={className}>{children}</span>;
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={cn("text-inherit no-underline hover:underline", className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}

const CONTACT_ICONS = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  website: Globe,
};

// Renders contact items inline (with separators) or stacked, with icons when the theme enables them.
// Pass the template's `theme`; `showContactIcons` is already resolved per template by getTemplate().
export function ContactList({ items, theme, layout = "inline", separator = "|", className, iconClassName }) {
  if (!items.length) return null;
  const showIcons = Boolean(theme?.showContactIcons);

  const renderItem = (item) => {
    const Icon = CONTACT_ICONS[item.type];
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        {showIcons && Icon && <Icon className={cn("size-[1.05em] shrink-0 text-(--tpl)", iconClassName)} />}
        <ResumeLink href={toHref(item.type, item.value)} className="break-words">
          {item.value}
        </ResumeLink>
      </span>
    );
  };

  if (layout === "stack") {
    return (
      <ul className={cn("space-y-1", className)}>
        {items.map((item) => (
          <li key={item.type} className="flex">
            {renderItem(item)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className={cn("flex flex-wrap items-center gap-y-0.5", showIcons ? "gap-x-4" : "gap-x-2", className)}>
      {items.map((item, i) => (
        <span key={item.type} className="inline-flex items-center gap-2">
          {!showIcons && i > 0 && <span className="opacity-50">{separator}</span>}
          {renderItem(item)}
        </span>
      ))}
    </p>
  );
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
      data-block
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

// Renders **bold** / *italic* markers from the editor as real formatting.
export function RichText({ text }) {
  return parseRichText(text).map((segment, i) => {
    let node = segment.text;
    if (segment.italic) node = <em>{node}</em>;
    if (segment.bold) node = <strong className="font-semibold">{node}</strong>;
    return <span key={i}>{node}</span>;
  });
}

export function Bullets({ items, className }) {
  if (!items?.length) return null;
  return (
    <ul className={cn("mt-1 list-disc space-y-0.5 pl-4 marker:text-(--tpl-text)/40", className)}>
      {items.map((item, i) => (
        <li key={i}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}

export function ExperienceList({ items, variant = "default" }) {
  if (variant === "timeline") {
    return (
      <div className="relative ml-1.5 space-y-4 border-l-2 border-(--tpl)/25 pl-5">
        {items.map((job, i) => (
          <div key={i} className={cn(tw.entry, "relative")}>
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
        <div key={i} className={tw.entry}>
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

// Shared layout for dated entries: bold title (+ muted suffix) with the date on the right.
function EntryHeader({ title, suffix, date }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <p className={cn(tw.strong, "font-semibold")}>
        {title}
        {suffix && <span className={cn(tw.muted, "font-normal")}> · {suffix}</span>}
      </p>
      {date && <p className={cn(tw.small, tw.faint, "shrink-0")}>{date}</p>}
    </div>
  );
}

export function EducationList({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((edu, i) => (
        <div key={i} className={tw.entry}>
          <EntryHeader title={edu.degree} date={dateRange(edu)} />
          <p className={cn(tw.small, tw.muted)}>
            {[edu.school, edu.location, edu.grade].filter(Boolean).join(" · ")}
          </p>
          {edu.description && (
            <p className="mt-0.5 whitespace-pre-line">
              <RichText text={edu.description} />
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProjectsList({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((project, i) => (
        <div key={i} className={tw.entry}>
          <EntryHeader title={project.name} suffix={project.role} date={dateRange(project)} />
          {project.link && (
            <p className={cn(tw.small, "text-(--tpl)")}>
              <ResumeLink href={toHref("link", project.link)}>{project.link}</ResumeLink>
            </p>
          )}
          {project.description && (
            <p className="mt-0.5 whitespace-pre-line">
              <RichText text={project.description} />
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function AchievementsList({ items }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className={tw.entry}>
          <EntryHeader title={item.title} date={item.date} />
          {item.description && (
            <p className="whitespace-pre-line">
              <RichText text={item.description} />
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function CertificationsList({ items }) {
  return (
    <div className="space-y-2">
      {items.map((cert, i) => (
        <div key={i} className={tw.entry}>
          <EntryHeader title={cert.name} suffix={cert.issuer} date={cert.date} />
          {cert.link && (
            <p className={cn(tw.small, tw.faint)}>
              <ResumeLink href={toHref("link", cert.link)}>{cert.link}</ResumeLink>
            </p>
          )}
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
    case "projects":
      return resume.projects?.length ? <ProjectsList items={resume.projects} /> : null;
    case "achievements":
      return resume.achievements?.length ? <AchievementsList items={resume.achievements} /> : null;
    case "certifications":
      return resume.certifications?.length ? <CertificationsList items={resume.certifications} /> : null;
    case "hobbies":
      return resume.hobbies?.length ? <SkillsList items={resume.hobbies} variant={variants.hobbies ?? "inline"} /> : null;
    case "summary":
      return resume.summary ? (
        <p className="whitespace-pre-line">
          <RichText text={resume.summary} />
        </p>
      ) : null;
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

// Renders each non-empty section, in the user's order, inside the template's own
// `Section({ title, children })` wrapper. `only` limits it to a column's sections (two-column layouts).
// Titles come from `resume.sectionTitles`, already resolved (user > template > default) by getTemplate().
export function ResumeSections({ resume, Section, only, variants = {} }) {
  const order = resume.sectionOrder ?? DEFAULT_SECTION_ORDER;
  return (only ? order.filter((key) => only.includes(key)) : order).map((key) => {
    const content = renderSection(key, resume, variants);
    if (!content) return null;
    return (
      <Section key={key} title={resume.sectionTitles[key]}>
        {content}
      </Section>
    );
  });
}
