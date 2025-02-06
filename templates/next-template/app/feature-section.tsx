import { Button } from "@/components/ui/button";
import { FC } from "react";

interface FeatureItemProps {
  title: string;
  description: string;
  imageUrl: string;
  isImageLeft: boolean;
}

const DEFAULT_ITEMS: FeatureItemProps[] = [
  {
    title: "Extended Reference from Web",
    description:
      "Pixno can understand all kinds of information in your pictures, including text, chart like Venn or statistical graph.",
    imageUrl: "/image 14.png", 
    isImageLeft: false,
  },
  {
    title: "Get More from Your Readings",
    description:
      "Pixno can enhance the credibility of generated notes by referencing relevant articles. It also expands your content through web searches.",
    imageUrl: "/Rectangle 18.png", 
    isImageLeft: true,
  },
  {
    title: "Seamless Multi-Device Sync",
    description:
      "Pixno can understand all kinds of information in your pictures, including text, chart like Venn or statistical graph.",
    imageUrl: "/image 9.png", 
    isImageLeft: false,
  },
];

const FeatureItem: FC<FeatureItemProps> = ({ title, description, imageUrl, isImageLeft }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center">
    {isImageLeft && (
      <div className="relative order-1 md:order-1">
        <img
          className="w-full max-w-2xl rounded-xl shadow-xl ring-1 ring-gray-400/10"
          src={imageUrl}
          alt={title}
        />
      </div>
    )}
    <div className={`order-2 ${isImageLeft ? "md:order-2" : "md:order-1"} flex flex-col items-center md:items-start`}>
      <h3 className="text-3xl font-bold tracking-tight text-foreground text-center md:text-left">{title}</h3>
      <p className="my-6 text-md/6 text-muted-foreground text-center md:text-left">{description}</p>
      {!isImageLeft && (
        <Button size="lg" className="w-full my-3 sm:w-auto bg-foreground text-background" asChild>
          <a href="#start">Get started free</a>
        </Button>
      )}
    </div>
    {!isImageLeft && (
      <div className="order-1 md:order-2 relative w-full max-w-2xl mx-auto">
        <div className="relative">
          <img
            className="w-full rounded-xl shadow-xl ring-1 ring-gray-400/10"
            src={imageUrl}
            alt={title}
          />
        </div>
      </div>
    )}
  </div>
);

export const FeatureSection: FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div className="mx-auto max-w-4xl text-center mb-16">
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
          Images to knowledge
        </h2>
        <p className="mt-6 text-lg/6 text-muted-foreground">
          Pixno transforms your smartphone into an AI-powered note-taking tool. Capture, organize, and enhance your ideas—all from your pocket.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-16">
        {DEFAULT_ITEMS.map((feature) => (
          <FeatureItem key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
};