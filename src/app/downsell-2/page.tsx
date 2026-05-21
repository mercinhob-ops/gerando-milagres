import type { Metadata } from "next";
import { FunnelPageLayout } from "@/components/funnel/funnel-page-layout";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Acesso por 30 Dias — Experimente o Programa · Gerando Milagres",
  robots: { index: false, follow: false },
};

const benefits = [
  "Acesso imediato a 2 módulos completos do programa Gerando Milagres",
  "Todo o conteúdo em vídeo + materiais de apoio dos módulos liberados",
  "30 dias para aplicar os protocolos e sentir resultados reais no seu corpo",
  "Suporte no grupo de acompanhamento durante todo o período",
  "Pode fazer upgrade para o programa completo a qualquer momento",
] as const;

export default function Downsell2Page() {
  return (
    <FunnelPageLayout
      badge="Experimente antes de decidir"
      headline="Que tal sentir a transformação no seu corpo antes de se comprometer com o programa completo?"
      subheadline="30 dias. 2 módulos completos. Tempo suficiente para aplicar os protocolos, sentir os primeiros resultados e decidir com clareza se o programa é para você."
      imageSrc="/images/camilla-hero.jpg"
      imageAlt="Camilla Freitas — Gerando Milagres"
      benefits={benefits}
      price="R$ 97"
      priceNote="Acesso por 30 dias · 2 módulos completos"
      ctaLabel="Quero experimentar por R$ 97"
      ctaHref={siteConfig.checkoutUrl}
      declineLabel="Não, obrigada — vou pensar um pouco mais"
      declineHref="/"
    />
  );
}
