import { Button } from "@/components/ui/button";
import { FC } from "react";

export const HeroSection: FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-6xl font-bold leading-tight">
            Efficiency{" "}
            <span className="relative inline-block">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[0.5em] bg-primary/80"
              ></span>
              <span className="relative">note</span>
            </span>{" "}
            <span className="relative inline-block">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[0.5em] bg-primary/80"
              ></span>
              <span className="relative">generating</span>
            </span>{" "}
            during class
          </h1>

          <p className="my-4 text-muted-foreground text-md/6">
            Photos can convert photos of your class notes, whiteboard content, and slides into structured digital notes. It’ll greatly improve your learning efficiency and enhance your learning experience.
          </p>

          <Button size="lg" className="w-full my-3 sm:w-auto bg-foreground text-background" asChild>
            <a href="#start">
            Get started free
            </a>
          </Button>

          <div className="mt-4 flex flex-col text-muted-foreground">
            <div className="mb-3 text-md/6">Work with</div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <a href="https://evernote.com" target="_blank" rel="noopener noreferrer">
                <img src="/Vector.svg" alt="Evernote" className="w-8 h-8" />
              </a>
              <a href="https://www.microsoft.com/en-us/microsoft-365/word" target="_blank" rel="noopener noreferrer">
                <img src="/Microsoft Word 2019.svg" alt="Microsoft Word" className="w-8 h-8" />
              </a>
              <a href="https://docs.google.com/" target="_blank" rel="noopener noreferrer">
                <img src="/Google Docs.svg" alt="Google Docs" className="w-8 h-8" />
              </a>
              <a href="https://obsidian.md/" target="_blank" rel="noopener noreferrer">
                <img src="/Obsidian.svg" alt="Obsidian" className="w-8 h-8" />
              </a>
              <a href="https://www.evernote.com/" target="_blank" rel="noopener noreferrer">
                <img src="/Evernote.svg" alt="Evernote" className="w-8 h-8" />
              </a>
            </div>   
          </div>
        </div>

        <div className="flex-1 mt-10 md:mt-0 md:ml-10 relative">
            <img
              src="https://nn2vn3p4ioupal4a.public.blob.vercel-storage.com/homepage/use-case/book_hero-2b7WSLagaAgHITvZiLbBD0GewsONQq.png"
              alt="Phone Interface"
              width={2432}
              height={1442}
              
            />
        </div>
      </div>
    </section>
  );
};
