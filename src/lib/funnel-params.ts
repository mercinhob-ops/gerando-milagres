/**
 * Parâmetros de atribuição preservados ao longo do Funil 01.
 *
 * - ATTRIBUTION_PARAMS vão para o checkout Kiwify e entre as páginas.
 * - `token` (contexto do 1 clique da Kiwify) só circula entre páginas
 *   internas do funil; nunca é enviado ao checkout de entrada nem incluído
 *   nas URLs data-upsell-url/data-downsell-url (o script oficial da Kiwify
 *   anexa o próprio token ao redirecionar).
 *
 * - Entre páginas internas do funil a query recebida é repassada INTEIRA
 *   (forwardParams): parâmetros que a Kiwify adicionar e que não conhecemos
 *   (ex.: payment_type) nunca são removidos.
 *
 * Nada aqui loga valores.
 */
export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "src",
  "sck",
  "fbclid",
] as const;

export const KIWIFY_CONTEXT_PARAM = "token";

export const FUNNEL_PARAMS = [KIWIFY_CONTEXT_PARAM, ...ATTRIBUTION_PARAMS] as const;

/** Seleciona apenas as chaves permitidas (valores não vazios) de uma query. */
export function pickParams(search: string, keys: readonly string[]): URLSearchParams {
  const current = new URLSearchParams(search);
  const picked = new URLSearchParams();
  for (const key of keys) {
    const value = current.get(key);
    if (value) picked.set(key, value);
  }
  return picked;
}

/**
 * Anexa parâmetros a uma URL (absoluta ou relativa) sem duplicar:
 * chaves já presentes na URL de destino são mantidas como estão.
 */
export function appendParams(url: string, params: URLSearchParams): string {
  if ([...params.keys()].length === 0) return url;

  const isAbsolute = /^https?:\/\//i.test(url);
  const parsed = new URL(url, "https://placeholder.invalid");
  for (const [key, value] of params) {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
  }
  if (isAbsolute) return parsed.toString();
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

/**
 * Toda a query recebida (valores não vazios; repetidos: o primeiro), para
 * repassar entre páginas internas do funil sem perder parâmetros Kiwify
 * desconhecidos.
 */
export function forwardParams(search: string): URLSearchParams {
  const current = new URLSearchParams(search);
  const out = new URLSearchParams();
  for (const [key, value] of current) {
    if (value && !out.has(key)) out.set(key, value);
  }
  return out;
}

/**
 * Converte o `searchParams` de uma página do App Router (já resolvido) em
 * query string, preservando TODAS as chaves (inclusive parâmetros Kiwify
 * desconhecidos). Valores repetidos: o primeiro.
 */
export function searchParamsToQuery(
  params: Record<string, string | string[] | undefined> | undefined
): string {
  const out = new URLSearchParams();
  for (const [key, raw] of Object.entries(params ?? {})) {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value) out.set(key, value);
  }
  const qs = out.toString();
  return qs ? `?${qs}` : "";
}
