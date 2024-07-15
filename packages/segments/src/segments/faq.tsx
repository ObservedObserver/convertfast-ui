import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Why use ConvertFast to build landing pages?",
    answer:
      "ConvertFast provides a comprehensive set of tools and pre-built components specifically designed for creating high-converting landing pages. Our intuitive interface, customizable templates, and optimized code export save you time and effort while ensuring professional results.",
  },
  {
    question: "Is ConvertFast open source?",
    answer:
      "Yes, ConvertFast is an open-source project. This means you can use, modify, and contribute to the codebase. We believe in transparency and community-driven development, which helps us continually improve and adapt to developers' needs.",
  },
  {
    question: "How does ConvertFast compare to other landing page builders?",
    answer:
      "ConvertFast stands out by focusing on developers' needs. Unlike traditional drag-and-drop builders, we provide clean, exportable code that integrates seamlessly with your existing projects. Our components are based on popular libraries like shadcn, ensuring high-quality, customizable UI elements.",
  },
  {
    question: "Can I use ConvertFast with my preferred frontend framework?",
    answer:
      "Absolutely! ConvertFast is designed to be framework-agnostic. While our components are primarily React-based, the exported code can be easily adapted to work with other popular frontend frameworks like Vue, Angular, or even vanilla JavaScript.",
  },
  {
    question: "Is there a learning curve to using ConvertFast?",
    answer:
      "ConvertFast is designed to be intuitive for developers familiar with modern web development practices. If you're comfortable with React and component-based architecture, you'll find ConvertFast easy to use. We also provide comprehensive documentation and examples to help you get started quickly.",
  },
];

export const FAQ: FC = () => {
  return (
    <section className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 to-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg shadow-sm border"
              >
                <AccordionTrigger className="px-4 py-4">
                  <span className="text-left font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
