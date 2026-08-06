import type { Metadata } from "next";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import { HeroSection } from "./sections/hero-section";
import { SocialProofSection } from "./sections/social-proof-section";
import { ForWhoSection } from "./sections/for-who-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { TimelineSection } from "./sections/timeline-section";
import { WhatsIncludedSection } from "./sections/whats-included-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { JourneyRulerSection } from "./sections/journey-ruler-section";
import { PricingUrgencySection } from "./sections/pricing-urgency-section";
import { GuaranteeSection } from "./sections/guarantee-section";
import { FaqSection } from "./sections/faq-section";
import { FinalCtaSection } from "./sections/final-cta-section";
import { FooterSection } from "./sections/footer-section";

export const metadata: Metadata = {
  title: "Florescer a Dois — Dra. Camilla Freitas",
  description:
    "O primeiro passo para vocês engravidarem juntos. Um guia prático e acolhedor para casais que sonham engravidar — corpo, mente, suplementação e fé, caminhando lado a lado.",
  robots: { index: false, follow: false },
};

export default function CasalGmPage() {
  return (
    <div className="overflow-x-hidden">
      <StickyHeaderCheckout checkoutUrl="https://pay.hotmart.com/D106943069P" eventValue={57.9} />

      <HeroSection />
      <SocialProofSection />
      <ForWhoSection />
      <HowItWorksSection />
      <TimelineSection />
      <WhatsIncludedSection />
      <TestimonialsSection />
      <JourneyRulerSection />
      <PricingUrgencySection />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection />
      <FooterSection />
    </div>
  );
}
