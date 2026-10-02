import { trackConversionEvent } from "@/lib/meta-conversions";
import { cicloFemininoFunnel, type FunnelProduct } from "@/config/funnels/ciclo-feminino";

/**
 * Eventos do funil. Todos passam por `trackConversionEvent`, que envia
 * Pixel (browser) + CAPI (/api/meta-conversions) com o MESMO eventID,
 * preservando a deduplicação no Meta.
 *
 * Purchase NÃO é disparado no frontend: só a confirmação real da Kiwify
 * (integração nativa da Kiwify ou webhook server-side) representa compra.
 *
 * InitiateCheckout NÃO é disparado pelo FUNIL 01: o Pixel configurado na
 * Kiwify já o dispara ao abrir o checkout, e não há deduplicação entre os
 * dois. O clique nos CTAs que levam ao checkout vira o evento personalizado
 * `CheckoutClick`.
 */
export const FUNNEL_EVENTS = {
  viewContent: "ViewContent", // padrão Meta
  checkoutClick: "CheckoutClick", // custom (no lugar de InitiateCheckout)
  upsellView: "UpsellView", // custom
  upsellAccept: "UpsellAccept", // custom
  upsellDecline: "UpsellDecline", // custom
} as const;

export type FunnelStep = "entry" | "upsell-1" | "upsell-2";

function productData(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  return {
    value: product.price,
    currency: "BRL",
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    product: product.name,
    step,
    funnel_id: funnelId,
  };
}

// ─── Proteção contra disparo duplo ──────────────────────────────────────────
// Cobre React Strict Mode (efeito executado 2x em dev), re-render, remount e
// clique duplo. Janela curta: não bloqueia uma nova ação legítima.
const DEDUPE_WINDOW_MS = 1500;
const lastFired = new Map<string, number>();

function shouldFire(key: string) {
  const now = Date.now();
  const last = lastFired.get(key);
  if (last !== undefined && now - last < DEDUPE_WINDOW_MS) return false;
  lastFired.set(key, now);
  return true;
}

/** Somente para testes. */
export function __resetFunnelTrackingForTests() {
  lastFired.clear();
}

// ─── Espera do Pixel ────────────────────────────────────────────────────────
// Eventos de visualização disparam na montagem da página, antes de o script
// do Pixel (afterInteractive) definir window.fbq. Sem essa espera, o evento
// chegava só pela CAPI. Aguarda até FBQ_WAIT_MS; se o Pixel não existir
// (ex.: sem NEXT_PUBLIC_META_PIXEL_ID), envia mesmo assim (CAPI).
const FBQ_WAIT_MS = 4000;
const FBQ_POLL_MS = 100;

export function waitForFbq(timeoutMs = FBQ_WAIT_MS): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.fbq === "function") return resolve();
    const started = Date.now();
    const timer = setInterval(() => {
      if (typeof window.fbq === "function" || Date.now() - started >= timeoutMs) {
        clearInterval(timer);
        resolve();
      }
    }, FBQ_POLL_MS);
  });
}

function fire(eventName: string, product: FunnelProduct, funnelId: string, step: FunnelStep, custom = false) {
  if (!shouldFire(`${eventName}:${product.id}:${step}`)) return;
  // keepalive: aceite/recusa navegam logo após o clique; a CAPI não pode ser cancelada.
  trackConversionEvent({ eventName, customData: productData(product, funnelId, step), custom, keepalive: true });
}

export async function trackFunnelViewContent(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  if (!shouldFire(`${FUNNEL_EVENTS.viewContent}:${product.id}:${step}:mount`)) return;
  await waitForFbq();
  fire(FUNNEL_EVENTS.viewContent, product, funnelId, step);
}

export async function trackUpsellView(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  if (!shouldFire(`${FUNNEL_EVENTS.upsellView}:${product.id}:${step}:mount`)) return;
  await waitForFbq();
  fire(FUNNEL_EVENTS.upsellView, product, funnelId, step, true);
}

/**
 * Clique em um CTA que abre o checkout Kiwify (LP, header fixo da LP e
 * aceite no modo checkout das upsells). Uma chave de deduplicação por
 * produto/etapa: clique duplo ou CTA + header no mesmo instante = 1 evento.
 */
export function trackFunnelCheckoutClick(product: FunnelProduct, step: FunnelStep) {
  if (!shouldFire(`${FUNNEL_EVENTS.checkoutClick}:${product.id}:${step}`)) return;
  trackConversionEvent({
    eventName: FUNNEL_EVENTS.checkoutClick,
    customData: {
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BRL",
      funnel: cicloFemininoFunnel.slug,
      step,
    },
    custom: true,
    keepalive: true, // o clique navega para a Kiwify na mesma aba
  });
}

export function trackUpsellAccept(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  fire(FUNNEL_EVENTS.upsellAccept, product, funnelId, step, true);
}

export function trackUpsellDecline(product: FunnelProduct, funnelId: string, step: FunnelStep) {
  fire(FUNNEL_EVENTS.upsellDecline, product, funnelId, step, true);
}
