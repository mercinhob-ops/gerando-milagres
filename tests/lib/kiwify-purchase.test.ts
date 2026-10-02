import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  buildPurchaseEvent,
  createOrderIdempotencyGuard,
  findFunnelProductByOfferCode,
  getKiwifyWebhookConfig,
  KIWIFY_WEBHOOK_SPEC_REQUIRED,
} from "@/lib/kiwify-purchase";

describe("buildPurchaseEvent (Funil 01)", () => {
  const base = { approvedAt: 1_759_000_000, customerEmail: "Cliente@Exemplo.com" };

  it("cada transação confirmada vira um Purchase separado com o valor real", () => {
    const entry = buildPurchaseEvent({ ...base, orderId: "o1", offerCode: "aktchfx", amount: 39.9 })!;
    const up1 = buildPurchaseEvent({ ...base, orderId: "o2", offerCode: "AQyRq5m", amount: 67 })!;
    const up2 = buildPurchaseEvent({ ...base, orderId: "o3", offerCode: "Ttiul2X", amount: 47.9 })!;

    expect([entry.customData!.value, up1.customData!.value, up2.customData!.value]).toEqual([39.9, 67, 47.9]);
    expect(entry.customData).toMatchObject({
      currency: "BRL",
      content_name: "Ciclo Feminino Descomplicado",
      content_ids: ["ciclo-feminino-descomplicado"],
    });
    expect(up2.customData!.content_name).toBe("Suplementação para a Fertilidade da Mulher");
    expect(new Set([entry.eventId, up1.eventId, up2.eventId]).size).toBe(3);
    expect(entry.eventName).toBe("Purchase");
    expect(entry.eventTime).toBe(base.approvedAt);
  });

  it("event_id estável por pedido (retentativa não duplica)", () => {
    const a = buildPurchaseEvent({ ...base, orderId: "o9", offerCode: "aktchfx", amount: 39.9 })!;
    const b = buildPurchaseEvent({ ...base, orderId: "o9", offerCode: "aktchfx", amount: 39.9 })!;
    expect(a.eventId).toBe(b.eventId);
  });

  it("ignora produtos de outros funis e valores inválidos", () => {
    expect(findFunnelProductByOfferCode("5IIyMsr")).toBeNull();
    expect(buildPurchaseEvent({ ...base, orderId: "x", offerCode: "5IIyMsr", amount: 197 })).toBeNull();
    expect(buildPurchaseEvent({ ...base, orderId: "x", offerCode: "aktchfx", amount: 0 })).toBeNull();
    expect(buildPurchaseEvent({ ...base, orderId: "", offerCode: "aktchfx", amount: 39.9 })).toBeNull();
  });
});

describe("POST /api/webhooks/kiwify (infraestrutura desligada)", () => {
  const ORIGINAL = { ...process.env };
  beforeEach(() => vi.resetModules());
  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it("503 quando não habilitado", async () => {
    delete process.env.KIWIFY_WEBHOOK_ENABLED;
    const { POST } = await import("@/app/api/webhooks/kiwify/route");
    expect((await POST()).status).toBe(503);
  });

  it("503 quando habilitado sem as variáveis obrigatórias", async () => {
    process.env.KIWIFY_WEBHOOK_ENABLED = "true";
    delete process.env.KIWIFY_WEBHOOK_TOKEN;
    const { POST } = await import("@/app/api/webhooks/kiwify/route");
    const res = await POST();
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ missing: expect.arrayContaining(["KIWIFY_WEBHOOK_TOKEN"]) });
  });

  it("501 mesmo habilitado: sem verificação oficial nenhum Purchase é enviado", async () => {
    process.env.KIWIFY_WEBHOOK_ENABLED = "true";
    process.env.KIWIFY_WEBHOOK_TOKEN = "segredo";
    process.env.META_CONVERSIONS_TOKEN = "t";
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "1";
    const fetchSpy = vi.spyOn(global, "fetch");
    const { POST } = await import("@/app/api/webhooks/kiwify/route");
    const res = await POST();
    expect(res.status).toBe(501);
    expect(await res.json()).toEqual({ error: KIWIFY_WEBHOOK_SPEC_REQUIRED });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("Webhook — configuração e idempotência", () => {
  it("valida o ambiente sem expor segredos", () => {
    expect(getKiwifyWebhookConfig({} as NodeJS.ProcessEnv)).toEqual({ status: "disabled" });
    expect(getKiwifyWebhookConfig({ KIWIFY_WEBHOOK_ENABLED: "true" } as unknown as NodeJS.ProcessEnv)).toMatchObject({
      status: "misconfigured",
    });
    expect(
      getKiwifyWebhookConfig({
        KIWIFY_WEBHOOK_ENABLED: "true",
        KIWIFY_WEBHOOK_TOKEN: "s",
        META_CONVERSIONS_TOKEN: "t",
        NEXT_PUBLIC_META_PIXEL_ID: "1",
      } as unknown as NodeJS.ProcessEnv).status
    ).toBe("ready");
  });

  it("o mesmo pedido só é aceito uma vez dentro do TTL", () => {
    let t = 0;
    const guard = createOrderIdempotencyGuard(1000, () => t);
    expect(guard.claim("o1")).toBe(true);
    expect(guard.claim("o1")).toBe(false);
    expect(guard.claim("o2")).toBe(true);
    expect(guard.claim("")).toBe(false);
    t = 2000;
    expect(guard.claim("o1")).toBe(true);
  });
});
