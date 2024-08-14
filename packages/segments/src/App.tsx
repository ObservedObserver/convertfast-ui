import { HeroSection } from '@/segments/hero-section'
import { FeatureSection } from '@/segments/feature-section'
import { CTA } from '@/segments/cta'
import { FAQ } from '@/segments/faq'
import { PricingSection } from './segments/pricing'
import { Navbar } from './segments/navbar'
import { Footer } from './segments/footer'
import { LogoCloud } from './segments/logo-cloud'
import { SocialProof } from './segments/social-proof'

function App() {

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
      <Footer />
    </>
  )
}

export default App
