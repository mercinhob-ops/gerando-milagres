import type { Metadata } from "next";
import { FunnelPageLayout } from "@/components/funnel/funnel-page-layout";
import { siteConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Plano Coração — Para o Casal · Gerando Milagres",
  robots: { index: false, follow: false },
};

const benefits = [
  "1 consulta individual para cada um (2 consultas ao total)",
  "1 sessão conjunta de alinhamento emocional e planejamento do casal",
  "Protocolo masculino completo com análise de espermograma",
  "Guia do Casal — manual exclusivo para a jornada juntos",
  "Suplementação individualizada para os dois + alimentos férteis do casal",
  "Suporte via WhatsApp por 90 dias para vocês dois",
] as const;

export default function Upsell2Page() {
  return (
    <FunnelPageLayout
      badge="Para casais que querem caminhar juntos"
      headline="Dois corpos preparados têm muito mais chances de gerar um milagre juntos"
      subheadline="A fertilidade é uma jornada do casal — não só da mulher. O Plano Coração foi criado para que vocês dois cheguem preparados: com protocolos individuais, alinhamento emocional e suporte por 90 dias."
      imageSrc="/images/camilla-family.jpg"
      imageAlt="Camilla Freitas — especialista em fertilidade para casais"
      benefits={benefits}
      price="R$ 1.650"
      priceNote="Para dois · Economia de R$ 450 vs. consultas separadas"
      ctaLabel="Sim, quero o Plano Coração para nós dois"
      ctaHref={siteConfig.checkoutUrl}
      declineLabel="Não, prefiro continuar individualmente"
      declineHref="/downsell-2"
    />
  );
}
