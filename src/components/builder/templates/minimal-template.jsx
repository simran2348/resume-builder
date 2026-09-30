import { Name, ResumeSections, accentStyle, getContacts, getLinks } from "@/components/builder/templates/shared";

// Letter-spaced monospace header and centered section titles between rules.
export default function MinimalTemplate({ resume, accent }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={accentStyle(accent)} className="px-16 py-12 font-sans text-[12.5px] leading-relaxed text-neutral-700">
      <header className="text-center">
        <Name value={personal.fullName} className="font-mono text-3xl tracking-[0.3em] text-(--tpl) uppercase" />
        {personal.jobTitle && (
          <p className="mt-2 text-[11px] tracking-[0.2em] text-neutral-500 uppercase">{personal.jobTitle}</p>
        )}
        {details.length > 0 && <p className="mt-3 text-[11px] text-neutral-600">{details.join("   |   ")}</p>}
      </header>

      <ResumeSections resume={resume} Section={Section} variants={{ skills: "inline" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-4 text-[11px] font-semibold tracking-[0.2em] text-(--tpl) uppercase">
        <span className="h-px flex-1 bg-neutral-300" />
        {title}
        <span className="h-px flex-1 bg-neutral-300" />
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
