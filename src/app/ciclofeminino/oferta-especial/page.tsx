import type { Metadata } from "next";
import { OfferPageLayout, type OfferPageContent } from "@/components/funnel/offer-page-layout";
import { cicloFemininoFunnel } from "@/config/funnels/ciclo-feminino";

const product = cicloFemininoFunnel.products.ciclosDesbloqueados;

export const metadata: Metadata = {
  title: "Oferta especial — Ciclos Desbloqueados",
  robots: { index: false, follow: false },
};

const content: OfferPageContent = {
  progressLabel: "Não feche esta página · uma oferta exclusiva para você",
  badge: "Oferta especial · somente nesta página",
  headline:
    "Agora que você começou a entender os sinais do seu ciclo, existe uma segunda pergunta: como preparar seu corpo para essa jornada?",
  subheadline: "[COPY: apresentação do Ciclos Desbloqueados como próximo passo natural]",
  mediaLabel: "[Imagem: mockup Ciclos Desbloqueados]",
  benefitsTitle: "O que você recebe",
  benefits: [
    "[COPY: entregável 1]",
    "[COPY: entregável 2]",
    "[COPY: entregável 3]",
    "[COPY: entregável 4]",
  ],
  priceNote: "Pagamento único · adicionado ao seu acesso",
  acceptLabel: "Sim, quero adicionar o Ciclos Desbloqueados",
  declineLabel: "Não, obrigada. Quero seguir sem esta oferta",
};

export default function OfertaEspecialPage() {
  return (
    <OfferPageLayout
      product={product}
      funnelId={cicloFemininoFunnel.id}
      step="upsell-1"
      content={content}
      declineHref={cicloFemininoFunnel.routes.downsell}
    />
  );
}
