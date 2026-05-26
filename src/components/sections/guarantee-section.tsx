import { Shield } from "lucide-react";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";

export function GuaranteeSection() {
  return (
    <Section id="garantia" className="bg-white">
      <Container className="max-w-2xl">
        <div className="flex flex-col md:flex-row items-center gap-10">

          {/* Badge visual */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(145deg, #F0E6DC, #E8D0C0)" }}
              aria-label="Garantia de 30 dias"
              role="img"
            >
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#C4867A]/40" />
              {/* Inner ring */}
              <div className="absolute inset-3 rounded-full border border-[#C4867A]/25" />

              <Shield
                className="w-8 h-8 text-[#C4867A] mb-1"
                aria-hidden="true"
              />
              <span className="font-display text-3xl font-bold text-[#6B4239] leading-none">
                30
              </span>
              <span className="font-sans text-xs font-bold text-[#C4867A] uppercase tracking-widest">
                dias
              </span>
            </div>
            <p className="font-sans text-xs text-gray-400 mt-3 text-center">
              Garantia incondicional
            </p>
          </div>

          {/* Text */}
          <div className="text-center md:text-left space-y-4">
            <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase">
              Sem risco para você
            </p>
            <Heading as="h2" size="h3" className="text-gray-900">
              Experimente sem medo. A garantia é nossa.
            </Heading>
            <p className="font-sans text-gray-600 leading-relaxed">
              Se em <strong className="text-brown">30 dias</strong> você aplicar os protocolos e não sentir nenhuma mudança no seu corpo — seja no sono, na energia, no ciclo ou nos marcadores de fertilidade — devolvemos 100% do seu investimento.{" "}
              <span className="font-semibold text-brown">Sem perguntas. Sem burocracia.</span>
            </p>
            <p className="font-display italic text-[#C4867A] text-lg">
              &ldquo;O risco é meu. A transformação é sua.&rdquo;
            </p>
            <p className="font-sans text-sm text-gray-500">
              Basta enviar um e-mail em até 30 dias após a compra.
            </p>
          </div>

        </div>
      </Container>
    </Section>
  );
}
