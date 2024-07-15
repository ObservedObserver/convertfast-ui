import { ISegment } from "../interfaces.ts";

export const DEFAULT_SEGMENTS: ISegment[] = [
  {
    name: "HeroSection",
    file: "hero-section",
    components: [
      {
        name: "Button",
        file: "button",
        source: "shadcn",
      },
    ],
  },
  {
    name: "FeatureSection",
    file: "feature-section",
    components: [
      {
        name: "Button",
        file: "button",
        source: "shadcn",
      },
    ],
  },
  {
    name: "CTA",
    file: "cta",
    components: [
      {
        name: "Button",
        file: "button",
        source: "shadcn",
      },
    ],
  },
  {
    name: "FAQ",
    file: "faq",
    components: [
      {
        name: "Accordion",
        file: "accordion",
        source: "shadcn",
      },
    ],
  },
  {
    name: "PricingSection",
    file: "pricing",
    components: [
      {
        name: "Button",
        file: "button",
        source: "shadcn",
      },
      {
        name: "Card",
        file: "card",
        source: "shadcn",
      },
    ],
  },
];
