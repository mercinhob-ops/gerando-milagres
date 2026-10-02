import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { ALLOWED_CAPI_EVENTS, validateCapiPayload, isAllowedHost } from "@/lib/meta-capi-validation";

const ORIGIN = "https://gerandomilagres.com.br";
const SECRET = "TOKEN-DE-TESTE-NAO-REAL";

function req(body: unknown, headers: Record<string, string> = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://gerandomilagres.com.br/api/meta-conversions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: ORIGIN,
      host: "gerandomilagres.com.br",
      "user-agent": "vitest",
      "x-forwarded-for": "203.0.113.9",
      ...headers,
    },
    body: raw,
  });
}

const valid = (over: Record<string, unknown> = {}) => ({
  eventName: "CheckoutClick",
  eventId: "0b6c9a1e-4b8e-4c1f-9a3d-2f4e5d6c7b8a",
  eventSourceUrl: `${ORIGIN}/ciclofeminino?utm_source=meta`,
  customData: {
    content_name: "Ciclo Feminino Descomplicado",
    content_type: "product",
    value: 39.9,
    currency: "BRL",
    funnel: "ciclo-feminino",
    step: "entry",
  },
  userData: { fbp: "fb.1.1596403881668.1116446470", fbc: "fb.1.1554763741205.IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDMgk" },
  ...over,
});

describe("POST /api/meta-conversions (hardening)", () => {
  const ORIGINAL = { ...process.env };
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "123456789012345";
    process.env.META_CONVERSIONS_TOKEN = SECRET;
    fetchSpy = vi.fn(() => Promise.resolve(new Response(JSON.stringify({ events_received: 1 }), { status: 200 })));
    vi.stubGlobal("fetch", fetchSpy);
  });
  afterEach(() => {
    process.env = { ...ORIGINAL };
    vi.unstubAllGlobals();
  });

  async function post(r: Request) {
    const { POST } = await import("@/app/api/meta-conversions/route");
    // NextRequest é compatível com Request para o que a rota usa.
    return POST(r as never);
  }

  it.each(ALLOWED_CAPI_EVENTS)("aceita o evento permitido %s", async (eventName) => {
    const res = await post(req(valid({ eventName })));
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("encaminha à Meta com o MESMO event_id (dedup); token só na chamada servidor→Graph, nunca na resposta", async () => {
    const res = await post(req(valid()));
    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe(`https://graph.facebook.com/v20.0/123456789012345/events?access_token=${SECRET}`);
    const sent = JSON.parse(String((init as RequestInit).body));
    expect(JSON.stringify(sent)).not.toContain(SECRET);
    expect(sent.data[0]).toMatchObject({
      event_name: "CheckoutClick",
      event_id: "0b6c9a1e-4b8e-4c1f-9a3d-2f4e5d6c7b8a",
      action_source: "website",
      custom_data: { funnel: "ciclo-feminino", step: "entry", value: 39.9 },
    });
    expect(JSON.stringify(await res.json())).not.toContain(SECRET);
  });

  it.each([
    ["evento arbitrário", valid({ eventName: "Purchase" })],
    ["evento inventado", valid({ eventName: "HackEvent" })],
    ["eventId inválido", valid({ eventId: "x" })],
    ["URL de outro site", valid({ eventSourceUrl: "https://evil.example/ciclofeminino" })],
    ["campo extra em customData", valid({ customData: { value: 1, email: "a@b.com" } })],
    ["valor absurdo", valid({ customData: { value: 1e9, currency: "BRL" } })],
    ["moeda inválida", valid({ customData: { value: 1, currency: "reais" } })],
    ["fbp malformado", valid({ userData: { fbp: "<script>" } })],
    ["corpo não-objeto", ["a"]],
  ])("rejeita %s (422) sem chamar a Meta", async (_, body) => {
    const res = await post(req(body));
    expect(res.status).toBe(422);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejeita origem de outro site, ausência de Origin/Referer e Content-Type não JSON", async () => {
    expect((await post(req(valid(), { origin: "https://evil.example" }))).status).toBe(403);
    const noOrigin = req(valid());
    noOrigin.headers.delete("origin");
    expect((await post(noOrigin)).status).toBe(403);
    expect((await post(req(valid(), { "content-type": "text/plain" }))).status).toBe(415);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("aceita Referer do próprio site quando não há Origin; aceita o host do próprio deploy (preview)", async () => {
    const withReferer = req(valid());
    withReferer.headers.delete("origin");
    withReferer.headers.set("referer", `${ORIGIN}/ciclofeminino`);
    expect((await post(withReferer)).status).toBe(200);

    const preview = "deploy-preview-12--gerando-milagres.netlify.app";
    const previewReq = req(valid({ eventSourceUrl: `https://${preview}/ciclofeminino` }), {
      origin: `https://${preview}`,
      host: preview,
    });
    expect((await post(previewReq)).status).toBe(200);
  });

  it("rejeita payload grande (413) e JSON inválido (400)", async () => {
    const big = valid({ customData: { content_name: "x".repeat(5000) } });
    expect((await post(req(big))).status).toBe(413);
    expect((await post(req("{nao-json"))).status).toBe(400);
  });

  it("não repassa o erro da Meta ao navegador", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: "detalhe interno", fbtrace_id: "x" } }), { status: 400 }));
    const res = await post(req(valid()));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "upstream_error" });
  });

  it("sem variáveis configuradas: 503 e nada é enviado", async () => {
    delete process.env.META_CONVERSIONS_TOKEN;
    const res = await post(req(valid()));
    expect(res.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("não loga nada (sem PII nem token no console)", async () => {
    const spies = (["log", "info", "warn", "error"] as const).map((m) => vi.spyOn(console, m).mockImplementation(() => {}));
    await post(req(valid()));
    await post(req(valid({ eventName: "Purchase" })));
    for (const s of spies) expect(s).not.toHaveBeenCalled();
    spies.forEach((s) => s.mockRestore());
  });
});

describe("Validação (unidade)", () => {
  it("localhost só fora de produção", () => {
    expect(isAllowedHost("localhost:3000", "gerandomilagres.com.br", false)).toBe(true);
    expect(isAllowedHost("localhost:3000", "gerandomilagres.com.br", true)).toBe(false);
    expect(isAllowedHost("www.gerandomilagres.com.br", null, true)).toBe(true);
  });

  it("eventos do frontend de todos os funis continuam aceitos (sem quebrar outros funis)", () => {
    for (const [eventName, customData] of [
      ["InitiateCheckout", { value: 197, currency: "BRL", content_name: "Mapa" }],
      ["InitiateCheckout", { value: 47, currency: "USD", content_name: "Casal" }],
      ["Lead", { content_name: "Quiz Fertilidade — Florescer a Dois" }],
      ["PageView", undefined],
    ] as const) {
      const r = validateCapiPayload(
        { eventName, eventId: "11111111-2222-3333-4444-555555555555", eventSourceUrl: `${ORIGIN}/x`, customData, userData: {} },
        "gerandomilagres.com.br",
        true
      );
      expect(r.ok).toBe(true);
    }
  });
});

describe("Token nunca vai para o navegador", () => {
  it("nenhum arquivo client-side referencia META_CONVERSIONS_TOKEN", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = path.join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|jsx?)$/.test(f)) {
          const src = readFileSync(p, "utf8");
          if (src.includes("META_CONVERSIONS_TOKEN") && /^["']use client["']/m.test(src)) offenders.push(p);
        }
      }
    };
    walk(path.join(process.cwd(), "src"));
    expect(offenders).toEqual([]);
  });

  it("build (quando presente): o token de teste não aparece nos chunks estáticos", () => {
    const dir = path.join(process.cwd(), ".next", "static");
    if (!existsSync(dir)) return;
    const hits: string[] = [];
    const walk = (d: string) => {
      for (const f of readdirSync(d)) {
        const p = path.join(d, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (f.endsWith(".js") && readFileSync(p, "utf8").includes("META_CONVERSIONS_TOKEN")) hits.push(p);
      }
    };
    walk(dir);
    expect(hits).toEqual([]);
  });
});
