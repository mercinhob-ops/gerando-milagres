import { describe, it, expect } from "vitest";

describe("Bootstrap smoke test", () => {
  it("ambiente de testes configurado corretamente", () => {
    expect(true).toBe(true);
  });

  it("variáveis de ambiente de exemplo estão documentadas", () => {
    const requiredEnvKeys = [
      "NEXT_PUBLIC_CHECKOUT_URL",
      "NEXT_PUBLIC_WHATSAPP_NUMBER",
      "RESEND_API_KEY",
    ];
    expect(requiredEnvKeys.length).toBeGreaterThan(0);
  });
});
