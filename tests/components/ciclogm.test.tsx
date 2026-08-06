import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

async function renderApp() {
  vi.resetModules();
  const { CicloGmApp } = await import("@/app/ciclogm/ciclogm-app");
  return render(<CicloGmApp />);
}

function start() {
  fireEvent.click(screen.getByText(/começar minha jornada/i));
}

describe("CicloGmApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mostra a tela de boas-vindas para quem nunca usou o app", async () => {
    await renderApp();
    expect(screen.getByRole("heading", { name: /temperatura basal/i })).toBeInTheDocument();
    expect(screen.getByText(/sua jornada começa aqui/i)).toBeInTheDocument();
    expect(screen.getByText(/começar minha jornada/i)).toBeInTheDocument();
  });

  it("exibe o aviso de autoconhecimento na tela de boas-vindas", async () => {
    await renderApp();
    expect(screen.getByText(/ferramenta de autoconhecimento/i)).toBeInTheDocument();
    expect(screen.getByText(/crf\/pe 4563/i)).toBeInTheDocument();
  });

  it("cria o primeiro ciclo e vai para a tela principal ao clicar em começar", async () => {
    await renderApp();
    start();

    expect(screen.getAllByText("Ciclo 1").length).toBeGreaterThan(0);
    expect(screen.getByText(/gráfico do ciclo/i)).toBeInTheDocument();
    expect(screen.getByText(/registro diário/i)).toBeInTheDocument();
    expect(screen.getByText(/tabela de registro/i)).toBeInTheDocument();
  });

  it("salva um registro com dia do ciclo calculado e mostra na tabela", async () => {
    await renderApp();
    start();

    const tempInput = screen.getByPlaceholderText(/ex: 36.5/i);
    fireEvent.change(tempInput, { target: { value: "36.4" } });
    fireEvent.click(screen.getByText(/salvar registro/i));

    const tempMatches = await screen.findAllByText("36.40");
    expect(tempMatches.length).toBeGreaterThan(0);

    // Primeiro registro do ciclo recém-criado cai no dia 1
    const dayMatches = screen.getAllByText("1");
    expect(dayMatches.length).toBeGreaterThan(0);
  });

  it("cria um novo ciclo pelo botão + Novo e alterna entre ciclos", async () => {
    await renderApp();
    start();

    fireEvent.click(screen.getByRole("button", { name: /novo/i }));
    fireEvent.change(screen.getByPlaceholderText(/nome do ciclo/i), {
      target: { value: "Ciclo de Agosto" },
    });
    fireEvent.click(screen.getByText("Criar"));

    expect(screen.getAllByText("Ciclo de Agosto").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ciclo 1").length).toBeGreaterThan(0);
  });

  it("limpa os registros do ciclo ativo após confirmação", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    await renderApp();
    start();

    fireEvent.change(screen.getByPlaceholderText(/ex: 36.5/i), { target: { value: "36.5" } });
    fireEvent.click(screen.getByText(/salvar registro/i));
    expect((await screen.findAllByText("36.50")).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText(/limpar este ciclo/i));

    expect(confirmSpy).toHaveBeenCalled();
    expect(screen.queryByText("36.50")).not.toBeInTheDocument();
    expect(screen.getAllByText(/nenhum registro neste ciclo ainda/i).length).toBeGreaterThan(0);

    confirmSpy.mockRestore();
  });

  it("não calcula nem exibe janela de ovulação em nenhuma tela", async () => {
    await renderApp();
    start();

    expect(screen.queryByText(/ovula/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/fértil/i)).not.toBeInTheDocument();
  });

  it("persiste os dados no localStorage entre renderizações", async () => {
    await renderApp();
    start();

    const stored = window.localStorage.getItem("ciclogm:data");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored ?? "{}").onboarded).toBe(true);
  });
});
