import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home (landing page)", () => {
  it("exibe headline principal com h1", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("exibe a promessa central de preparar o corpo para gerar vida", () => {
    render(<Home />);
    expect(screen.getByText(/preparar seu corpo para gerar vida/i)).toBeInTheDocument();
  });

  it("exibe o CTA principal com copy emocional", () => {
    render(<Home />);
    expect(
      screen.getAllByRole("link", { name: /Quero preparar meu corpo/i })[0]
    ).toBeInTheDocument();
  });

  it("CTA principal é link externo para checkout", () => {
    render(<Home />);
    const cta = screen.getAllByRole("link", { name: /Quero preparar meu corpo/i })[0];
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("exibe link de WhatsApp", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /fale pelo WhatsApp/i })).toBeInTheDocument();
  });
});
