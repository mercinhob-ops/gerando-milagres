"use client";

import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import type { FunnelProduct } from "@/config/funnels/ciclo-feminino";
import { useCheckoutHref } from "./entry-checkout-cta";

/**
 * Registra no header fixo global o checkout DESTE produto, já com os
 * parâmetros de atribuição da visita. Sem checkout pronto, não registra
 * nada (o header fica oculto nas rotas do funil — ver sticky-header.tsx).
 */
export function FunnelStickyCheckout({ product }: { product: FunnelProduct }) {
  const href = useCheckoutHref(product);
  if (!href) return null;
  return <StickyHeaderCheckout checkoutUrl={href} eventValue={product.price} />;
}
