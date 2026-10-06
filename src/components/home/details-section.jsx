import DetailCard from "@/components/home/detail-card";
import SectionHeading from "@/components/home/section-heading";
import { DotGrid, Waves } from "@/components/ui/decor";
import { APP_DETAILS, DETAILS_SECTION } from "@/constants/home";

export default function DetailsSection() {
  if (!APP_DETAILS.length) return null;

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-brand/10 bg-brand-soft px-5 py-16 sm:px-10 sm:py-20 lg:px-14">
        <Waves className="inset-x-0 top-0 h-40 w-full" />
        <DotGrid className="-right-10 -bottom-10 hidden size-56 md:block" />

        <div className="reveal relative">
          <SectionHeading
            id="features-title"
            eyebrow={DETAILS_SECTION.eyebrow}
            title={DETAILS_SECTION.title}
            subtitle={DETAILS_SECTION.subtitle}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {APP_DETAILS.map((detail) => (
              <DetailCard key={detail.title} title={detail.title} info={detail.info} icon={detail.icon} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
