import Link from "next/link";

import FaqItem from "@/components/home/faq-item";
import SectionHeading from "@/components/home/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_SECTION, FAQS } from "@/constants/home";

export default function FaqSection() {
  if (!FAQS.length) return null;

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-8 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="faq-title" title={FAQ_SECTION.title} subtitle={FAQ_SECTION.subtitle} />
        <Accordion className="gap-3">
          {FAQS.map((faq, index) => (
            <FaqItem key={faq.question} value={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have a question?{" "}
          <Link href="/contact" className="font-medium text-brand underline-offset-4 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
