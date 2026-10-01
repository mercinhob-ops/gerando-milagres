import { NextResponse } from "next/server";

/**
 * Webhook Kiwify → Purchase (Funil 01) — INFRAESTRUTURA DESLIGADA.
 *
 * Por que desligada: a documentação pública da Kiwify lista os gatilhos de
 * webhook (ex.: `compra_aprovada`) e o campo `token` do cadastro, mas NÃO
 * documenta o formato do payload nem como verificar a autenticidade de uma
 * entrega. Processar corpo não verificado permitiria Purchases falsos.
 *
 * Para ativar (somente com contrato oficial em mãos):
 *   1. Implementar `verifyKiwifyDelivery` conforme a documentação oficial,
 *      usando o segredo em KIWIFY_WEBHOOK_TOKEN (variável de servidor).
 *   2. Implementar `toConfirmedSale`, retornando dados só para eventos de
 *      compra APROVADA, com o valor real da transação.
 *   3. Chamar `sendFunnelPurchase(sale)` de @/lib/kiwify-purchase.
 *   4. Definir KIWIFY_WEBHOOK_ENABLED=true e cadastrar a URL na Kiwify.
 *   5. NÃO ativar se o Pixel/CAPI nativo da Kiwify já envia Purchase ao
 *      mesmo Pixel (contaria em dobro).
 *
 * Esta rota nunca registra (log) o corpo recebido nem dados de compradores.
 */

type Verification = { ok: true } | { ok: false; reason: string };

// TODO(kiwify): implementar conforme contrato oficial. Até lá, sempre recusa.
function verifyKiwifyDelivery(): Verification {
  return { ok: false, reason: "verification-not-implemented" };
}

export async function POST() {
  if (process.env.KIWIFY_WEBHOOK_ENABLED !== "true" || !process.env.KIWIFY_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: "Kiwify webhook not enabled" }, { status: 503 });
  }

  const verification = verifyKiwifyDelivery();
  if (!verification.ok) {
    return NextResponse.json({ error: "Kiwify webhook verification not implemented" }, { status: 501 });
  }

  // Inalcançável enquanto a verificação não existir: nenhum Purchase é enviado.
  return NextResponse.json({ received: true });
}
