import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardItemProps = {
  image: string;
  title: string;
  category: string;
  description: string;
  roundedClasses: string;
};

const CardItem: React.FC<CardItemProps> = ({
  image,
  title,
  category,
  description,
  roundedClasses,
}) => {
  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", roundedClasses)}>
      <div className="w-full overflow-hidden">
        <img
          className="w-full h-80 object-cover"
          src={image}
          alt={title}
        />
      </div>
      <div className="flex flex-col ">
        <h3 className="px-6 pt-8 text-sm text-muted-foreground font-semibold">{category}</h3>
        <p className="px-6 py-2 text-base text-primary font-semibold">{title}</p>
        <p className="px-6 pb-8 text-sm text-muted-foreground max-w-lg">{description}</p>
      </div>

    </Card>
  );
};

export function BentoGrids() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base font-semibold leading-7 text-muted-foreground">
          Deploy faster
        </h2>
        <p className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
          Everything you need to deploy your app
        </p>

        <div className="mt-10 grid gap-4 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div className="col-span-1 lg:col-span-2">
              <CardItem
                image="https://ui.convertfa.st/images/graphic-walker-dark-2.png"
                category="Releases"
                title="Mobile friendly"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In gravida justo et nulla efficitur, maximus egestas sem pellentesque."
                roundedClasses="lg:rounded-l-3xl rounded-t-3xl"
              />
            </div>

            <CardItem
              image="https://ui.convertfa.st/images/graphic-walker-dark-2.png"
              category="Integrations"
              title="Performance"
              description="Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit."
              roundedClasses="lg:rounded-r-3xl" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <CardItem
              image="https://ui.convertfa.st/images/graphic-walker-dark-2.png"
              category="Security"
              title="Security"
              description="Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi."
              roundedClasses="lg:rounded-l-3xl"
            />

            <div className="col-span-1 lg:col-span-2">
              <CardItem
                image="https://ui.convertfa.st/images/graphic-walker-dark-2.png"
                category="Performance"
                title="Powerful APIs"
                description="Sed congue eros non finibus molestie. Vestibulum euismod augue vel commodo vulputate. Maecenas at augue sed elit dictum vulputate."
                roundedClasses="lg:rounded-r-3xl rounded-b-3xl" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}