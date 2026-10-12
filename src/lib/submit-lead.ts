import type { LeadData } from "@/lib/leads";

interface SubmitLeadInput {
  page: string;
  name: string;
  whatsapp: string;
  email?: string;
  data: LeadData;
}

/** Envia o lead para /api/leads em segundo plano. Nunca lança nem bloqueia o fluxo. */
export function submitLead({ page, name, whatsapp, email, data }: SubmitLeadInput) {
  try {
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ page, name, whatsapp, email, data, created_at: new Date().toISOString() }),
    }).catch(() => {});
  } catch {
    // fetch indisponível — ignora silenciosamente
  }
}
