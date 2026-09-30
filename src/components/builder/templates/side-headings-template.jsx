import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { Name, Photo, ResumeSections, accentStyle, getLinks } from "@/components/builder/templates/shared";

// Headshot header, then section titles sit in a left gutter next to their content.
export default function SideHeadingsTemplate({ resume, accent }) {
  const { personal } = resume;
  const contactRows = [
    [Mail, personal.email],
    [Phone, personal.phone],
    [MapPin, personal.location],
    ...getLinks(personal).map((link) => [Globe, link]),
  ].filter(([, value]) => value);

  return (
    <div style={accentStyle(accent)} className="font-sans text-[12.5px] leading-relaxed text-neutral-700">
      <div className="h-3 bg-(--tpl)" />
      <div className="px-12 py-10">
        <header className="flex items-start gap-6">
          <Photo src={personal.photo} className="size-28" />
          <div className="min-w-0 flex-1 pt-1">
            <Name value={personal.fullName} className="text-3xl font-bold tracking-tight text-(--tpl) uppercase" />
            {personal.jobTitle && <p className="mt-0.5 text-sm font-medium text-neutral-600">{personal.jobTitle}</p>}
            {contactRows.length > 0 && (
              <ul className="mt-3 space-y-1 text-[11.5px] text-neutral-600">
                {contactRows.map(([Icon, value]) => (
                  <li key={value} className="flex items-center gap-2">
                    <Icon className="size-3 text-(--tpl)" />
                    {value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <ResumeSections resume={resume} Section={Section} />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6 grid grid-cols-[140px_1fr] gap-6">
      <div>
        <span className="block h-0.5 w-14 bg-(--tpl)" />
        <h2 className="mt-1.5 text-[11px] font-bold tracking-wider text-neutral-900 uppercase">{title}</h2>
      </div>
      <div className="min-w-0 border-t border-neutral-200 pt-1.5">{children}</div>
    </section>
  );
}
