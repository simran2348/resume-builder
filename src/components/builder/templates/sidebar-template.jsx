import { Name, Photo, ResumeSections, accentStyle, getContacts, getLinks } from "@/components/builder/templates/shared";

// Two columns: coloured sidebar (photo, contact, skills, languages) and main content on the right.
export default function SidebarTemplate({ resume, accent }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div
      style={accentStyle(accent)}
      className="grid min-h-[1123px] grid-cols-[240px_1fr] font-sans text-[12.5px] leading-relaxed text-neutral-700"
    >
      <aside className="bg-(--tpl) px-7 py-10 text-white/90">
        <Photo src={personal.photo} className="mx-auto size-32 rounded-full ring-4 ring-white/25" />

        {details.length > 0 && (
          <SideSection title="Contact">
            <ul className="space-y-1.5 text-[11.5px] break-words">
              {details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SideSection>
        )}

        {resume.skills?.length > 0 && (
          <SideSection title="Skills">
            <ul className="space-y-1">
              {resume.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </SideSection>
        )}

        {resume.languages?.length > 0 && (
          <SideSection title="Languages">
            <div className="space-y-2">
              {resume.languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-[11.5px]">
                    <span className="font-medium text-white">{lang.name}</span>
                    <span>{lang.proficiency}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-white/25">
                    <div className="h-full rounded-full bg-white" style={{ width: `${((lang.level ?? 3) / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SideSection>
        )}
      </aside>

      <main className="px-10 py-10">
        <Name value={personal.fullName} className="text-4xl font-bold tracking-tight text-neutral-900" />
        {personal.jobTitle && <p className="mt-1 text-base font-medium text-(--tpl)">{personal.jobTitle}</p>}

        <ResumeSections resume={resume} Section={Section} sections={["summary", "experience", "education"]} />
      </main>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 border-b border-white/30 pb-1 text-[11px] font-bold tracking-[0.14em] text-white uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="mb-2 text-[12px] font-bold tracking-[0.14em] text-(--tpl) uppercase">{title}</h2>
      {children}
    </section>
  );
}
