import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHash } from "node:crypto";

const ORIGINAL_ENV = { ...process.env };

async function importFresh() {
  vi.resetModules();
  return import("@/lib/meta-conversions-server");
}

describe("sendServerConversionEvent", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "123456789";
    process.env.META_CONVERSIONS_TOKEN = "test-token";
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.restoreAllMocks();
  });

  it("não chama o Graph API quando pixel ou token estão ausentes", async () => {
    delete process.env.META_CONVERSIONS_TOKEN;
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}"));

    const { sendServerConversionEvent } = await importFresh();
    await sendServerConversionEvent({
      eventName: "Purchase",
      eventId: "evt-1",
      eventSourceUrl: "https://example.com/produtos/x",
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("envia event_name, event_id e action_source system_generated para o Graph API", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}"));

    const { sendServerConversionEvent } = await importFresh();
    await sendServerConversionEvent({
      eventName: "Purchase",
      eventId: "purchase-abc-123",
      eventSourceUrl: "https://example.com/produtos/mapa-da-fertilidade",
      customData: { value: 197, currency: "BRL", content_name: "Mapa da Fertilidade" },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0];
    expect(String(url)).toContain("graph.facebook.com");
    expect(String(url)).toContain("123456789");
    expect(String(url)).toContain("access_token=test-token");

    const body = JSON.parse(String((options as RequestInit).body));
    const event = body.data[0];
    expect(event.event_name).toBe("Purchase");
    expect(event.event_id).toBe("purchase-abc-123");
    expect(event.action_source).toBe("system_generated");
    expect(event.event_source_url).toBe("https://example.com/produtos/mapa-da-fertilidade");
    expect(event.custom_data).toEqual({ value: 197, currency: "BRL", content_name: "Mapa da Fertilidade" });
  });

  it("faz hash SHA-256 (lowercase, trim) do e-mail e telefone antes de enviar", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}"));

    const { sendServerConversionEvent } = await importFresh();
    await sendServerConversionEvent({
      eventName: "Purchase",
      eventId: "evt-2",
      eventSourceUrl: "https://example.com",
      userEmail: "  Maria@Example.com  ",
      userPhone: "(81) 98139-6005",
    });

    const [, options] = fetchSpy.mock.calls[0];
    const body = JSON.parse(String((options as RequestInit).body));
    const userData = body.data[0].user_data;

    expect(userData.em).toBe(createHash("sha256").update("maria@example.com").digest("hex"));
    expect(userData.ph).toBe(createHash("sha256").update("81981396005").digest("hex"));
  });

  it("nunca lança mesmo se o fetch falhar (fire-and-forget)", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));

    const { sendServerConversionEvent } = await importFresh();
    await expect(
      sendServerConversionEvent({
        eventName: "Purchase",
        eventId: "evt-3",
        eventSourceUrl: "https://example.com",
      })
    ).resolves.toBeUndefined();
  });
});
