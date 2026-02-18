import { FC } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_ITEMS: FAQItem[] = [
  {
    question: "What does the new template option control?",
    answer: "It controls which segment source files are copied when you create or add sections to a page.",
  },
  {
    question: "Which template is the default?",
    answer: "The default remains the existing ConvertFast design and is selected with --template default.",
  },
  {
    question: "Can I switch style later?",
    answer: "Yes. You can add new sections from another template, or update generated files directly in your app.",
  },
  {
    question: "Does this change how dependencies are installed?",
    answer: "No. Segment dependencies are installed the same way for both templates.",
  },
];

export const FAQ: FC<{ items?: FAQItem[] }> = (props) => {
  const { items = DEFAULT_ITEMS } = props;

  return (
    <section id="faq" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Common questions</h2>
      </div>
      <Accordion type="single" collapsible className="divide-y rounded-2xl border">
        {items.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-none px-6">
            <AccordionTrigger className="py-5 text-left text-base">{faq.question}</AccordionTrigger>
            <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
