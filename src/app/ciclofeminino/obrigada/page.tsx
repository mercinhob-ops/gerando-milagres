import type { Metadata } from "next";
import { Mail, Inbox, Clock, MessageCircle } from "lucide-react";
import { PremiumFooter } from "@/components/marketing/premium-footer";
import { MediaPlaceholder } from "@/components/funnel/copy-slot";
import { createWhatsappUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Obrigada! Próximos passos — Ciclo Feminino",
  robots: { index: false, follow: false },
};

/**
 * Espaço reservado para o "Desafio Prontas para Gerar".
 * Mantido desligado: esta página não vende nada por enquanto.
 * Em ambiente de desenvolvimento aparece um marcador tracejado.
 */
const DESAFIO_PRONTAS_PARA_GERAR = { enabled: false } as const;

const SUPPORT_MESSAGE = "Olá! Comprei o Ciclo Feminino Descomplicado e preciso de ajuda com o acesso 🌸";

const steps = [
  {
    icon: Mail,
    title: "Confira seu e-mail",
    text: "O acesso é enviado pela Kiwify para o e-mail informado na compra, logo após a confirmação do pagamento.",
  },
  {
    icon: Inbox,
    title: "Olhe também spam e promoções",
    text: "Se não encontrar na caixa de entrada, procure por “Kiwify” nas abas spam, lixo eletrônico ou promoções.",
  },
  {
    icon: Clock,
    title: "Pagou com Pix ou boleto?",
    text: "O acesso chega quando o pagamento é compensado. No Pix costuma ser em minutos; no boleto, pode levar até 3 dias úteis.",
  },
  {
    icon: MessageCircle,
    title: "Ainda com dúvida?",
    text: "Fale com o nosso atendimento pelo WhatsApp e informe o e-mail usado na compra.",
  },
] as const;

export default function ObrigadaPage() {
  // Sem evento Purchase aqui: a compra é confirmada pela Kiwify, não pela visita a esta página.
  const showDesafioSlot =
    DESAFIO_PRONTAS_PARA_GERAR.enabled || process.env.NODE_ENV !== "production";

  return (
    <div className="overflow-x-hidden">
      <main
        className="min-h-screen px-5 py-12 md:py-20"
        style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #ffffff 60%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-10">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Pedido recebido
            </p>
            <h1 className="font-['Georgia',serif] text-3xl md:text-5xl font-bold text-dark-brown leading-tight">
              Obrigada pela confiança!
            </h1>
            <p className="font-sans text-base md:text-lg text-gray-600 leading-relaxed">
              Veja abaixo como acessar o seu material.
            </p>
          </div>

          <ol className="space-y-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="bg-white rounded-2xl border border-nude-dark/40 shadow-sm p-5 flex items-start gap-4"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-salmon/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-salmon" aria-hidden="true" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-salmon text-white text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-sans font-bold text-dark-brown">{title}</p>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed mt-1">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="text-center mt-8">
            <a
              href={createWhatsappUrl(SUPPORT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-salmon border-2 border-salmon rounded-full px-6 py-3 hover:bg-salmon hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Falar com o atendimento
            </a>
          </div>

          {showDesafioSlot && (
            <section aria-label="Próxima etapa (reservado)" className="mt-12">
              <MediaPlaceholder
                label="[Reservado: Desafio Prontas para Gerar — desativado]"
                className="min-h-40 w-full"
              />
            </section>
          )}
        </div>
      </main>

      <PremiumFooter whatsappMessage={SUPPORT_MESSAGE} />
    </div>
  );
}
