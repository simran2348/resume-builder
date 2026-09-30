import { Name, ResumeSections, accentStyle, getContacts, getInitials, getLinks } from "@/components/builder/templates/shared";

// Coloured header band with an initials box; sections separated by rules.
export default function BannerTemplate({ resume, accent }) {
  const { personal } = resume;
  const contacts = getContacts(personal);
  const links = getLinks(personal);

  return (
    <div style={accentStyle(accent)} className="font-sans text-[12.5px] leading-relaxed text-neutral-700">
      <header className="flex items-center gap-6 bg-(--tpl) px-12 py-8 text-white">
        <div className="flex size-16 shrink-0 items-center justify-center border-2 border-white/70 text-2xl font-light">
          {getInitials(personal.fullName)}
        </div>
        <div className="min-w-0">
          <Name value={personal.fullName} className="text-3xl font-bold tracking-wide uppercase" />
          {personal.jobTitle && <p className="text-sm text-white/90">{personal.jobTitle}</p>}
          {(contacts.length > 0 || links.length > 0) && (
            <p className="mt-2 text-[11px] text-white/80">{[...contacts, ...links].join("  ·  ")}</p>
          )}
        </div>
      </header>

      <div className="px-12 pb-10">
        <ResumeSections resume={resume} Section={Section} variants={{ languages: "bars" }} />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-5 border-t border-neutral-200 pt-4 first:border-t-0">
      <h2 className="text-[11px] font-bold tracking-[0.14em] text-(--tpl) uppercase">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
