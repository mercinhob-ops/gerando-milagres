/**
 * FUNIL 02 — Preparo para Engravidar
 *
 * Fonte única de verdade para produto, preço, checkout, materiais e rota
 * deste funil. Tipos e helpers são compartilhados com o Funil 01
 * (ciclo-feminino.ts). Nenhum componente da página deve ter preço, link de
 * checkout ou estado de material hardcoded — tudo vem daqui.
 *
 * PARA ATIVAR AS VENDAS (somente com dados confirmados pelo proprietário):
 *   1. `checkoutUrl`: link oficial da Kiwify deste produto.
 *   2. `checkoutReady: true`.
 *   3. `price` final e `priceIsProvisional: false`.
 *   4. Cada material pronto: `ready: true` (+ `preview` com a imagem real).
 *   5. `coverImage` com a arte oficial, quando existir.
 *   6. Remover o aviso de prévia e o noindex em page.tsx.
 */
import type { FunnelCoverImage, FunnelProduct } from "./ciclo-feminino";

export const preparoParaEngravidarRoutes = {
  entry: "/preparoparaengravidar",
} as const;

export const preparoParaEngravidarProduct: FunnelProduct = {
  id: "preparo-para-engravidar",
  name: "Preparo para Engravidar",
  price: 77,
  checkoutUrl: null, // pendente: link oficial da Kiwify
  checkoutReady: false,
  kiwifyOfferCode: null,
  oneClickTriggerId: null,
  oneClickCancelTriggerId: null,
  nextPath: null,
  coverImage: null, // pendente: arte oficial do produto
};

/** Enquanto `true`, todo preço exibido traz a indicação "preço provisório". */
export const PRICE_IS_PROVISIONAL = true;

export interface PreparoMaterial {
  id: string;
  name: string;
  /** `true` somente quando o arquivo final existir e for entregue na compra. */
  ready: boolean;
  /** Imagem real de uma página do material; `null` até existir. */
  preview: FunnelCoverImage | null;
}

/** Materiais planejados. Nenhum está pronto: a página exibe "Em produção". */
export const preparoParaEngravidarMaterials: readonly PreparoMaterial[] = [
  { id: "guia", name: "Guia Preparo para Engravidar", ready: false, preview: null },
  { id: "checklist", name: "Checklist Antes do Positivo", ready: false, preview: null },
  { id: "diario-ciclo", name: "Diário do Ciclo", ready: false, preview: null },
  { id: "mapa-habitos", name: "Mapa de Hábitos", ready: false, preview: null },
  { id: "roteiro-consulta", name: "Roteiro para Consulta", ready: false, preview: null },
  { id: "plano-final", name: "Plano Final de Preparação", ready: false, preview: null },
];

export const preparoParaEngravidarFunnel = {
  id: "funil-02-preparo-para-engravidar",
  /** Identificador curto usado no parâmetro `funnel` do CheckoutClick. */
  slug: "preparo-para-engravidar",
  product: preparoParaEngravidarProduct,
  materials: preparoParaEngravidarMaterials,
  routes: preparoParaEngravidarRoutes,
} as const;
