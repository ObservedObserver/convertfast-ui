import { Button } from "@/components/ui/button";
import { FC } from "react";

export const HeroSection: FC = () => {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6">
            Bootstrap your landing page with ConvertFast UI
          </h1>
          <p className="text-xl sm:text-2xl text-secondary-foreground mb-8">
            Build stunning landing pages with ease and convert your customers
            faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Start now
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <code className="p-1 rounded">
                npm install convertfast-ui
              </code>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Free and open-source. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};
