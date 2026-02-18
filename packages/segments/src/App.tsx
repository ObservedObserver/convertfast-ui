import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/segments/hero-section";
import { FeatureSection } from "@/segments/feature-section";
import { CTA } from "@/segments/cta";
import { FAQ } from "@/segments/faq";
import { PricingSection } from "@/segments/pricing";
import { Navbar } from "@/segments/navbar";
import { Footer } from "@/segments/footer";
import { LogoCloud } from "@/segments/logo-cloud";
import { SocialProof } from "@/segments/social-proof";
import { BlogSection } from "@/segments/blog";
import { BentoGrids } from "@/segments/bento-grids";
import { NewsLetter } from "@/segments/news-letter";
import { Stats } from "@/segments/stats";
import { HeroSection as EditorialHeroSection } from "@/editorial/segments/hero-section";
import { LogoCloud as EditorialLogoCloud } from "@/editorial/segments/logo-cloud";
import { FeatureSection as EditorialFeatureSection } from "@/editorial/segments/feature-section";
import { SocialProof as EditorialSocialProof } from "@/editorial/segments/social-proof";
import { CTA as EditorialCTA } from "@/editorial/segments/cta";
import { FAQ as EditorialFAQ } from "@/editorial/segments/faq";
import { PricingSection as EditorialPricingSection } from "@/editorial/segments/pricing";

const TEMPLATE_NAMES = ["default", "editorial"] as const;
type TemplateName = (typeof TEMPLATE_NAMES)[number];

const TEMPLATE_DESCRIPTION: Record<TemplateName, string> = {
  default: "Current ConvertFast segment style",
  editorial: "Alternative editorial design style",
};

function isTemplateName(value: string | null): value is TemplateName {
  return value !== null && TEMPLATE_NAMES.includes(value as TemplateName);
}

function resolveInitialTemplate(): TemplateName {
  const queryTemplate = new URLSearchParams(window.location.search).get("template");
  return isTemplateName(queryTemplate) ? queryTemplate : "default";
}

function DefaultTemplatePreview() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <LogoCloud />
      <FeatureSection />
      <PricingSection />
      <SocialProof />
      <CTA />
      <FAQ />
      <BlogSection />
      <BentoGrids />
      <NewsLetter />
      <Stats />
      <Footer />
    </>
  );
}

function EditorialTemplatePreview() {
  return (
    <>
      <EditorialHeroSection />
      <EditorialLogoCloud />
      <EditorialFeatureSection />
      <EditorialSocialProof />
      <EditorialCTA />
      <EditorialFAQ />
      <EditorialPricingSection />
    </>
  );
}

function App() {
  const [template, setTemplate] = useState<TemplateName>(resolveInitialTemplate);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (template === "default") {
      url.searchParams.delete("template");
    } else {
      url.searchParams.set("template", template);
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [template]);

  return (
    <>
      <div className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Template preview</p>
            <p className="text-sm text-muted-foreground">{TEMPLATE_DESCRIPTION[template]}</p>
          </div>
          <div className="flex items-center gap-2">
            {TEMPLATE_NAMES.map((name) => (
              <Button
                key={name}
                size="sm"
                variant={template === name ? "default" : "outline"}
                onClick={() => setTemplate(name)}
              >
                {name}
              </Button>
            ))}
            <ModeToggle />
          </div>
        </div>
      </div>
      {template === "default" ? <DefaultTemplatePreview /> : <EditorialTemplatePreview />}
    </>
  );
}

export default App;
