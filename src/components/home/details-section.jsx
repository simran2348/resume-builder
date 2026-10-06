import DetailCard from "@/components/home/detail-card";
import SectionHeading from "@/components/home/section-heading";
import { APP_DETAILS, DETAILS_SECTION } from "@/constants/home";

export default function DetailsSection() {
  if (!APP_DETAILS.length) return null;

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-8 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="features-title" title={DETAILS_SECTION.title} subtitle={DETAILS_SECTION.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APP_DETAILS.map((detail) => (
            <DetailCard key={detail.title} title={detail.title} info={detail.info} icon={detail.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
