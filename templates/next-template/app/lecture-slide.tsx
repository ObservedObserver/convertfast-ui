import React from "react";
import { Button } from "@/components/ui/button";

export const LectureSlideComponent = () => {
  return (
    <section className="max-w-7xl mx-auto flex justify-center items-center ">
      <div className="w-full mx-auto my-16 p-32 flex justify-center items-center bg-accent rounded-none xl:rounded-3xl ">
        <div className="text-center">
          <h2 className="max-w-md mx-auto text-4xl font-bold mb-4">
            Turn Lecture Slides into Study-Ready Notes
          </h2>

          <p className="text-muted-foreground mb-6">
            Capture classroom content instantly and transform it into structured text.
          </p>

          <Button size="lg" className="w-full my-3 sm:w-auto bg-foreground text-background" asChild>
            <a href="#start">
              Get started free
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};