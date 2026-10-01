/**
 * FUNIL 01 — Ciclo Feminino
 *
 * Fonte única de verdade para produtos, preços, checkouts e rotas do funil.
 * Nenhuma página ou componente do funil deve ter URL de checkout ou preço
 * hardcoded — tudo vem daqui.
 *
 * Fluxo:
 *   /ciclofeminino  →  checkout R$ 39,90 (Kiwify)
 *   → /ciclofeminino/oferta-especial  (Ciclos Desbloqueados, R$ 67)
 *   → /ciclofeminino/suplementacao    (Suplementação Inteligente, R$ 47,90)
 *   → /ciclofeminino/obrigada
 *
 * Os redirecionamentos entre etapas pós-compra são feitos PELA KIWIFY
 * (página de obrigado/upsell configurada em cada produto). O frontend
 * não simula esses redirecionamentos. Ver docs/funil-ciclo-feminino.md.
 */

export type CheckoutStatus = "confirmed" | "pending";

export interface FunnelProduct {
  /** Identificador interno estável (usado em eventos e âncoras). */
  id: string;
  name: string;
  /** Valor numérico em BRL, usado nos eventos de conversão. */
  price: number;
  /**
   * URL do checkout Kiwify deste produto.
   * `null` = ainda não confirmada → a página mostra "checkout pendente".
   */
  checkoutUrl: string | null;
  checkoutStatus: CheckoutStatus;
  /**
   * Upsell de 1 clique da Kiwify (cartão/Pix). Preencher com o id EXATO do
   * botão gerado no "gerador de upsell" do painel Kiwify
   * (formato `kiwify-upsell-trigger-XXXXXXX`). `null` = desativado:
   * o botão de aceitar leva ao checkout normal do produto.
   */
  oneClickTriggerId: string | null;
  /** Observações operacionais (não aparecem na página). */
  notes?: string;
}

export const KIWIFY_UPSELL_SCRIPT_SRC =
  "https://kiwify-snippets.netlify.app/upsell/upsell.min.js";

/** Id fixo que o script da Kiwify usa para o link de recusa. */
export const KIWIFY_UPSELL_CANCEL_ID = "kiwify-upsell-cancel-trigger";

export type CicloFemininoProductKey = "cicloFeminino" | "ciclosDesbloqueados" | "suplementacao";

// Tipado como FunnelProduct (não `as const`) para que trocar `null` por uma URL
// confirmada não exija mudar nenhum tipo nas páginas.
export const cicloFemininoProducts: Record<CicloFemininoProductKey, FunnelProduct> = {
  cicloFeminino: {
    id: "ciclo-feminino-descomplicado",
    name: "Ciclo Feminino Descomplicado",
    price: 39.9,
    checkoutUrl: null, // TODO(kiwify): link do produto R$ 39,90 ainda não fornecido
    checkoutStatus: "pending",
    oneClickTriggerId: null, // produto de entrada — não usa 1 clique
  },
  ciclosDesbloqueados: {
    id: "ciclos-desbloqueados",
    name: "Ciclos Desbloqueados",
    price: 67,
    checkoutUrl: null, // TODO(kiwify): confirmar antes de ativar — ver notes
    checkoutStatus: "pending",
    oneClickTriggerId: null, // TODO(kiwify): id do botão do gerador de upsell
    notes:
      "Candidato: https://pay.kiwify.com.br/AQyRq5m (usado em /desbloqueandociclos). " +
      "O checkout mostra o nome 'Ciclos Desbloqueados', mas não exibe o preço e a descrição " +
      "fala de protocolo intestinal. Confirmar no painel Kiwify que é a oferta de R$ 67 " +
      "deste funil antes de preencher checkoutUrl. Atenção: a página de obrigado da Kiwify " +
      "é configurada por produto — alterar a deste produto afeta também quem compra por " +
      "/desbloqueandociclos. Recomendado: oferta/produto separado para o funil.",
  },
  suplementacao: {
    id: "suplementacao-inteligente-fertilidade",
    name: "Suplementação Inteligente para Fertilidade Feminina",
    price: 47.9,
    checkoutUrl: null, // TODO(kiwify): link do produto R$ 47,90 ainda não fornecido
    checkoutStatus: "pending",
    oneClickTriggerId: null, // TODO(kiwify): id do botão do gerador de upsell
  },
};

export const cicloFemininoRoutes = {
  entry: "/ciclofeminino",
  upsell: "/ciclofeminino/oferta-especial",
  downsell: "/ciclofeminino/suplementacao",
  thankYou: "/ciclofeminino/obrigada",
} as const;

export const cicloFemininoFunnel = {
  id: "funil-01-ciclo-feminino",
  products: cicloFemininoProducts,
  routes: cicloFemininoRoutes,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────

export function isCheckoutReady(product: FunnelProduct): product is FunnelProduct & {
  checkoutUrl: string;
} {
  return product.checkoutStatus === "confirmed" && typeof product.checkoutUrl === "string";
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

/** "R$ 39,90" com espaço inseparável, como no restante do site. */
export function formatPrice(value: number) {
  return brl.format(value).replace(/\s/, " ");
}
