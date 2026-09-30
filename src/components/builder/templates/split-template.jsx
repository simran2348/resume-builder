import { Name, ResumeSections, accentStyle, getContacts, getLinks } from "@/components/builder/templates/shared";

// Full-width header, then a wide main column and a tinted side panel for skills and languages.
export default function SplitTemplate({ resume, accent }) {
  const { personal } = resume;
  const contacts = getContacts(personal);
  const links = getLinks(personal);
  const hasSide = resume.skills?.length > 0 || resume.languages?.length > 0 || links.length > 0;

  return (
    <div style={accentStyle(accent)} className="px-12 py-11 font-sans text-[12.5px] leading-relaxed text-neutral-700">
      <header className="border-b-4 border-(--tpl) pb-4">
        <Name value={personal.fullName} className="text-4xl font-bold tracking-tight text-neutral-900" />
        {personal.jobTitle && <p className="mt-1 text-base text-(--tpl)">{personal.jobTitle}</p>}
        {contacts.length > 0 && <p className="mt-2 text-[11.5px] text-neutral-600">{contacts.join("   ·   ")}</p>}
      </header>

      <div className={hasSide ? "grid grid-cols-[1fr_210px] gap-8" : ""}>
        <div className="min-w-0">
          <ResumeSections resume={resume} Section={Section} sections={["summary", "experience", "education"]} />
        </div>

        {hasSide && (
          <aside className="mt-6 self-start rounded-lg bg-(--tpl)/6 p-5 *:first:mt-0">
            {links.length > 0 && (
              <Section title="Links">
                <ul className="space-y-1 text-[11.5px] break-words">
                  {links.map((link) => (
                    <li key={link}>{link}</li>
                  ))}
                </ul>
              </Section>
            )}
            <ResumeSections
              resume={resume}
              Section={Section}
              sections={["skills", "languages"]}
              variants={{ skills: "tags", languages: "bars" }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[11px] font-bold tracking-[0.14em] text-(--tpl) uppercase">{title}</h2>
      {children}
    </section>
  );
}
