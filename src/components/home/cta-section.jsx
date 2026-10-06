import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ResumeUpload from "@/components/home/resume-upload";
import { DotGrid, Ring } from "@/components/ui/decor";
import { CTA_SECTION, HERO_CONTENT } from "@/constants/home";

export default function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="px-4 pt-8 pb-24 sm:px-6 lg:px-8">
      <div className="reveal relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-deep px-6 py-16 text-center shadow-[0_30px_60px_-30px_rgba(37,99,235,0.6)] sm:px-12 sm:py-20">
        <Ring className="-top-24 -left-24 size-72 border-white/15" />
        <Ring className="-right-16 -bottom-32 size-80 border-white/15" />
        <DotGrid className="top-6 right-10 hidden size-32 text-white/40 sm:block" />

        <div className="relative mx-auto max-w-2xl">
          <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            {CTA_SECTION.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pretty text-blue-50/90">{CTA_SECTION.subtitle}</p>

          <div className="mt-9 [&>div>div:first-child]:justify-center [&_[aria-live]>div]:mx-auto">
            <ResumeUpload
              inverted
              label={HERO_CONTENT.uploadButtonLabel}
              buttonClassName="border border-white/40 bg-white/10 text-white shadow-none hover:bg-white/20 peer-focus-visible:ring-white/60 peer-focus-visible:ring-offset-brand"
              before={
                <Link
                  href="/templates"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-brand-deep shadow-sm transition-all outline-none hover:-translate-y-px hover:shadow-md focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
                >
                  {HERO_CONTENT.createButtonLabel}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
