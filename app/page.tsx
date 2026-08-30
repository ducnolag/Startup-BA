import Navigation from '@/components/layout/Navigation';
import Hero from '@/components/hero/Hero';
import Tools from '@/components/sections/Tools';
import Features from '@/components/sections/Features';
import Pricing from '@/components/sections/Pricing';
import Mission from '@/components/sections/Mission';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="relative bg-[#020409]">
      <Navigation />
      <Hero />
      <Tools />
      <Features />
      <Pricing />
      <Mission />
      <CTA />
      <Footer />
    </main>
  );
}
