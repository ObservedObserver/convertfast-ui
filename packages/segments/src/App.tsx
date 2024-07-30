import { HeroSection } from '@/segments/hero-section'
import { FeatureSection } from '@/segments/feature-section'
import { CTA } from '@/segments/cta'
import { FAQ } from '@/segments/faq'
import { PricingSection } from './segments/pricing'
import { Navbar } from './segments/navbar'
import { Footer } from './segments/footer'
import { CompanyLogos } from './segments/company-logos'

function App() {

  return (
    <>
      <Navbar />
      <HeroSection />
      <CompanyLogos />
      <FeatureSection />
      <PricingSection />
      <CTA />
      <FAQ />
      <Footer />
    </>
  )
}

export default App
