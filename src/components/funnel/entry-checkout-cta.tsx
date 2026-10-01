"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/design-system/button";
import { cn } from "@/lib/utils";
import { isCheckoutReady, type FunnelProduct } from "@/config/funnels/ciclo-feminino";
import { trackFunnelInitiateCheckout } from "@/lib/funnel-tracking";
import { ATTRIBUTION_PARAMS, appendParams, pickParams } from "@/lib/funnel-params";

/** Checkout do produto + UTMs/src/sck/fbclid da visita (sem duplicar). */
export function useCheckoutHref(product: FunnelProduct) {
  const base = isCheckoutReady(product) ? product.checkoutUrl : null;
  const [href, setHref] = useState(base);

  useEffect(() => {
    if (!base) return;
    // Lido após a hidratação para não divergir do HTML estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(appendParams(base, pickParams(window.location.search, ATTRIBUTION_PARAMS)));
  }, [base]);

  return href;
}

/**
 * CTA de compra da página de entrada. Leva exclusivamente ao checkout do
 * produto configurado em src/config/funnels (nunca ao checkout global) e
 * dispara InitiateCheckout (Pixel + CAPI, mesmo eventID; clique duplo
 * ignorado pela janela de deduplicação). Abre na mesma aba para que o
 * pós-compra da Kiwify continue o funil na aba da cliente.
 */
export function EntryCheckoutCta({
  product,
  funnelId,
  label,
  className,
}: {
  product: FunnelProduct;
  funnelId: string;
  label: string;
  className?: string;
}) {
  const href = useCheckoutHref(product);
  if (!href) return null;

  return (
    <a
      href={href}
      data-funnel-checkout={product.id}
      onClick={() => trackFunnelInitiateCheckout(product, funnelId, "entry")}
      className={cn(
        buttonVariants({ variant: "primary", size: "lg" }),
        "inline-flex bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5",
        className
      )}
    >
      {label}
    </a>
  );
}
