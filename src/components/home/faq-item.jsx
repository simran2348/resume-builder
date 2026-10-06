import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Must be rendered inside an <Accordion>. The trigger exposes aria-expanded / aria-controls.
// `answer` is a string, or an array of paragraphs where an item can be `{ list: [...] }`.
export default function FaqItem({ question, answer, value }) {
  const blocks = Array.isArray(answer) ? answer : [answer];

  return (
    <AccordionItem
      value={value}
      className="rounded-xl border border-border bg-card/80 px-5 backdrop-blur-sm transition-colors data-open:border-brand/40"
    >
      {/* AccordionTrigger renders inside an <h3> (Base UI Accordion.Header). */}
      <AccordionTrigger className="py-4 text-base font-medium text-foreground hover:no-underline">
        {question}
      </AccordionTrigger>
      <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
        {blocks.map((block, i) =>
          typeof block === "string" ? (
            <p key={i}>{block}</p>
          ) : (
            <ul key={i} className="list-disc space-y-1 pl-5 marker:text-brand not-last:mb-4">
              {block.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
