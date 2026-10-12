import { NextRequest, NextResponse } from "next/server";
import { checkRequestOrigin } from "@/lib/meta-capi-validation";
import { LEADS_TABLE, MAX_LEAD_BODY_BYTES, validateLeadPayload } from "@/lib/leads";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Recebe leads das landing pages e grava na tabela `leads` do Supabase.
 * Sempre responde 200 — o lead nunca pode ser bloqueado por falha aqui.
 * O campo `ok` indica se a gravação aconteceu (útil para diagnóstico).
 */

const ok = (saved: boolean) =>
  NextResponse.json({ ok: saved }, { status: 200, headers: { "Cache-Control": "no-store" } });

export async function POST(request: NextRequest) {
  try {
    if (!checkRequestOrigin(request.headers, process.env.NODE_ENV === "production").ok) return ok(false);

    const raw = await request.text();
    if (raw.length > MAX_LEAD_BODY_BYTES) return ok(false);

    const payload = validateLeadPayload(JSON.parse(raw));
    if (!payload) return ok(false);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error("[api/leads] Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
      return ok(false);
    }

    const { error } = await supabase.from(LEADS_TABLE).insert(payload);
    if (error) {
      console.error("[api/leads] Falha ao gravar lead:", error.message);
      return ok(false);
    }
    return ok(true);
  } catch (error) {
    console.error("[api/leads] Erro inesperado:", error instanceof Error ? error.message : error);
    return ok(false);
  }
}
