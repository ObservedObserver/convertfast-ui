import { Button } from "@/components/ui/button";
import { FC } from "react";

export const HeroSection: FC = () => {
  return (
    <div className="p-16 mx-auto">
      <div className="max-w-3xl">
        <h1 className="text-6xl my-8 font-semibold">
          Bootstrap your landing page with convertfast-ui
        </h1>
        <p className="text-2xl my-6">
          Build landing page with ease and convert your customers fast.
        </p>
        <div className="flex gap-2 mt-2">
          <Button>Start now</Button>
          <Button variant="outline">npm install convertfast-ui</Button>
        </div>
      </div>
    </div>
  );
};
