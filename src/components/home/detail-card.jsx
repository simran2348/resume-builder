// `icon` is an optional lucide icon component.
export default function DetailCard({ title, info, icon: Icon }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md">
      {Icon ? (
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-glow text-brand">
          <Icon className="size-5" aria-hidden />
        </span>
      ) : (
        <span className="h-1 w-8 rounded-full bg-brand" aria-hidden />
      )}
      <h3 className="mt-3 text-lg font-semibold text-heading">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{info}</p>
    </div>
  );
}
