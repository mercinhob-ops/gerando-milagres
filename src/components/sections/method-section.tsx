import { Apple, Moon, FlaskConical, Brain, Dumbbell } from "lucide-react";
import { methodPillars } from "@/data/method";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";
import type { LucideIcon } from "lucide-react";

const pillarIcons: Record<string, LucideIcon> = {
  alimentacao: Apple,
  sono: Moon,
  suplementacao: FlaskConical,
  stress: Brain,
  atividade: Dumbbell,
};

export function MethodSection() {
  return (
    <Section id="metodo" className="bg-[#F0E6DC]">
      <Container>
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase mb-4">
            Como funciona
          </p>
          <Heading as="h2" size="h2" className="text-gray-900">
            Os 5 pilares do método
          </Heading>
          <p className="mt-4 font-sans text-base md:text-lg text-gray-600 max-w-xl mx-auto">
            Cada pilar foi escolhido com base em evidências científicas e na
            experiência real com alunas em diferentes condições.
          </p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          aria-label="Pilares do método"
        >
          {methodPillars.map((pillar) => {
            const Icon = pillarIcons[pillar.slug];
            return (
              <li
                key={pillar.slug}
                className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-salmon/10 flex items-center justify-center shrink-0">
                  {Icon && (
                    <Icon className="w-6 h-6 text-salmon" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-gray-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center font-display text-base md:text-lg italic text-brown">
          Não é sobre fazer tudo perfeito — é sobre preparar seu corpo com
          intenção e ciência.
        </p>
      </Container>
    </Section>
  );
}
