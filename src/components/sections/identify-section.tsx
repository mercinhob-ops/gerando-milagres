import { pains, bridge } from "@/data/identify";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";

export function IdentifySection() {
  return (
    <Section
      id="voce-se-identifica"
      className="bg-[#F0E6DC]"
    >
      <Container className="max-w-2xl">
        <div className="text-center mb-10">
          <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase mb-4">
            Isso é para você
          </p>
          <Heading as="h2" size="h2" className="text-gray-900">
            Você se identifica?
          </Heading>
        </div>

        <ul className="space-y-4 mb-10" aria-label="Situações da persona">
          {pains.map((pain, i) => (
            <li key={i} className="flex items-start gap-4">
              <span
                className="mt-1 shrink-0 w-5 h-5 rounded-full bg-salmon/20 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="w-2 h-2 rounded-full bg-salmon block" />
              </span>
              <p className="font-sans text-base md:text-lg text-gray-700 leading-relaxed">
                {pain}
              </p>
            </li>
          ))}
        </ul>

        <div className="border-l-4 border-salmon pl-5 py-1">
          <p className="font-display text-lg md:text-xl italic text-brown leading-relaxed">
            &ldquo;{bridge}&rdquo;
          </p>
        </div>
      </Container>
    </Section>
  );
}
