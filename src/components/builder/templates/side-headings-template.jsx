import { ContactList, Name, Photo, ResumeSections, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Headshot header, then section titles sit in a left gutter next to their content.
export default function SideHeadingsTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={tw.root}>
      <div className="h-3 bg-(--tpl)" />
      <div className={cn(tw.padX, tw.padY)}>
        <header className="flex items-start gap-6">
          <Photo src={personal.photo} className="size-28" />
          <div className="min-w-0 flex-1 pt-1">
            <Name value={personal.fullName} className="tracking-tight text-(--tpl) uppercase" />
            {personal.jobTitle && <p className={cn(tw.muted, "mt-0.5 font-medium")}>{personal.jobTitle}</p>}
            <ContactList items={details} theme={theme} layout="stack" className={cn(tw.small, tw.muted, "mt-3")} />
          </div>
        </header>

        <ResumeSections resume={resume} Section={Section} />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={cn(tw.gap, "grid grid-cols-[140px_1fr] gap-6")}>
      <div>
        <span className={cn(tw.accentLine, "block h-0.5 w-14")} />
        <h2 className={cn(tw.heading, tw.strong, "mt-1.5 font-bold tracking-wider uppercase")}>{title}</h2>
      </div>
      <div className={cn(tw.rule, "min-w-0 border-t pt-1.5")}>{children}</div>
    </section>
  );
}
