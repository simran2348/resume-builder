import { cn } from "@/lib/utils";

// `id` goes on the <h2> so the section can reference it with aria-labelledby.
export default function SectionHeading({ id, eyebrow, title, subtitle, align = "center", className }) {
  return (
    <div className={cn("mb-12 max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && <p className="mb-3 text-sm font-semibold tracking-wide text-brand">{eyebrow}</p>}
      <h2 id={id} className="text-3xl font-bold tracking-tight text-balance text-heading sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
