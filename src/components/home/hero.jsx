import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import ResumeUpload from "@/components/home/resume-upload";
import { buttonVariants } from "@/components/ui/button";
import { HERO_CONTENT } from "@/constants/home";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    // Fills the viewport below the sticky header so the details only appear on scroll.
    <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 md:min-h-[calc(100svh-5.5rem)]">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <span className="mb-5 rounded-full border border-brand/20 bg-brand-glow px-3 py-1 text-xs font-medium text-brand">
          {HERO_CONTENT.badge}
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          {HERO_CONTENT.title}
        </h1>
        <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
          {HERO_CONTENT.subtitle}
        </p>

        <div className="mt-10 w-full">
          <ResumeUpload />
        </div>

        <div className="my-6 flex w-full items-center gap-4 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <Link
          href="/builder"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full gap-2 rounded-xl bg-brand px-6 text-base text-brand-foreground shadow-sm hover:bg-brand/90 focus-visible:ring-brand/40 sm:w-auto"
          )}
        >
          {HERO_CONTENT.createButtonLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <a
        href="#details"
        aria-label="Scroll to learn more"
        className="absolute bottom-6 hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </a>
    </section>
  );
}
