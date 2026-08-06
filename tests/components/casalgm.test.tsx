import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import CasalGmPage from "@/app/casalgm/page";

describe("CasalGmPage", () => {
  it("renderiza a headline principal do hero", () => {
    render(<CasalGmPage />);
    expect(
      screen.getByRole("heading", { name: /o primeiro passo para vocês engravidarem juntos/i })
    ).toBeInTheDocument();
  });

  it("renderiza todas as 13 seções pedidas", () => {
    render(<CasalGmPage />);

    expect(screen.getByText(/mais de/i)).toBeInTheDocument();
    expect(screen.getAllByText(/500 casais/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/esse guia é para vocês se/i)).toBeInTheDocument();
    expect(screen.getByText(/um caminho claro, em 3 etapas/i)).toBeInTheDocument();
    expect(screen.getByText(/o que vocês vão viver com o guia/i)).toBeInTheDocument();
    expect(screen.getByText(/o que está incluso/i)).toBeInTheDocument();
    expect(screen.getByText(/o que casais estão dizendo/i)).toBeInTheDocument();
    expect(screen.getByText(/onde vocês estão nessa jornada/i)).toBeInTheDocument();
    expect(screen.getByText(/as vagas para esse guia encerram em breve/i)).toBeInTheDocument();
    expect(screen.getByText(/garantia de 7 dias — sem riscos/i)).toBeInTheDocument();
    expect(screen.getByText(/perguntas frequentes/i)).toBeInTheDocument();
    expect(screen.getByText(/não percam mais um ciclo/i)).toBeInTheDocument();
    expect(screen.getByText(/central de atendimento/i)).toBeInTheDocument();
  });

  it("todos os CTAs apontam para o checkout Hotmart do Florescer a Dois", () => {
    render(<CasalGmPage />);
    const links = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.includes("pay.hotmart.com"));
    expect(links.length).toBeGreaterThanOrEqual(3);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "https://pay.hotmart.com/D106943069P");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("dispara InitiateCheckout ao clicar em um CTA", () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    render(<CasalGmPage />);
    const links = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.includes("pay.hotmart.com"));
    fireEvent.click(links[0]);

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      expect.objectContaining({ value: 57.9, currency: "BRL" }),
      expect.any(Object)
    );
  });

  it("mostra a hierarquia de preço com valor riscado e parcelamento", () => {
    render(<CasalGmPage />);
    expect(screen.getByText(/de r\$ 97,00/i)).toBeInTheDocument();
    expect(screen.getByText(/r\$ 28,95/i)).toBeInTheDocument();
    expect(screen.getByText(/ou r\$ 57,90 à vista/i)).toBeInTheDocument();
  });

  it("abre e fecha uma pergunta do FAQ ao clicar", () => {
    render(<CasalGmPage />);
    const question = screen.getByText(/para quem é o florescer a dois\?/i);
    const button = question.closest("button");
    expect(button).not.toBeNull();

    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(button!);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it('o botão "Voltar ao topo" rola a página para o início', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(<CasalGmPage />);
    fireEvent.click(screen.getByText(/voltar ao topo/i));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("link do WhatsApp no footer usa o número configurado", () => {
    render(<CasalGmPage />);
    const waLink = screen.getByText(/central de atendimento/i).closest("a");
    expect(waLink).toHaveAttribute("href", expect.stringContaining("wa.me/5581981396005"));
  });

  it("link da política de privacidade aponta para /privacidade", () => {
    render(<CasalGmPage />);
    const link = within(screen.getByRole("contentinfo")).getByText(/política de privacidade/i);
    expect(link).toHaveAttribute("href", "/privacidade");
  });
});
