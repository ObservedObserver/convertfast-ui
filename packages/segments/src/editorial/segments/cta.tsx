import { Button } from "@/components/ui/button";
import { FC } from "react";

interface CTAData {
  title?: string;
  description?: string;
}

export const CTA: FC<CTAData> = (props) => {
  const {
    title = "Start with the template that matches your brand voice",
    description = "Use --template default for the current style, or --template editorial for a cleaner composition.",
  } = props;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-primary p-8 text-primary-foreground shadow-sm sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/85">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="secondary">
              Create page
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground">
              Read docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
