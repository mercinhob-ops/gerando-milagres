"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";
import {
  getOneClickConfig,
  isCheckoutReady,
  KIWIFY_UPSELL_SCRIPT_SRC,
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
  FUNNEL_PARAMS,
  KIWIFY_CONTEXT_PARAM,
  appendParams,
  pickParams,
} from "@/lib/funnel-params";

/**
 * Aceitar/recusar de uma oferta pós-compra do Funil 01.
 *
 * MODO "one-click" — a URL tem `?token=` (contexto que a Kiwify envia ao
 * redirecionar após a compra; é o mesmo sinal que a documentação da Kiwify
 * usa para testes: `?token=123`) E o produto tem os IDs do gerador:
 *   renderiza a marcação OFICIAL do gerador de upsell (container
 *   `kiwify-upsell-<código>` com data-upsell-url/data-downsell-url, botão
 *   `kiwify-upsell-trigger-<código>`, recusa `kiwify-upsell-cancel-trigger-<código>`)
 *   via innerHTML — React não controla esses nós, então o script oficial pode
 *   manipulá-los livremente — e carrega o script v2 UMA vez (next/script, id fixo).
 *   Cobrança e redirecionamento (aceite e recusa) são da Kiwify.
 *
 * MODO "checkout" — sem token (acesso direto) ou se o script oficial falhar
 *   ao carregar: aceitar abre o checkout oficial do produto (com UTMs);
 *   recusar segue para a próxima etapa (com token/UTMs).
 *
 * Tracking por delegação de clique (fase de captura) no wrapper: funciona
 * nos dois modos sem interferir nos handlers do script da Kiwify e sem
 * chamar preventDefault. Cliques repetidos são ignorados pela janela de
 * deduplicação de funnel-tracking. Nenhum evento aqui representa compra.
 */

type Mode = "one-click" | "checkout" | "unavailable";

function resolveMode(product: FunnelProduct, oneClick: OneClickConfig | null, search: string): Mode {
  if (oneClick && new URLSearchParams(search).has(KIWIFY_CONTEXT_PARAM)) return "one-click";
  return isCheckoutReady(product) ? "checkout" : "unavailable";
}

const KIWIFY_STYLE_VARS =
  "--kiwify-upsell-accept-bg:#C4867A;--kiwify-upsell-accept-color:#FFFFFF;" +
  "--kiwify-upsell-decline-color:#6B7280;--kiwify-upsell-width:100%;--kiwify-upsell-font:inherit";

/**
 * Estilo base da marca para a marcação oficial (sem !important): garante um
 * botão legível antes/sem o CSS do script. Quando o script oficial carrega,
 * as regras dele prevalecem e usam as variáveis acima.
 */
const KIWIFY_HOST_CSS = `
.kiwify-upsell-host [id^="kiwify-upsell-trigger-"]{display:block;width:100%;border:0;border-radius:9999px;padding:15px 14px;background:var(--kiwify-upsell-accept-bg);color:var(--kiwify-upsell-accept-color);font:inherit;font-weight:600;font-size:.95rem;letter-spacing:.01em;line-height:1.3;cursor:pointer;box-shadow:0 10px 30px rgba(196,134,122,.45)}
.kiwify-upsell-host [id^="kiwify-upsell-trigger-"]:focus-visible{outline:2px solid #6B4239;outline-offset:3px}
.kiwify-upsell-host [id^="kiwify-upsell-cancel-trigger-"]{margin-top:18px;text-align:center;color:var(--kiwify-upsell-decline-color);font-size:.875rem;text-decoration:underline;text-underline-offset:4px;cursor:pointer;padding:8px 0}
`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildOfficialUpsellHtml({
  config,
  nextUrl,
  acceptLabel,
  declineLabel,
}: {
  config: OneClickConfig;
  nextUrl: string;
  acceptLabel: string;
  declineLabel: string;
}) {
  const url = escapeHtml(nextUrl);
  return (
    `<div id="${config.containerId}" data-upsell-url="${url}" data-downsell-url="${url}" style="${KIWIFY_STYLE_VARS}">` +
    `<button id="${config.triggerId}" type="button">${escapeHtml(acceptLabel)}</button>` +
    `<div id="${config.cancelTriggerId}" role="button" tabindex="0">${escapeHtml(declineLabel)}</div>` +
    `</div>`
  );
}

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

  // Delegação de cliques para tracking (não altera navegação).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onClick = (event: Event) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      const isAccept =
        target.closest('[data-funnel-action="accept"]') ||
        (oneClick && target.closest(`[id="${oneClick.triggerId}"]`));
      const isDecline =
        target.closest('[data-funnel-action="decline"]') ||
        (oneClick && target.closest(`[id="${oneClick.cancelTriggerId}"]`));
      if (isAccept) {
        trackUpsellAccept(product, funnelId, step);
        if (mode === "checkout") trackFunnelInitiateCheckout(product, funnelId, step);
      } else if (isDecline) {
        trackUpsellDecline(product, funnelId, step);
      }
    };
    el.addEventListener("click", onClick, true);
    return () => el.removeEventListener("click", onClick, true);
  }, [mode, oneClick, product, funnelId, step]);

  const attribution = pickParams(search, ATTRIBUTION_PARAMS);
  const checkoutHref = isCheckoutReady(product) ? appendParams(product.checkoutUrl, attribution) : null;
  const declineHref = appendParams(nextPath, pickParams(search, FUNNEL_PARAMS));
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
          <style>{KIWIFY_HOST_CSS}</style>
          <div
            className="kiwify-upsell-host"
            dangerouslySetInnerHTML={{
              __html: buildOfficialUpsellHtml({ config: oneClick, nextUrl: kiwifyNextUrl, acceptLabel, declineLabel }),
            }}
          />
          <Script
            id="kiwify-upsell-v2"
            src={KIWIFY_UPSELL_SCRIPT_SRC}
            strategy="afterInteractive"
            onError={() => setMode(isCheckoutReady(product) ? "checkout" : "unavailable")}
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
