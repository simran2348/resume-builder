import { Name, ResumeSections, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Full-width header, then a wide main column and a tinted side panel for skills and languages.
export default function SplitTemplate({ resume, theme }) {
  const { personal } = resume;
  const contacts = getContacts(personal);
  const links = getLinks(personal);
  const hasSide = resume.skills?.length > 0 || resume.languages?.length > 0 || links.length > 0;

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, tw.padX, tw.padY)}>
      <header className="border-b-4 border-(--tpl) pb-4">
        <Name value={personal.fullName} className={cn(tw.strong, "tracking-tight")} />
        {personal.jobTitle && <p className={cn(tw.title, "mt-1 text-(--tpl)")}>{personal.jobTitle}</p>}
        {contacts.length > 0 && <p className={cn(tw.small, tw.muted, "mt-2")}>{contacts.join("   ·   ")}</p>}
      </header>

      <div className={hasSide ? "grid grid-cols-[1fr_210px] gap-8" : ""}>
        <div className="min-w-0">
          <ResumeSections resume={resume} Section={Section} sections={["summary", "experience", "education"]} />
        </div>

        {hasSide && (
          <aside className="mt-(--tpl-section-gap) self-start rounded-lg bg-(--tpl)/6 p-5 *:first:mt-0">
            {links.length > 0 && (
              <Section title="Links">
                <ul className={cn(tw.small, "space-y-1 break-words")}>
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
    <section className={tw.gap}>
      <h2 className={cn(tw.heading, "mb-2 font-bold tracking-[0.14em] text-(--tpl) uppercase")}>{title}</h2>
      {children}
    </section>
  );
}
