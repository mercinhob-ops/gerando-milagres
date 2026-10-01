"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";
import {
  isCheckoutReady,
  KIWIFY_UPSELL_CANCEL_ID,
  KIWIFY_UPSELL_SCRIPT_SRC,
  type FunnelProduct,
} from "@/config/funnels/ciclo-feminino";
import {
  trackFunnelInitiateCheckout,
  trackUpsellAccept,
  trackUpsellDecline,
  type FunnelStep,
} from "@/lib/funnel-tracking";

/** Parâmetros repassados entre etapas (token da Kiwify + UTMs). */
const FORWARDED_PARAMS = [
  "token",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "src",
  "sck",
] as const;

function forwardedQuery(search: string) {
  const current = new URLSearchParams(search);
  const next = new URLSearchParams();
  for (const key of FORWARDED_PARAMS) {
    const value = current.get(key);
    if (value) next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `?${qs}` : "";
}

type Mode = "one-click" | "checkout" | "pending";

/**
 * Botões de aceitar/recusar de uma oferta pós-compra.
 *
 * - "one-click": a Kiwify redirecionou para cá com `?token=` E o id do botão
 *   do gerador de upsell está configurado → renderiza os ids que o script
 *   oficial da Kiwify usa. A cobrança e o redirecionamento são da Kiwify.
 * - "checkout": sem token (ex.: acesso direto) → aceitar abre o checkout
 *   próprio do produto.
 * - "pending": checkout ainda não confirmado na config → botão inativo.
 *
 * Recusar sempre leva à próxima etapa, preservando token e UTMs.
 * Nada aqui confirma compra: Purchase vem da Kiwify.
 */
export function UpsellActions({
  product,
  funnelId,
  step,
  acceptLabel,
  declineLabel,
  declineHref,
}: {
  product: FunnelProduct;
  funnelId: string;
  step: FunnelStep;
  acceptLabel: string;
  declineLabel: string;
  declineHref: string;
}) {
  const [query, setQuery] = useState("");
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const search = window.location.search;
    // Leitura única da URL após a hidratação (evita mismatch SSR/cliente).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(forwardedQuery(search));
    setHasToken(new URLSearchParams(search).has("token"));
  }, []);

  const mode: Mode =
    product.oneClickTriggerId && hasToken
      ? "one-click"
      : isCheckoutReady(product)
        ? "checkout"
        : "pending";

  const acceptClass = cn(
    buttonVariants({ variant: "primary", size: "lg" }),
    "w-full justify-center text-center leading-snug shadow-[0_10px_30px_rgba(196,134,122,0.45)]"
  );

  function handleAccept() {
    trackUpsellAccept(product, funnelId, step);
    if (mode === "checkout") trackFunnelInitiateCheckout(product, funnelId, step);
  }

  function handleDecline() {
    trackUpsellDecline(product, funnelId, step);
  }

  return (
    <div className="space-y-5" data-upsell-mode={mode}>
      {mode === "one-click" && (
        <>
          <a id={product.oneClickTriggerId ?? undefined} href="#" onClick={handleAccept} className={acceptClass}>
            {acceptLabel}
          </a>
          <Script src={KIWIFY_UPSELL_SCRIPT_SRC} strategy="afterInteractive" />
        </>
      )}

      {mode === "checkout" && isCheckoutReady(product) && (
        <a href={`${product.checkoutUrl}${query}`} onClick={handleAccept} className={acceptClass}>
          {acceptLabel}
        </a>
      )}

      {mode === "pending" && (
        <span
          role="button"
          aria-disabled="true"
          data-checkout-pending={product.id}
          title="Checkout Kiwify ainda não configurado em src/config/funnels/ciclo-feminino.ts"
          className={cn(
            acceptClass,
            "flex-col gap-0.5 cursor-not-allowed bg-salmon/80 hover:bg-salmon/80 outline-2 outline-dashed outline-offset-4 outline-amber-500/70"
          )}
        >
          <span>{acceptLabel}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/85">
            Checkout pendente
          </span>
        </span>
      )}

      <div className="flex items-center justify-center gap-1.5 text-gray-400">
        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="font-sans text-xs">Pagamento processado pela Kiwify</span>
      </div>

      <div className="text-center">
        <a
          id={mode === "one-click" ? KIWIFY_UPSELL_CANCEL_ID : undefined}
          href={`${declineHref}${query}`}
          onClick={handleDecline}
          className="inline-block font-sans text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors py-2"
        >
          {declineLabel}
        </a>
      </div>
    </div>
  );
}
