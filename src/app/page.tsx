import { HeroSection } from "@/components/sections/hero-section";
import { IdentifySection } from "@/components/sections/identify-section";
import { ForWhoSection } from "@/components/sections/for-who-section";
import { CamillaSection } from "@/components/sections/camilla-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { MethodSection } from "@/components/sections/method-section";
import { BonusSection } from "@/components/sections/bonus-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { GuaranteeSection } from "@/components/sections/guarantee-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaFinalSection } from "@/components/sections/cta-final-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IdentifySection />
      <ForWhoSection />
      <CamillaSection />
      <TestimonialsSection />
      <MethodSection />
      <BonusSection />
      <PricingSection />
      <GuaranteeSection />
      <FaqSection />
      <CtaFinalSection />
    </main>
  );
}
