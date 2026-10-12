import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPage from "@/app/admin/page";

const leads = [
  { id: "1", page: "tentantes", name: "Maria Clara", whatsapp: "81988887777", email: null, data: { Idade: "36 a 39 anos" }, created_at: "2026-10-12T14:00:00.000Z" },
  { id: "2", page: "gestante", name: "Ana Paula", whatsapp: "81999991234", email: null, data: { Trimestre: "2º trimestre" }, created_at: "2026-10-12T13:00:00.000Z" },
];

function mockApi(password = "certa") {
  const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
    const ok = (init?.headers as Record<string, string>)["x-admin-password"] === password;
    return Promise.resolve(
      new Response(JSON.stringify(ok ? { leads } : { error: "Senha incorreta." }), { status: ok ? 200 : 401 })
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function login(password: string) {
  fireEvent.change(await screen.findByLabelText(/^senha$/i), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
}

describe("AdminPage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("mostra e oculta a senha digitada pelo ícone de olho", async () => {
    mockApi();
    render(<AdminPage />);
    const input = await screen.findByLabelText(/^senha$/i);
    fireEvent.change(input, { target: { value: "minha-senha" } });
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: /mostrar senha/i }));
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("minha-senha");

    fireEvent.click(screen.getByRole("button", { name: /ocultar senha/i }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("'Esqueci a senha' mostra a orientação de contato com o suporte", async () => {
    mockApi();
    render(<AdminPage />);
    expect(screen.queryByText(/suporte técnico/i)).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: /esqueci a senha/i }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Entre em contato com o suporte técnico para redefinir"
    );
  });

  it("mostra erro com senha errada e não guarda sessão", async () => {
    mockApi();
    render(<AdminPage />);
    await login("errada");
    expect(await screen.findByRole("alert")).toHaveTextContent(/senha incorreta/i);
    expect(window.sessionStorage.length).toBe(0);
  });

  it("após login lista, filtra, expande respostas e sai", async () => {
    mockApi();
    render(<AdminPage />);
    await login("certa");

    expect(await screen.findByText("Maria Clara")).toBeInTheDocument();
    expect(screen.getByText("Ana Paula")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Gestante" }));
    expect(screen.queryByText("Maria Clara")).not.toBeInTheDocument();
    expect(screen.getByText("Ana Paula")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ver \(1\)/i }));
    expect(screen.getByText("2º trimestre")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /sair/i }));
    expect(await screen.findByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(window.sessionStorage.length).toBe(0);
  });

  it("mantém logado pela sessionStorage", async () => {
    mockApi();
    window.sessionStorage.setItem("gm_admin_password", "certa");
    render(<AdminPage />);
    await waitFor(() => expect(screen.getByText("Maria Clara")).toBeInTheDocument());
  });
});
