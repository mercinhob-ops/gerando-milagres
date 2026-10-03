import { NextResponse } from "next/server";
import { getKiwifyWebhookConfig, KIWIFY_WEBHOOK_SPEC_REQUIRED } from "@/lib/kiwify-purchase";

/**
 * Webhook Kiwify → Purchase (Funil 01) — INFRAESTRUTURA DESLIGADA.
 *
 * KIWIFY_WEBHOOK_SPEC_REQUIRED: a documentação pública da Kiwify lista os
 * gatilhos (ex.: `compra_aprovada`), mas não publica o payload nem como
 * verificar a autenticidade da entrega. Aceitar POST não verificado
 * permitiria Purchases falsos. Por isso esta rota NUNCA processa o corpo.
 *
 * Para finalizar (somente com o contrato oficial em mãos):
 *   1. verificar autenticidade com KIWIFY_WEBHOOK_TOKEN conforme a especificação;
 *   2. aceitar só o evento de pagamento APROVADO;
 *   3. normalizar → ConfirmedKiwifySale (orderId, offerCode, amount real, approvedAt);
 *   4. `createOrderIdempotencyGuard().claim(orderId)` + armazenamento persistente;
 *   5. `sendFunnelPurchase(sale)`;
 *   6. não ativar se o Pixel/CAPI nativo da Kiwify já envia Purchase ao mesmo Pixel.
 *
 * Nunca registrar (log) o corpo, e-mail, telefone ou tokens.
 */
export async function POST() {
  const config = getKiwifyWebhookConfig();

  if (config.status === "disabled") {
    return NextResponse.json({ error: "Kiwify webhook not enabled" }, { status: 503 });
  }
  if (config.status === "misconfigured") {
    return NextResponse.json({ error: "Kiwify webhook misconfigured", missing: config.missing }, { status: 503 });
  }

  // Configurado, mas sem especificação oficial de verificação: recusa sempre.
  return NextResponse.json({ error: KIWIFY_WEBHOOK_SPEC_REQUIRED }, { status: 501 });
}
