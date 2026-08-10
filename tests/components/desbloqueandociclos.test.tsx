import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import DesbloqueandoCiclosPage from "@/app/desbloqueandociclos/page";

describe("DesbloqueandoCiclosPage", () => {
  it("renderiza a headline principal do hero", () => {
    render(<DesbloqueandoCiclosPage />);
    expect(screen.getByRole("heading", { name: /desbloqueando.*ciclos/is })).toBeInTheDocument();
  });

  it("todos os CTAs apontam para o checkout Kiwify correto", () => {
    render(<DesbloqueandoCiclosPage />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.kiwify.com.br"));
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://pay.kiwify.com.br/AQyRq5m");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("dispara InitiateCheckout com valor 67 ao clicar em um CTA", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<DesbloqueandoCiclosPage />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.includes("pay.kiwify.com.br"));
    fireEvent.click(links[0]);

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 67, currency: "BRL" }),
      expect.any(Object)
    );
  });

  it("mostra a hierarquia de preço 2x de R$33,50 / R$67 à vista", () => {
    render(<DesbloqueandoCiclosPage />);
    expect(screen.getByText(/r\$\s*33,50/i)).toBeInTheDocument();
    expect(screen.getAllByText(/r\$\s*67/i).length).toBeGreaterThan(0);
  });

  it("mostra os 4 depoimentos ilustrativos", () => {
    render(<DesbloqueandoCiclosPage />);
    expect(screen.getByText(/\*depoimentos ilustrativos/i)).toBeInTheDocument();
    expect(screen.getByText("Priscila Andrade")).toBeInTheDocument();
  });

  it("abre e fecha uma pergunta do FAQ ao clicar", () => {
    render(<DesbloqueandoCiclosPage />);
    const question = screen.getByText(/desbloqueando ciclos é para mim/i);
    const button = question.closest("button");
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it('o footer tem WhatsApp, CRF/PE 4563 e botão "Voltar ao topo"', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<DesbloqueandoCiclosPage />);
    const footer = within(screen.getByRole("contentinfo"));
    expect(footer.getByText(/crf\/pe 4563/i)).toBeInTheDocument();
    const waLink = footer.getByText(/central de atendimento/i).closest("a");
    expect(waLink).toHaveAttribute("href", expect.stringContaining("wa.me/5581981396005"));

    fireEvent.click(screen.getByText(/voltar ao topo/i));
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
