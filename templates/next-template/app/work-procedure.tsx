"use client";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "Create Notebook",
    description:
      "Once you've signed in, the intuitive Photos interface welcomes you. To start capturing your classroom content, click on the 'New Notebook' button. Name your notebook to keep your notes organized by subject or topic. This step ensures all your photos and AI-generated notes are stored in one place for easy access later.",
    image: "https://nn2vn3p4ioupal4a.public.blob.vercel-storage.com/homepage/use-case/lecture_step_1-lRFoXtYfI01hHJcR9meouDewFTLNA9.png",
  },
  {
    id: 2,
    title: "Take Photos or Import Images",
    description:
      "Once you've signed in, the intuitive Photos interface welcomes you. To start capturing your classroom content, click on the 'New Notebook' button. Name your notebook to keep your notes organized by subject or topic. This step ensures all your photos and AI-generated notes are stored in one place for easy access later.",
    image: "https://nn2vn3p4ioupal4a.public.blob.vercel-storage.com/homepage/use-case/lecture_step_2-oRbW0jedZn0Fak3YdGgOmwPtqO3jpE.png",
  },
  {
    id: 3,
    title: "Review, Edit, and Export",
    description:
      "Once you've signed in, the intuitive Photos interface welcomes you. To start capturing your classroom content, click on the 'New Notebook' button. Name your notebook to keep your notes organized by subject or topic. This step ensures all your photos and AI-generated notes are stored in one place for easy access later.",
    image: "https://nn2vn3p4ioupal4a.public.blob.vercel-storage.com/homepage/use-case/lecture_step_3-RZzWqVqEGU4dg4Ip5Zp6zwTWGrLz89.png",
  },
];

export const HowItWorks: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <section className="bg-accent py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center">How it works</h2>

        <div className="mt-10 flex flex-col md:flex-row gap-10">
          <div className="block md:hidden">
            {steps.map((step) => (
              <div
                key={step.id}
                className="mb-8 p-4"
              >
                <img
                  src={step.image}
                  alt={`Step ${step.id}`}
                  className="bg-white rounded-3xl mb-4"
                />
                <h3 className="text-lg font-semibold">{step.id}. {step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="hidden md:flex flex-1 bg-white rounded-3xl overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={steps.find((step) => step.id === currentStep)?.image}
              alt="Step Image"
            />
          </div>

          <div className="hidden md:flex flex-col flex-1 justify-center">
            <ol className="space-y-6">
              {steps.map((step) => (
                <li
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className="relative flex cursor-pointer items-start"
                >
                  <span
                    className={`absolute left-0 w-1 rounded-xl ${
                      step.id === currentStep ? "bg-primary" : "bg-gray-300"
                    }`}
                    style={{ height: "100%" }}
                  ></span>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">
                      {step.id}. {step.title}
                    </h3>
                    {step.id === currentStep && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <div className="w-full mt-6">
              <Button size="lg" className="bg-foreground text-background" asChild>
                <a href="#start">Get started free</a>
              </Button>
            </div>

            
          
          </div>
        </div>
      </div>
    </section>
  );
};