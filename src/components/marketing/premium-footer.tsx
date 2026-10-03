"use client";

import { createWhatsappUrl } from "@/lib/env";

const DEFAULT_SIGNATURE = "Dra. Camilla Freitas • CRF/PE 4563 • Todos os direitos reservados";

/**
 * Rodapé premium compartilhado.
 *
 * Padrão (sem props novas) = comportamento original das páginas existentes.
 * - `whatsappMessage` ausente → sem link de WhatsApp (usado no Funil 01,
 *   que reserva o contato direto para uma etapa posterior).
 * - `signature` → linha de assinatura específica (o Funil 01 não usa "Dra.").
 * - `showBackToTop` → botão "Voltar ao topo" (padrão: sim).
 */
export function PremiumFooter({
  whatsappMessage,
  signature = DEFAULT_SIGNATURE,
  showBackToTop = true,
}: {
  whatsappMessage?: string;
  signature?: string;
  showBackToTop?: boolean;
}) {
  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="py-12 px-6 text-center" style={{ background: "#4A2E26" }}>
      <div className="max-w-2xl mx-auto space-y-5">
        {whatsappMessage && (
          <a
            href={createWhatsappUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm text-nude/80 hover:text-white transition-colors"
          >
            Central de atendimento: contato via WhatsApp +55 (81) 98139-6005
          </a>
        )}

        <p className="font-sans text-xs text-nude/50">{signature}</p>

        <a
          href="/privacidade"
          className="inline-block font-sans text-xs text-nude/60 hover:text-white underline underline-offset-4 transition-colors py-3"
        >
          Política de Privacidade
        </a>

        {showBackToTop && (
          <div>
            <button
              type="button"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-white/80 border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
            >
              Voltar ao topo
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
