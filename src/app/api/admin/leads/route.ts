import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { LEADS_TABLE } from "@/lib/leads";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Lista os leads para a página /admin. A senha (ADMIN_PASSWORD) fica só no
 * servidor — o repositório é público, então ela nunca pode estar no código.
 * O navegador envia a senha no header `x-admin-password` a cada requisição.
 */

const MAX_LEADS = 5000;

const json = (body: Record<string, unknown>, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function passwordMatches(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return json({ error: "ADMIN_PASSWORD não configurada no servidor." }, 503);

  if (!passwordMatches(request.headers.get("x-admin-password") ?? "", expected)) {
    return json({ error: "Senha incorreta." }, 401);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return json({ error: "Supabase não configurado no servidor." }, 503);

  const { data, error } = await supabase
    .from(LEADS_TABLE)
    .select("id, page, name, whatsapp, email, data, created_at")
    .order("created_at", { ascending: false })
    .limit(MAX_LEADS);

  if (error) {
    console.error("[api/admin/leads] Falha ao buscar leads:", error.message);
    return json({ error: "Não foi possível carregar os leads." }, 500);
  }
  return json({ leads: data ?? [] }, 200);
}
