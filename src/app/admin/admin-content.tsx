"use client";

import { Fragment, useEffect, useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";
import { formatLeadDate, leadsToCsv, type LeadRow } from "@/lib/leads";

const SESSION_KEY = "gm_admin_password";
const PAGE_FILTERS = [
  { value: "todas", label: "Todas" },
  { value: "gestante", label: "Gestante" },
  { value: "tentantes", label: "Tentantes" },
] as const;

type PageFilter = (typeof PAGE_FILTERS)[number]["value"];

async function fetchLeads(password: string): Promise<{ leads?: LeadRow[]; error?: string }> {
  try {
    const response = await fetch("/api/admin/leads", {
      headers: { "x-admin-password": password },
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return { error: body.error ?? "Não foi possível carregar os leads." };
    return { leads: body.leads ?? [] };
  } catch {
    return { error: "Falha de conexão. Tente novamente." };
  }
}

function readSession() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSession(value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(SESSION_KEY);
    else window.sessionStorage.setItem(SESSION_KEY, value);
  } catch {
    // sessionStorage indisponível — o login vale só enquanto a página estiver aberta
  }
}

export function AdminContent() {
  const [password, setPassword] = useState<string | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);

  async function login(candidate: string) {
    const result = await fetchLeads(candidate);
    if (result.leads) {
      writeSession(candidate);
      setPassword(candidate);
      setLeads(result.leads);
    }
    return result.error ?? null;
  }

  useEffect(() => {
    async function restoreSession() {
      const saved = readSession();
      if (saved && (await login(saved))) writeSession(null);
      setCheckingSession(false);
    }
    restoreSession();
  }, []);

  function logout() {
    writeSession(null);
    setPassword(null);
    setLeads([]);
  }

  async function refresh() {
    if (!password) return;
    const result = await fetchLeads(password);
    if (result.leads) setLeads(result.leads);
    else if (result.error) logout();
  }

  return (
    <div className="min-h-dvh bg-cream">
      {checkingSession ? (
        <p className="p-10 text-center font-sans text-sm text-brown/70">Carregando…</p>
      ) : password ? (
        <LeadsDashboard leads={leads} onLogout={logout} onRefresh={refresh} />
      ) : (
        <LoginScreen onLogin={login} />
      )}
    </div>
  );
}

/* ─────────────────────────── Login ─────────────────────────── */

function LoginScreen({ onLogin }: { onLogin: (password: string) => Promise<string | null> }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotMessage, setShowForgotMessage] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value) return setError("Digite a senha.");
    setLoading(true);
    const loginError = await onLogin(value);
    setLoading(false);
    if (loginError) setError(loginError);
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="text-center">
          <p className="font-['Georgia',serif] italic text-sm font-bold text-dark-brown">Gerando Milagres</p>
          <h1 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown mt-1">Área administrativa</h1>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="font-sans text-sm font-semibold text-brown/80">
            Senha
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setError(null);
              }}
              className="w-full rounded-xl border-2 border-nude-dark/40 bg-white py-3 pl-4 pr-12 font-sans text-base text-dark-brown outline-none focus:border-salmon"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              aria-controls="admin-password"
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-brown/60 hover:text-dark-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-salmon/50"
            >
              {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {error && (
          <p role="alert" className="font-sans text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), "bg-salmon hover:bg-salmon/90 w-full justify-center")}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForgotMessage(true)}
            className="font-sans text-sm font-semibold text-salmon underline underline-offset-4 hover:text-brown"
          >
            Esqueci a senha
          </button>
          {showForgotMessage && (
            <p role="status" className="mt-3 rounded-xl bg-cream px-4 py-3 font-sans text-sm text-dark-brown">
              Entre em contato com o suporte técnico para redefinir
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────── Tabela ─────────────────────────── */

function LeadsDashboard({
  leads,
  onLogout,
  onRefresh,
}: {
  leads: LeadRow[];
  onLogout: () => void;
  onRefresh: () => void;
}) {
  const [filter, setFilter] = useState<PageFilter>("todas");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleLeads = useMemo(
    () => (filter === "todas" ? leads : leads.filter((lead) => lead.page === filter)),
    [leads, filter]
  );

  function exportCsv() {
    const blob = new Blob([leadsToCsv(visibleLeads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown">Leads</h1>
          <p className="font-sans text-sm text-brown/70">
            {visibleLeads.length} {visibleLeads.length === 1 ? "lead" : "leads"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-xl border-2 border-nude-dark/50 bg-white px-4 py-2 font-sans text-sm font-semibold text-dark-brown hover:border-salmon"
          >
            Atualizar
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={visibleLeads.length === 0}
            className="rounded-xl bg-salmon px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-salmon/90 disabled:opacity-50"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl px-4 py-2 font-sans text-sm font-semibold text-brown/70 hover:text-dark-brown"
          >
            Sair
          </button>
        </div>
      </header>

      <div role="group" aria-label="Filtrar por página" className="flex gap-2 mb-4">
        {PAGE_FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              "rounded-full px-4 py-1.5 font-sans text-sm font-semibold border-2 transition-colors",
              filter === option.value
                ? "bg-dark-brown border-dark-brown text-white"
                : "bg-white border-nude-dark/40 text-dark-brown hover:border-salmon"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] font-sans text-sm text-left">
          <thead className="bg-nude/60 text-dark-brown">
            <tr>
              <th className="px-4 py-3 font-semibold">Data/Hora</th>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">WhatsApp</th>
              <th className="px-4 py-3 font-semibold">Página</th>
              <th className="px-4 py-3 font-semibold">Respostas</th>
            </tr>
          </thead>
          <tbody>
            {visibleLeads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-brown/60">
                  Nenhum lead encontrado.
                </td>
              </tr>
            )}
            {visibleLeads.map((lead) => {
              const expanded = expandedId === lead.id;
              const entries = Object.entries(lead.data ?? {});
              return (
                <Fragment key={lead.id}>
                  <tr className="border-t border-nude/60 text-dark-brown align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{formatLeadDate(lead.created_at)}</td>
                    <td className="px-4 py-3">{lead.name ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.whatsapp ? (
                        <a
                          href={`https://wa.me/${lead.whatsapp.length <= 11 ? `55${lead.whatsapp}` : lead.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-salmon underline underline-offset-2"
                        >
                          {lead.whatsapp}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">{lead.page}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setExpandedId(expanded ? null : lead.id)}
                        className="font-semibold text-salmon hover:underline"
                      >
                        {expanded ? "Ocultar" : `Ver (${entries.length})`}
                      </button>
                    </td>
                  </tr>
                  {expanded && (
                    <tr className="bg-cream/60">
                      <td colSpan={5} className="px-4 py-4">
                        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                          {lead.email && <AnswerItem label="E-mail" value={lead.email} />}
                          {entries.map(([key, value]) => (
                            <AnswerItem
                              key={key}
                              label={key}
                              value={Array.isArray(value) ? value.join(", ") : value === null ? "—" : String(value)}
                            />
                          ))}
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnswerItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-brown/60">{label}</dt>
      <dd className="text-dark-brown">{value || "—"}</dd>
    </div>
  );
}
