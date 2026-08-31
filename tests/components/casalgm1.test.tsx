import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import CasalGm1Page from "@/app/casalgm1/page";

describe("CasalGm1Page", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza a headline principal do hero", () => {
    render(<CasalGm1Page />);
    expect(
      screen.getByRole("heading", { name: /transforme o sonho de vocês em realidade/i })
    ).toBeInTheDocument();
  });

  it("mostra o placeholder de VSL", () => {
    render(<CasalGm1Page />);
    expect(screen.getByText(/assista ao vídeo da dra\. camilla/i)).toBeInTheDocument();
  });

  it("renderiza todas as seções pedidas", () => {
    render(<CasalGm1Page />);

    expect(screen.getByText(/a jornada de vocês está chegando mais perto do positivo\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/então a dra\. camilla está aqui para ajudar vocês/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/por que ela pode ajudar vocês nessa jornada\?/i)).toBeInTheDocument();
    expect(screen.getByText(/histórias reais de casais que floresceram juntos/i)).toBeInTheDocument();
    expect(
      screen.getByText(/vocês vão dominar os 3 pilares da fertilidade do casal/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/recebam conteúdos elaborados pela dra\. camilla/i)).toBeInTheDocument();
    expect(screen.getByText(/garantia de 7 dias — sem riscos/i)).toBeInTheDocument();
    expect(screen.getByText(/perguntas frequentes/i)).toBeInTheDocument();
    expect(screen.getByText(/ficaram alguma dúvida\?/i)).toBeInTheDocument();
  });

  it("todos os CTAs de checkout apontam para o Hotmart do Florescer a Dois", () => {
    render(<CasalGm1Page />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.hotmart.com"));
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://pay.hotmart.com/D106943069P");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("dispara InitiateCheckout em reais ao clicar em um CTA", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm1Page />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.hotmart.com"));
    fireEvent.click(links[0]);

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 57.9, currency: "BRL" }),
      expect.any(Object)
    );
  });

  it("mostra o preço 2x de R$28,95 ou R$57,90 à vista no card de preço", () => {
    render(<CasalGm1Page />);
    expect(screen.getByText(/por 2x de/i)).toBeInTheDocument();
    expect(screen.getByText(/r\$28,95/i)).toBeInTheDocument();
    expect(screen.getByText(/ou r\$57,90 à vista/i)).toBeInTheDocument();
    expect(screen.getByText(/r\$242,00/i)).toBeInTheDocument();
  });

  it("mostra o botão de WhatsApp para suporte, separado do checkout", () => {
    render(<CasalGm1Page />);
    const waLink = screen.getByText(/falar com suporte/i).closest("a");
    expect(waLink).not.toBeNull();
    expect(waLink).toHaveAttribute("href", "https://wa.me/5581981396005");
    expect(waLink).toHaveAttribute("target", "_blank");
  });

  it("não dispara InitiateCheckout ao clicar no botão de WhatsApp", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGm1Page />);
    const waLink = screen.getByText(/falar com suporte/i).closest("a")!;
    fireEvent.click(waLink);

    expect(fbq).not.toHaveBeenCalled();
  });

  it("abre e fecha uma pergunta do FAQ ao clicar", () => {
    render(<CasalGm1Page />);
    const question = screen.getByText(/para quem é o florescer a dois\?/i);
    const button = question.closest("button");
    expect(button).not.toBeNull();

    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("mostra depoimentos em cards com nomes, idade e tempo tentando", () => {
    render(<CasalGm1Page />);
    expect(screen.getByText(/ana e pedro, 34 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/2 anos tentando/i)).toBeInTheDocument();
  });

  it("mostra os 3 bônus com preço riscado e 'por GRÁTIS'", () => {
    render(<CasalGm1Page />);
    expect(screen.getByText(/pack de infusões de chás para fertilidade/i)).toBeInTheDocument();
    expect(screen.getByText(/checklist dos próximos passos/i)).toBeInTheDocument();
    expect(screen.getByText(/devocional de fé e fertilidade/i)).toBeInTheDocument();
    expect(screen.getAllByText(/por grátis/i).length).toBe(3);
  });

  it("o contador de casais ajudados anima até 500", () => {
    vi.useFakeTimers();
    render(<CasalGm1Page />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId("animated-counter")).toHaveTextContent("500");
  });

  it("mostra o footer com os créditos da Dra. Camilla", () => {
    render(<CasalGm1Page />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/gerando milagres 2026 · dra\. camilla freitas · crf\/pe 4563/i)).toBeInTheDocument();
  });
});
