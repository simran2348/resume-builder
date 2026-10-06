// Shared call-to-action button styles for the landing page (links and the upload button).
const CTA_BASE =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const CTA_PRIMARY = `${CTA_BASE} bg-brand text-brand-foreground shadow-sm hover:-translate-y-px hover:bg-brand/90 hover:shadow-md`;

export const CTA_SECONDARY = `${CTA_BASE} border border-brand/25 bg-card text-heading shadow-sm hover:-translate-y-px hover:border-brand/50 hover:shadow-md`;
