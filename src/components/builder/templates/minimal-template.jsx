import { Name, ResumeSections, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Letter-spaced header and centered section titles between rules.
export default function MinimalTemplate({ resume, theme }) {
  const { personal } = resume;
  const details = [...getContacts(personal), ...getLinks(personal)];

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, tw.padX, tw.padY)}>
      <header className="text-center">
        <Name value={personal.fullName} className="font-normal tracking-[0.3em] text-(--tpl) uppercase" />
        {personal.jobTitle && <p className={cn(tw.small, tw.faint, "mt-2 tracking-[0.2em] uppercase")}>{personal.jobTitle}</p>}
        {details.length > 0 && <p className={cn(tw.small, tw.muted, "mt-3")}>{details.join("   |   ")}</p>}
      </header>

      <ResumeSections resume={resume} Section={Section} variants={{ skills: "inline" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={tw.gap}>
      <h2 className={cn(tw.heading, "flex items-center gap-4 font-semibold tracking-[0.2em] text-(--tpl) uppercase")}>
        <span className={cn(tw.line, "h-px flex-1")} />
        {title}
        <span className={cn(tw.line, "h-px flex-1")} />
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
