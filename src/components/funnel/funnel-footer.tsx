import { PremiumFooter } from "@/components/marketing/premium-footer";

/** Assinatura do Funil 01 — somente credenciais confirmadas, sem "Dra.". */
export const FUNNEL_FOOTER_SIGNATURE =
  "Camilla Freitas • Farmacêutica • CRF/PE 4563 • Todos os direitos reservados";

/**
 * Rodapé das páginas do Funil 01: mesma identidade do PremiumFooter, sem
 * WhatsApp (contato direto fica para uma etapa posterior) e com link válido
 * para a Política de Privacidade.
 */
export function FunnelFooter({ showBackToTop = true }: { showBackToTop?: boolean }) {
  return <PremiumFooter signature={FUNNEL_FOOTER_SIGNATURE} showBackToTop={showBackToTop} />;
}
