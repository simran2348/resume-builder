import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";

import FaqItem from "@/components/home/faq-item";
import SectionHeading from "@/components/home/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_SECTION, FAQS } from "@/constants/home";

export default function FaqSection() {
  if (!FAQS.length) return null;

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="reveal mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow={FAQ_SECTION.eyebrow}
            title={FAQ_SECTION.title}
            subtitle={FAQ_SECTION.subtitle}
            className="mb-6"
          />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircleQuestion className="size-4 text-brand" aria-hidden />
            Still have a question?{" "}
            <Link href="/contact" className="font-medium text-brand underline-offset-4 hover:underline">
              Contact us
            </Link>
          </p>
        </div>

        <Accordion className="gap-3">
          {FAQS.map((faq, index) => (
            <FaqItem key={faq.question} value={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
