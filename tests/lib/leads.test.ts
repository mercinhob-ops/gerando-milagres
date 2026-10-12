import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { leadsToCsv, validateLeadPayload, type LeadRow } from "@/lib/leads";

const insert = vi.fn();
const order = vi.fn();
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () =>
    process.env.SUPABASE_SERVICE_ROLE_KEY
      ? {
          from: () => ({
            insert,
            select: () => ({ order: () => ({ limit: order }) }),
          }),
        }
      : null,
}));

const { POST } = await import("@/app/api/leads/route");
const { GET } = await import("@/app/api/admin/leads/route");

const ORIGIN = "https://gerandomilagres.com.br";

function leadRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${ORIGIN}/api/leads`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, host: "gerandomilagres.com.br", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as never;
}

const validLead = {
  page: "tentantes",
  name: "Maria Clara",
  whatsapp: "81988887777",
  data: { Idade: "36 a 39 anos", "O que foi identificado": ["SOP", "Endometriose"], Origem: null },
  created_at: "2026-10-12T13:00:00.000Z",
};

describe("validateLeadPayload", () => {
  it("aceita um lead válido e normaliza campos vazios", () => {
    expect(validateLeadPayload({ ...validLead, email: "" })).toEqual({ ...validLead, email: null });
  });

  it("rejeita página inválida, dados aninhados e campos grandes", () => {
    expect(validateLeadPayload({ ...validLead, page: "../x" })).toBeNull();
    expect(validateLeadPayload({ ...validLead, data: { a: { b: 1 } } })).toBeNull();
    expect(validateLeadPayload({ ...validLead, name: "x".repeat(201) })).toBeNull();
    expect(validateLeadPayload("lead")).toBeNull();
  });
});

describe("leadsToCsv", () => {
  it("gera uma coluna por resposta e neutraliza fórmulas", () => {
    const rows: LeadRow[] = [
      { id: "1", page: "gestante", name: "=HYPERLINK(\"x\")", whatsapp: "81999991234", email: null, data: { Trimestre: "2º trimestre" }, created_at: "2026-10-12T13:00:00.000Z" },
      { id: "2", page: "tentantes", name: "Ana \"Bia\"", whatsapp: null, email: null, data: { Idade: "Até 30 anos", Lista: ["A", "B"] }, created_at: "2026-10-12T14:00:00.000Z" },
    ];
    const csv = leadsToCsv(rows);
    const [header, first, second] = csv.replace("﻿", "").split("\r\n");
    expect(header).toBe('"Data/Hora";"Nome";"WhatsApp";"E-mail";"Página";"Trimestre";"Idade";"Lista"');
    expect(first).toContain(`"'=HYPERLINK(""x"")"`);
    expect(second).toContain('"Ana ""Bia"""');
    expect(second).toContain('"A, B"');
  });
});

describe("POST /api/leads", () => {
  beforeEach(() => {
    insert.mockReset().mockResolvedValue({ error: null });
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-de-teste");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.unstubAllEnvs());

  it("grava o lead e responde 200", async () => {
    const response = await POST(leadRequest(validLead));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ page: "tentantes", name: "Maria Clara" }));
  });

  it("responde 200 mesmo quando o Supabase falha", async () => {
    insert.mockResolvedValueOnce({ error: { message: "tabela não existe" } });
    const response = await POST(leadRequest(validLead));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: false });
  });

  it("responde 200 sem gravar para JSON inválido, outra origem ou Supabase não configurado", async () => {
    expect((await POST(leadRequest("{nao-json"))).status).toBe(200);
    expect((await POST(leadRequest(validLead, { origin: "https://site-malicioso.com" }))).status).toBe(200);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect((await POST(leadRequest(validLead))).status).toBe(200);
    expect(insert).not.toHaveBeenCalled();
  });
});

describe("GET /api/admin/leads", () => {
  const adminRequest = (password?: string) =>
    new Request(`${ORIGIN}/api/admin/leads`, {
      headers: password === undefined ? {} : { "x-admin-password": password },
    }) as never;

  beforeEach(() => {
    order.mockReset().mockResolvedValue({ data: [{ id: "1" }], error: null });
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-de-teste");
    vi.stubEnv("ADMIN_PASSWORD", "senha-de-teste");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("recusa sem senha ou com senha errada", async () => {
    expect((await GET(adminRequest())).status).toBe(401);
    expect((await GET(adminRequest("errada"))).status).toBe(401);
    expect(order).not.toHaveBeenCalled();
  });

  it("devolve os leads com a senha correta", async () => {
    const response = await GET(adminRequest("senha-de-teste"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ leads: [{ id: "1" }] });
  });

  it("fica bloqueado quando ADMIN_PASSWORD não está configurada", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect((await GET(adminRequest(""))).status).toBe(503);
  });
});
