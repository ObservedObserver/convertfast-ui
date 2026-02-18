import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  body: string;
  author: {
    name: string;
    handle: string;
    imageUrl: string;
  };
};

const testimonials = [
  {
    body: "We replaced a bloated landing page builder and shipped our first campaign in under an hour.",
    author: { name: "Emily Chen", handle: "emilychen_tech", imageUrl: "https://ui.convertfa.st/avatars/avatar-1.svg" },
  },
  {
    body: "The generated code is readable enough that our engineers actually keep iterating instead of rewriting.",
    author: { name: "Marcus Johnson", handle: "marcusj_ai", imageUrl: "https://ui.convertfa.st/avatars/avatar-2.svg" },
  },
  {
    body: "Template variants are a big win. We can switch visual direction without rebuilding all sections.",
    author: { name: "Sarah Thompson", handle: "sarahT_biz", imageUrl: "https://ui.convertfa.st/avatars/avatar-3.svg" },
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <Card className="h-full border-dashed">
    <CardContent className="flex h-full flex-col justify-between p-6">
      <p className="text-base leading-7 text-muted-foreground">"{testimonial.body}"</p>
      <div className="mt-6 flex items-center gap-3 border-t pt-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={testimonial.author.imageUrl} alt={testimonial.author.name} />
          <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">{testimonial.author.name}</p>
          <p className="text-xs text-muted-foreground">@{testimonial.author.handle}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function SocialProof() {
  return (
    <section className="border-y bg-zinc-50/30 py-20 dark:bg-zinc-950/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Social proof</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Teams shipping faster with ConvertFast</h2>
        </header>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial: Testimonial) => (
            <TestimonialCard key={testimonial.author.handle} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
