import { ContactList, Name, ResumeSections, getContacts, getInitials, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Accent header band with an initials box; sections separated by rules.
export default function BannerTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={tw.root}>
      <header className={cn(tw.padX, "flex items-center gap-6 bg-(--tpl) py-8 text-white")}>
        <div className="flex size-16 shrink-0 items-center justify-center border-2 border-white/70 text-2xl font-light">
          {getInitials(personal.fullName)}
        </div>
        <div className="min-w-0">
          <Name value={personal.fullName} className="tracking-wide uppercase" />
          {personal.jobTitle && <p className="text-white/90">{personal.jobTitle}</p>}
          <ContactList
            items={details}
            theme={theme}
            separator="·"
            className={cn(tw.small, "mt-2 text-white/85")}
            iconClassName="text-white"
          />
        </div>
      </header>

      <div className={cn(tw.padX, "pb-10")}>
        <ResumeSections resume={resume} Section={Section} variants={{ languages: "bars" }} />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={cn(tw.gap, tw.rule, "border-t pt-4 first:border-t-0")}>
      <h2 className={cn(tw.heading, "font-bold tracking-[0.14em] text-(--tpl) uppercase")}>{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
