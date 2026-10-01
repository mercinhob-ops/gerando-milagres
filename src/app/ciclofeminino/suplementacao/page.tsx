import type { Metadata } from "next";
import { OfferPageLayout, type OfferPageContent } from "@/components/funnel/offer-page-layout";
import { cicloFemininoFunnel } from "@/config/funnels/ciclo-feminino";

const product = cicloFemininoFunnel.products.suplementacao;

export const metadata: Metadata = {
  title: "Suplementação Inteligente para Fertilidade Feminina",
  robots: { index: false, follow: false },
};

// Posicionamento educacional: sem promessa de gravidez, tratamento,
// cura ou resultado médico. Sem indicação de dose.
const content: OfferPageContent = {
  progressLabel: "Última etapa antes de concluir",
  badge: "Conteúdo educacional",
  headline: "[COPY: headline educacional sobre entender a suplementação com segurança]",
  subheadline: "[COPY: o que é o material e por que conhecimento vem antes de qualquer suplemento]",
  mediaLabel: "[Imagem: mockup Suplementação Inteligente]",
  benefitsTitle: "O que você vai encontrar",
  benefits: [
    "[COPY: tópico educacional 1]",
    "[COPY: tópico educacional 2]",
    "[COPY: tópico educacional 3]",
  ],
  priceNote: "Pagamento único · material educativo digital",
  acceptLabel: "Sim, quero o guia de Suplementação Inteligente",
  declineLabel: "Não, obrigada. Quero concluir meu pedido",
};

export default function SuplementacaoPage() {
  return (
    <OfferPageLayout
      product={product}
      funnelId={cicloFemininoFunnel.id}
      step="oferta-2"
      content={content}
      declineHref={cicloFemininoFunnel.routes.thankYou}
      disclaimer={
        <>
          <strong className="text-brown">Aviso:</strong> material de caráter exclusivamente
          educativo. Não é prescrição, não indica doses e não substitui consulta, diagnóstico ou
          acompanhamento com médico ou outro profissional de saúde. Não há garantia de resultados
          relacionados à gravidez. Converse com seu médico antes de iniciar qualquer suplemento.
        </>
      }
    />
  );
}
