import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { computeStreak } from "@/app/ciclogm/storage";

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

  afterEach(() => {
    // Garante que um teste com fake timers que falhe no meio não vaze
    // timers falsos para os testes seguintes.
    vi.useRealTimers();
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

  it("usa camilla-zap2.jpg na foto da tela de boas-vindas", async () => {
    await renderApp();
    const photo = screen.getByAltText(/dra\. camilla freitas/i);
    expect(photo.getAttribute("src")).toContain("camilla-zap2.jpg");
  });

  it("mostra um gráfico de exemplo quando o ciclo ainda não tem registros", async () => {
    await renderApp();
    start();

    expect(screen.getByText(/exemplo/i)).toBeInTheDocument();
    const svg = document.querySelector('svg[aria-label*="exemplo" i]');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 720 280");

    fireEvent.change(screen.getByPlaceholderText(/ex: 36.5/i), { target: { value: "36.6" } });
    fireEvent.click(screen.getByText(/salvar registro/i));

    await screen.findAllByText("36.60");
    expect(screen.queryByText(/^exemplo$/i)).not.toBeInTheDocument();
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

  it("mostra o primeiro versículo e roda para o próximo após 6 segundos", async () => {
    vi.useFakeTimers();
    await renderApp();
    start();

    expect(screen.getByText(/jeremias 29:11/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(6500);
    });

    expect(screen.getByText(/isaías 40:31/i)).toBeInTheDocument();
  });

  it("mostra uma mensagem de incentivo rotativa depois de salvar um registro", async () => {
    await renderApp();
    start();

    fireEvent.change(screen.getByPlaceholderText(/ex: 36.5/i), { target: { value: "36.3" } });
    fireEvent.click(screen.getByText(/salvar registro/i));

    const toast = await screen.findByRole("status");
    expect(toast.textContent).toMatch(/🌸|✨|💛|🌿|🙏/);
  });

  it("mostra o indicador de sequência ao salvar o primeiro registro do dia", async () => {
    await renderApp();
    start();

    expect(screen.getByText(/registre hoje para começar sua sequência/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/ex: 36.5/i), { target: { value: "36.4" } });
    fireEvent.click(screen.getByText(/salvar registro/i));

    expect(screen.getByText(/1 dia seguido/i)).toBeInTheDocument();
  });

  it("mostra o resumo do ciclo com registros, temperatura média, dia do ciclo e variação", async () => {
    await renderApp();
    start();

    fireEvent.change(screen.getByPlaceholderText(/ex: 36.5/i), { target: { value: "36.20" } });
    fireEvent.click(screen.getByText(/salvar registro/i));

    expect(screen.getByText("Registros")).toBeInTheDocument();
    expect(screen.getByText("Temp. média")).toBeInTheDocument();
    expect(screen.getAllByText("Dia do ciclo").length).toBeGreaterThan(0);
    expect(screen.getByText("Variação")).toBeInTheDocument();

    const avgMatches = await screen.findAllByText(/36\.20/);
    expect(avgMatches.length).toBeGreaterThan(0);
    expect(screen.getByText("0.00°C")).toBeInTheDocument();
  });

  it("mantém o rodapé de backup/restaurar/limpar e adiciona o rodapé de marca", async () => {
    await renderApp();
    start();

    expect(screen.getByText(/fazer backup/i)).toBeInTheDocument();
    expect(screen.getByText(/restaurar backup/i)).toBeInTheDocument();
    expect(screen.getByText(/limpar este ciclo/i)).toBeInTheDocument();
    expect(screen.getByText(/seu milagre está a caminho/i)).toBeInTheDocument();
    expect(screen.getAllByText("Gerando Milagres").length).toBeGreaterThan(0);
  });
});

describe("computeStreak", () => {
  it("retorna 0 quando não há registros", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("conta 1 quando o dia anterior ao mais recente não tem registro", () => {
    const records = [
      { date: "2026-08-01" },
      { date: "2026-08-02" },
      { date: "2026-08-03" },
      { date: "2026-08-05" },
    ];
    expect(computeStreak(records)).toBe(1);
  });

  it("conta a sequência completa quando os dias são realmente consecutivos", () => {
    const records = [
      { date: "2026-08-01" },
      { date: "2026-08-02" },
      { date: "2026-08-03" },
      { date: "2026-08-04" },
    ];
    expect(computeStreak(records)).toBe(4);
  });
});
