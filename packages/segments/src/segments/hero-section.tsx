// import { BGShapeCircle } from "@/components/bg-shape-circle";
import { Button } from "@/components/ui/button";
import { FC } from "react";

interface HeroSectionProps {
  title?: string;
  description?: string;
  bannerImage?: string;
  bannerImageDark?: string;
  hint?: string;
  startButtonText?: string;
  learnMoreButtonText?: string;
}

export const HeroSection: FC<HeroSectionProps> = (props) => {
  const {
    title = "Bootstrap your landing page with ConvertFast UI",
    description = "Build stunning landing pages with ease and convert your customers faster than ever.",
    bannerImage = "https://ui.convertfa.st/images/graphic-walker-light-2.png",
    bannerImageDark = "https://ui.convertfa.st/images/graphic-walker-dark-2.png",
    hint = "Free and open-source. No credit card required.",
    startButtonText = "Start now",
    learnMoreButtonText = "Learn more",
  } = props;
  return (
    <div className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 to-black relative">
      <div className="absolute bg-[url('/_convertfast/gradient-bg-0.svg')] bg-auto bg-no-repeat z-0 inset-0 top-0 bottom-0 left-0 right-0 grayscale"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 drop-shadow-md">
            {title}
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <a href="#start">{startButtonText}</a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <a href="#start">{learnMoreButtonText}</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">{hint}</p>
        </div>

        <img
          alt="app screenshot"
          src={bannerImage}
          width={2432}
          height={1442}
          className="mt-8 rounded-md shadow-2xl border sm:mt-12 block dark:hidden"
        />
        <img
          alt="app screenshot"
          src={bannerImageDark}
          width={2432}
          height={1442}
          className="mt-8 rounded-md shadow-2xl border sm:mt-12 hidden dark:block"
        />
      </div>
    </div>
  );
};
