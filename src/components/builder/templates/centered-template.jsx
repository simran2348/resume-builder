import { ContactList, Name, ResumeSections, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Name, role and contact details centred at the top; classic left-aligned sections below.
export default function CenteredTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, tw.padX, tw.padY)}>
      <header className={cn(tw.rule, "border-b pb-5 text-center")}>
        <Name value={personal.fullName} className={cn(tw.strong, "tracking-tight")} />
        {personal.jobTitle && <p className={cn(tw.title, "mt-1 font-medium text-(--tpl)")}>{personal.jobTitle}</p>}
        <ContactList items={details} theme={theme} className={cn(tw.small, tw.muted, "mt-3 justify-center")} />
      </header>

      <ResumeSections resume={resume} Section={Section} titles={{ summary: "Professional Summary" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={tw.gap}>
      <h2 className={cn(tw.heading, "font-bold tracking-[0.12em] text-(--tpl) uppercase")}>{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
