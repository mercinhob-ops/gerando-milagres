import { NextRequest, NextResponse } from "next/server";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_TOKEN;

interface EventPayload {
  eventName: string;
  eventSourceUrl: string;
  eventId: string;
  customData?: Record<string, unknown>;
  userData?: {
    fbc?: string;
    fbp?: string;
  };
}

export async function POST(request: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: "Meta CAPI not configured" }, { status: 503 });
  }

  let body: EventPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventName, eventSourceUrl, eventId, customData, userData } = body;

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
          ...(ua && { client_user_agent: ua }),
          ...(userData?.fbc && { fbc: userData.fbc }),
          ...(userData?.fbp && { fbp: userData.fbp }),
        },
        ...(customData && { custom_data: customData }),
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status });
  }

  return NextResponse.json({ success: true, events_received: data.events_received });
}
