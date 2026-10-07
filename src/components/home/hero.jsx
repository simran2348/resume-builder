import Link from "next/link";
import { ChevronDown, CircleCheck, Plus, ShieldCheck } from "lucide-react";

import { CTA_SECONDARY } from "@/components/home/cta-styles";
import HeroPreview from "@/components/home/hero-preview";
import ResumeUpload from "@/components/home/resume-upload";
import { HERO_CONTENT, UPLOAD_CONFIG } from "@/constants/home";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative px-4 pt-10 pb-28 sm:px-6 md:pt-16 lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center lg:px-8 lg:pt-8"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
          <h1
            id="hero-title"
            className="text-4xl leading-[1.08] font-bold tracking-tight text-balance text-heading sm:text-5xl lg:text-6xl"
          >
            {HERO_CONTENT.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {HERO_CONTENT.subtitle}
          </p>

          {/* Real actions: upload goes through /api/resume/parse, create opens the template picker. */}
          <div id="get-started" className="mt-9 max-w-xl scroll-mt-8">
            <ResumeUpload
              label={HERO_CONTENT.uploadButtonLabel}
              // The text column is narrowest between lg and xl, so the buttons stack there.
              rowClassName="lg:grid-cols-1 xl:grid-cols-2"
              after={
                <Link href="/templates" className={CTA_SECONDARY}>
                  <Plus className="size-4" aria-hidden />
                  {HERO_CONTENT.createButtonLabel}
                </Link>
              }
            />
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-px size-3.5 shrink-0 text-brand" aria-hidden />
              PDF or Word (.docx), up to {UPLOAD_CONFIG.maxSizeMB} MB. {HERO_CONTENT.privacyNote}
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {HERO_CONTENT.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm font-medium text-heading">
                <CircleCheck className="size-4 text-brand" aria-hidden />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-150 motion-safe:duration-700 motion-safe:fill-mode-both">
          <HeroPreview />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to learn more"
        className="absolute bottom-6 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:text-heading focus-visible:ring-3 focus-visible:ring-brand/40"
      >
        <ChevronDown className="size-6 motion-safe:animate-float" aria-hidden />
      </a>
    </section>
  );
}
