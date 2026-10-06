// `id` goes on the <h2> so the section can reference it with aria-labelledby.
export default function SectionHeading({ id, title, subtitle }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 id={id} className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-pretty text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
