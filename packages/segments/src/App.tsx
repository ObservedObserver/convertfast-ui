import { HeroSection } from '@/segments/hero-section'
import { FeatureSection } from '@/segments/feature-section'
import { CTA } from '@/segments/cta'
import { FAQ } from '@/segments/faq'
import { PricingSection } from './segments/pricing'

function App() {

  return (
    <>
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <CTA />
      <FAQ />
    </>
  )
}

export default App
