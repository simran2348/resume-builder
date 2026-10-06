// `icon` is an optional lucide icon component.
export default function DetailCard({ title, info, icon: Icon }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card/80 p-6 text-card-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-brand/40">
      {Icon ? (
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-glow text-brand">
          <Icon className="size-5" aria-hidden />
        </span>
      ) : (
        <span className="h-1 w-8 rounded-full bg-brand" aria-hidden />
      )}
      <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{info}</p>
    </div>
  );
}
