import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Lock,
  RefreshCw,
  Smartphone,
  Thermometer,
} from "lucide-react";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { GuaranteeSection } from "@/components/marketing/guarantee-section";
import { PremiumFooter } from "@/components/marketing/premium-footer";
import { EntryCheckoutCta } from "@/components/funnel/entry-checkout-cta";
import { TrackFunnelView } from "@/components/funnel/track-funnel-view";
import { MediaPlaceholder } from "@/components/funnel/copy-slot";
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
const serif = "font-['Georgia',serif]";
const signalIcons = [RefreshCw, Droplets, Thermometer] as const;

function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p className={`font-sans text-xs font-semibold tracking-widest uppercase mb-3 text-salmon ${className}`}>
      {children}
    </p>
  );
}

function H2({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <h2
      className={`${serif} text-2xl md:text-4xl font-bold leading-snug ${dark ? "text-white" : "text-dark-brown"}`}
    >
      {children}
    </h2>
  );
}

function PriceLine({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2 justify-center md:justify-start">
      <Lock className={`w-3.5 h-3.5 ${dark ? "text-nude/50" : "text-gray-400"}`} aria-hidden="true" />
      <p className={`font-sans text-xs ${dark ? "text-nude/75" : "text-gray-500"}`}>
        {product.name} • {PRICE}
      </p>
    </div>
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
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-15%] right-[-20%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] rounded-full bg-salmon/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-5 pt-10 pb-12 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="flex-1 text-center md:text-left space-y-6">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-salmon shrink-0" aria-hidden="true" />
              <span className="font-sans text-[11px] md:text-xs font-semibold tracking-widest text-nude uppercase">
                {c.hero.eyebrow}
              </span>
            </span>

            <h1 className={`${serif} text-[1.7rem] leading-[1.2] sm:text-4xl md:text-5xl font-bold text-white md:leading-[1.12]`}>
              {c.hero.headline}
            </h1>

            <p className="font-sans text-base md:text-lg text-nude/85 leading-relaxed md:max-w-xl">
              {c.hero.subheadline}
            </p>

            <div className="space-y-3 pt-1">
              <EntryCheckoutCta
                product={product}
                label={c.hero.ctaLabel}
                className="w-full sm:w-auto justify-center text-sm md:text-base tracking-wide px-8 py-4"
              />
              <PriceLine dark />
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start pt-2">
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
                {c.hero.author}
              </span>
            </div>
          </div>

          {/* Mockup só no desktop: no celular o CTA vem primeiro */}
          <div className="hidden md:block shrink-0 w-[340px] lg:w-[400px]">
            <MediaPlaceholder label={c.product.mediaLabel} tone="dark" className="aspect-square w-full" />
          </div>
        </div>
      </section>

      {/* ─── 2. IDENTIFICAÇÃO ──────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <H2>{c.identification.heading}</H2>
            <p className="font-sans text-sm text-gray-500 mt-4">{c.identification.intro}</p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2 mb-8">
            {c.identification.items.map((item, i) => {
              const Icon = i === 0 ? Smartphone : CalendarDays;
              return (
                <li key={item} className="flex items-start gap-3 bg-cream rounded-2xl px-4 py-3.5">
                  <Icon className="w-4 h-4 text-salmon shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="font-sans text-sm text-brown/90 leading-snug">{item}</p>
                </li>
              );
            })}
          </ul>
          <div className="rounded-3xl border-l-4 border-salmon bg-cream px-6 py-6 text-center md:text-left">
            <p className="font-sans text-brown/80 text-base">{c.identification.conclusionLead}</p>
            <p className={`${serif} italic text-lg md:text-2xl text-dark-brown leading-relaxed mt-1`}>
              {c.identification.conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. QUEBRA DE CRENÇA ───────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <Eyebrow>{c.belief.eyebrow}</Eyebrow>
            <H2>{c.belief.heading}</H2>
            <p className="font-sans text-base text-gray-600 leading-relaxed mt-4">{c.belief.text}</p>
          </div>
          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            {c.belief.signals.map(({ title, desc }, i) => {
              const Icon = signalIcons[i];
              return (
                <div key={title} className="bg-white rounded-2xl p-3.5 md:p-6 text-center border border-nude-dark/30">
                  <div className="w-9 h-9 md:w-11 md:h-11 mx-auto rounded-full bg-salmon/10 flex items-center justify-center mb-2.5">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-salmon" aria-hidden="true" />
                  </div>
                  <p className="font-sans font-bold text-dark-brown text-xs md:text-base leading-tight">{title}</p>
                  <p className="hidden md:block font-sans text-sm text-gray-500 mt-1.5">{desc}</p>
                </div>
              );
            })}
          </div>
          <p className="font-sans text-xs text-gray-500 text-center mt-3">{c.belief.signalsNote}</p>

          <blockquote className="mt-10 rounded-3xl px-6 py-8 md:px-12 md:py-10 text-center" style={darkGradient}>
            <p className={`${serif} text-xl md:text-3xl font-bold text-white leading-snug`}>
              {c.belief.quote[0]}{" "}
              <span className="text-salmon">{c.belief.quote[1]}</span>
            </p>
            <p className="font-sans text-sm md:text-base text-nude/80 leading-relaxed mt-3 max-w-xl mx-auto">
              {c.belief.quote[2]}
            </p>
          </blockquote>
        </div>
      </section>

      {/* ─── 4. TRANSFORMAÇÃO ──────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <Eyebrow>{c.transformation.eyebrow}</Eyebrow>
            <H2>{c.transformation.heading}</H2>
          </div>
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
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
        </div>
      </section>

      {/* ─── 5. O QUE ELA VAI APRENDER ─────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-nude">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <Eyebrow>{c.learn.eyebrow}</Eyebrow>
            <H2>{c.learn.heading}</H2>
          </div>
          <ol className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {c.learn.items.map((item, i) => (
              <li key={item} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm">
                <span className={`${serif} text-lg font-bold text-salmon w-7 shrink-0`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-sans text-sm text-brown/90 leading-snug">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── 6. CONEXÃO COM O DESEJO MAIOR ─────────────────────────── */}
      <section className="py-16 md:py-24 px-5" style={darkGradient}>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="font-sans text-sm md:text-base text-nude/75">{c.desire.heading}</p>
          <p className={`${serif} text-3xl md:text-5xl font-bold text-white leading-tight`}>
            {c.desire.highlight}
          </p>
          <p className="font-sans text-base md:text-lg text-nude/85 leading-relaxed">{c.desire.text}</p>

          <div className="h-px w-16 bg-salmon/60 mx-auto" aria-hidden="true" />

          <p className="font-sans text-base text-nude/80">
            {c.desire.turnLead}{" "}
            <strong className="text-white font-semibold">{c.desire.turn}</strong>
          </p>
          <p className={`${serif} italic text-xl md:text-2xl text-salmon`}>{c.desire.piece}</p>
          <p className="font-sans text-sm md:text-base text-nude/75 leading-relaxed">{c.desire.closing}</p>
        </div>
      </section>

      {/* ─── 7. PRODUTO ────────────────────────────────────────────── */}
      <section id="oferta" className="py-14 md:py-20 px-5 bg-cream scroll-mt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-nude-dark/40 overflow-hidden md:flex">
          <div className="md:w-[45%] bg-nude/50 p-6 md:p-8 flex items-center">
            <MediaPlaceholder label={c.product.mediaLabel} className="aspect-[4/3] md:aspect-square w-full" />
          </div>
          <div className="flex-1 p-6 md:p-10 text-center md:text-left">
            <Eyebrow>{c.product.eyebrow}</Eyebrow>
            <h2 className={`${serif} text-2xl md:text-4xl font-bold text-dark-brown leading-tight`}>
              {product.name}
            </h2>
            <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed mt-3">{c.product.subtitle}</p>
            <div className="border-t border-nude-dark/30 mt-6 pt-6">
              <p className={`${serif} text-5xl font-bold text-salmon leading-none`}>{PRICE}</p>
              <p className="font-sans text-xs text-gray-500 mt-2 mb-6">{c.product.note}</p>
              <EntryCheckoutCta
                product={product}
                label={c.product.ctaLabel}
                className="w-full justify-center text-sm md:text-base tracking-wide"
              />
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-gray-400 mt-4">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-sans text-xs">Pagamento seguro via Kiwify</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GARANTIA (componente existente) ───────────────────────── */}
      <GuaranteeSection
        description={
          <>
            Se nos primeiros <strong className="text-brown">7 dias</strong> você sentir que o material
            não é para você, devolvemos 100% do valor.
          </>
        }
      />

      {/* ─── 8. AUTORIDADE ─────────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-cream">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-14 items-center">
          <div className="w-full max-w-[240px] md:max-w-none md:w-[280px] shrink-0">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/camilla-zap.jpg"
                alt="Dra. Camilla Freitas, farmacêutica"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 240px, 280px"
              />
            </div>
          </div>
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div>
              <Eyebrow>{c.specialist.eyebrow}</Eyebrow>
              <H2>{c.specialist.name}</H2>
              <p className="font-sans text-xs font-semibold tracking-wide text-salmon uppercase mt-2">
                {c.specialist.role}
              </p>
            </div>
            <blockquote className={`${serif} italic text-lg md:text-2xl text-dark-brown leading-relaxed`}>
              “{c.specialist.quote}”
            </blockquote>
            <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed">{c.specialist.text}</p>
          </div>
        </div>
      </section>

      {/* ─── 9. PLANTAR A JORNADA ──────────────────────────────────── */}
      <section className="py-12 md:py-16 px-5 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-salmon" />
            <span className="w-10 h-px bg-nude-dark" />
            <span className="w-3 h-3 rounded-full border-2 border-nude-dark" />
            <span className="w-10 h-px bg-nude-dark" />
            <span className="w-3 h-3 rounded-full border-2 border-nude-dark" />
          </div>
          <H2>{c.journey.heading}</H2>
          <p className="font-sans text-base text-gray-600 leading-relaxed mt-4">{c.journey.text}</p>
        </div>
      </section>

      {/* ─── 10. OFERTA FINAL ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5 text-center" style={darkGradient}>
        <div className="max-w-2xl mx-auto space-y-6">
          <H2 dark>{c.finalOffer.heading}</H2>
          <div className="inline-block bg-white/10 border border-white/15 rounded-2xl px-8 py-5">
            <p className="font-sans text-sm font-semibold text-nude">{product.name}</p>
            <p className={`${serif} text-4xl font-bold text-salmon leading-none mt-2`}>{PRICE}</p>
          </div>
          <div>
            <EntryCheckoutCta
              product={product}
              label={c.finalOffer.ctaLabel}
              className="w-full sm:w-auto justify-center text-sm md:text-base tracking-wide px-8 py-4"
            />
            <p className="font-sans text-xs text-nude/60 mt-3">Garantia de 7 dias · pagamento seguro</p>
          </div>
        </div>
      </section>

      {/* ─── 11. FAQ ───────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-5 bg-cream">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Eyebrow>{c.faq.eyebrow}</Eyebrow>
            <H2>{c.faq.heading}</H2>
          </div>
          <FaqAccordion items={c.faq.items} />
          <div className="text-center mt-8 flex items-center justify-center gap-2 text-brown/70">
            <CheckCircle2 className="w-4 h-4 text-salmon" aria-hidden="true" />
            <p className="font-sans text-xs">Conteúdo educativo. Não substitui avaliação profissional.</p>
          </div>
        </div>
      </section>

      <PremiumFooter whatsappMessage={c.footerWhatsappMessage} />
    </div>
  );
}
