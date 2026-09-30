import { Name, ResumeSections, accentStyle, getContacts, getInitials, getLinks } from "@/components/builder/templates/shared";

// Centered serif header with a monogram; section titles followed by a hairline.
export default function ElegantTemplate({ resume, accent }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={accentStyle(accent)} className="px-16 py-12 font-serif text-[12.5px] leading-relaxed text-neutral-700">
      <header className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-(--tpl) text-sm text-(--tpl)">
          {getInitials(personal.fullName)}
        </div>
        <Name value={personal.fullName} className="mt-3 text-3xl tracking-[0.08em] text-(--tpl) uppercase" />
        {personal.jobTitle && <p className="mt-1 text-sm text-neutral-600 italic">{personal.jobTitle}</p>}
        {details.length > 0 && <p className="mt-3 text-[11px] text-neutral-600">{details.join("  |  ")}</p>}
      </header>

      <ResumeSections resume={resume} Section={Section} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-3 text-[14px] text-(--tpl)">
        {title}
        <span className="h-px flex-1 bg-neutral-300" />
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
