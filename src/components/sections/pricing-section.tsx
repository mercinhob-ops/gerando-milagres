import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/env";
import { buttonVariants } from "@/components/design-system/button";
import { CheckCircle2, Lock } from "lucide-react";

const included = [
  "Programa completo de 3 meses (12 semanas)",
  "Protocolo científico de suplementação e alimentação",
  "Acesso vitalício à plataforma e atualizações",
  "Suporte no grupo de acompanhamento",
  "3 bônus exclusivos (valor R$ 1.497)",
] as const;

export function PricingSection() {
  return (
    <section
      id="preco"
      className="py-20 px-4"
      style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <p className="font-sans text-xs font-semibold tracking-widest text-[#C4867A] uppercase mb-6">
          Investimento
        </p>

        {/* Headline */}
        <h2 className="font-display text-3xl md:text-4xl text-white mb-2 italic">
          Prepare seu corpo pelo valor de uma consulta
        </h2>
        <p className="font-sans text-[#E8D0C0]/80 text-base mb-10">
          Um programa completo de 3 meses com tudo que você precisa para chegar preparada.
        </p>

        {/* Price card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl mb-8">
          {/* Old price */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="font-sans text-sm text-gray-400 uppercase tracking-wide">De</span>
            <span className="font-display text-2xl text-gray-400 line-through">
              R$ 1.497
            </span>
          </div>

          {/* New price */}
          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="font-sans text-lg text-gray-500 mb-2">por</span>
            <span className="font-display text-6xl md:text-7xl font-bold text-[#6B4239] leading-none">
              R$&nbsp;247
            </span>
          </div>
          <p className="font-sans text-sm text-gray-500 mb-6">à vista</p>

          {/* Installment */}
          <div className="bg-[#F0E6DC] rounded-xl px-5 py-3 mb-8 inline-block">
            <p className="font-sans text-sm text-[#6B4239]">
              ou <span className="font-bold text-base">12x de R$&nbsp;25,55</span> no cartão
            </p>
          </div>

          {/* What's included */}
          <ul className="space-y-2 text-left mb-8" aria-label="O que está incluído">
            {included.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2
                  className="w-4.5 h-4.5 text-[#C4867A] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="font-sans text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={siteConfig.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "w-full justify-center text-center"
            )}
          >
            Quero preparar meu corpo por R$&nbsp;247
          </a>

          <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-4">
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="font-sans text-xs">Pagamento 100% seguro · SSL</span>
          </div>
        </div>

        {/* Savings callout */}
        <p className="font-sans text-sm text-[#E8D0C0]/70">
          Você economiza{" "}
          <span className="text-[#C4867A] font-semibold">R$ 1.250</span>{" "}
          em relação ao valor original do programa
        </p>
      </div>
    </section>
  );
}
