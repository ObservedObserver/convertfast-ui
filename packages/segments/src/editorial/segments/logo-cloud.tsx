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
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Card className="border-dashed px-6 py-12 sm:px-10">
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by product teams
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {logos.map((logo) => (
              <div key={logo.name} className="flex items-center justify-center rounded-lg border bg-background/80 p-4">
                <img src={logo.src} alt={logo.alt} width={120} height={36} className="max-h-10 w-full object-contain" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
