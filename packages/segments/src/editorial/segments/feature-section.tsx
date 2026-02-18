import { Button } from "@/components/ui/button";
import { FC } from "react";

interface FeatureItemProps {
  title: string;
  description: string;
  imageUrl: string;
  isImageLeft: boolean;
}

const FeatureItem: FC<FeatureItemProps> = ({ title, description, imageUrl, isImageLeft }) => (
  <article className="grid items-center gap-8 border-t py-10 first:border-t-0 md:grid-cols-5 md:gap-10">
    <div className={`${isImageLeft ? "md:col-span-2" : "md:col-span-3 md:order-2"}`}>
      <img src={imageUrl} alt={title} className="w-full rounded-xl border object-cover shadow-sm" />
    </div>
    <div className={`${isImageLeft ? "md:col-span-3" : "md:col-span-2 md:order-1"}`}>
      <h3 className="text-2xl font-semibold text-primary sm:text-3xl">{title}</h3>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
      <Button className="mt-6" variant="secondary">
        Explore feature
      </Button>
    </div>
  </article>
);

const DEFAULT_ITEMS: FeatureItemProps[] = [
  {
    title: "Narrative-first page structure",
    description:
      "Guide visitors from headline to proof to offer with deliberate spacing and clear visual cadence.",
    imageUrl: "https://ui.convertfa.st/images/graphic-walker-light-2.png",
    isImageLeft: true,
  },
  {
    title: "Cleaner visual density",
    description:
      "The editorial theme reduces decorative noise and shifts emphasis to copy, product shots, and social trust.",
    imageUrl: "https://ui.convertfa.st/images/convertfast-ui-cli.png",
    isImageLeft: false,
  },
  {
    title: "Still fully component-driven",
    description:
      "Every section remains regular React code so you can swap content, move blocks, and adapt visuals quickly.",
    imageUrl: "https://ui.convertfa.st/images/convertfast-ui-light-demo.png",
    isImageLeft: true,
  },
];

interface FeatureSectionProps {
  items?: FeatureItemProps[];
  brand?: string;
  title?: string;
  description?: string;
}

export const FeatureSection: FC<FeatureSectionProps> = (props) => {
  const {
    items = DEFAULT_ITEMS,
    brand = "ConvertFast",
    title = "Build pages with sharper hierarchy",
    description = "Use the editorial template when you want a calmer, copy-led look with strong section rhythm.",
  } = props;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{brand}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">{title}</h2>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
      </header>
      <div className="mt-10">{items.map((feature, index) => <FeatureItem key={index} {...feature} />)}</div>
    </section>
  );
};
