import { Name, Photo, ResumeSections, accentStyle, getContacts, getLinks } from "@/components/builder/templates/shared";

// Single-column, top-to-bottom layout, optionally with a round photo.
export default function ClassicTemplate({ resume, accent, showPhoto = false }) {
  const { personal } = resume;
  const contacts = getContacts(personal);
  const links = getLinks(personal);

  return (
    <div style={accentStyle(accent)} className="px-14 py-12 font-sans text-[12.5px] leading-relaxed text-neutral-700">
      <header className="flex items-center gap-6">
        {showPhoto && <Photo src={personal.photo} className="size-24 rounded-full" />}
        <div className="min-w-0 flex-1">
          <Name value={personal.fullName} className="text-3xl font-bold tracking-tight text-neutral-900" />
          {personal.jobTitle && <p className="mt-1 text-base font-medium text-(--tpl)">{personal.jobTitle}</p>}
          {(contacts.length > 0 || links.length > 0) && (
            <div className="mt-3 space-y-0.5 text-[12px] text-neutral-600">
              {contacts.length > 0 && <p>{contacts.join("  |  ")}</p>}
              {links.length > 0 && <p>{links.join("  |  ")}</p>}
            </div>
          )}
        </div>
      </header>

      <ResumeSections resume={resume} Section={Section} titles={{ summary: "Professional Summary" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-neutral-300 pb-1 text-[12px] font-bold tracking-[0.12em] text-(--tpl) uppercase">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
