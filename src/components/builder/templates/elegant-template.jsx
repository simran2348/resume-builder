import { ContactList, Name, ResumeSections, getContacts, getInitials, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Centered header with a monogram; section titles followed by a hairline.
export default function ElegantTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, tw.padX, tw.padY)}>
      <header className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-(--tpl) text-sm text-(--tpl)">
          {getInitials(personal.fullName)}
        </div>
        <Name value={personal.fullName} className="mt-3 font-medium tracking-[0.08em] text-(--tpl) uppercase" />
        {personal.jobTitle && <p className={cn(tw.muted, "mt-1 italic")}>{personal.jobTitle}</p>}
        <ContactList items={details} theme={theme} className={cn(tw.small, tw.muted, "mt-3 justify-center")} />
      </header>

      <ResumeSections resume={resume} Section={Section} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={tw.gap}>
      <h2 className={cn(tw.heading, "flex items-center gap-3 text-(--tpl)")}>
        {title}
        <span className={cn(tw.line, "h-px flex-1")} />
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
