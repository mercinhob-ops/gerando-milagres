export const LEADS_TABLE = "leads";
export const MAX_LEAD_BODY_BYTES = 8192;

export type LeadData = Record<string, string | number | boolean | string[] | null>;

export interface LeadPayload {
  page: string;
  name: string | null;
  whatsapp: string | null;
  email: string | null;
  data: LeadData;
  created_at?: string;
}

export interface LeadRow {
  id: string;
  page: string;
  name: string | null;
  whatsapp: string | null;
  email: string | null;
  data: LeadData | null;
  created_at: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown, max: number): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed || null : undefined;
}

function sanitizeData(raw: unknown): LeadData | null {
  if (raw === undefined || raw === null) return {};
  if (!isPlainObject(raw)) return null;
  const entries = Object.entries(raw);
  if (entries.length > 40) return null;

  const out: LeadData = {};
  for (const [key, value] of entries) {
    if (key.length > 80) return null;
    if (value === null || typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) {
      out[key] = value;
    } else if (typeof value === "string" && value.length <= 500) {
      out[key] = value;
    } else if (Array.isArray(value) && value.length <= 20 && value.every((v) => typeof v === "string" && v.length <= 200)) {
      out[key] = value as string[];
    } else {
      return null;
    }
  }
  return out;
}

/** Valida o corpo do POST /api/leads. Retorna null se o payload for inválido. */
export function validateLeadPayload(raw: unknown): LeadPayload | null {
  if (!isPlainObject(raw)) return null;
  if (typeof raw.page !== "string" || !/^[a-z0-9-]{1,40}$/.test(raw.page)) return null;

  const name = optionalString(raw.name, 200);
  const whatsapp = optionalString(raw.whatsapp, 30);
  const email = optionalString(raw.email, 200);
  const data = sanitizeData(raw.data);
  if (name === undefined || whatsapp === undefined || email === undefined || data === null) return null;

  const payload: LeadPayload = { page: raw.page, name, whatsapp, email, data };
  if (typeof raw.created_at === "string" && !Number.isNaN(Date.parse(raw.created_at))) {
    payload.created_at = new Date(raw.created_at).toISOString();
  }
  return payload;
}

/** Evita que planilhas interpretem células como fórmula (CSV injection). */
function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : Array.isArray(value) ? value.join(", ") : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function formatLeadDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Recife" });
}

/** Gera CSV (separador ";" para abrir direto no Excel pt-BR) com uma coluna por resposta. */
export function leadsToCsv(leads: readonly LeadRow[]): string {
  const dataKeys: string[] = [];
  for (const lead of leads) {
    for (const key of Object.keys(lead.data ?? {})) {
      if (!dataKeys.includes(key)) dataKeys.push(key);
    }
  }

  const header = ["Data/Hora", "Nome", "WhatsApp", "E-mail", "Página", ...dataKeys];
  const rows = leads.map((lead) => [
    formatLeadDate(lead.created_at),
    lead.name,
    lead.whatsapp,
    lead.email,
    lead.page,
    ...dataKeys.map((key) => lead.data?.[key]),
  ]);

  return "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n");
}
