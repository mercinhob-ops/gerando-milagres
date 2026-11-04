import type { Metadata } from "next";
import Image from "next/image";
import { Check, Info, Lock, X } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { EntryCheckoutCta } from "@/components/funnel/entry-checkout-cta";
import { FunnelStickyCheckout } from "@/components/funnel/funnel-sticky-checkout";
import { TrackFunnelView } from "@/components/funnel/track-funnel-view";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { formatPrice, isCheckoutReady, SITE_URL } from "@/config/funnels/ciclo-feminino";
import {
  PRICE_IS_PROVISIONAL,
  preparoParaEngravidarFunnel as funnel,
} from "@/config/funnels/preparo-para-engravidar";
import { PREVIEW_NOTICE, preparoParaEngravidarContent as c } from "./content";

const product = funnel.product;
const PRICE = formatPrice(product.price);
const CHECKOUT_READY = isCheckoutReady(product);
const PAGE_URL = `${SITE_URL}${funnel.routes.entry}`;
const MATERIALS_PENDING = funnel.materials.some((m) => !m.ready);

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  // Prévia: fora dos buscadores até checkout, preço e materiais estarem confirmados.
  robots: { index: false, follow: false },
  alternates: { canonical: PAGE_URL },
  // Imagem de compartilhamento somente quando a capa oficial existir na configuração.
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    url: PAGE_URL,
    siteName: "Gerando Milagres",
    locale: "pt_BR",
    type: "website",
    ...(product.coverImage && {
      images: [
        {
          url: `${SITE_URL}${product.coverImage.src}`,
          width: product.coverImage.width,
          height: product.coverImage.height,
          alt: product.coverImage.alt,
        },
      ],
    }),
  },
};

/** Fundo escuro único: texto creme sobre ele mantém contraste ≥ 7:1 em toda a área. */
const DARK_BG = "linear-gradient(160deg, #3F271F 0%, #4A2E26 55%, #563529 100%)";

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p
      className={`mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] ${light ? "text-[#E8D0C0]" : "text-[#8E5449]"}`}
    >
      {children}
    </p>
  );
}

function H2({ id, children, light = false }: { id: string; children: string; light?: boolean }) {
  return (
    <h2
      id={id}
      className={`font-display text-[1.65rem] font-bold leading-[1.2] text-balance md:text-4xl ${light ? "text-white" : "text-dark-brown"}`}
    >
      {children}
    </h2>
  );
}

/** Preço vindo da configuração central, sempre identificado enquanto for provisório. */
function PriceTag({ light = false, align = "right" }: { light?: boolean; align?: "left" | "right" | "center" }) {
  return (
    <div className={align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}>
      <p
        data-price
        className={`font-display text-[1.75rem] font-bold leading-none ${light ? "text-white" : "text-dark-brown"}`}
      >
        {PRICE}
      </p>
      {PRICE_IS_PROVISIONAL && (
        <p data-price-provisional className={`mt-1 font-sans text-xs ${light ? "text-[#E8D0C0]" : "text-brown"}`}>
          {c.hero.provisionalPrice}
        </p>
      )}
    </div>
  );
}

/**
 * CTA de compra. Ativa sozinho quando a configuração central receber o link
 * oficial da Kiwify (`checkoutReady`); até lá, botão desativado sem link.
 */
function BuyCta({ className = "" }: { className?: string }) {
  if (!CHECKOUT_READY) {
    return (
      <button
        type="button"
        disabled
        data-checkout-pending
        className={`flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#E8D0C0] px-5 py-3.5 text-center font-sans text-[15px] font-semibold text-dark-brown ${className}`}
      >
        {c.hero.unavailableLabel}
      </button>
    );
  }
  return (
    <EntryCheckoutCta
      product={product}
      funnelSlug={funnel.slug}
      label={c.hero.ctaLabel}
      className={`min-h-12 w-full justify-center px-5 py-3.5 text-[15px] md:text-base ${className}`}
    />
  );
}

/** Capa do guia: arte oficial quando existir; até lá, capa tipográfica discreta. */
function GuideCover() {
  if (product.coverImage) {
    return (
      <Image
        src={product.coverImage.src}
        alt={product.coverImage.alt}
        width={product.coverImage.width}
        height={product.coverImage.height}
        sizes="300px"
        priority
        className="h-auto w-full rounded-2xl shadow-[0_24px_50px_-18px_rgba(74,46,38,0.55)]"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Capa provisória do guia ${product.name}`}
      data-product-cover="typographic"
      className="relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-2xl p-6 text-[#F0E6DC] shadow-[0_24px_50px_-18px_rgba(74,46,38,0.55)]"
      style={{ background: DARK_BG }}
    >
      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">Gerando Milagres</span>
      <div>
        <span className="block h-px w-10 bg-[#C4867A]" aria-hidden="true" />
        <span className="mt-4 block font-display text-[2rem] font-bold leading-[1.1] text-white">{product.name}</span>
        <span className="mt-3 block font-sans text-sm">Guia prático em seis etapas</span>
      </div>
      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">Camilla Freitas</span>
    </div>
  );
}

export default function PreparoParaEngravidarPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <TrackFunnelView product={product} funnelId={funnel.id} step="entry" kind="view-content" />
      <FunnelStickyCheckout product={product} funnelSlug={funnel.slug} />

      <p className="bg-dark-brown px-4 py-2 text-center font-sans text-xs leading-snug text-[#F0E6DC]">{PREVIEW_NOTICE}</p>

      <main>
        {/* ─── 1. HERO — promessa, oferta e CTA na primeira tela ───────── */}
        <section aria-labelledby="hero-title" className="bg-[linear-gradient(180deg,#FBF6F1_0%,#F0E6DC_100%)]">
          <div className="mx-auto max-w-6xl px-4 pt-4 pb-12 min-[375px]:pt-6 sm:px-6 md:pt-14 md:pb-20 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16">
            <div>
              <p className="inline-flex rounded-full border border-nude-dark/70 bg-white/70 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-brown sm:text-xs">
                {c.hero.eyebrow}
              </p>
              <h1
                id="hero-title"
                className="mt-2.5 font-display text-[1.55rem] font-bold leading-[1.15] text-balance text-dark-brown min-[375px]:text-[1.9rem] sm:text-[2.5rem] md:mt-4 lg:text-[2.85rem]"
              >
                {c.hero.headline}
              </h1>
              <p className="mt-2.5 font-sans text-[14px] leading-relaxed text-brown min-[375px]:mt-3 min-[375px]:text-[15px] md:mt-5 md:max-w-xl md:text-lg">
                {c.hero.subheadline}
              </p>

              <div className="mt-4 rounded-2xl border border-nude-dark/60 bg-white p-4 min-[375px]:mt-5 shadow-[0_12px_32px_-18px_rgba(74,46,38,0.35)] md:mt-8 md:max-w-xl md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-sans text-[15px] font-semibold leading-snug text-dark-brown md:text-base">{product.name}</p>
                    <p className="mt-0.5 font-sans text-[13px] leading-snug text-brown md:text-sm">{c.hero.format}</p>
                  </div>
                  <PriceTag />
                </div>
                <div id="hero-cta" className="mt-4">
                  <BuyCta />
                </div>
                <p className="mt-3 flex items-center justify-center gap-1.5 font-sans text-xs text-brown md:justify-start">
                  <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {c.hero.access}
                </p>
              </div>

              <ul className="mt-5 space-y-2 md:max-w-xl" aria-label="Destaques do guia">
                {c.hero.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 font-sans text-sm text-dark-brown">
                    <Check className="h-4 w-4 shrink-0 text-[#A66458]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
                  <Image
                    src="/images/camilla-zap2.jpg"
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                    style={{ objectPosition: "50% 12%" }}
                  />
                </div>
                <p className="font-sans text-[13px] leading-snug text-brown">
                  Por <span className="font-semibold text-dark-brown">{c.hero.authorName}</span>
                  <br />
                  {c.hero.authorRole}
                </p>
              </div>
            </div>

            {/* Capa só no desktop: no celular ela empurraria a oferta para baixo da primeira tela. */}
            <div className="hidden lg:block">
              <div className="mx-auto max-w-[300px]">
                <GuideCover />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. IDENTIFICAÇÃO ──────────────────────────────────────── */}
        <section aria-labelledby="identification-title" className="bg-white px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Eyebrow>{c.identification.eyebrow}</Eyebrow>
              <H2 id="identification-title">{c.identification.heading}</H2>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10">
              {c.identification.items.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border-l-[3px] border-[#C4867A] bg-cream px-4 py-4 font-sans text-[15px] leading-snug text-dark-brown md:px-5"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-8 max-w-2xl text-center font-sans text-base leading-relaxed text-brown">
              {c.identification.closing}
            </p>
          </div>
        </section>

        {/* ─── 3. MUDANÇA DE PERSPECTIVA ──────────────────────────────── */}
        <section aria-labelledby="perspective-title" className="px-4 py-14 sm:px-6 md:py-24" style={{ background: DARK_BG }}>
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow light>{c.perspective.eyebrow}</Eyebrow>
              <H2 id="perspective-title" light>
                {c.perspective.heading}
              </H2>
              <p className="mt-4 font-sans text-base leading-relaxed text-[#F0E6DC]">{c.perspective.text}</p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {c.perspective.pillars.map(({ title, text }) => (
                <li key={title} data-dark-card className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/15">
                  <h3 className="font-sans text-base font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#F0E6DC]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── 4. AS SEIS ETAPAS DO GUIA ──────────────────────────────── */}
        <section aria-labelledby="guide-title" className="bg-cream px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>{c.guide.eyebrow}</Eyebrow>
              <H2 id="guide-title">{c.guide.heading}</H2>
              <p className="mt-3 font-sans text-base leading-relaxed text-brown">{c.guide.text}</p>
            </div>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10 lg:grid-cols-3" aria-label="Etapas do guia">
              {c.guide.steps.map(({ title, text }, i) => (
                <li key={title} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-nude-dark/30 md:block md:p-6">
                  <p className="font-display text-xl font-bold leading-none text-[#A66458] md:text-2xl" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-sans text-base font-semibold leading-snug text-dark-brown md:mt-3">{title}</h3>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-brown">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── 5. MATERIAIS — estado vem da configuração central ──────── */}
        <section aria-labelledby="materials-title" className="bg-white px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>{c.materials.eyebrow}</Eyebrow>
              <H2 id="materials-title">{c.materials.heading}</H2>
              <p className="mt-3 font-sans text-base leading-relaxed text-brown">{c.materials.text}</p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
              {funnel.materials.map((material) => (
                <li key={material.id} data-material={material.id} className="overflow-hidden rounded-2xl border border-nude-dark/60">
                  {material.ready && material.preview && (
                    <div className="relative aspect-[4/3] bg-[#FCFAF8]">
                      <Image
                        src={material.preview.src}
                        alt={material.preview.alt}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-sans text-base font-semibold leading-snug text-dark-brown">{material.name}</h3>
                      <span
                        data-material-status={material.ready ? "ready" : "pending"}
                        className={`shrink-0 rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${material.ready ? "bg-[#A66458] text-white" : "bg-cream text-brown"}`}
                      >
                        {material.ready ? c.materials.readyLabel : c.materials.pendingLabel}
                      </span>
                    </div>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed text-brown">{c.materials.descriptions[material.id]}</p>
                  </div>
                </li>
              ))}
            </ul>
            {MATERIALS_PENDING && (
              <p
                data-materials-pending
                className="mt-6 flex items-start justify-center gap-2 rounded-2xl border border-dashed border-nude-dark bg-[#F7EFE8] px-5 py-4 text-center font-sans text-sm text-brown"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {c.materials.pendingNotice}
              </p>
            )}
          </div>
        </section>

        {/* ─── 6. PARA QUEM É ─────────────────────────────────────────── */}
        <section aria-labelledby="audience-title" className="bg-cream px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>{c.audience.eyebrow}</Eyebrow>
              <H2 id="audience-title">{c.audience.heading}</H2>
            </div>
            <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-[1.2fr_1fr]">
              <ul className="space-y-3.5 rounded-2xl bg-white p-5 md:p-7">
                {c.audience.forItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A66458]">
                      <Check className="h-3 w-3 text-white" aria-hidden="true" />
                    </span>
                    <span className="font-sans text-[15px] leading-snug text-dark-brown">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-nude-dark p-5 md:p-7">
                <h3 className="font-sans text-sm font-bold text-dark-brown">{c.audience.notTitle}</h3>
                <ul className="mt-3 space-y-2.5">
                  {c.audience.notItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-brown" aria-hidden="true" />
                      <span className="font-sans text-sm leading-snug text-brown">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. ESPECIALISTA ────────────────────────────────────────── */}
        <section aria-labelledby="specialist-title" className="bg-white px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 md:flex-row md:gap-12">
            <div className="relative aspect-[4/5] w-full max-w-[220px] shrink-0 overflow-hidden rounded-3xl shadow-lg md:max-w-[280px]">
              <Image
                src="/images/camilla-zap2.jpg"
                alt="Camilla Freitas, farmacêutica"
                fill
                className="object-cover"
                style={{ objectPosition: "50% 10%" }}
                sizes="(min-width: 768px) 280px, 220px"
              />
            </div>
            <div className="text-center md:text-left">
              <Eyebrow>{c.specialist.eyebrow}</Eyebrow>
              <H2 id="specialist-title">{c.specialist.name}</H2>
              <ul className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Registro profissional">
                {c.specialist.credentials.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-nude-dark bg-white px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-brown"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {c.specialist.paragraphs.map((text) => (
                <p key={text} className="mt-4 font-sans text-[15px] leading-relaxed text-brown md:text-base">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 8. OFERTA ──────────────────────────────────────────────── */}
        <section id="oferta" aria-labelledby="offer-title" className="scroll-mt-6 bg-cream px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-28px_rgba(74,46,38,0.45)] ring-1 ring-nude-dark/40 md:grid md:grid-cols-[1.15fr_0.85fr]">
            <div className="p-5 sm:p-7 md:p-9">
              <Eyebrow>{c.offer.eyebrow}</Eyebrow>
              <H2 id="offer-title">{product.name}</H2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-brown">{c.offer.summary}</p>
              <h3 className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-brown">{c.offer.includesTitle}</h3>
              <ul className="mt-3 space-y-2.5">
                {funnel.materials.map((material) => (
                  <li key={material.id} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A66458]" aria-hidden="true" />
                    <span className="font-sans text-[15px] leading-snug text-dark-brown">
                      {material.name}
                      {!material.ready && <span className="text-brown"> · {c.materials.pendingLabel.toLowerCase()}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center border-t border-nude-dark/40 bg-[#F7EFE8] p-5 sm:p-7 md:border-t-0 md:border-l md:p-9">
              <PriceTag align="center" />
              <div className="mt-5">
                <BuyCta />
              </div>
              <p className="mt-4 flex items-start gap-2 font-sans text-xs leading-relaxed text-brown">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {c.offer.note}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 9. FAQ ─────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-title" className="bg-white px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-title" className="mb-8 text-center font-display text-[1.65rem] font-bold text-dark-brown md:text-4xl">
              {c.faq.heading}
            </h2>
            <FaqAccordion items={c.faq.items} />
          </div>
        </section>

        {/* ─── 10. CHAMADA FINAL ──────────────────────────────────────── */}
        <section aria-labelledby="final-title" className="px-4 py-16 text-center sm:px-6 md:py-24" style={{ background: DARK_BG }}>
          <div className="mx-auto max-w-2xl">
            <H2 id="final-title" light>
              {c.finalCta.heading}
            </H2>
            <p className="mt-4 font-sans text-base leading-relaxed text-[#F0E6DC]">{c.finalCta.text}</p>
            <div className="mx-auto mt-8 max-w-sm">
              <PriceTag light align="center" />
              <div className="mt-5">
                <BuyCta />
              </div>
            </div>
          </div>
        </section>
      </main>

      <FunnelFooter />
    </div>
  );
}
