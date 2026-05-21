import type { Metadata } from "next";
import { FunnelPageLayout } from "@/components/funnel/funnel-page-layout";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Consulta Individual com Camilla Freitas — Gerando Milagres",
  robots: { index: false, follow: false },
};

const benefits = [
  "Prescrição personalizada de suplementação e fitoterápicos para o seu caso específico",
  "Análise detalhada dos seus exames laboratoriais com olhar clínico de fertilidade",
  "Cardápio de alimentos férteis personalizado para o seu organismo e ciclo",
  "30 dias de suporte direto com Camilla pelo WhatsApp após a consulta",
  "Consulta online de 1h a 1h30 — você escolhe o melhor horário",
] as const;

export default function Upsell1Page() {
  return (
    <FunnelPageLayout
      badge="Oferta especial · Pós-inscrição"
      headline="Agora que você deu o primeiro passo, que tal ir mais fundo com Camilla ao seu lado?"
      subheadline="No programa você aprende o método. Na consulta, Camilla aplica ele ao seu caso — com análise dos seus exames, histórico e protocolo 100% individualizado para o seu corpo."
      imageSrc="/images/camilla-story.jpg"
      imageAlt="Camilla Freitas em consulta individual"
      benefits={benefits}
      price="R$ 550"
      priceNote="Pagamento único · Consulta online ao vivo"
      ctaLabel="Sim, quero minha consulta personalizada"
      ctaHref={siteConfig.checkoutUrl}
      declineLabel="Não, obrigada — vou continuar só com o programa"
      declineHref="/downsell-1"
    />
  );
}
