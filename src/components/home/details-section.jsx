import DetailCard from "@/components/home/detail-card";
import SectionHeading from "@/components/home/section-heading";
import { APP_DETAILS, DETAILS_SECTION } from "@/constants/home";

export default function DetailsSection() {
  if (!APP_DETAILS.length) return null;

  return (
    <section id="details" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title={DETAILS_SECTION.title} subtitle={DETAILS_SECTION.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APP_DETAILS.map((detail, index) => (
            <DetailCard key={index} title={detail.title} info={detail.info} />
          ))}
        </div>
      </div>
    </section>
  );
}
