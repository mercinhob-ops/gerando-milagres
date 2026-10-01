import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, CheckCircle2, Lock, X } from "lucide-react";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { GuaranteeSection } from "@/components/marketing/guarantee-section";
import { PremiumFooter } from "@/components/marketing/premium-footer";
import { EntryCheckoutCta } from "@/components/funnel/entry-checkout-cta";
import { TrackFunnelView } from "@/components/funnel/track-funnel-view";
import { CopySlot, MediaPlaceholder } from "@/components/funnel/copy-slot";
import {
  cicloFemininoFunnel,
  formatPrice,
  isCheckoutReady,
} from "@/config/funnels/ciclo-feminino";
import { cicloFemininoContent as c } from "./content";

const product = cicloFemininoFunnel.products.cicloFeminino;
const PRICE = formatPrice(product.price);

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  robots: { index: false, follow: false },
};

const darkGradient = { background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 60%, #8B5E52 100%)" };

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-sans text-xs font-semibold tracking-widest uppercase mb-3 text-salmon">{children}</p>
  );
}

function SectionHeading({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <h2
      className={
        "font-['Georgia',serif] text-2xl md:text-4xl font-bold leading-snug " +
        (dark ? "text-white" : "text-dark-brown")
      }
    >
      <CopySlot text={text} />
    </h2>
  );
}

export default function CicloFemininoPage() {
  return (
    <div className="overflow-x-hidden">
      <TrackFunnelView
        product={product}
        funnelId={cicloFemininoFunnel.id}
        step="entry"
        kind="view-content"
      />
      {isCheckoutReady(product) && (
        <StickyHeaderCheckout checkoutUrl={product.checkoutUrl} eventValue={product.price} />
      )}

      {/* ─── 1. HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={darkGradient}>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pt-10 pb-14 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left space-y-6 order-2 md:order-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-salmon/40">
                <Image
                  src="/images/camilla-zap.jpg"
                  alt="Dra. Camilla Freitas"
                  fill
                  className="object-cover object-top"
                  sizes="36px"
                />
              </div>
              <span className="font-sans text-[11px] md:text-xs font-semibold tracking-widest text-salmon uppercase">
                {c.hero.eyebrow}
              </span>
            </div>

            <div>
              <p className="font-sans text-nude/70 text-xs md:text-sm font-semibold tracking-widest uppercase mb-2">
                {c.hero.kicker}
              </p>
              <h1 className="font-['Georgia',serif] text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                {c.hero.titleLine1}
                <br />
                <span className="text-salmon">{c.hero.titleLine2}</span>
              </h1>
            </div>

            <CopySlot
              as="p"
              text={c.hero.subtitle}
              className="block font-sans text-base md:text-xl text-nude/90 leading-relaxed md:max-w-xl"
            />

            <div className="space-y-3">
              <EntryCheckoutCta
                product={product}
                label={c.hero.ctaLabel}
                className="w-full sm:w-auto justify-center text-base md:text-lg px-8 py-4"
              />
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Lock className="w-3.5 h-3.5 text-nude/50" aria-hidden="true" />
                <p className="font-sans text-xs text-nude/70">
                  {PRICE} · pagamento único · garantia de 7 dias
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 shrink-0 w-full max-w-[220px] sm:max-w-[300px] md:max-w-[380px]">
            <MediaPlaceholder label={c.hero.mediaLabel} tone="dark" className="aspect-square w-full" />
          </div>
        </div>
      </section>

      {/* ─── 2. IDENTIFICAÇÃO DO PROBLEMA ──────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Eyebrow>{c.identification.eyebrow}</Eyebrow>
            <SectionHeading text={c.identification.heading} />
          </div>
          <ul className="space-y-3 mb-10">
            {c.identification.items.map((item) => (
              <li key={item} className="flex items-start gap-4 bg-cream rounded-2xl px-5 py-4">
                <span
                  className="w-6 h-6 rounded-full bg-salmon/20 text-salmon font-bold text-sm flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  ✦
                </span>
                <CopySlot as="p" text={item} className="font-sans text-brown/90 leading-snug text-sm md:text-base" />
              </li>
            ))}
          </ul>
          <div className="rounded-3xl border-l-4 border-salmon bg-cream px-6 py-6">
            <CopySlot
              as="p"
              text={c.identification.highlight}
              className="font-['Georgia',serif] italic text-lg md:text-2xl text-dark-brown leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* ─── 3. TRANSFORMAÇÃO ──────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-cream">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Eyebrow>{c.transformation.eyebrow}</Eyebrow>
            <SectionHeading text={c.transformation.heading} />
          </div>
          <div className="space-y-3">
            {c.transformation.pairs.map(({ from, to }) => (
              <div
                key={from}
                className="bg-white rounded-2xl p-5 border border-nude-dark/30 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <CopySlot as="p" text={from} className="flex-1 font-sans text-sm text-gray-500" />
                <ArrowRight className="w-4 h-4 text-salmon shrink-0 rotate-90 sm:rotate-0" aria-hidden="true" />
                <CopySlot as="p" text={to} className="flex-1 font-sans text-sm font-semibold text-dark-brown" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. O QUE ELA VAI APRENDER ─────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Eyebrow>{c.learn.eyebrow}</Eyebrow>
            <SectionHeading text={c.learn.heading} />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.learn.items.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-nude-dark/30 px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-salmon shrink-0 mt-0.5" aria-hidden="true" />
                <CopySlot as="p" text={item} className="font-sans text-sm md:text-base text-brown/90 leading-snug" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 5. PARA QUEM É ────────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-nude">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Eyebrow>{c.forWho.eyebrow}</Eyebrow>
            <SectionHeading text={c.forWho.heading} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white rounded-2xl p-6 space-y-3">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-salmon">É para você se</p>
              {c.forWho.isFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-salmon shrink-0 mt-1" aria-hidden="true" />
                  <CopySlot as="p" text={item} className="font-sans text-sm text-brown/90 leading-snug" />
                </div>
              ))}
            </div>
            <div className="bg-white/60 rounded-2xl p-6 space-y-3">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brown/60">Não é para</p>
              {c.forWho.notFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-brown/50 shrink-0 mt-1" aria-hidden="true" />
                  <CopySlot as="p" text={item} className="font-sans text-sm text-brown/80 leading-snug" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. CONTEÚDO ───────────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-cream">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Eyebrow>{c.modules.eyebrow}</Eyebrow>
            <SectionHeading text={c.modules.heading} />
          </div>
          <div className="space-y-3">
            {c.modules.items.map(({ number, title, desc }) => (
              <div
                key={number}
                className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-nude-dark/30"
              >
                <span className="font-['Georgia',serif] text-2xl font-bold text-salmon leading-none shrink-0 w-9">
                  {number}
                </span>
                <div className="space-y-1">
                  <CopySlot as="p" text={title} className="font-sans font-bold text-dark-brown text-base" />
                  <CopySlot as="p" text={desc} className="font-sans text-gray-500 text-sm leading-relaxed" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. ESPECIALISTA ───────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-14 items-center">
          <div className="w-full max-w-[260px] md:max-w-none md:w-[280px] shrink-0">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/camilla-zap.jpg"
                alt="Dra. Camilla Freitas, farmacêutica"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 260px, 280px"
              />
            </div>
          </div>
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div>
              <Eyebrow>{c.specialist.eyebrow}</Eyebrow>
              <h2 className="font-['Georgia',serif] text-2xl md:text-4xl font-bold text-dark-brown leading-snug">
                {c.specialist.name}
              </h2>
            </div>
            <CopySlot
              as="p"
              text={c.specialist.bio}
              className="font-['Georgia',serif] italic text-base md:text-lg text-gray-700 leading-relaxed"
            />
            <div className="border-l-4 border-salmon pl-5 py-1 text-left inline-block">
              <p className="font-sans text-xs font-semibold tracking-wide text-salmon uppercase">
                {c.specialist.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. OFERTA ─────────────────────────────────────────────── */}
      <section id="oferta" className="py-14 md:py-20 px-5 bg-cream scroll-mt-20">
        <div className="max-w-lg mx-auto text-center">
          <Eyebrow>{c.offer.eyebrow}</Eyebrow>
          <SectionHeading text={c.offer.heading} />

          <div className="mt-8 bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-nude-dark/40 text-left">
            <p className="font-sans text-sm font-bold text-dark-brown text-center mb-5">{product.name}</p>
            <ul className="space-y-3 mb-6">
              {c.offer.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-salmon shrink-0 mt-0.5" aria-hidden="true" />
                  <CopySlot as="p" text={item} className="font-sans text-sm text-brown/90 leading-snug" />
                </li>
              ))}
            </ul>
            <div className="text-center border-t border-nude-dark/30 pt-6">
              <p className="font-['Georgia',serif] text-5xl font-bold text-salmon leading-none">{PRICE}</p>
              <p className="font-sans text-brown/60 text-xs mt-3 mb-6">{c.offer.note}</p>
              <EntryCheckoutCta
                product={product}
                label={c.offer.ctaLabel}
                className="w-full justify-center text-base"
              />
              <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-4">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-sans text-xs">Pagamento seguro via Kiwify</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. GARANTIA ───────────────────────────────────────────── */}
      <GuaranteeSection
        description={
          <>
            Se nos primeiros <strong className="text-brown">7 dias</strong> você sentir que o material
            não é para você, devolvemos 100% do valor.
          </>
        }
        quote={c.guarantee.quote}
      />

      {/* ─── 10. FAQ ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-cream">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Eyebrow>{c.faq.eyebrow}</Eyebrow>
            <SectionHeading text={c.faq.heading} />
          </div>
          <FaqAccordion items={c.faq.items} />
        </div>
      </section>

      {/* ─── 11. CTA FINAL ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5 text-center" style={darkGradient}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Eyebrow>{c.finalCta.eyebrow}</Eyebrow>
          <SectionHeading text={c.finalCta.heading} dark />
          <CopySlot
            as="p"
            text={c.finalCta.text}
            className="font-sans text-nude/80 text-base md:text-lg leading-relaxed"
          />
          <div className="pt-2 space-y-3">
            <EntryCheckoutCta
              product={product}
              label={c.finalCta.ctaLabel}
              className="w-full sm:w-auto justify-center text-base md:text-lg px-8 py-4"
            />
            <p className="font-sans text-xs text-nude/60">
              {PRICE} · garantia de 7 dias · pagamento seguro
            </p>
          </div>
        </div>
      </section>

      <PremiumFooter whatsappMessage={c.footerWhatsappMessage} />
    </div>
  );
}
