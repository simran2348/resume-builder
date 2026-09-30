import { ContactList, Name, Photo, ResumeSections, getContacts, getLinks, themeStyle, tw } from "@/components/builder/templates/shared";
import { cn } from "@/lib/utils";

// Single-column, top-to-bottom layout, optionally with a photo.
export default function ClassicTemplate({ resume, theme, showPhoto = false }) {
  const { personal } = resume;
  const contacts = getContacts(personal);
  const links = getLinks(personal);

  return (
    <div style={themeStyle(theme)} className={cn(tw.root, tw.padX, tw.padY)}>
      <header className="flex items-center gap-6">
        {showPhoto && <Photo src={personal.photo} className="size-24" />}
        <div className="min-w-0 flex-1">
          <Name value={personal.fullName} className="tracking-tight" />
          {personal.jobTitle && <p className={cn(tw.title, "mt-1 font-medium text-(--tpl)")}>{personal.jobTitle}</p>}
          {(contacts.length > 0 || links.length > 0) && (
            <div className={cn(tw.small, tw.muted, "mt-3 space-y-0.5")}>
              <ContactList items={contacts} theme={theme} />
              <ContactList items={links} theme={theme} />
            </div>
          )}
        </div>
      </header>

      <ResumeSections resume={resume} Section={Section} titles={{ summary: "Professional Summary" }} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={tw.gap}>
      <h2 className={cn(tw.heading, tw.rule, "border-b pb-1 font-bold tracking-[0.12em] text-(--tpl) uppercase")}>
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
