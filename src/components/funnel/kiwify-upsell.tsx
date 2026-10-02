"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { KIWIFY_UPSELL_SCRIPT_SRC } from "@/config/funnels/ciclo-feminino";

/**
 * Upsell de 1 clique OFICIAL da Kiwify (script v2), reutilizável.
 *
 * - Renderiza a marcação exata do gerador da Kiwify (container
 *   `kiwify-upsell-<código>` com data-upsell-url/data-downsell-url, botão
 *   trigger e recusa cancel-trigger) via innerHTML: o React não reconcilia
 *   esses nós, então o script oficial pode manipulá-los sem conflito.
 * - Carrega o script UMA vez (next/script deduplica pelo `id`).
 * - Até o script estar pronto, aceite e recusa ficam bloqueados (visual +
 *   interceptação na fase de captura, cobrindo mouse, toque e teclado):
 *   nenhum clique "morto" e nenhum evento de tracking sem ação real.
 * - Depois de um aceite/recusa, novos cliques são bloqueados por
 *   `CLICK_LOCK_MS` (evita dupla cobrança por duplo clique).
 * - Falha ou timeout do script → `onUnavailable()` (o pai mostra o checkout).
 *
 * Nenhum dado de pagamento passa por aqui: cobrança e redirecionamento são
 * feitos pelo script da Kiwify com o token que ela própria colocou na URL.
 */

export const KIWIFY_SCRIPT_ID = "kiwify-upsell-v2";
export const KIWIFY_READY_TIMEOUT_MS = 12_000;
export const CLICK_LOCK_MS = 10_000;

export interface KiwifyUpsellProps {
  /** ID do container oficial: `kiwify-upsell-<código>`. */
  containerId: string;
  /** ID EXATO do botão de aceite gerado pela Kiwify. */
  triggerId: string;
  /** ID EXATO do elemento de recusa gerado pela Kiwify. */
  cancelTriggerId: string;
  /** Destino após aceite aprovado (data-upsell-url). */
  acceptUrl: string;
  /** Destino após recusa (data-downsell-url). */
  declineUrl: string;
  acceptLabel: string;
  declineLabel: string;
  /** Metadados/callbacks de tracking (sem PII). */
  tracking?: {
    onAccept?: () => void;
    onDecline?: () => void;
  };
  /** Script não carregou / não ficou pronto a tempo. */
  onUnavailable?: () => void;
  readyTimeoutMs?: number;
}

const KIWIFY_STYLE_VARS =
  "--kiwify-upsell-accept-bg:#C4867A;--kiwify-upsell-accept-color:#FFFFFF;" +
  "--kiwify-upsell-decline-color:#6B7280;--kiwify-upsell-width:100%;--kiwify-upsell-font:inherit";

/**
 * Estilo base da marca (sem !important): botão legível antes/sem o CSS do
 * script. Quando o script carrega, as regras dele prevalecem e usam as
 * variáveis acima. Enquanto `data-kiwify-ready="false"`, os controles ficam
 * visualmente aguardando e sem ponteiro.
 */
export const KIWIFY_HOST_CSS = `
.kiwify-upsell-host [id^="kiwify-upsell-trigger-"]{display:block;width:100%;border:0;border-radius:9999px;padding:15px 14px;background:var(--kiwify-upsell-accept-bg);color:var(--kiwify-upsell-accept-color);font:inherit;font-weight:600;font-size:.95rem;letter-spacing:.01em;line-height:1.3;cursor:pointer;box-shadow:0 10px 30px rgba(196,134,122,.45);transition:opacity .2s}
.kiwify-upsell-host [id^="kiwify-upsell-trigger-"]:focus-visible{outline:2px solid #6B4239;outline-offset:3px}
.kiwify-upsell-host [id^="kiwify-upsell-cancel-trigger-"]:focus-visible{outline:2px solid #6B4239;outline-offset:3px;border-radius:6px}
.kiwify-upsell-host [id^="kiwify-upsell-cancel-trigger-"]{margin-top:18px;text-align:center;color:var(--kiwify-upsell-decline-color);font-size:.875rem;text-decoration:underline;text-underline-offset:4px;cursor:pointer;padding:8px 0}
.kiwify-upsell-host[data-kiwify-ready="false"] [id^="kiwify-upsell-trigger-"],.kiwify-upsell-host[data-kiwify-ready="false"] [id^="kiwify-upsell-cancel-trigger-"]{pointer-events:none;cursor:progress;opacity:.75}
`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildOfficialUpsellHtml({
  containerId,
  triggerId,
  cancelTriggerId,
  acceptUrl,
  declineUrl,
  acceptLabel,
  declineLabel,
}: Pick<
  KiwifyUpsellProps,
  "containerId" | "triggerId" | "cancelTriggerId" | "acceptUrl" | "declineUrl" | "acceptLabel" | "declineLabel"
>) {
  return (
    `<div id="${escapeHtml(containerId)}" data-upsell-url="${escapeHtml(acceptUrl)}" data-downsell-url="${escapeHtml(declineUrl)}" style="${KIWIFY_STYLE_VARS}">` +
    `<button id="${escapeHtml(triggerId)}" type="button">${escapeHtml(acceptLabel)}</button>` +
    `<div id="${escapeHtml(cancelTriggerId)}" role="button" tabindex="0">${escapeHtml(declineLabel)}</div>` +
    `</div>`
  );
}

export function KiwifyUpsell({
  containerId,
  triggerId,
  cancelTriggerId,
  acceptUrl,
  declineUrl,
  acceptLabel,
  declineLabel,
  tracking,
  onUnavailable,
  readyTimeoutMs = KIWIFY_READY_TIMEOUT_MS,
}: KiwifyUpsellProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const lockedUntil = useRef(0);

  // Callbacks em ref: os listeners são registrados uma vez só.
  const callbacks = useRef({ tracking, onUnavailable });
  useEffect(() => {
    callbacks.current = { tracking, onUnavailable };
  });

  // Objeto ESTÁVEL (mesma referência entre renders): o React 19 reaplica
  // innerHTML sempre que a prop dangerouslySetInnerHTML muda de referência,
  // o que apagaria os listeners que o script da Kiwify colocou nos botões
  // (ex.: no re-render de "pronto"). Só muda se os próprios dados mudarem.
  const innerHtml = useMemo(
    () => ({
      __html: buildOfficialUpsellHtml({
        containerId,
        triggerId,
        cancelTriggerId,
        acceptUrl,
        declineUrl,
        acceptLabel,
        declineLabel,
      }),
    }),
    [containerId, triggerId, cancelTriggerId, acceptUrl, declineUrl, acceptLabel, declineLabel]
  );

  const markReady = () => {
    readyRef.current = true;
    setReady(true);
  };

  // Timeout: se o script não ficar pronto, o pai cai para o checkout.
  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => {
      if (!readyRef.current) callbacks.current.onUnavailable?.();
    }, readyTimeoutMs);
    return () => window.clearTimeout(timer);
  }, [ready, readyTimeoutMs]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const resolve = (target: EventTarget | null): "accept" | "decline" | null => {
      const el = target as Element | null;
      if (!el?.closest) return null;
      if (el.closest(`[id="${triggerId}"]`)) return "accept";
      if (el.closest(`[id="${cancelTriggerId}"]`)) return "decline";
      return null;
    };

    // Fase de captura no host: roda ANTES dos handlers do script nos botões.
    const onClick = (event: Event) => {
      const action = resolve(event.target);
      if (!action) return;
      const now = Date.now();
      if (!readyRef.current || now < lockedUntil.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      lockedUntil.current = now + CLICK_LOCK_MS;
      if (action === "accept") callbacks.current.tracking?.onAccept?.();
      else callbacks.current.tracking?.onDecline?.();
    };

    // A recusa oficial é <div role="button" tabindex="0">: Enter/Espaço
    // disparam o mesmo clique que o script escuta.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      if (target?.id !== cancelTriggerId) return;
      event.preventDefault();
      target.click();
    };

    host.addEventListener("click", onClick, true);
    host.addEventListener("keydown", onKeyDown);
    return () => {
      host.removeEventListener("click", onClick, true);
      host.removeEventListener("keydown", onKeyDown);
    };
  }, [triggerId, cancelTriggerId]);

  return (
    <>
      <style>{KIWIFY_HOST_CSS}</style>
      <div
        ref={hostRef}
        className="kiwify-upsell-host"
        data-kiwify-ready={ready ? "true" : "false"}
        aria-busy={!ready}
        dangerouslySetInnerHTML={innerHtml}
      />
      <Script
        id={KIWIFY_SCRIPT_ID}
        src={KIWIFY_UPSELL_SCRIPT_SRC}
        strategy="afterInteractive"
        // onLoad: 1ª carga (ou espera pela carga iniciada por outra montagem);
        // onReady: script já carregado antes desta montagem.
        onLoad={markReady}
        onReady={markReady}
        onError={() => callbacks.current.onUnavailable?.()}
      />
    </>
  );
}
