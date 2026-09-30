import { Name, Photo, ResumeSections, accentStyle, getContacts, getLinks } from "@/components/builder/templates/shared";

// Tinted header with headshot, then a narrow details column on the left and main content on the right.
export default function ProfileTemplate({ resume, accent }) {
  const { personal } = resume;
  const contacts = getContacts(personal);
  const links = getLinks(personal);

  return (
    <div style={accentStyle(accent)} className="font-sans text-[12.5px] leading-relaxed text-neutral-700">
      <header className="flex items-center gap-7 bg-(--tpl)/8 px-12 py-9">
        <Photo src={personal.photo} className="size-28 rounded-full ring-4 ring-white" />
        <div className="min-w-0">
          <Name value={personal.fullName} className="text-4xl font-bold tracking-tight text-(--tpl)" />
          {personal.jobTitle && <p className="mt-1 text-base font-medium text-neutral-700">{personal.jobTitle}</p>}
        </div>
      </header>

      <div className="grid grid-cols-[200px_1fr] gap-8 px-12 py-8">
        <aside className="space-y-6 border-r border-neutral-200 pr-6">
          {contacts.length > 0 && (
            <Section title="Contact">
              <ul className="space-y-1 text-[11.5px] break-words">
                {contacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          )}
          {links.length > 0 && (
            <Section title="Links">
              <ul className="space-y-1 text-[11.5px] break-words">
                {links.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          )}
          <ResumeSections
            resume={resume}
            Section={Section}
            sections={["skills", "languages"]}
            variants={{ skills: "stack", languages: "bars" }}
          />
        </aside>

        <main className="min-w-0 space-y-6">
          <ResumeSections
            resume={resume}
            Section={Section}
            sections={["summary", "experience", "education"]}
            titles={{ summary: "Profile" }}
          />
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-2 border-b-2 border-(--tpl) pb-1 text-[11px] font-bold tracking-[0.14em] text-neutral-900 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
