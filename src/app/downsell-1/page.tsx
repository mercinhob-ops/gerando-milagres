import type { Metadata } from "next";
import { FunnelPageLayout } from "@/components/funnel/funnel-page-layout";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Guia Rápido dos 5 Pilares da Fertilidade — Gerando Milagres",
  robots: { index: false, follow: false },
};

const benefits = [
  "Os 5 pilares da fertilidade explicados de forma direta e aplicável",
  "Lista completa de suplementos essenciais com dosagem e quando tomar",
  "Plano de ação de 30 dias para começar a preparar o corpo imediatamente",
  "Alimentos férteis e anti-inflamatórios para incluir hoje na sua rotina",
  "Download imediato após o pagamento — acesso vitalício ao PDF",
] as const;

export default function Downsell1Page() {
  return (
    <FunnelPageLayout
      badge="Uma alternativa mais acessível"
      headline="Antes de ir, leva com você o mapa completo da fertilidade"
      subheadline="O Guia Rápido dos 5 Pilares é um PDF prático que vai te acompanhar desde o primeiro dia — com tudo que você precisa saber para começar a preparar o corpo ainda essa semana."
      imageSrc="/images/camilla-profile.jpg"
      imageAlt="Camilla Freitas, farmacêutica especialista em fertilidade"
      benefits={benefits}
      price="R$ 47"
      priceNote="Acesso vitalício · PDF para download imediato"
      ctaLabel="Quero o Guia por R$ 47"
      ctaHref={siteConfig.checkoutUrl}
      declineLabel="Não, prefiro prosseguir sem o guia"
      declineHref="/upsell-2"
    />
  );
}
