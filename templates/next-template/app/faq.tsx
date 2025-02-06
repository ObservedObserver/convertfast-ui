"use client";

import { FC,useState } from "react";
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

const DEFAULT_ITEMS: FAQItem[] = [
  {
    question: "What are the advantages of Pixno?",
    answer:
      "Convenient: Upload your photos and turn them into notes with a few clicks. Well-Structured: Turn your photos to well-structured text notes with AI. Muti-Export: Export the generated notes to any note-taking app you prefer. ",
  },
  {
    question: "Can I turn my photos into text notes for free?",
    answer:
      "Yes, ConvertFast is an open-source project. This means you can use, modify, and contribute to the codebase. We believe in transparency and community-driven development, which helps us continually improve and adapt to developers' needs.",
  },
  {
    question: "How to export my notes to Obsidian?",
    answer:
      "ConvertFast stands out by focusing on developers' needs. Unlike traditional drag-and-drop builders, we provide clean, exportable code that integrates seamlessly with your existing projects. Our components are based on popular libraries like shadcn, ensuring high-quality, customizable UI elements.",
  },
  {
    question: "What are the pricing plans?",
    answer:
      "Absolutely! ConvertFast is designed to be framework-agnostic. While our components are primarily React-based, the exported code can be easily adapted to work with other popular frontend frameworks like Vue, Angular, or even vanilla JavaScript.",
  },
  {
    question: "How to make my notes private?",
    answer:
      "ConvertFast is designed to be intuitive for developers familiar with modern web development practices. If you're comfortable with React and component-based architecture, you'll find ConvertFast easy to use. We also provide comprehensive documentation and examples to help you get started quickly.",
  },
];

export const FAQ: FC<{items?: FAQItem[]}> = (props) => {
  const { items = DEFAULT_ITEMS } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <section className="bg-gradient-to-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-center mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Need more help?{" "}
            <a
              href="#"
              className="text-primary underline hover:text-orange-700 transition"
            >
              Contact us
            </a>
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {items.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`rounded-lg shadow-sm border ${
                  activeIndex === index ? "bg-accent" : "bg-white dark:bg-black"
                }`}
              >
                <AccordionTrigger
                  onClick={() => handleToggle(index)}
                  className="px-4 py-4"
                >
                  <span className="text-left font-large text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 text-muted-foreground text-md ">
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
