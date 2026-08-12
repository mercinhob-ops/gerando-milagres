import { createHash } from "node:crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_TOKEN;

function hashField(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export interface ServerConversionEvent {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  customData?: Record<string, unknown>;
  userEmail?: string | null;
  userPhone?: string | null;
}

/**
 * Envia um evento server-side (CAPI) diretamente ao Meta, sem depender de
 * uma sessão de navegador. Usado para eventos disparados por webhooks
 * (ex: Purchase confirmado pelo provedor de pagamento), onde não existe
 * fbp/fbc/IP de navegador reais disponíveis — por isso action_source é
 * "system_generated" em vez de "website".
 *
 * Fire-and-forget: nunca lança. Uma falha no envio ao Meta não deve
 * interromper o processamento do webhook que chamou esta função.
 */
export async function sendServerConversionEvent(event: ServerConversionEvent): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const userData: Record<string, string> = {};
  if (event.userEmail) userData.em = hashField(event.userEmail);
  if (event.userPhone) userData.ph = hashField(normalizePhone(event.userPhone));

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: event.eventSourceUrl,
        action_source: "system_generated",
        event_id: event.eventId,
        user_data: userData,
        ...(event.customData && { custom_data: event.customData }),
      },
    ],
  };

  try {
    await fetch(`https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Ignorado de propósito — ver docstring acima.
  }
}
