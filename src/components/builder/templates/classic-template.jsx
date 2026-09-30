/* eslint-disable @next/next/no-img-element -- photo is a local data URL */

// Single-column, top-to-bottom layout. Colours are fixed (not theme tokens) because this is the printed page.
export default function ClassicTemplate({ resume, showPhoto = false }) {
  const { personal, summary } = resume;

  const contacts = [personal.email, personal.phone, personal.location].filter(Boolean);
  const links = [personal.linkedin, personal.github, personal.website].filter(Boolean);
  const hasHeaderDetails = contacts.length > 0 || links.length > 0;

  return (
    <div className="px-14 py-12 font-sans text-[13px] leading-relaxed text-neutral-800">
      <header className="flex items-center gap-6">
        {showPhoto && (
          <div className="size-24 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200">
            {personal.photo && (
              <img src={personal.photo} alt="" className="size-full object-cover" />
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h1
            className={
              personal.fullName
                ? "text-3xl font-bold tracking-tight text-neutral-900"
                : "text-3xl font-bold tracking-tight text-neutral-300"
            }
          >
            {personal.fullName || "Your Name"}
          </h1>
          {personal.jobTitle && (
            <p className="mt-1 text-base font-medium text-neutral-600">{personal.jobTitle}</p>
          )}

          {hasHeaderDetails && (
            <div className="mt-3 space-y-0.5 text-[12px] text-neutral-600">
              {contacts.length > 0 && <p>{contacts.join("  |  ")}</p>}
              {links.length > 0 && <p>{links.join("  |  ")}</p>}
            </div>
          )}
        </div>
      </header>

      {summary && (
        <Section title="Professional Summary">
          <p className="whitespace-pre-line">{summary}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-neutral-300 pb-1 text-[12px] font-bold tracking-[0.12em] text-neutral-900 uppercase">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
