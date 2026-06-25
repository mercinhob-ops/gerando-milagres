declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

interface ConversionOptions {
  eventName: string;
  customData?: Record<string, unknown>;
}

export function trackConversionEvent({ eventName, customData }: ConversionOptions) {
  const eventId = crypto.randomUUID();
  const eventSourceUrl = window.location.href;

  const cookies = Object.fromEntries(
    document.cookie.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k.trim(), v.join("=")];
    })
  );

  // Server-side CAPI — fire-and-forget, não bloqueia UI
  fetch("/api/meta-conversions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventSourceUrl,
      eventId,
      customData,
      userData: {
        fbc: cookies._fbc,
        fbp: cookies._fbp,
      },
    }),
  }).catch(() => {});

  // Client-side pixel com mesmo eventID para deduplicação no Events Manager
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, customData ?? {}, { eventID: eventId });
  }
}
