import {
  cicloFemininoProducts,
  cicloFemininoRoutes,
  SITE_URL,
  type FunnelProduct,
} from "@/config/funnels/ciclo-feminino";
import { sendServerConversionEvent, type ServerConversionEvent } from "@/lib/meta-conversions-server";

/**
 * PURCHASE DO FUNIL 01 A PARTIR DE CONFIRMAÇÃO REAL DA KIWIFY
 *
 * Este módulo NÃO conhece o formato do webhook da Kiwify: a documentação
 * pública (docs.kiwify.com.br) lista os gatilhos (ex.: `compra_aprovada`),
 * mas não publica o payload nem como verificar a autenticidade da entrega.
 * Por isso:
 *   - `ConfirmedKiwifySale` é um formato NOSSO, normalizado;
 *   - a conversão payload → ConfirmedKiwifySale e a verificação de
 *     autenticidade ficam em `src/app/api/webhooks/kiwify/route.ts`,
 *     DESLIGADAS até existir contrato oficial.
 *
 * Cada transação confirmada vira UM Purchase com o valor REAL daquela
 * transação (R$ 39,90, R$ 67 e R$ 47,90 são eventos separados; nada é somado).
 * event_id estável por pedido → retentativas do webhook não duplicam no Meta.
 *
 * ATENÇÃO: não usar junto com o Pixel/CAPI nativo da Kiwify para o mesmo
 * Pixel — os IDs seriam diferentes e o Purchase contaria em dobro.
 */

export interface ConfirmedKiwifySale {
  /** ID do pedido/transação na Kiwify (único por transação). */
  orderId: string;
  /** Código do checkout/oferta (ex.: "aktchfx", "AQyRq5m", "Ttiul2X"). */
  offerCode: string;
  /** Valor efetivamente pago nesta transação, em reais. */
  amount: number;
  /** Momento da aprovação (Unix, segundos). */
  approvedAt: number;
  customerEmail?: string | null;
  customerPhone?: string | null;
}

function offerCodeOf(product: FunnelProduct) {
  if (product.kiwifyOfferCode) return product.kiwifyOfferCode;
  const match = product.checkoutUrl?.match(/pay\.kiwify\.com\.br\/([A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

/** Produto do Funil 01 pelo código Kiwify, ou null se for de outro funil. */
export function findFunnelProductByOfferCode(code: string): FunnelProduct | null {
  return (
    Object.values(cicloFemininoProducts).find((p) => offerCodeOf(p) === code) ?? null
  );
}

export function buildPurchaseEvent(sale: ConfirmedKiwifySale): ServerConversionEvent | null {
  const product = findFunnelProductByOfferCode(sale.offerCode);
  if (!product) return null;
  if (!sale.orderId || !Number.isFinite(sale.amount) || sale.amount <= 0) return null;

  return {
    eventName: "Purchase",
    eventId: `kiwify-purchase-${sale.orderId}`,
    eventTime: sale.approvedAt,
    eventSourceUrl: `${SITE_URL}${cicloFemininoRoutes.entry}`,
    // Sem user agent do navegador do comprador (webhook), "system_generated"
    // é o action_source aceito pelo Meta. Ver docs/funil-ciclo-feminino.md.
    actionSource: "system_generated",
    customData: {
      value: Math.round(sale.amount * 100) / 100,
      currency: "BRL",
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      order_id: sale.orderId,
    },
    userEmail: sale.customerEmail ?? null,
    userPhone: sale.customerPhone ?? null,
  };
}

/** Envia o Purchase de uma venda CONFIRMADA. Retorna false se não for do funil. */
export async function sendFunnelPurchase(sale: ConfirmedKiwifySale): Promise<boolean> {
  const event = buildPurchaseEvent(sale);
  if (!event) return false;
  await sendServerConversionEvent(event);
  return true;
}

// ─── Webhook: configuração, especificação e idempotência ────────────────────

/**
 * Marcador explícito: o contrato do webhook da Kiwify (payload, campo de
 * status aprovado, ID da transação, valor e forma de verificar autenticidade)
 * NÃO está documentado publicamente nem no repositório. Enquanto este
 * marcador existir, a rota recusa qualquer POST — nenhum Purchase é enviado.
 */
export const KIWIFY_WEBHOOK_SPEC_REQUIRED = "KIWIFY_WEBHOOK_SPEC_REQUIRED" as const;

export type KiwifyWebhookConfig =
  | { status: "disabled" }
  | { status: "misconfigured"; missing: string[] }
  | { status: "ready"; secret: string };

/** Valida as variáveis de servidor do webhook (nunca expostas ao cliente). */
export function getKiwifyWebhookConfig(env: NodeJS.ProcessEnv = process.env): KiwifyWebhookConfig {
  if (env.KIWIFY_WEBHOOK_ENABLED !== "true") return { status: "disabled" };
  const missing = ["KIWIFY_WEBHOOK_TOKEN", "META_CONVERSIONS_TOKEN", "NEXT_PUBLIC_META_PIXEL_ID"].filter(
    (key) => !env[key]
  );
  if (missing.length > 0) return { status: "misconfigured", missing };
  return { status: "ready", secret: env.KIWIFY_WEBHOOK_TOKEN! };
}

/**
 * Idempotência por pedido/transação: o mesmo orderId só gera um Purchase.
 * Camadas:
 *  1. este guard em memória (por instância do servidor, com TTL);
 *  2. event_id estável `kiwify-purchase-<orderId>` → o Meta deduplica
 *     reenvios do mesmo evento.
 * Para garantia entre instâncias/reinícios, a versão final deve gravar o
 * orderId em armazenamento persistente (ex.: tabela no Supabase do projeto)
 * antes de enviar — definido quando a especificação da Kiwify existir.
 */
export function createOrderIdempotencyGuard(ttlMs = 48 * 60 * 60 * 1000, now: () => number = Date.now) {
  const seen = new Map<string, number>();
  return {
    /** true na primeira vez que o orderId aparece dentro do TTL. */
    claim(orderId: string): boolean {
      const t = now();
      for (const [id, at] of seen) if (t - at > ttlMs) seen.delete(id);
      if (!orderId || seen.has(orderId)) return false;
      seen.set(orderId, t);
      return true;
    },
  };
}
