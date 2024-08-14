import { Card } from "@/components/ui/card";

const logos = [
  { name: "Google", src: "https://ui.convertfa.st/logos/Google.svg", alt: "Google logo" },
  { name: "Microsoft", src: "https://ui.convertfa.st/logos/Microsoft.svg", alt: "Microsoft logo" },
  { name: "Meta", src: "https://ui.convertfa.st/logos/Meta.svg", alt: "Meta logo" },
  { name: "OpenAI", src: "https://ui.convertfa.st/logos/OpenAI.svg", alt: "OpenAI logo" },
  { name: "Vercel", src: "https://ui.convertfa.st/logos/Vercel.svg", alt: "Vercel logo" },
];

export function LogoCloud() {
  return (
    <Card className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-white">
          Chosen by Forward-Thinking Enterprises
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {logos.map((logo, index) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.alt}
              width={158}
              height={48}
              className={`col-span-2 max-h-12 w-full object-contain grayscale dark:invert ${
                index === 3
                  ? "sm:col-start-2 lg:col-span-1"
                  : index === 4
                  ? "col-start-2 sm:col-start-auto lg:col-span-1"
                  : "lg:col-span-1"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
