/**
 * Validação do payload aceito por /api/meta-conversions.
 *
 * A rota é pública por natureza (o navegador a chama sem segredo), então a
 * proteção é em camadas — nenhuma delas sozinha é "autenticação":
 *   1. Content-Type JSON obrigatório (força preflight CORS em chamadas de
 *      outros sites; a rota não responde CORS, então o navegador bloqueia).
 *   2. Origin/Referer do próprio site (domínio oficial, o próprio host do
 *      deploy — cobre previews — e localhost fora de produção).
 *   3. Lista fechada de eventos + validação de tipos, tamanhos e campos.
 *   4. eventSourceUrl precisa ser do mesmo site.
 * Nada aqui loga valores.
 */

/**
 * Eventos efetivamente disparados pelo frontend do site (todos os funis —
 * restringir só ao FUNIL 01 quebraria a CAPI dos demais).
 */
export const ALLOWED_CAPI_EVENTS = [
  // padrão Meta
  "PageView",
  "ViewContent",
  "InitiateCheckout", // usado por outros funis; o FUNIL 01 não dispara mais
  "Lead",
  // personalizados do FUNIL 01
  "CheckoutClick",
  "UpsellView",
  "UpsellAccept",
  "UpsellDecline",
] as const;

export type AllowedCapiEvent = (typeof ALLOWED_CAPI_EVENTS)[number];

export const OFFICIAL_HOSTS = ["gerandomilagres.com.br", "www.gerandomilagres.com.br"] as const;

export const MAX_BODY_BYTES = 4096;

const ALLOWED_CUSTOM_KEYS = new Set([
  "value",
  "currency",
  "content_name",
  "content_ids",
  "content_type",
  "product",
  "step",
  "funnel",
  "funnel_id",
]);

export interface ValidCapiEvent {
  eventName: AllowedCapiEvent;
  eventId: string;
  eventSourceUrl: string;
  customData?: Record<string, string | number | string[]>;
  userData: { fbc?: string; fbp?: string };
}

type Result<T> = { ok: true; value: T } | { ok: false; reason: string };

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const shortString = (v: unknown, max: number): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= max;

/** Hosts aceitos como origem da chamada. */
export function isAllowedHost(host: string, requestHost: string | null, isProduction: boolean) {
  const h = host.toLowerCase();
  if ((OFFICIAL_HOSTS as readonly string[]).includes(h)) return true;
  // Mesmo host do deploy que está respondendo (preview/branch deploy da Netlify).
  if (requestHost && h === requestHost.toLowerCase()) return true;
  if (!isProduction && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(h)) return true;
  return false;
}

function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.host;
  } catch {
    return null;
  }
}

/** Origin (ou, na falta, Referer) precisa ser do próprio site. */
export function checkRequestOrigin(
  headers: { get(name: string): string | null },
  isProduction: boolean
): Result<null> {
  const requestHost = headers.get("x-forwarded-host") ?? headers.get("host");
  const originHost = hostOf(headers.get("origin")) ?? hostOf(headers.get("referer"));
  if (!originHost) return { ok: false, reason: "origin" };
  if (!isAllowedHost(originHost, requestHost, isProduction)) return { ok: false, reason: "origin" };
  return { ok: true, value: null };
}

function validateCustomData(raw: unknown): Result<ValidCapiEvent["customData"]> {
  if (raw === undefined) return { ok: true, value: undefined };
  if (!isPlainObject(raw)) return { ok: false, reason: "customData" };
  const keys = Object.keys(raw);
  if (keys.length > ALLOWED_CUSTOM_KEYS.size) return { ok: false, reason: "customData" };
  const out: Record<string, string | number | string[]> = {};
  for (const key of keys) {
    if (!ALLOWED_CUSTOM_KEYS.has(key)) return { ok: false, reason: "customData" };
    const v = raw[key];
    if (v === undefined || v === null) continue;
    if (key === "value") {
      if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100_000) return { ok: false, reason: "value" };
      out[key] = v;
    } else if (key === "currency") {
      if (typeof v !== "string" || !/^[A-Z]{3}$/.test(v)) return { ok: false, reason: "currency" };
      out[key] = v;
    } else if (key === "content_ids") {
      if (!Array.isArray(v) || v.length > 10 || !v.every((x) => shortString(x, 100))) {
        return { ok: false, reason: "content_ids" };
      }
      out[key] = v as string[];
    } else {
      if (!shortString(v, 200)) return { ok: false, reason: key };
      out[key] = v;
    }
  }
  return { ok: true, value: out };
}

/** Valida o corpo já parseado. */
export function validateCapiPayload(
  body: unknown,
  requestHost: string | null,
  isProduction: boolean
): Result<ValidCapiEvent> {
  if (!isPlainObject(body)) return { ok: false, reason: "body" };
  const { eventName, eventId, eventSourceUrl, customData, userData } = body;

  if (typeof eventName !== "string" || !(ALLOWED_CAPI_EVENTS as readonly string[]).includes(eventName)) {
    return { ok: false, reason: "eventName" };
  }
  // eventID gerado por crypto.randomUUID() no navegador (dedup com o Pixel).
  if (typeof eventId !== "string" || !/^[A-Za-z0-9-]{8,64}$/.test(eventId)) {
    return { ok: false, reason: "eventId" };
  }
  if (!shortString(eventSourceUrl, 2048)) return { ok: false, reason: "eventSourceUrl" };
  const sourceHost = hostOf(eventSourceUrl);
  if (!sourceHost || !isAllowedHost(sourceHost, requestHost, isProduction)) {
    return { ok: false, reason: "eventSourceUrl" };
  }

  const custom = validateCustomData(customData);
  if (!custom.ok) return custom;

  const user: ValidCapiEvent["userData"] = {};
  if (userData !== undefined) {
    if (!isPlainObject(userData)) return { ok: false, reason: "userData" };
    for (const key of ["fbc", "fbp"] as const) {
      const v = userData[key];
      if (v === undefined || v === null || v === "") continue;
      if (typeof v !== "string" || !/^fb\.\d\.\d+\.[\w.-]{1,500}$/.test(v)) return { ok: false, reason: key };
      user[key] = v;
    }
  }

  return {
    ok: true,
    value: {
      eventName: eventName as AllowedCapiEvent,
      eventId,
      eventSourceUrl,
      customData: custom.value,
      userData: user,
    },
  };
}
