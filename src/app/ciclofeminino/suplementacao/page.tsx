import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { TrackFunnelView } from "@/components/funnel/track-funnel-view";
import { UpsellActions } from "@/components/funnel/upsell-actions";
import { ProductCover } from "@/components/funnel/product-cover";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { searchParamsToQuery } from "@/lib/funnel-params";
import { cicloFemininoFunnel, formatPrice } from "@/config/funnels/ciclo-feminino";
import { suplementacaoContent as c } from "./content";

const product = cicloFemininoFunnel.products.suplementacao;
const PRICE = formatPrice(product.price);

export const metadata: Metadata = {
  title: c.meta.title,
  robots: { index: false, follow: false },
};

const serif = "font-['Georgia',serif]";
const darkGradient = { background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 60%, #8B5E52 100%)" };

export default async function SuplementacaoPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Lido no servidor: o HTML já sai no modo certo (1 clique com ?token=).
  const initialSearch = searchParamsToQuery(await searchParams);

  return (
    <main className="min-h-screen bg-white">
      <TrackFunnelView
        product={product}
        funnelId={cicloFemininoFunnel.id}
        step="upsell-2"
        kind="upsell-view"
      />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section
        className="px-5 pt-8 pb-6 md:pt-10 md:pb-8 text-center"
        style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #ffffff 100%)" }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center bg-white border border-salmon/30 rounded-full px-4 py-1.5 shadow-sm">
            <span className="font-sans text-[11px] md:text-xs font-semibold uppercase tracking-widest text-brown">
              {c.hero.eyebrow}
            </span>
          </span>
          <h1 className={`${serif} text-[1.45rem] leading-[1.25] sm:text-3xl md:text-[2.1rem] font-bold text-dark-brown`}>
            {c.hero.headline}
          </h1>
          <p className="font-sans text-[15px] md:text-base text-gray-600 leading-relaxed">{c.hero.subheadline}</p>
        </div>
      </section>

      {/* ─── PRODUTO + OFERTA (CTA cedo) ──────────────────────────── */}
      {/* Mobile: título → preço/CTA → conteúdo. Desktop: conteúdo à esquerda,
          preço/CTA à direita desde o topo do card. */}
      <section id="oferta" className="px-5 pb-12 md:pb-16 scroll-mt-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-nude-dark/50 shadow-xl p-4 md:p-8 grid gap-6 md:grid-cols-[1fr_320px] md:gap-x-10 md:gap-y-5">
          <div className="order-1 md:col-start-1 text-center md:text-left">
            <h2 className={`${serif} text-xl md:text-[1.7rem] font-bold text-dark-brown leading-snug`}>{product.name}</h2>
            <p className="font-sans text-sm md:text-[15px] text-gray-600 leading-relaxed mt-2">{c.offer.subtitle}</p>
          </div>

          <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:self-start md:sticky md:top-6 bg-cream/60 rounded-2xl p-5">
            <div className="text-center mb-4">
              <p className={`${serif} text-4xl md:text-5xl font-bold text-salmon leading-none`}>{PRICE}</p>
              <p className="font-sans text-xs text-gray-500 mt-2">{c.offer.priceNote}</p>
            </div>
            <UpsellActions
              product={product}
              funnelId={cicloFemininoFunnel.id}
              step="upsell-2"
              acceptLabel={c.offer.acceptLabel}
              declineLabel={c.offer.declineLabel}
              initialSearch={initialSearch}
            />
          </div>

          <div className="order-3 md:col-start-1 md:row-start-2 space-y-5">
            <div className="flex gap-4 items-start">
              <ProductCover
                title={product.name}
                image={product.coverImage}
                eyebrow="Guia digital"
                tone="salmon"
                className="w-24 md:w-32 shrink-0"
                sizes="128px"
                titleClassName="text-[11px] md:text-sm"
              />
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-salmon mb-2.5">
                  {c.offer.nutrientsLabel}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {c.offer.nutrients.map((n) => (
                    <li
                      key={n}
                      className="font-sans text-xs md:text-sm font-semibold text-brown bg-cream border border-nude-dark/50 rounded-full px-3 py-1"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">{c.offer.care}</p>
          </div>
        </div>
      </section>

      {/* ─── QUEBRA DE CRENÇA ──────────────────────────────────────── */}
      <section className="px-5 py-12 md:py-16 bg-cream">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className={`${serif} text-xl md:text-3xl font-bold text-dark-brown leading-snug`}>{c.belief.heading}</h2>
          <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed">{c.belief.text}</p>
          <p className="font-sans text-sm md:text-base text-dark-brown font-medium leading-relaxed">{c.belief.intent}</p>
        </div>
      </section>

      {/* ─── TRANSFORMAÇÃO ─────────────────────────────────────────── */}
      <section className="px-5 py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-3 md:grid-cols-2 md:gap-5">
            {c.transformation.pairs.map(({ before, after }) => (
              <div key={before} className="rounded-2xl overflow-hidden border border-nude-dark/40 flex flex-col">
                <div className="bg-gray-50 px-5 py-4">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Antes</p>
                  <p className="font-sans text-sm text-gray-500 italic leading-snug">“{before}”</p>
                </div>
                <div className="flex justify-center -my-3 relative z-10">
                  <span className="w-6 h-6 rounded-full bg-salmon flex items-center justify-center">
                    <ArrowDown className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="bg-cream px-5 py-4 flex-1">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-salmon mb-1">Depois</p>
                  <p className="font-sans text-sm font-semibold text-dark-brown leading-snug">“{after}”</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="#oferta"
              className="inline-flex items-center justify-center rounded-full border-2 border-salmon text-salmon font-sans font-semibold text-sm px-6 py-3 hover:bg-salmon hover:text-white transition-colors"
            >
              {c.backToOffer}
            </a>
          </div>
        </div>
      </section>

      {/* ─── PONTE PARA AUTORIDADE (sem venda de consulta) ─────────── */}
      <section className="px-5 py-14 md:py-20" style={darkGradient}>
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <p className={`${serif} text-xl md:text-2xl text-nude/80 leading-snug`}>{c.bridge.general}</p>
          <p className={`${serif} text-2xl md:text-4xl font-bold text-white leading-snug`}>{c.bridge.individual}</p>
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-salmon/50">
              <Image
                src="/images/camilla-zap2.jpg"
                alt="Camilla Freitas"
                fill
                className="object-cover"
                style={{ objectPosition: "50% 12%" }}
                sizes="48px"
              />
            </div>
            <p className="font-sans text-xs md:text-sm text-nude/80 leading-snug text-left max-w-sm">
              <strong className="text-white">{c.bridge.authorityName}</strong> — {c.bridge.authorityText}
            </p>
          </div>
        </div>
      </section>
      <FunnelFooter showBackToTop={false} />
    </main>
  );
}
