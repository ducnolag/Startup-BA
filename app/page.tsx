import Navigation from '@/components/layout/Navigation';
import Hero from '@/components/hero/Hero';
import Tools from '@/components/sections/Tools';
import Features from '@/components/sections/Features';
import Pricing from '@/components/sections/Pricing';
import Mission from '@/components/sections/Mission';
import VoteTool from '@/components/sections/VoteTool';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="relative bg-white">
      <Navigation />
      <Hero />
      <Tools />
      <Features />
      <Pricing />
      <Mission />
      <VoteTool />
      <CTA />
      <Footer />
    </main>
  );
}