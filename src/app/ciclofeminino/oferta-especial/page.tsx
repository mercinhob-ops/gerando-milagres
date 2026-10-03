import type { Metadata } from "next";
import Image from "next/image";
import { HeartPulse, Layers, Users } from "lucide-react";
import { TrackFunnelView } from "@/components/funnel/track-funnel-view";
import { UpsellActions } from "@/components/funnel/upsell-actions";
import { ProductCover } from "@/components/funnel/product-cover";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { searchParamsToQuery } from "@/lib/funnel-params";
import { cicloFemininoFunnel, formatPrice } from "@/config/funnels/ciclo-feminino";
import { ofertaEspecialContent as c } from "./content";

const product = cicloFemininoFunnel.products.ciclosDesbloqueados;
const PRICE = formatPrice(product.price);

export const metadata: Metadata = {
  title: c.meta.title,
  robots: { index: false, follow: false },
};

const serif = "font-['Georgia',serif]";
const darkGradient = { background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 60%, #8B5E52 100%)" };
const pillarIcons = [Layers, HeartPulse, Users] as const;

const COVER_TONES = ["dark", "salmon", "light"] as const;

export default async function OfertaEspecialPage({
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
        step="upsell-1"
        kind="upsell-view"
      />

      {/* ─── TOPO ──────────────────────────────────────────────────── */}
      <section
        className="px-5 pt-8 pb-6 md:pt-10 md:pb-8 text-center"
        style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #ffffff 100%)" }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center bg-white border border-salmon/30 rounded-full px-4 py-1.5 shadow-sm">
            <span className="font-sans text-[11px] md:text-xs font-semibold uppercase tracking-widest text-brown">
              {c.top.eyebrow}
            </span>
          </span>
          <h1 className={`${serif} text-[1.45rem] leading-[1.25] sm:text-3xl md:text-[2.1rem] font-bold text-dark-brown`}>
            {c.top.headline}
          </h1>
          <p className="font-sans text-[15px] md:text-base text-gray-600 leading-relaxed">{c.top.subheadline}</p>
        </div>
      </section>

      {/* ─── APRESENTAÇÃO + OFERTA (CTA cedo) ─────────────────────── */}
      {/* Mobile: título → preço/CTA → materiais.
          Desktop: título e materiais à esquerda, preço/CTA fixo à direita
          desde o topo do card (CTA dentro da primeira dobra em 1366×768). */}
      <section id="oferta" className="px-5 pb-12 md:pb-16 scroll-mt-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-nude-dark/50 shadow-xl p-4 md:p-8 grid gap-6 md:grid-cols-[1fr_320px] md:gap-x-10 md:gap-y-6">
          <div className="order-1 md:col-start-1 text-center md:text-left">
            <h2 className={`${serif} text-xl md:text-[1.7rem] font-bold text-dark-brown leading-snug`}>
              {c.offer.heading}
            </h2>
            <p className="font-sans text-sm md:text-[15px] text-gray-600 leading-relaxed mt-2">{c.offer.subtitle}</p>
            {/* Desktop: logo abaixo do título. Mobile: abaixo do CTA (mantém o CTA na 1ª dobra). */}
            <p className="hidden md:block font-sans text-[13px] text-brown bg-cream/70 rounded-xl px-3 py-2 mt-3 leading-snug">
              {c.offer.difference}
            </p>
          </div>

          <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:self-start md:sticky md:top-6 bg-cream/60 rounded-2xl p-5">
            <div className="text-center mb-4">
              <p className="font-sans text-sm font-bold text-dark-brown">{product.name}</p>
              <p className={`${serif} text-4xl md:text-5xl font-bold text-salmon leading-none mt-2`}>{PRICE}</p>
              <p className="font-sans text-xs text-gray-500 mt-2">{c.offer.priceNote}</p>
            </div>
            <UpsellActions
              product={product}
              funnelId={cicloFemininoFunnel.id}
              step="upsell-1"
              acceptLabel={c.offer.acceptLabel}
              declineLabel={c.offer.declineLabel}
              initialSearch={initialSearch}
            />
          </div>

          <div className="order-3 md:col-start-1 md:row-start-2 space-y-5">
            <p className="md:hidden font-sans text-[13px] text-brown bg-cream/70 rounded-xl px-3 py-2 leading-snug text-center">
              {c.offer.difference}
            </p>
            <div className="grid grid-cols-3 gap-2.5 md:gap-4 w-full max-w-[300px] md:max-w-none mx-auto md:mx-0">
              {c.offer.materials.map((m, i) => (
                <ProductCover
                  key={m.title}
                  title={m.title}
                  eyebrow={String(i + 1).padStart(2, "0")}
                  tone={COVER_TONES[i]}
                  className="rounded-xl"
                  titleClassName="text-[11px] sm:text-sm md:text-sm lg:text-base"
                />
              ))}
            </div>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-salmon mb-3 text-center md:text-left">
                {c.offer.comboLabel}
              </p>
              <ol className="space-y-2.5">
                {c.offer.materials.map((m, i) => (
                  <li key={m.title} className="flex items-start gap-3">
                    <span className={`${serif} text-salmon font-bold text-base w-6 shrink-0`}>{i + 1}.</span>
                    <p className="font-sans text-sm leading-snug">
                      <strong className="text-dark-brown">{m.title}</strong>
                      <span className="text-gray-500"> — {m.subtitle}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PONTE ─────────────────────────────────────────────────── */}
      <section className="px-5 py-12 md:py-16 bg-cream">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`${serif} text-xl md:text-3xl font-bold text-dark-brown leading-snug`}>{c.bridge.heading}</h2>
          <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed mt-4">{c.bridge.text}</p>
          <ul className="flex flex-wrap justify-center gap-2 mt-5">
            {c.bridge.topics.map((t) => (
              <li
                key={t}
                className="font-sans text-xs md:text-sm font-semibold text-brown bg-white border border-nude-dark/50 rounded-full px-3.5 py-1.5"
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="font-sans text-xs text-gray-500 mt-4">{c.bridge.note}</p>
        </div>
      </section>

      {/* ─── O QUE ELA ENCONTRA ────────────────────────────────────── */}
      <section className="px-5 py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-salmon text-center mb-6">
            {c.pillars.eyebrow}
          </p>
          <div className="grid gap-3 md:grid-cols-3 md:gap-5">
            {c.pillars.items.map(({ title, text }, i) => {
              const Icon = pillarIcons[i];
              return (
                <div key={title} className="rounded-2xl border border-nude-dark/40 p-5 flex md:flex-col gap-4 md:gap-3">
                  <div className="w-10 h-10 rounded-full bg-salmon/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-salmon" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-sans font-bold text-dark-brown">{title}</p>
                    <p className="font-sans text-sm text-gray-600 leading-relaxed mt-1">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DESEJO ────────────────────────────────────────────────── */}
      <section className="px-5 py-14 md:py-20 text-center" style={darkGradient}>
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="font-sans text-sm md:text-base text-nude/80 leading-relaxed">{c.desire.lead}</p>
          <div className="space-y-1">
            <p className={`${serif} italic text-lg md:text-xl text-nude/70`}>{c.desire.smallQuestion}</p>
            <p className="font-sans text-xs uppercase tracking-widest text-nude/50">{c.desire.smallLabel}</p>
          </div>
          <div className="space-y-1">
            <p className={`${serif} text-2xl md:text-3xl font-bold text-white leading-snug`}>{c.desire.bigQuestion}</p>
            <p className="font-sans text-xs uppercase tracking-widest text-salmon">{c.desire.bigLabel}</p>
          </div>
          <p className="font-sans text-base text-nude/90">{c.desire.closing}</p>
          <a
            href="#oferta"
            className="inline-flex items-center justify-center rounded-full border-2 border-salmon text-white font-sans font-semibold text-sm px-6 py-3 hover:bg-salmon transition-colors"
          >
            {c.backToOffer}
          </a>
        </div>
      </section>

      {/* ─── AUTORIDADE (curta) ────────────────────────────────────── */}
      <section className="px-5 py-8 bg-cream">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow">
            <Image
              src="/images/camilla-zap2.jpg"
              alt="Camilla Freitas"
              fill
              className="object-cover"
              style={{ objectPosition: "50% 12%" }}
              sizes="56px"
            />
          </div>
          <p className="font-sans text-sm text-gray-600 leading-snug">
            <strong className="text-dark-brown">{c.authority.name}</strong> — {c.authority.text}
          </p>
        </div>
      </section>
      <FunnelFooter showBackToTop={false} />
    </main>
  );
}
