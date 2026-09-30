import { ContactList, Name, Photo, ResumeSections, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Two columns: accent sidebar (photo, contact, skills, languages) and main content on the right.
export default function SidebarTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, "grid min-h-[1123px] grid-cols-[240px_1fr]")}>
      <aside className="bg-(--tpl) px-7 py-(--tpl-margin) text-white/90">
        <Photo src={personal.photo} className="mx-auto size-32" />

        {details.length > 0 && (
          <SideSection title="Contact">
            <ContactList
              items={details}
              theme={theme}
              layout="stack"
              className={cn(tw.small, "space-y-1.5")}
              iconClassName="text-white"
            />
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
                  <div className={cn(tw.small, "flex justify-between")}>
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

      <main className="px-[calc(var(--tpl-margin)*0.8)] py-(--tpl-margin)">
        <Name value={personal.fullName} className={cn(tw.strong, "tracking-tight")} />
        {personal.jobTitle && <p className={cn(tw.title, "mt-1 font-medium text-(--tpl)")}>{personal.jobTitle}</p>}

        <ResumeSections resume={resume} Section={Section} sections={["summary", "experience", "education"]} />
      </main>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <section className="mt-(--tpl-section-gap)">
      <h2 className={cn(tw.heading, "mb-2 border-b border-white/30 pb-1 font-bold tracking-[0.14em] text-white uppercase")}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Section({ title, children }) {
  return (
    <section className={tw.gap}>
      <h2 className={cn(tw.heading, "mb-2 font-bold tracking-[0.14em] text-(--tpl) uppercase")}>{title}</h2>
      {children}
    </section>
  );
}
