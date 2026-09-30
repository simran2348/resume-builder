export default function DetailCard({ title, info }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-card/80 p-6 text-card-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-brand/40">
      <span className="h-1 w-8 rounded-full bg-brand" />
      <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{info}</p>
    </div>
  );
}
