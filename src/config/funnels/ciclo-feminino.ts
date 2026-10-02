/**
 * FUNIL 01 — Ciclo Feminino
 *
 * Fonte única de verdade para produtos, preços, checkouts, IDs Kiwify e rotas
 * do funil. Nenhuma página ou componente do funil deve ter URL de checkout,
 * ID Kiwify ou preço hardcoded — tudo vem daqui.
 *
 * Fluxo:
 *   /ciclofeminino  →  checkout aktchfx (R$ 39,90)
 *   → [Kiwify: obrigado do produto] /ciclofeminino/oferta-especial  (1-click AQyRq5m, R$ 67)
 *   → [Kiwify: data-upsell-url / data-downsell-url] /ciclofeminino/suplementacao  (1-click Ttiul2X, R$ 47,90)
 *   → [Kiwify: data-upsell-url / data-downsell-url] /ciclofeminino/obrigada
 *
 * Ver docs/funil-ciclo-feminino.md.
 */

export interface FunnelCoverImage {
  /** Caminho em /public. */
  src: string;
  width: number;
  height: number;
  /** Texto alternativo descritivo. */
  alt: string;
}

export interface FunnelProduct {
  /** Identificador interno estável (usado em content_ids e eventos). */
  id: string;
  name: string;
  /** Valor numérico em BRL, usado nos eventos de conversão. */
  price: number;
  /** Checkout oficial Kiwify deste produto. */
  checkoutUrl: string | null;
  /** `true` somente quando o checkout foi confirmado pelo proprietário. */
  checkoutReady: boolean;
  /**
   * Código da oferta no gerador de upsell da Kiwify. O container oficial é
   * `kiwify-upsell-<código>`. `null` = produto sem upsell de 1 clique.
   */
  kiwifyOfferCode: string | null;
  /** ID EXATO do botão de aceite gerado pela Kiwify. */
  oneClickTriggerId: string | null;
  /** ID EXATO do elemento de recusa gerado pela Kiwify. */
  oneClickCancelTriggerId: string | null;
  /** Próxima etapa do funil (aceite e recusa levam para cá). */
  nextPath: string | null;
  /**
   * Arte oficial do produto em /public. `null` = sem arte oficial: a página
   * usa uma capa tipográfica na identidade do funil.
   */
  coverImage: FunnelCoverImage | null;
}

export const SITE_URL = "https://gerandomilagres.com.br";

/** Script oficial do upsell de 1 clique (v2) fornecido pela Kiwify. */
export const KIWIFY_UPSELL_SCRIPT_SRC = "https://snippets.kiwify.com/upsell-v2/upsell.min.js";

export const cicloFemininoRoutes = {
  entry: "/ciclofeminino",
  upsell: "/ciclofeminino/oferta-especial",
  downsell: "/ciclofeminino/suplementacao",
  thankYou: "/ciclofeminino/obrigada",
} as const;

export type CicloFemininoProductKey = "cicloFeminino" | "ciclosDesbloqueados" | "suplementacao";

export const cicloFemininoProducts: Record<CicloFemininoProductKey, FunnelProduct> = {
  cicloFeminino: {
    id: "ciclo-feminino-descomplicado",
    name: "Ciclo Feminino Descomplicado",
    price: 39.9,
    checkoutUrl: "https://pay.kiwify.com.br/aktchfx",
    checkoutReady: true,
    kiwifyOfferCode: null, // produto de entrada — não usa 1 clique
    oneClickTriggerId: null,
    oneClickCancelTriggerId: null,
    // Pós-compra configurado NA KIWIFY (página de obrigado do produto):
    nextPath: cicloFemininoRoutes.upsell,
    coverImage: {
      src: "/images/ciclo-feminino-descomplicado.webp",
      width: 1134,
      height: 1387,
      alt: "Guia Ciclo Feminino Descomplicado aberto em um tablet, ao lado de um celular com as fases do ciclo",
    },
  },
  ciclosDesbloqueados: {
    id: "ciclos-desbloqueados",
    name: "Ciclos Desbloqueados",
    price: 67,
    checkoutUrl: "https://pay.kiwify.com.br/AQyRq5m",
    checkoutReady: true,
    kiwifyOfferCode: "AQyRq5m",
    oneClickTriggerId: "kiwify-upsell-trigger-AQyRq5m",
    oneClickCancelTriggerId: "kiwify-upsell-cancel-trigger-AQyRq5m",
    nextPath: cicloFemininoRoutes.downsell,
    coverImage: null, // sem arte; capas tipográficas dos 3 materiais
  },
  suplementacao: {
    id: "suplementacao-fertilidade-mulher",
    name: "Suplementação para a Fertilidade da Mulher",
    price: 47.9,
    checkoutUrl: "https://pay.kiwify.com.br/Ttiul2X",
    checkoutReady: true,
    kiwifyOfferCode: "Ttiul2X",
    oneClickTriggerId: "kiwify-upsell-trigger-Ttiul2X",
    oneClickCancelTriggerId: "kiwify-upsell-cancel-trigger-Ttiul2X",
    nextPath: cicloFemininoRoutes.thankYou,
    coverImage: {
      src: "/images/suplementacao-fertilidade-feminina.webp",
      width: 1134,
      height: 1387,
      alt: "Guia de suplementação para a fertilidade feminina aberto em um tablet, ao lado de um frasco de suplemento",
    },
  },
};

export const cicloFemininoFunnel = {
  id: "funil-01-ciclo-feminino",
  products: cicloFemininoProducts,
  routes: cicloFemininoRoutes,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────

export function isCheckoutReady(product: FunnelProduct): product is FunnelProduct & {
  checkoutUrl: string;
} {
  return product.checkoutReady && typeof product.checkoutUrl === "string";
}

export interface OneClickConfig {
  containerId: string;
  triggerId: string;
  cancelTriggerId: string;
}

/** Configuração completa do 1 clique ou `null` se faltar qualquer ID. */
export function getOneClickConfig(product: FunnelProduct): OneClickConfig | null {
  if (!product.kiwifyOfferCode || !product.oneClickTriggerId || !product.oneClickCancelTriggerId) {
    return null;
  }
  return {
    containerId: `kiwify-upsell-${product.kiwifyOfferCode}`,
    triggerId: product.oneClickTriggerId,
    cancelTriggerId: product.oneClickCancelTriggerId,
  };
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
