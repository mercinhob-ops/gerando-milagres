import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaqSection } from "@/components/sections/faq-section";
import { faqItems } from "@/data/faq";

describe("FaqSection", () => {
  it("exibe o headline 'Perguntas frequentes'", () => {
    render(<FaqSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /perguntas frequentes/i })
    ).toBeInTheDocument();
  });

  it(`renderiza todos os ${faqItems.length} itens do accordion`, () => {
    render(<FaqSection />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(faqItems.length);
  });

  it("exibe a pergunta sobre SOP", () => {
    render(<FaqSection />);
    expect(screen.getAllByText(/SOP/).length).toBeGreaterThan(0);
  });

  it("exibe a pergunta sobre endometriose", () => {
    render(<FaqSection />);
    expect(screen.getAllByText(/endometriose/i).length).toBeGreaterThan(0);
  });

  it("exibe a pergunta sobre FIV", () => {
    render(<FaqSection />);
    expect(screen.getAllByText(/FIV/).length).toBeGreaterThan(0);
  });

  it("botão começa com aria-expanded=false", () => {
    render(<FaqSection />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) =>
      expect(btn).toHaveAttribute("aria-expanded", "false")
    );
  });

  it("abre o accordion ao clicar no botão", async () => {
    render(<FaqSection />);
    const user = userEvent.setup();
    const firstButton = screen.getAllByRole("button")[0];
    await user.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
  });

  it("fecha o accordion ao clicar novamente", async () => {
    render(<FaqSection />);
    const user = userEvent.setup();
    const firstButton = screen.getAllByRole("button")[0];
    await user.click(firstButton);
    await user.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
  });

  it("section tem id='faq'", () => {
    render(<FaqSection />);
    expect(document.getElementById("faq")).toBeInTheDocument();
  });
});
