import { ContactList, Name, ResumeSections, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Name left, contacts right; experience drawn on a vertical timeline.
export default function TimelineTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, tw.padX, tw.padY)}>
      <header className="flex items-end justify-between gap-8 border-b-2 border-(--tpl) pb-5">
        <div className="min-w-0">
          <Name value={personal.fullName} className={cn(tw.strong, "font-extrabold tracking-tight")} />
          {personal.jobTitle && <p className={cn(tw.title, "mt-1 font-medium text-(--tpl)")}>{personal.jobTitle}</p>}
        </div>
        <ContactList
          items={details}
          theme={theme}
          layout="stack"
          className={cn(tw.small, tw.muted, "shrink-0 space-y-0.5 [&>li]:justify-end")}
        />
      </header>

      <ResumeSections resume={resume} Section={Section} variants={{ experience: "timeline", skills: "tags" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={tw.gap}>
      <h2 className={cn(tw.heading, tw.strong, "flex items-center gap-2 font-bold")}>
        <span className="size-2 rotate-45 bg-(--tpl)" />
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
