import { ContactList, MAIN_SECTIONS, Name, Photo, ResumeSections, SIDE_SECTIONS, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

const INVERSE_VARS = {
  "--tpl-text": "#ffffff",
  "--tpl": "#ffffff",
  "--tpl-divider": "var(--tpl-inverse-divider)",
};

// Two columns: accent sidebar (photo, contact, skills, languages) and main content on the right.
export default function SidebarTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, "grid min-h-[1123px] grid-cols-[240px_1fr]")}>
      {/* The column colour comes from SidebarPageBackground (full height on every page, no seams). */}
      <aside className="px-7 py-(--tpl-margin) text-white/90">
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

        {/* Shared renderers with the text / accent colours flipped to white for the coloured column. */}
        <div style={INVERSE_VARS}>
          <ResumeSections
            resume={resume}
            Section={SideSection}
            only={SIDE_SECTIONS}
            variants={{ skills: "stack", languages: "bars", hobbies: "stack" }}
          />
        </div>
      </aside>

      <main className="px-[calc(var(--tpl-margin)*0.8)] py-(--tpl-margin)">
        <Name value={personal.fullName} className={cn(tw.strong, "tracking-tight")} />
        {personal.jobTitle && <p className={cn(tw.title, "mt-1 font-medium text-(--tpl)")}>{personal.jobTitle}</p>}

        <ResumeSections resume={resume} Section={Section} only={MAIN_SECTIONS} />
      </main>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <section className="mt-(--tpl-section-gap)">
      <h2 className={cn(tw.heading, tw.inverseRule, "mb-2 border-b pb-1 font-bold tracking-[0.14em] text-white uppercase")}>
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

// Drawn behind every page at full height so the coloured column runs top to bottom on each page.
export function SidebarPageBackground({ theme }) {
  return (
    <div style={themeStyle(theme)} className="grid h-full grid-cols-[240px_1fr]">
      <div className="bg-(--tpl)" />
    </div>
  );
}
