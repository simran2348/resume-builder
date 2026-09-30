import { Name, ResumeSections, accentStyle, getContacts, getLinks } from "@/components/builder/templates/shared";

// Name left, contacts right; experience drawn on a vertical timeline.
export default function TimelineTemplate({ resume, accent }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={accentStyle(accent)} className="px-14 py-12 font-sans text-[12.5px] leading-relaxed text-neutral-700">
      <header className="flex items-end justify-between gap-8 border-b-2 border-(--tpl) pb-5">
        <div className="min-w-0">
          <Name value={personal.fullName} className="text-4xl font-extrabold tracking-tight text-neutral-900" />
          {personal.jobTitle && <p className="mt-1 text-base font-medium text-(--tpl)">{personal.jobTitle}</p>}
        </div>
        {details.length > 0 && (
          <ul className="shrink-0 space-y-0.5 text-right text-[11px] text-neutral-600">
            {details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </header>

      <ResumeSections
        resume={resume}
        Section={Section}
        variants={{ experience: "timeline", skills: "tags" }}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-2 text-[13px] font-bold text-neutral-900">
        <span className="size-2 rotate-45 bg-(--tpl)" />
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
