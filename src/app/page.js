import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { LogoStrip } from '@/components/marketing/LogoStrip';
import { SectionShowcase } from '@/components/marketing/SectionShowcase';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { LivePreview } from '@/components/marketing/LivePreview';
import { ProblemFraming } from '@/components/marketing/ProblemFraming';
import { AIFeatures } from '@/components/marketing/AIFeatures';
import { Testimonials } from '@/components/marketing/Testimonials';
import { PricingTeaser } from '@/components/marketing/PricingTeaser';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { Footer } from '@/components/marketing/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F6] text-[#1F1F1F]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoStrip />
        <SectionShowcase />
        <HowItWorks />
        <LivePreview />
        <ProblemFraming />
        <AIFeatures />
        <Testimonials />
        <PricingTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
