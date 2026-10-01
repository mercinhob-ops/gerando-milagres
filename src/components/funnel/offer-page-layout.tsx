import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatPrice, type FunnelProduct } from "@/config/funnels/ciclo-feminino";
import type { FunnelStep } from "@/lib/funnel-tracking";
import { TrackFunnelView } from "./track-funnel-view";
import { UpsellActions } from "./upsell-actions";
import { CopySlot, MediaPlaceholder } from "./copy-slot";

export interface OfferPageContent {
  progressLabel: string;
  badge: string;
  headline: string;
  subheadline: string;
  mediaLabel: string;
  benefitsTitle: string;
  benefits: readonly string[];
  priceNote: string;
  acceptLabel: string;
  declineLabel: string;
}

/**
 * Layout mobile-first das ofertas pós-compra do funil (upsell/oferta 2).
 * Uma coluna no celular com CTA visível cedo; duas colunas no desktop.
 * Sem animações de entrada para não atrasar o carregamento.
 */
export function OfferPageLayout({
  product,
  funnelId,
  step,
  content,
  declineHref,
  disclaimer,
}: {
  product: FunnelProduct;
  funnelId: string;
  step: FunnelStep;
  content: OfferPageContent;
  declineHref: string;
  disclaimer?: ReactNode;
}) {
  const actions = (
    <UpsellActions
      product={product}
      funnelId={funnelId}
      step={step}
      acceptLabel={content.acceptLabel}
      declineLabel={content.declineLabel}
      declineHref={declineHref}
    />
  );

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #ffffff 55%)" }}
    >
      <TrackFunnelView product={product} funnelId={funnelId} step={step} kind="upsell-view" />

      {/* Aviso de etapa — não afirma que a compra anterior foi aprovada */}
      <div className="bg-dark-brown text-center px-4 py-2.5">
        <p className="font-sans text-[11px] md:text-xs font-semibold uppercase tracking-widest text-nude">
          {content.progressLabel}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8 md:py-14">
        <div className="flex justify-center mb-6 md:mb-10">
          <span className="inline-flex items-center gap-2 bg-salmon/10 border border-salmon/30 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-salmon shrink-0" aria-hidden="true" />
            <span className="font-sans text-[11px] md:text-xs font-semibold text-brown uppercase tracking-widest">
              {content.badge}
            </span>
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <div className="flex-1 w-full space-y-6">
            <h1 className="font-['Georgia',serif] text-2xl sm:text-3xl md:text-4xl font-bold text-dark-brown leading-snug text-center md:text-left">
              <CopySlot text={content.headline} />
            </h1>
            <CopySlot
              as="p"
              text={content.subheadline}
              className="block font-sans text-base md:text-lg text-gray-600 leading-relaxed text-center md:text-left"
            />

            <div className="bg-white rounded-2xl border border-nude-dark shadow-sm p-5 md:p-6 space-y-5">
              <div className="text-center md:text-left">
                <p className="font-sans text-sm font-bold text-dark-brown">{product.name}</p>
                <p className="font-['Georgia',serif] text-4xl md:text-5xl font-bold text-brown leading-none mt-2">
                  {formatPrice(product.price)}
                </p>
                <p className="font-sans text-xs text-gray-500 mt-2">{content.priceNote}</p>
              </div>
              {actions}
            </div>

            <div className="space-y-3">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-salmon">
                {content.benefitsTitle}
              </p>
              <ul className="space-y-3" aria-label={content.benefitsTitle}>
                {content.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-salmon shrink-0 mt-0.5" aria-hidden="true" />
                    <CopySlot as="p" text={benefit} className="font-sans text-gray-700 leading-snug" />
                  </li>
                ))}
              </ul>
            </div>

            {/* No celular a mídia vem depois do CTA para o botão aparecer sem rolar */}
            <MediaPlaceholder label={content.mediaLabel} className="md:hidden aspect-[16/9] w-full" />

            {disclaimer && (
              <div className="font-sans text-xs text-gray-500 leading-relaxed bg-cream/70 rounded-xl px-4 py-3">
                {disclaimer}
              </div>
            )}
          </div>

          <div className="hidden md:block w-72 lg:w-80 shrink-0 md:sticky md:top-10">
            <MediaPlaceholder label={content.mediaLabel} className="aspect-[3/4] w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
