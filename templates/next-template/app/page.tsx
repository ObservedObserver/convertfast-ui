import { Navbar } from './navbar';
import { HeroSection } from './hero-section';
import { HowItWorks } from './work-procedure';
import { FeatureSection } from './feature-section';
import { FAQ } from './faq';
import { LectureSlideComponent } from './lecture-slide';
import { ThemeProvider } from '@/components/theme-provider';

function LandingPage() {
  return (
    <ThemeProvider>
      <>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <FeatureSection />
        <FAQ />
        <LectureSlideComponent />
      </>
    </ThemeProvider>
  );
}

export default LandingPage;