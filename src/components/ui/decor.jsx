import { cn } from "@/lib/utils";

// Small decorative kit shared by the landing and content pages. Everything here is purely visual:
// hidden from assistive technology and ignored by the pointer. Position with `className`.

// Large, heavily blurred light-blue shape.
export function Blob({ className, tone = "brand" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        tone === "brand" ? "bg-brand/15 dark:bg-brand/20" : "bg-sky-300/25 dark:bg-sky-400/10",
        className
      )}
    />
  );
}

// A patch of small dots that fades out towards its edges.
export function DotGrid({ className }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute text-brand/30", className)}
      style={{
        backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
        backgroundSize: "16px 16px",
        maskImage: "radial-gradient(closest-side, black, transparent)",
        WebkitMaskImage: "radial-gradient(closest-side, black, transparent)",
      }}
    />
  );
}

// Two thin, soft curves. Stretches to the size given by `className`.
export function Waves({ className }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 200"
      preserveAspectRatio="none"
      fill="none"
      className={cn("pointer-events-none absolute text-brand", className)}
    >
      <path
        d="M0 120 C 160 40, 320 200, 480 110 S 720 40, 800 90"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
      <path
        d="M0 150 C 180 80, 340 210, 500 140 S 730 80, 800 120"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Thin outlined circle.
export function Ring({ className }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute rounded-full border border-brand/15", className)} />
  );
}
