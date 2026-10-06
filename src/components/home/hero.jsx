import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";

import ResumeUpload from "@/components/home/resume-upload";
import { buttonVariants } from "@/components/ui/button";
import { HERO_CONTENT } from "@/constants/home";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    // Fills the viewport below the header so the product information only appears on scroll.
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-4 pt-8 pb-24 sm:px-6 md:min-h-[calc(100svh-5rem)]"
    >
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <span className="mb-5 rounded-full border border-brand/20 bg-brand-glow px-3 py-1 text-xs font-medium text-brand">
          {HERO_CONTENT.badge}
        </span>
        <h1 id="hero-title" className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          {HERO_CONTENT.title}
        </h1>
        <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">{HERO_CONTENT.subtitle}</p>

        <div className="mt-10 w-full text-left">
          <h2 className="mb-2 text-sm font-semibold text-foreground">{HERO_CONTENT.uploadTitle}</h2>
          <ResumeUpload />
          <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="mt-px size-3.5 shrink-0 text-brand" aria-hidden />
            {HERO_CONTENT.uploadHint} {HERO_CONTENT.privacyNote}
          </p>
        </div>

        <div className="my-6 flex w-full items-center gap-4 text-xs tracking-wider text-muted-foreground uppercase">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          href="/templates"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full gap-2 rounded-xl bg-brand px-6 text-base text-brand-foreground shadow-sm hover:bg-brand/90 focus-visible:ring-brand/40 sm:w-auto"
          )}
        >
          {HERO_CONTENT.createButtonLabel}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      {/* Subtle cue that there's more below; sits in the hero's bottom padding so it never covers the actions. */}
      <a
        href="#about"
        aria-label="Scroll to learn more about Rireki"
        className="absolute bottom-6 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-brand/40"
      >
        <ChevronDown className="size-6 motion-safe:animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
