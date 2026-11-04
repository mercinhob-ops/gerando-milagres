import type { Metadata } from "next";
import Image from "next/image";
import { Check, FileText, Info, Lock, MessageCircleQuestion, NotebookPen, Route, ShieldCheck, Users } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { TrackFunnelView } from "@/components/funnel/track-funnel-view";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { SITE_URL } from "@/config/funnels/ciclo-feminino";
import {
  PURCHASE_TERMS,
  preparoParaEngravidarFunnel as funnel,
  preparoParaEngravidarTestimonials as testimonials,
} from "@/config/funnels/preparo-para-engravidar";
import { BuyCta, PriceTag } from "./buy-cta";
import { MobileBuyBar } from "./mobile-buy-bar";
import { Quiz } from "./quiz";
import { StepsDemo } from "./steps-demo";
import { PREVIEW_NOTICE, preparoParaEngravidarContent as c } from "./content";

const product = funnel.product;
const PAGE_URL = `${SITE_URL}${funnel.routes.entry}`;
const MATERIALS_PENDING = funnel.materials.some((m) => !m.ready);
const materialById = new Map(funnel.materials.map((m) => [m.id, m]));

/** Respostas de entrega e garantia passam a vir da configuração quando confirmadas. */
const faqItems = c.faq.items.map((item) => {
  const confirmed = "id" in item ? PURCHASE_TERMS[item.id] : null;
  return confirmed ? { ...item, answer: confirmed } : item;
});

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  // Pré-lançamento: fora dos buscadores até checkout, preço e materiais estarem confirmados.
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
/** Acento lilás suave, usado só nesta página (não existe token global de lilás). */
const LILAC_BG = "bg-[#F1EBF4]";

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

const HOW_ICONS = [Route, NotebookPen, Users] as const;
const TRUST_ICONS = [ShieldCheck, Info, MessageCircleQuestion, FileText] as const;

export default function PreparoParaEngravidarPage() {
  const demoSteps = c.steps.items.map((step) => {
    const material = materialById.get(step.material);
    return { ...step, material: material ? { name: material.name, ready: material.ready } : null };
  });

  return (
    // Espaço no fim (celular) para a barra fixa nunca cobrir o rodapé.
    <div className="overflow-x-hidden bg-white pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <TrackFunnelView product={product} funnelId={funnel.id} step="entry" kind="view-content" />

      <p className="bg-dark-brown px-4 py-2 text-center font-sans text-xs leading-snug text-[#F0E6DC]">{PREVIEW_NOTICE}</p>

      <main>
        {/* ─── 1. HERO ─────────────────────────────────────────────────── */}
        <section aria-labelledby="hero-title" className="bg-[linear-gradient(180deg,#FBF6F1_0%,#F0E6DC_100%)]">
          <div className="mx-auto max-w-6xl px-4 pt-4 pb-12 min-[375px]:pt-6 sm:px-6 md:pt-14 md:pb-20 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16">
            <div>
              <p className="inline-flex rounded-full border border-nude-dark/70 bg-white/70 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-brown sm:text-xs">
                {c.hero.eyebrow}
              </p>
              <h1
                id="hero-title"
                className="mt-2.5 font-display text-[1.55rem] font-bold leading-[1.15] text-balance text-dark-brown min-[375px]:text-[1.8rem] sm:text-[2.5rem] md:mt-4 lg:text-[2.85rem]"
              >
                {c.hero.headline}
              </h1>
              <p className="mt-2.5 font-sans text-[14px] leading-relaxed text-brown min-[375px]:mt-3 min-[375px]:text-[15px] md:mt-5 md:max-w-xl md:text-lg">
                {c.hero.subheadline}
              </p>

              <div className="mt-4 rounded-2xl border border-nude-dark/60 bg-white p-4 shadow-[0_12px_32px_-18px_rgba(74,46,38,0.35)] min-[375px]:mt-5 md:mt-8 md:max-w-xl md:p-5">
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
                  {PURCHASE_TERMS.delivery ? c.hero.accessConfirmed : c.hero.access}
                </p>
              </div>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 md:max-w-xl" aria-label="Destaques do guia">
                {c.hero.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-sans text-sm text-dark-brown">
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

        {/* ─── 2. MINI QUIZ ───────────────────────────────────────────── */}
        <section aria-labelledby="quiz-start-title" className={`${LILAC_BG} px-4 py-14 sm:px-6 md:py-20`}>
          <div className="mx-auto max-w-3xl">
            <h2 id="quiz-start-title" className="mb-4 text-center font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#6B4F7A]">
              {c.quizStart.eyebrow}
            </h2>
            <Quiz
              question={c.quizStart.question}
              hint={c.quizStart.hint}
              options={c.quizStart.options}
              continueHref="#identificacao"
              continueLabel={c.quizStart.continueLabel}
            />
          </div>
        </section>

        {/* ─── 3. IDENTIFICAÇÃO EMOCIONAL ─────────────────────────────── */}
        <section
          id="identificacao"
          aria-labelledby="identification-title"
          className="scroll-mt-4 px-4 py-14 sm:px-6 md:py-24"
          style={{ background: DARK_BG }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow light>{c.identification.eyebrow}</Eyebrow>
              <H2 id="identification-title" light>
                {c.identification.heading}
              </H2>
            </div>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-4">
              {c.identification.thoughts.map((thought) => (
                <li key={thought} data-dark-card className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/15 md:p-6">
                  <span aria-hidden="true" className="block font-display text-4xl leading-none text-[#C4867A]">
                    “
                  </span>
                  <p className="mt-1 font-display text-lg leading-snug text-[#F0E6DC] italic md:text-xl">{thought}</p>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-9 max-w-2xl text-center font-sans text-base leading-relaxed text-[#F0E6DC]">
              {c.identification.closing}
            </p>
          </div>
        </section>

        {/* ─── 4. MUDANÇA DE PERSPECTIVA ──────────────────────────────── */}
        <section aria-labelledby="perspective-title" className="bg-cream px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>{c.perspective.eyebrow}</Eyebrow>
              <H2 id="perspective-title">{c.perspective.heading}</H2>
              <p className="mt-4 font-sans text-base leading-relaxed text-brown">{c.perspective.text}</p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {c.perspective.pillars.map(({ title, text }) => (
                <li key={title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-nude-dark/30">
                  <span className="block h-1 w-8 rounded-full bg-[#B9A6C4]" aria-hidden="true" />
                  <h3 className="mt-4 font-sans text-base font-semibold leading-snug text-dark-brown">{title}</h3>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-brown">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── 5. DEMONSTRAÇÃO DAS ETAPAS ─────────────────────────────── */}
        <section aria-labelledby="steps-title" className="bg-white px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>{c.steps.eyebrow}</Eyebrow>
              <H2 id="steps-title">{c.steps.heading}</H2>
              <p className="mt-3 font-sans text-base leading-relaxed text-brown">{c.steps.text}</p>
            </div>
            <div className="mt-8 md:mt-12">
              <StepsDemo
                steps={demoSteps}
                panelLabel={c.steps.panelLabel}
                materialLabel={c.steps.materialLabel}
                pendingLabel={c.materials.pendingLabel}
                readyLabel={c.materials.readyLabel}
              />
            </div>
          </div>
        </section>

        {/* ─── 6. COMO FUNCIONA ───────────────────────────────────────── */}
        <section aria-labelledby="how-title" className={`${LILAC_BG} px-4 py-14 sm:px-6 md:py-24`}>
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#6B4F7A]">{c.howItWorks.eyebrow}</p>
              <H2 id="how-title">{c.howItWorks.heading}</H2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {c.howItWorks.items.map(({ title, text }, i) => {
                const Icon = HOW_ICONS[i];
                return (
                  <li key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#D9CCE0]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EBF4]">
                        <Icon className="h-5 w-5 text-[#6B4F7A]" aria-hidden="true" />
                      </span>
                      <span className="font-display text-sm font-bold text-[#6B4F7A]">Passo {i + 1}</span>
                    </div>
                    <h3 className="mt-4 font-sans text-base font-semibold leading-snug text-dark-brown">{title}</h3>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed text-brown">{text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ─── 7. O QUE ESTÁ INCLUÍDO ─────────────────────────────────── */}
        <section aria-labelledby="materials-title" className="bg-white px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>{c.materials.eyebrow}</Eyebrow>
              <H2 id="materials-title">{c.materials.heading}</H2>
              <p className="mt-3 font-sans text-base leading-relaxed text-brown">{c.materials.text}</p>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-10 lg:grid-cols-3 lg:gap-4">
              {funnel.materials.map((material) => (
                <li key={material.id} data-material={material.id} className="overflow-hidden rounded-2xl border border-nude-dark/60 bg-white">
                  {/* Espaço da capa: imagem real quando o material estiver pronto. */}
                  <div className="relative aspect-[4/3] bg-[#F7EFE8]">
                    {material.ready && material.preview ? (
                      <Image
                        src={material.preview.src}
                        alt={material.preview.alt}
                        fill
                        sizes="(min-width: 1024px) 320px, 45vw"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1.5 px-3 text-center">
                        <FileText className="h-6 w-6 text-[#B08A78]" aria-hidden="true" />
                        <span className="font-sans text-xs text-brown">{c.materials.coverPending}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 sm:p-5">
                    <span
                      data-material-status={material.ready ? "ready" : "pending"}
                      className={`inline-block rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${material.ready ? "bg-[#A66458] text-white" : "bg-cream text-brown"}`}
                    >
                      {material.ready ? c.materials.readyLabel : c.materials.pendingLabel}
                    </span>
                    <h3 className="mt-2 font-sans text-[15px] font-semibold leading-snug text-dark-brown sm:text-base">{material.name}</h3>
                    <p className="mt-1 hidden font-sans text-sm leading-relaxed text-brown sm:block">
                      {c.materials.descriptions[material.id]}
                    </p>
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

        {/* ─── 8. SEGUNDO QUIZ ────────────────────────────────────────── */}
        <section aria-labelledby="quiz-moment-title" className="bg-cream px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 id="quiz-moment-title" className="mb-4 text-center font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#8E5449]">
              {c.quizMoment.eyebrow}
            </h2>
            <Quiz
              question={c.quizMoment.question}
              hint={c.quizMoment.hint}
              options={c.quizMoment.options}
              continueHref="#especialista"
              continueLabel={c.quizMoment.continueLabel}
            />
          </div>
        </section>

        {/* ─── 9. AUTORIDADE ──────────────────────────────────────────── */}
        <section id="especialista" aria-labelledby="specialist-title" className="scroll-mt-4 bg-white px-4 py-14 sm:px-6 md:py-24">
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

        {/* ─── 10. CREDIBILIDADE (depoimentos só reais e autorizados) ─── */}
        <section aria-labelledby="trust-title" className="px-4 py-14 sm:px-6 md:py-24" style={{ background: DARK_BG }}>
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow light>{c.trust.eyebrow}</Eyebrow>
              <H2 id="trust-title" light>
                {c.trust.heading}
              </H2>
              <p className="mt-4 font-sans text-base leading-relaxed text-[#F0E6DC]">{c.trust.text}</p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {c.trust.items.map(({ title, text }, i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <li key={title} data-dark-card className="flex gap-4 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/15">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#E8D0C0]" aria-hidden="true" />
                    <div>
                      <h3 className="font-sans text-base font-semibold text-white">{title}</h3>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-[#F0E6DC]">{text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            {testimonials.length > 0 && (
              <div data-testimonials className="mt-12">
                <h3 className="text-center font-display text-2xl font-bold text-white">{c.trust.testimonialsHeading}</h3>
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                  {testimonials.map((t) => (
                    <li key={t.name + t.authorizedOn} data-dark-card className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/15">
                      <p className="font-sans text-[15px] leading-relaxed text-[#F0E6DC]">“{t.text}”</p>
                      <p className="mt-3 font-sans text-sm font-semibold text-white">{t.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ─── 11. OFERTA ─────────────────────────────────────────────── */}
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

        {/* ─── 12. FAQ ────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-title" className="bg-white px-4 py-14 sm:px-6 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-title" className="mb-8 text-center font-display text-[1.65rem] font-bold text-dark-brown md:text-4xl">
              {c.faq.heading}
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* ─── 13. CTA FINAL ──────────────────────────────────────────── */}
        <section
          id="cta-final"
          aria-labelledby="final-title"
          className="px-4 py-16 text-center sm:px-6 md:py-24"
          style={{ background: DARK_BG }}
        >
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

      {/* ─── 14. BARRA FIXA (celular) ─────────────────────────────────── */}
      <MobileBuyBar productName={product.name} />
    </div>
  );
}
