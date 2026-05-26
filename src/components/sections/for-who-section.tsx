import { CheckCircle2, XCircle } from "lucide-react";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";

const forItems = [
  "Já tentou engravidar por mais de 6 meses sem sucesso",
  "Fez FIV sem sucesso e quer preparar o corpo para a próxima tentativa",
  "Tem SOP ou endometriose e quer agir sobre os fatores que pode controlar",
  "Sofreu aborto precoce e quer fortalecer o corpo para uma nova gestação",
  "Tem 35+ anos e quer otimizar cada chance que tem",
  "Quer se preparar antes mesmo de começar a tentar",
] as const;

const notForItems = [
  "Quem busca resultados sem compromisso com o processo",
  "Quem não está disposta a fazer ajustes no estilo de vida",
] as const;

export function ForWhoSection() {
  return (
    <Section id="para-quem-e" className="bg-white">
      <Container className="max-w-3xl">
        <div className="text-center mb-10">
          <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase mb-4">
            Identificação
          </p>
          <Heading as="h2" size="h2" className="text-gray-900">
            Este programa é para você
          </Heading>
          <p className="font-sans text-base text-gray-600 mt-3 max-w-xl mx-auto">
            Se você se vê em algum desses cenários, o Gerando Milagres foi criado para você.
          </p>
        </div>

        {/* For who — YES */}
        <ul className="space-y-4 mb-10" aria-label="Para quem é o programa">
          {forItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3 bg-[#F0E6DC]/60 rounded-xl px-5 py-4">
              <CheckCircle2
                className="w-5 h-5 text-[#C4867A] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="font-sans text-gray-800 leading-snug">{item}</span>
            </li>
          ))}
        </ul>

        {/* Not for who — NO */}
        <div className="border-t border-[#D4B5A0] pt-8">
          <p className="font-sans text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4 text-center">
            Não é para você se…
          </p>
          <ul className="space-y-3" aria-label="Para quem não é o programa">
            {notForItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <XCircle
                  className="w-5 h-5 text-gray-300 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="font-sans text-gray-500 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
