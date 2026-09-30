import FaqItem from "@/components/home/faq-item";
import SectionHeading from "@/components/home/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_SECTION, FAQS } from "@/constants/home";

export default function FaqSection() {
  if (!FAQS.length) return null;

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title={FAQ_SECTION.title} subtitle={FAQ_SECTION.subtitle} />
        <Accordion className="gap-3">
          {FAQS.map((faq, index) => (
            <FaqItem key={index} value={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
