"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";
import {
  getOneClickConfig,
  isCheckoutReady,
  SITE_URL,
  type FunnelProduct,
  type OneClickConfig,
} from "@/config/funnels/ciclo-feminino";
import {
  trackFunnelInitiateCheckout,
  trackUpsellAccept,
  trackUpsellDecline,
  type FunnelStep,
} from "@/lib/funnel-tracking";
import {
  ATTRIBUTION_PARAMS,
  KIWIFY_CONTEXT_PARAM,
  appendParams,
  forwardParams,
  pickParams,
} from "@/lib/funnel-params";
import { KiwifyUpsell } from "./kiwify-upsell";

/**
 * Aceitar/recusar de uma oferta pós-compra do Funil 01.
 *
 * MODO "one-click" — a URL tem `?token=` (contexto que a Kiwify envia ao
 * redirecionar após a compra; é o mesmo sinal que a documentação da Kiwify
 * usa para testes: `?token=123`) E o produto tem os IDs do gerador:
 *   delega ao <KiwifyUpsell> (marcação e script OFICIAIS da Kiwify; botões
 *   bloqueados até o script estar pronto). Cobrança e redirecionamento
 *   (aceite e recusa) são da Kiwify.
 *
 * MODO "checkout" — sem token (acesso direto) ou se o script oficial falhar
 *   / não ficar pronto: aceitar abre o checkout oficial do produto (com
 *   UTMs); recusar segue para a próxima etapa repassando a query inteira.
 *
 * Nenhum evento aqui representa compra.
 */

type Mode = "one-click" | "checkout" | "unavailable";

function resolveMode(product: FunnelProduct, oneClick: OneClickConfig | null, search: string): Mode {
  if (oneClick && new URLSearchParams(search).has(KIWIFY_CONTEXT_PARAM)) return "one-click";
  return isCheckoutReady(product) ? "checkout" : "unavailable";
}

export { buildOfficialUpsellHtml } from "./kiwify-upsell";

export function UpsellActions({
  product,
  funnelId,
  step,
  acceptLabel,
  declineLabel,
  initialSearch = "",
}: {
  product: FunnelProduct;
  funnelId: string;
  step: FunnelStep;
  acceptLabel: string;
  declineLabel: string;
  /**
   * Query da requisição, lida no servidor (searchParams da página). Permite
   * renderizar já no HTML o modo correto (1 clique x checkout), sem troca
   * após a hidratação — evita clique no botão errado e salto de layout.
   */
  initialSearch?: string;
}) {
  const oneClick = useMemo(() => getOneClickConfig(product), [product]);
  const nextPath = product.nextPath ?? "/";
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState(initialSearch);
  const [mode, setMode] = useState<Mode>(() => resolveMode(product, oneClick, initialSearch));

  useEffect(() => {
    // Confirma no cliente (ex.: render sem searchParams). Normalmente igual ao SSR.
    const query = window.location.search;
    const next = resolveMode(product, oneClick, query);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(query);
    setMode((current) => (current === next ? current : next));
  }, [product, oneClick]);

  // Tracking do modo checkout (o modo 1 clique faz o próprio tracking).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || mode !== "checkout") return;
    const onClick = (event: Event) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      if (target.closest('[data-funnel-action="accept"]')) {
        trackUpsellAccept(product, funnelId, step);
        trackFunnelInitiateCheckout(product, funnelId, step);
      } else if (target.closest('[data-funnel-action="decline"]')) {
        trackUpsellDecline(product, funnelId, step);
      }
    };
    el.addEventListener("click", onClick, true);
    return () => el.removeEventListener("click", onClick, true);
  }, [mode, product, funnelId, step]);

  const attribution = pickParams(search, ATTRIBUTION_PARAMS);
  const checkoutHref = isCheckoutReady(product) ? appendParams(product.checkoutUrl, attribution) : null;
  // Recusa interna: repassa a query INTEIRA (token, UTMs e qualquer parâmetro
  // Kiwify desconhecido).
  const declineHref = appendParams(nextPath, forwardParams(search));
  // Para o script oficial: URL absoluta da próxima etapa (domínio oficial, como
  // no HTML gerado pela Kiwify) + atribuição, SEM o token (o script da Kiwify
  // anexa o próprio contexto ao redirecionar).
  const kiwifyNextUrl = appendParams(`${SITE_URL}${nextPath}`, attribution);

  const acceptClass = cn(
    buttonVariants({ variant: "primary", size: "lg" }),
    "w-full justify-center text-center text-[15px] px-4 leading-snug shadow-[0_10px_30px_rgba(196,134,122,0.45)]"
  );

  const secureNote = (
    <div className="flex items-center justify-center gap-1.5 text-gray-400">
      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
      <span className="font-sans text-xs">Pagamento processado pela Kiwify</span>
    </div>
  );

  return (
    <div ref={wrapperRef} className="space-y-4" data-upsell-mode={mode}>
      {mode === "one-click" && oneClick ? (
        <>
          <KiwifyUpsell
            containerId={oneClick.containerId}
            triggerId={oneClick.triggerId}
            cancelTriggerId={oneClick.cancelTriggerId}
            acceptUrl={kiwifyNextUrl}
            declineUrl={kiwifyNextUrl}
            acceptLabel={acceptLabel}
            declineLabel={declineLabel}
            tracking={{
              onAccept: () => trackUpsellAccept(product, funnelId, step),
              onDecline: () => trackUpsellDecline(product, funnelId, step),
            }}
            onUnavailable={() => setMode(isCheckoutReady(product) ? "checkout" : "unavailable")}
          />
          {secureNote}
        </>
      ) : (
        <>
          {mode === "checkout" && checkoutHref && (
            <a href={checkoutHref} data-funnel-action="accept" className={acceptClass}>
              {acceptLabel}
            </a>
          )}
          {secureNote}
          <div className="text-center">
            <a
              href={declineHref}
              data-funnel-action="decline"
              className="inline-block font-sans text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4 transition-colors py-2"
            >
              {declineLabel}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
