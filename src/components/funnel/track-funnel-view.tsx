"use client";

import { useEffect, useRef } from "react";
import type { FunnelProduct } from "@/config/funnels/ciclo-feminino";
import {
  trackFunnelViewContent,
  trackUpsellView,
  type FunnelStep,
} from "@/lib/funnel-tracking";

/**
 * Dispara um único evento de visualização por carregamento de página.
 * - kind "view-content" → ViewContent (página de entrada)
 * - kind "upsell-view"  → UpsellView  (ofertas pós-compra)
 *
 * Proteção dupla contra repetição: ref local (re-render) + janela de
 * deduplicação em funnel-tracking (Strict Mode / remount).
 */
export function TrackFunnelView({
  product,
  funnelId,
  step,
  kind,
}: {
  product: FunnelProduct;
  funnelId: string;
  step: FunnelStep;
  kind: "view-content" | "upsell-view";
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (kind === "view-content") void trackFunnelViewContent(product, funnelId, step);
    else void trackUpsellView(product, funnelId, step);
  }, [product, funnelId, step, kind]);

  return null;
}
