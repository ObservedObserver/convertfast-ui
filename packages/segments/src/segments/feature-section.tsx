import { Button } from "@/components/ui/button";
import { FC } from "react";

interface FeatureProps {
  title: string;
  description: string;
  imageUrl: string;
  isImageLeft: boolean;
}

const Feature: FC<FeatureProps> = ({ title, description, imageUrl, isImageLeft }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    {isImageLeft && (
      <div className="order-1 md:order-1">
        <img className="w-full max-w-2xl rounded-xl shadow-xl ring-1 ring-gray-400/10" src={imageUrl} alt={title} />
      </div>
    )}
    <div className={`order-2 ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
      <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
      <div className="mt-4">
        <Button variant="link">Learn more</Button>
      </div>
    </div>
    {!isImageLeft && (
      <div className="order-1 md:order-2">
        <img className="w-full max-w-2xl rounded-xl shadow-xl ring-1 ring-gray-400/10" src={imageUrl} alt={title} />
      </div>
    )}
  </div>
);

export const FeatureSection: FC = () => {
  const features: FeatureProps[] = [
    {
      title: "Rapid Landing Page Development",
      description: "Build stunning landing pages in minutes with our intuitive drag-and-drop interface and pre-designed components.",
      imageUrl: "/tmp-app.png",
      isImageLeft: true,
    },
    {
      title: "Customizable Templates",
      description: "Choose from a wide range of professionally designed templates and easily customize them to match your brand.",
      imageUrl: "/tmp-app.png",
      isImageLeft: false,
    },
    {
      title: "Code Export and Integration",
      description: "Export clean, optimized code that seamlessly integrates with your existing projects, saving valuable development time.",
      imageUrl: "/tmp-app.png",
      isImageLeft: true,
    },
    {
      title: "Responsive Design",
      description: "Create mobile-friendly landing pages that look great on all devices, ensuring a consistent user experience.",
      imageUrl: "/tmp-app.png",
      isImageLeft: false,
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-semibold leading-7 text-primary">ConvertFast</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Everything you need to build landing pages
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          ConvertFast is a powerful landing page builder for developers, offering code templates and components inspired by shadcn. Create beautiful, functional landing pages quickly and efficiently.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-16">
        {features.map((feature, index) => (
          <Feature key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};