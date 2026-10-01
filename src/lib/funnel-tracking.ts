import { trackConversionEvent } from "@/lib/meta-conversions";
import type { FunnelProduct } from "@/config/funnels/ciclo-feminino";

/**
 * Eventos do funil. Todos passam por `trackConversionEvent`, que envia
 * Pixel (browser) + CAPI (/api/meta-conversions) com o MESMO eventID,
 * preservando a deduplicação.
 *
 * Purchase NÃO é disparado aqui: a compra só é confirmada pela Kiwify
 * (integração nativa de Pixel/CAPI da Kiwify ou webhook server-side).
 */
export const FUNNEL_EVENTS = {
  viewContent: "ViewContent", // padrão Meta
  initiateCheckout: "InitiateCheckout", // padrão Meta
  upsellView: "UpsellView", // custom
  upsellAccept: "UpsellAccept", // custom
  upsellDecline: "UpsellDecline", // custom
} as const;

export type FunnelStep = "entry" | "upsell-1" | "oferta-2";

function productData(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  return {
    value: product.price,
    currency: "BRL",
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    funnel_id: funnelId,
    funnel_step: step,
  };
}

export function trackFunnelViewContent(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  trackConversionEvent({
    eventName: FUNNEL_EVENTS.viewContent,
    customData: productData(product, funnelId, step),
  });
}

export function trackFunnelInitiateCheckout(
  product: FunnelProduct,
  funnelId: string,
  step: FunnelStep
) {
  trackConversionEvent({
    eventName: FUNNEL_EVENTS.initiateCheckout,
    customData: productData(product, funnelId, step),
  });
}

export function trackUpsellView(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  trackConversionEvent({
    eventName: FUNNEL_EVENTS.upsellView,
    customData: productData(product, funnelId, step),
    custom: true,
  });
}

export function trackUpsellAccept(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  trackConversionEvent({
    eventName: FUNNEL_EVENTS.upsellAccept,
    customData: productData(product, funnelId, step),
    custom: true,
  });
}

export function trackUpsellDecline(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  trackConversionEvent({
    eventName: FUNNEL_EVENTS.upsellDecline,
    customData: productData(product, funnelId, step),
    custom: true,
  });
}
