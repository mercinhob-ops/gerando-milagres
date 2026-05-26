import { ClipboardList, CalendarDays, FlaskConical } from "lucide-react";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";
import type { LucideIcon } from "lucide-react";

interface BonusItem {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
}

const bonuses: BonusItem[] = [
  {
    icon: ClipboardList,
    title: "Checklist dos 10 Pilares do Preparo",
    description:
      "Um guia visual completo com tudo que você precisa verificar e ajustar antes de tentar engravidar — do sono à suplementação.",
    value: "R$ 497",
  },
  {
    icon: CalendarDays,
    title: "Linha do Tempo Inteligente do Preparo",
    description:
      "Semana a semana, saiba exatamente o que fazer e quando fazer para chegar ao momento certo com o corpo preparado.",
    value: "R$ 597",
  },
  {
    icon: FlaskConical,
    title: "Guia de Valores Ideais dos Exames para Fertilidade",
    description:
      "Entenda seus exames como nunca antes — quais valores buscar e o que cada resultado significa para a sua fertilidade.",
    value: "R$ 403",
  },
];

export function BonusSection() {
  return (
    <Section id="bonus" className="bg-[#F0E6DC]">
      <Container>
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase mb-4">
            Bônus exclusivos
          </p>
          <Heading as="h2" size="h2" className="text-gray-900">
            Tudo isso ainda vem com você
          </Heading>
          <p className="font-sans text-base text-gray-600 mt-3 max-w-xl mx-auto">
            Ao adquirir o programa, você recebe esses 3 materiais extras — sem custo adicional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {bonuses.map((bonus, i) => {
            const Icon = bonus.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#D4B5A0]/50 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C4867A]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-[#C4867A]" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-sans font-semibold text-gray-900 leading-snug">
                    {bonus.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {bonus.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D4B5A0]/50">
                  <p className="font-sans text-xs text-gray-400 line-through">
                    Valor: {bonus.value}
                  </p>
                  <p className="font-sans text-sm font-bold text-[#C4867A]">
                    Incluso grátis
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total value banner */}
        <div className="bg-white rounded-2xl border border-[#D4B5A0] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="font-sans text-sm text-gray-500">Valor total dos bônus</p>
            <p className="font-display text-2xl font-bold text-gray-400 line-through">
              R$ 1.497
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-sans text-sm font-semibold text-[#C4867A] uppercase tracking-wide">
              Você leva tudo isso
            </p>
            <p className="font-display text-3xl font-bold text-[#6B4239]">
              de graça
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
