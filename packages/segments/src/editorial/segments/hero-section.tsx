import { Button } from "@/components/ui/button";
import { FC } from "react";

const metrics = [
  { label: "Pages shipped", value: "1.2k+" },
  { label: "Avg launch time", value: "12 min" },
  { label: "Teams using it", value: "350+" },
];

export const HeroSection: FC = () => {
  return (
    <section className="relative overflow-hidden border-y bg-zinc-50/40 dark:bg-zinc-950/50">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-end lg:px-8 lg:py-28">
        <div>
          <p className="mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Editorial Template
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Ship your landing page with a cleaner, story-first layout
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            ConvertFast now supports template variants. Start with the default look or switch to an editorial style to
            emphasize copy, hierarchy, and whitespace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#pricing">Launch this template</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#faq">View FAQ</a>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-background/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Performance snapshot</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border bg-background p-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{metric.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-primary">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
