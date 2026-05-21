import { faqItems } from "@/data/faq";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";

export function FaqSection() {
  return (
    <Section id="faq" className="bg-white">
      <Container className="max-w-3xl">
        <div className="text-center mb-10">
          <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase mb-4">
            Suas dúvidas respondidas
          </p>
          <Heading as="h2" size="h2" className="text-gray-900">
            Perguntas frequentes
          </Heading>
        </div>

        <FaqAccordion items={faqItems} />
      </Container>
    </Section>
  );
}
