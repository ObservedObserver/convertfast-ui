import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$19",
    blurb: "For individuals testing new ideas.",
    features: ["5 pages", "Basic sections", "Email support"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$49",
    blurb: "For teams running active campaigns.",
    features: ["20 pages", "Template variants", "Priority support", "A/B-ready structure"],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "$99",
    blurb: "For organizations with multiple brands.",
    features: ["Unlimited pages", "Shared design tokens", "Dedicated onboarding"],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Pick a plan and publish faster</h2>
        </header>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.highlighted ? "border-primary shadow-md" : "border-dashed"}>
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="mt-2 text-4xl font-bold text-primary">{plan.price}</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{plan.blurb}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                  {plan.highlighted ? "Start Growth" : "Choose plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
