// Page backdrop: a soft blue wash at the top of the page with two blurred shapes. It scrolls with the page
// (absolute, not fixed) so long pages settle into a plain background below the fold.
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, var(--brand-blue-glow), var(--brand-soft) 45%, transparent)" }}
      />
      <div className="absolute -top-40 -right-32 size-[520px] rounded-full bg-brand/15 blur-3xl dark:bg-brand/20" />
      <div className="absolute top-40 -left-48 hidden size-[420px] rounded-full bg-sky-300/25 blur-3xl sm:block dark:bg-sky-400/10" />
    </div>
  );
}
