import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

async function renderApp() {
  vi.resetModules();
  const { CicloGmApp } = await import("@/app/ciclogm/ciclogm-app");
  return render(<CicloGmApp />);
}

describe("CicloGmApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mostra a tela de boas-vindas para quem nunca usou o app", async () => {
    await renderApp();
    expect(screen.getByText(/começar minha jornada/i)).toBeInTheDocument();
  });

  it("exibe o aviso de autoconhecimento na tela de boas-vindas", async () => {
    await renderApp();
    expect(screen.getByText(/ferramenta de autoconhecimento/i)).toBeInTheDocument();
    expect(screen.getByText(/crf\/pe 4563/i)).toBeInTheDocument();
  });

  it("cria o primeiro ciclo e vai para a tela principal ao clicar em começar", async () => {
    await renderApp();
    fireEvent.click(screen.getByText(/começar minha jornada/i));

    expect(screen.getByLabelText(/selecionar ciclo/i)).toBeInTheDocument();
    expect(screen.getByText(/registro diário/i)).toBeInTheDocument();
  });

  it("salva um registro de temperatura e mostra na tabela de histórico", async () => {
    await renderApp();
    fireEvent.click(screen.getByText(/começar minha jornada/i));

    const tempInput = screen.getByPlaceholderText(/ex: 36.5/i);
    fireEvent.change(tempInput, { target: { value: "36.4" } });
    fireEvent.click(screen.getByText(/salvar registro/i));

    const matches = await screen.findAllByText("36.40");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("não calcula nem exibe janela de ovulação em nenhuma tela", async () => {
    await renderApp();
    fireEvent.click(screen.getByText(/começar minha jornada/i));

    expect(screen.queryByText(/ovula/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/fértil/i)).not.toBeInTheDocument();
  });

  it("persiste os dados no localStorage entre renderizações", async () => {
    await renderApp();
    fireEvent.click(screen.getByText(/começar minha jornada/i));

    const stored = window.localStorage.getItem("ciclogm:data");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored ?? "{}").onboarded).toBe(true);
  });
});
