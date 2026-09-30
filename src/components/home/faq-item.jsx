import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Must be rendered inside an <Accordion>.
export default function FaqItem({ question, answer, value }) {
  return (
    <AccordionItem
      value={value}
      className="rounded-xl border border-border bg-card/80 px-5 backdrop-blur-sm transition-colors data-open:border-brand/40"
    >
      <AccordionTrigger className="py-4 text-base font-medium text-foreground hover:no-underline">
        {question}
      </AccordionTrigger>
      <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
