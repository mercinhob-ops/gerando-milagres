import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingSection } from "@/components/sections/pricing-section";

describe("PricingSection", () => {
  it("exibe headline", () => {
    render(<PricingSection />);
    expect(
      screen.getByRole("heading", { name: /prepare seu corpo pelo valor de uma consulta/i })
    ).toBeInTheDocument();
  });

  it("exibe o preço principal R$247", () => {
    render(<PricingSection />);
    expect(screen.getAllByText(/247/).length).toBeGreaterThan(0);
  });

  it("exibe parcelamento em 12x", () => {
    render(<PricingSection />);
    expect(screen.getByText(/12x/i)).toBeInTheDocument();
  });

  it("CTA aponta para checkout externo", () => {
    render(<PricingSection />);
    const cta = screen.getByRole("link", { name: /quero preparar meu corpo por r\$\s*247/i });
    expect(cta).toHaveAttribute("href", "https://pay.kiwify.com.br/uOSEIEm");
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("lista o que está incluído", () => {
    render(<PricingSection />);
    expect(screen.getByRole("list", { name: /o que está incluído/i })).toBeInTheDocument();
  });

  it("section tem id='preco'", () => {
    render(<PricingSection />);
    expect(document.getElementById("preco")).toBeInTheDocument();
  });
});
