import { ContactList, MAIN_SECTIONS, Name, Photo, ResumeSections, SIDE_SECTIONS, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Tinted header with headshot, then a narrow details column on the left and main content on the right.
export default function ProfileTemplate({ resume, theme }) {
  const { personal } = resume;
  const contacts = getContacts(personal);
  const links = getLinks(personal);

  return (
    <div style={themeStyle(theme)} className={tw.root}>
      <header className={cn(tw.padX, "flex items-center gap-7 bg-(--tpl)/8 py-9")}>
        <Photo src={personal.photo} className="size-28" />
        <div className="min-w-0">
          <Name value={personal.fullName} className="tracking-tight text-(--tpl)" />
          {personal.jobTitle && <p className={cn(tw.title, "mt-1 font-medium")}>{personal.jobTitle}</p>}
        </div>
      </header>

      <div className={cn(tw.padX, "grid grid-cols-[200px_1fr] gap-8 py-8")}>
        <aside className={cn(tw.rule, "space-y-(--tpl-section-gap) border-r pr-6")}>
          {contacts.length > 0 && (
            <Section title="Contact">
              <ContactList items={contacts} theme={theme} layout="stack" className={tw.small} />
            </Section>
          )}
          {links.length > 0 && (
            <Section title="Links">
              <ContactList items={links} theme={theme} layout="stack" className={tw.small} />
            </Section>
          )}
          <ResumeSections
            resume={resume}
            Section={Section}
            only={SIDE_SECTIONS}
            variants={{ skills: "stack", languages: "bars", hobbies: "stack" }}
          />
        </aside>

        <main className="min-w-0 space-y-(--tpl-section-gap)">
          <ResumeSections
            resume={resume}
            Section={Section}
            only={MAIN_SECTIONS}
          />
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className={cn(tw.heading, tw.strong, tw.accentRule, "mb-2 border-b-2 pb-1 font-bold tracking-[0.14em] uppercase")}>
        {title}
      </h2>
      {children}
    </section>
  );
}
