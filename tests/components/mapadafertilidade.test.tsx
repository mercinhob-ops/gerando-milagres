import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import MapaDaFertilidadePage from "@/app/mapadafertilidade/page";

describe("MapaDaFertilidadePage", () => {
  it("renderiza a headline principal do hero", () => {
    render(<MapaDaFertilidadePage />);
    expect(screen.getByRole("heading", { name: /mapa da.*fertilidade/is })).toBeInTheDocument();
  });

  it("todos os CTAs apontam para o checkout Kiwify correto", () => {
    render(<MapaDaFertilidadePage />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.kiwify.com.br"));
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://pay.kiwify.com.br/5IIyMsr");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("dispara InitiateCheckout com valor 197 ao clicar em um CTA", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<MapaDaFertilidadePage />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.kiwify.com.br"));
    fireEvent.click(links[0]);

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 197, currency: "BRL" }),
      expect.any(Object)
    );
  });

  it("mostra a hierarquia de preço 10x de R$23,68 / R$197 à vista", () => {
    render(<MapaDaFertilidadePage />);
    expect(screen.getAllByText(/r\$\s*23,68/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/r\$\s*197/i).length).toBeGreaterThan(0);
  });

  it("mostra os 4 depoimentos ilustrativos", () => {
    render(<MapaDaFertilidadePage />);
    expect(screen.getByText(/\*depoimentos ilustrativos/i)).toBeInTheDocument();
    expect(screen.getByText("Débora Nunes")).toBeInTheDocument();
  });

  it("abre e fecha uma pergunta do FAQ ao clicar", () => {
    render(<MapaDaFertilidadePage />);
    const question = screen.getByText(/o mapa da fertilidade é para mim/i);
    const button = question.closest("button");
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it('o footer tem WhatsApp, CRF/PE 4563 e botão "Voltar ao topo"', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<MapaDaFertilidadePage />);
    const footer = within(screen.getByRole("contentinfo"));
    expect(footer.getByText(/crf\/pe 4563/i)).toBeInTheDocument();
    const waLink = footer.getByText(/central de atendimento/i).closest("a");
    expect(waLink).toHaveAttribute("href", expect.stringContaining("wa.me/5581981396005"));

    fireEvent.click(screen.getByText(/voltar ao topo/i));
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
