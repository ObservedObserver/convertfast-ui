import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarIcon, CircleBackslashIcon } from "@radix-ui/react-icons";

type FeatureItemProps = {
  title: string;
  description: string;
  Icon: React.ElementType; 
};

function FeatureItem({ title, description, Icon }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="rounded-md bg-secondary p-1 ">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <dt className="mt-4 font-semibold">{title}</dt>
      <dd className="mt-2 text-muted-foreground">{description}</dd>
    </div>
  );
}

function SubscribeForm() {
  return (
    <div className="mt-6 flex max-w-md gap-x-4">
      <Input
        name="email"
        type="email"
        required
        placeholder="Enter your email"
        className="flex-auto"
      />
      <Button type="submit" className="flex-none">
        Subscribe
      </Button>
    </div>
  );
}

export function NewsLetter() {
  return (
    <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32 bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <Card className="max-w-xl p-6 lg:max-w-lg bg-transparent">
            <h2 className="text-4xl font-semibold tracking-tight">
              Subscribe to our newsletter
            </h2>
            <p className="mt-4 text-lg text-primary">
              Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt
              dolore.
            </p>
            <SubscribeForm />
          </Card>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <FeatureItem
              title="Weekly articles"
              description="Non laboris consequat cupidatat laborum magna. Eiusmod non irure cupidatat duis commodo amet."
              Icon={CalendarIcon} 
            />
            <FeatureItem
              title="No spam"
              description="Officia excepteur ullamco ut sint duis proident non adipisicing. Voluptate incididunt anim."
              Icon={CircleBackslashIcon} 
            />
          </dl>
        </div>
      </div>
    </div>
  );
}