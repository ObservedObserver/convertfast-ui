import { HeroSection } from '@/segments/hero-section'
import { FeatureSection } from '@/segments/feature-section'
import { CTA } from '@/segments/cta'
import { FAQ } from '@/segments/faq'
import { PricingSection } from './segments/pricing'
import { Navbar } from './segments/navbar'
import { Footer } from './segments/footer'
import { LogoCloud } from './segments/logo-cloud'
import { SocialProof } from './segments/social-proof'
import { BlogSection } from './segments/blog'
import { BentoGrids } from './segments/bento-grids'
import { NewsLetter } from './segments/news-letter'
import { Stats } from './segments/stats'  

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
      <BlogSection/>
      <BentoGrids />
      <NewsLetter />
      <Stats/>
      <Footer />
    </>
  )
}

export default App
