import { FC } from "react";
import { Button } from "@/components/ui/button";

export const CTA: FC = () => {
  return (
    <section className="bg-gradient-to-r from-slate-950 to-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to build your high-converting landing page?
          </h2>
          <p className="mt-6 text-xl leading-8 opacity-90">
            With ConvertFast, you can create stunning landing pages that turn visitors into customers. Start building for free and see the difference.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Get started for free
            </Button>
            <Button size="lg" className="w-full sm:w-auto">
              View documentation
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            No credit card required. Start building in minutes.
          </p>
        </div>
      </div>
    </section>
  );
};