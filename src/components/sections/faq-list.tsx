import { Accordion, AccordionItem } from "@/components/ui/accordion";
import type { Faq } from "@/lib/schemas/content";

export function FaqList({
  items,
  titleId,
  title = "Working with me",
}: {
  items: Faq[];
  titleId: string;
  title?: string;
}) {
  return (
    <section
      aria-labelledby={titleId}
      className="rounded-3xl border border-border glass px-6 py-4 sm:px-8"
    >
      <h2 id={titleId} className="pt-4 pb-2 font-display text-xl font-semibold">
        {title}
      </h2>
      <Accordion>
        {items.map((item, i) => (
          <AccordionItem
            key={item.question}
            title={item.question}
            name="faq"
            defaultOpen={i === 0}
          >
            {item.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
