import { NextRequest, NextResponse } from "next/server";
import { checkRequestOrigin, MAX_BODY_BYTES, validateCapiPayload } from "@/lib/meta-capi-validation";

/**
 * Meta Conversions API (server-side) para eventos disparados pelo navegador.
 * O navegador envia o MESMO eventID ao Pixel e a esta rota (deduplicação).
 *
 * Hardening (ver src/lib/meta-capi-validation.ts): Content-Type JSON,
 * Origin/Referer do próprio site, limite de tamanho, lista fechada de
 * eventos e validação de campos. O token fica só no servidor: vai apenas na
 * chamada servidor→Graph (TLS, mesmo formato já em produção), nunca é
 * devolvido ao navegador nem logado.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_TOKEN;
const GRAPH_VERSION = "v20.0";
const UPSTREAM_TIMEOUT_MS = 5000;

const json = (body: Record<string, unknown>, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return json({ error: "Meta CAPI not configured" }, 503);
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const origin = checkRequestOrigin(request.headers, isProduction);
  if (!origin.ok) return json({ error: "forbidden" }, 403);

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const result = validateCapiPayload(body, requestHost, isProduction);
  if (!result.ok) return json({ error: "invalid_event", field: result.reason }, 422);

  const { eventName, eventId, eventSourceUrl, customData, userData } = result.value;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    undefined;
  const ua = request.headers.get("user-agent") ?? undefined;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: eventSourceUrl,
        action_source: "website",
        event_id: eventId,
        user_data: {
          ...(ip && { client_ip_address: ip }),
          ...(ua && { client_user_agent: ua.slice(0, 512) }),
          ...(userData.fbc && { fbc: userData.fbc }),
          ...(userData.fbp && { fbp: userData.fbp }),
        },
        ...(customData && Object.keys(customData).length > 0 && { custom_data: customData }),
      },
    ],
  };

  try {
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!res.ok) {
      // Não repassa a resposta da Meta (pode conter detalhes internos).
      return json({ error: "upstream_error" }, 502);
    }
    const data = (await res.json().catch(() => ({}))) as { events_received?: number };
    return json({ success: true, events_received: data.events_received ?? null }, 200);
  } catch {
    return json({ error: "upstream_unavailable" }, 502);
  }
}
