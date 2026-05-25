import { HeroSection } from "@/components/sections/hero-section";
import { IdentifySection } from "@/components/sections/identify-section";
import { CamillaSection } from "@/components/sections/camilla-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { MethodSection } from "@/components/sections/method-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaFinalSection } from "@/components/sections/cta-final-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IdentifySection />
      <CamillaSection />
      <TestimonialsSection />
      <MethodSection />
      <FaqSection />
      <CtaFinalSection />
    </main>
  );
}
